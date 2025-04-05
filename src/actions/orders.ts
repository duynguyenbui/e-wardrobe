'use server'

import { getPayloadClient } from '@/get-payload'
import { getServerSideUser } from '@/get-serverside-user'
import { CreateOrderValidator, TCreateOrderValidator } from '@/validation'
import { revalidatePath } from 'next/cache'
import { SHIPPING_STATUS } from '@/constants'
import { stripe } from '@/stripe'
import Stripe from 'stripe'
import { redirect } from 'next/navigation'
import { formatVND } from '@/utilities/currency'

export const repay = async (orderId: string) => {
  const { user: currentUser } = await getServerSideUser()
  if (!currentUser) return { success: false, message: 'Không tìm thấy người dùng' }

  if (!orderId) return { success: false, message: 'Không tìm thấy đơn hàng' }

  const payload = await getPayloadClient()

  const order = await payload.findByID({
    collection: 'orders',
    id: orderId,
    depth: 2,
  })

  if (!order) return { success: false, message: 'Không tìm thấy đơn hàng' }

  if (order.type !== 'stripe')
    return {
      success: false,
      message: 'Phương thức thanh toán không hợp lệ cho chức năng thanh toán lại',
    }

  if ((order.customer as any)?.id !== currentUser.id) {
    return { success: false, message: 'Người dùng không hợp lệ' }
  }

  if (order.isPaid) return { success: false, message: 'Đơn hàng đã được thanh toán' }

  // handle repay here
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = []

  return { success: false, data: order, message: 'Chức năng thanh toán lại đang được bảo trì' }
}

export const createOrder = async (data: TCreateOrderValidator) => {
  const currentDate = new Date()

  const { success, data: safeData } = await CreateOrderValidator.safeParseAsync(data)

  if (!success) return { success: false, message: 'Dữ liệu không hợp lệ', data: null }

  const { user: currentUser } = await getServerSideUser()

  if (!currentUser) return { success: false, message: 'Không tìm thấy người dùng', data: null }

  const {
    addressId,
    userId,
    lineItems: userLineItems,
    note,
    couponId,
    type: paymentMethod,
  } = safeData

  if (userId !== currentUser.id)
    return { success: false, message: 'Người dùng không hợp lệ', data: null }

  const payload = await getPayloadClient()

  let session: Stripe.Response<Stripe.Checkout.Session> | undefined = undefined

  // handle address
  const shippingAddress = await payload.findByID({
    collection: 'addresses',
    id: addressId,
    depth: 0,
  })

  if (!shippingAddress || shippingAddress.user !== userId) {
    return { success: false, message: 'Địa chỉ không tồn tại', data: null }
  }

  // handle shipping status
  const { docs: shippingStatuses } = await payload.find({
    collection: 'shippingStatuses',
    where: {
      code: {
        like: SHIPPING_STATUS.Pending,
      },
    },
    pagination: false,
  })

  if (!shippingStatuses.length) {
    return { success: false, message: 'Trạng thái vận chuyển không tồn tại', data: null }
  }

  const shippingStatus = shippingStatuses[0]

  // handle line items
  const lineItems: any = []

  for (const item of userLineItems) {
    const productVariant = await payload.findByID({
      collection: 'productVariants',
      id: item.productVariantId,
    })

    if (!productVariant) {
      return { success: false, message: 'Sản phẩm không tồn tại', data: null }
    }

    if (productVariant.quantity <= 0 || productVariant.quantity < item.quantityToBuy) {
      return { success: false, message: 'Sản phẩm không còn hàng', data: null }
    }

    lineItems.push({
      productVariant,
      productDiscount: productVariant.discount || 0,
      quantityToBuy: item.quantityToBuy,
      productPrice: productVariant.price,
      finalProductPrice:
        productVariant.price * item.quantityToBuy -
        (productVariant.price * item.quantityToBuy * productVariant.discount) / 100,
    })
  }

  const totalPrice = lineItems.reduce((acc: number, item: any) => acc + item.finalProductPrice, 0)

  if (!totalPrice) {
    return { success: false, message: 'Tổng giá trị đơn hàng không hợp lệ', data: null }
  }

  const { docs: shippingFees } = await payload.find({
    collection: 'shippingFees',
    where: {
      minimumPriceToUse: {
        less_than_equal: totalPrice,
      },
    },
    pagination: false,
    sort: ['fee'],
    limit: 1,
  })

  if (!shippingFees.length || !shippingFees[0]) {
    return { success: false, message: 'Phí vận chuyển không tồn tại', data: null }
  }

  const shippingFeeValue = shippingFees[0].fee

  // handle coupon
  let couponValue = 0
  let coupon = null

  if (couponId && couponId !== 'none') {
    coupon = await payload.findByID({
      collection: 'coupons',
      id: couponId,
      depth: 0,
    })

    if (!coupon) {
      return { success: false, message: 'Mã giảm giá không tồn tại', data: null }
    }

    if (coupon.validFrom && new Date(coupon.validFrom) > currentDate) {
      return { success: false, message: 'Mã giảm giá chưa bắt đầu', data: null }
    }

    if (coupon.validTo && new Date(coupon.validTo) < currentDate) {
      return { success: false, message: 'Mã giảm giá đã hết hạn', data: null }
    }

    if (coupon.minimumPriceToUse && totalPrice < coupon.minimumPriceToUse) {
      return {
        success: false,
        message: 'Đơn hàng không đạt điều kiện sử dụng mã giảm giá',
        data: null,
      }
    }

    if (!coupon.collectedUsers?.includes(currentUser.id)) {
      return {
        success: false,
        message: 'Bạn chưa thuộc danh sách người dùng được áp dụng mã giảm giá',
        data: null,
      }
    }

    if (coupon.currentUse?.length && coupon.currentUse.length >= coupon.quantity) {
      return { success: false, message: 'Mã giảm giá đã hết lượt sử dụng', data: null }
    }

    if (coupon.currentUse?.includes(currentUser.id)) {
      return { success: false, message: 'Bạn đã sử dụng mã giảm giá này', data: null }
    }

    if (coupon.discountType === 'percentage') {
      couponValue = (totalPrice * coupon.discountAmount) / 100
    } else {
      couponValue = coupon.discountAmount
    }
  }

  if (paymentMethod !== 'cod' && paymentMethod !== 'stripe') {
    return { success: false, message: 'Phương thức thanh toán không hợp lệ', data: null }
  }

  let shippingFeeDiscount = 0.0

  if (coupon && coupon.discountType === 'percentage') {
    shippingFeeDiscount = (shippingFeeValue * coupon.discountAmount) / 100
  }

  const totalPriceWithCoupon = totalPrice + shippingFeeValue - couponValue - shippingFeeDiscount

  const order = await payload.create({
    collection: 'orders',
    data: {
      lineItems: lineItems,
      totalPrice: totalPriceWithCoupon,
      shippingFee: shippingFeeValue,
      shippingAddress: shippingAddress,
      shippingStatus: shippingStatus,
      note: note,
      type: paymentMethod,
      customer: currentUser,
      isPaid: false,
      coupon: coupon,
    },
  })

  if (!order) {
    return { success: false, message: 'Lỗi khi tạo đơn hàng', data: null }
  }

  // update product variant quantity
  for (const item of lineItems) {
    await payload.update({
      collection: 'productVariants',
      id: item.productVariant.id,
      data: {
        quantity: item.productVariant.quantity - item.quantityToBuy,
      },
    })
  }

  // update coupon current use
  if (coupon) {
    await payload.update({
      collection: 'coupons',
      id: coupon.id,
      data: { currentUse: [...(coupon.currentUse || []), currentUser.id] },
    })
  }

  if (paymentMethod === 'cod') {
    // handle cod payment
    return { success: true, message: 'Đơn hàng đã được tạo thành công' }
  } else {
    // handle online payment
    const stripeLineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = []

    lineItems.forEach((item: any) => {
      stripeLineItems.push({
        price_data: {
          currency: 'vnd',
          product_data: {
            name: item.productVariant.title,
            description: item.productVariant.description,
          },
          unit_amount: Math.round(item.productPrice * (1 - item.productDiscount / 100)),
        },
        quantity: item.quantityToBuy,
      })
    })

    if (shippingFeeValue) {
      stripeLineItems.push({
        price_data: {
          currency: 'vnd',
          product_data: {
            name: 'Phí vận chuyển',
            description: `Phí vận chuyển cho đơn hàng ${formatVND(shippingFeeValue)}`,
          },
          unit_amount: Math.round(shippingFeeValue),
        },
        quantity: 1,
      })
    }

    let stripeCoupon: Stripe.Coupon | null = null
    if (coupon && couponValue) {
      let stripeCouponData: Stripe.CouponCreateParams = {
        name: `${coupon.code}`,
      }

      if (coupon.discountType === 'fixed') {
        stripeCouponData = {
          ...stripeCouponData,
          amount_off: Math.round(couponValue),
          currency: 'vnd',
        }
      }

      if (coupon.discountType === 'percentage') {
        stripeCouponData = {
          ...stripeCouponData,
          percent_off: coupon.discountAmount,
        }
      }

      stripeCoupon = await stripe.coupons.create(stripeCouponData)
    }

    session = await stripe.checkout.sessions.create({
      line_items: stripeLineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/orders/success?orderId=${order.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/orders/cancel?orderId=${order.id}`,
      metadata: {
        orderId: order.id,
      },
      discounts: stripeCoupon ? [{ coupon: stripeCoupon.id }] : [],
    })

    if (session?.url) {
      redirect(session.url)
    } else {
      return { success: false, message: 'Lỗi khi tạo session thanh toán', data: null }
    }
  }
}

export const getOrder = async (orderId: string) => {
  const payload = await getPayloadClient()

  const { user: currentUser } = await getServerSideUser()

  if (!currentUser) return { success: false, message: 'User not found', data: null }

  const order = await payload.findByID({
    collection: 'orders',
    id: orderId,
    depth: 2,
  })

  if (!order) return { success: false, message: 'Order not found', data: null }

  if (
    typeof order.customer === 'object'
      ? order.customer.id !== currentUser.id
      : order.customer !== currentUser.id
  ) {
    return { success: false, message: 'User not authorized', data: null }
  }

  return { success: true, data: order }
}

export const getOrders = async () => {
  const payload = await getPayloadClient()

  const { user: currentUser } = await getServerSideUser()

  if (!currentUser) return { success: false, message: 'User not found', data: null }

  const { docs: orders } = await payload.find({
    collection: 'orders',
    where: {
      'customer.id': {
        equals: currentUser.id,
      },
    },
    pagination: false,
    select: {
      id: true,
      isPaid: true,
      totalPrice: true,
      shippingFee: true,
      note: true,
      createdAt: true,
      type: true,
      shippingStatus: true,
    },
  })

  return { success: true, data: orders || [] }
}

export const receiveOrder = async (orderId: string) => {
  const payload = await getPayloadClient()

  const { user: currentUser } = await getServerSideUser()

  if (!currentUser) return { success: false, message: 'User not found' }

  const order = await payload.findByID({
    collection: 'orders',
    id: orderId,
  })

  if (!order) return { success: false, message: 'Order not found' }

  if (
    typeof order.customer === 'object'
      ? order.customer.id !== currentUser.id
      : order.customer !== currentUser.id
  ) {
    return { success: false, message: 'User not authorized' }
  }

  const { docs: shippingStatuses } = await payload.find({
    collection: 'shippingStatuses',
    where: {
      code: {
        like: SHIPPING_STATUS.Received,
      },
    },
    pagination: false,
  })

  await payload.update({
    collection: 'orders',
    id: orderId,
    data: {
      shippingStatus: shippingStatuses[0],
    },
  })

  revalidatePath('/orders/list')
  return { success: true }
}

export const getNumberOfOrdersWithin3MonthsGroupByDay = async () => {
  const currentDate = new Date()
  const threeMonthsAgo = new Date(currentDate)
  threeMonthsAgo.setMonth(currentDate.getMonth() - 3)

  const payload = await getPayloadClient()

  const { docs: orders } = await payload.find({
    collection: 'orders',
    where: {
      createdAt: {
        greater_than_equal: threeMonthsAgo,
        less_than_equal: currentDate,
      },
    },
    pagination: false,
    depth: 1,
    sort: 'createdAt',
    limit: 1000,
  })

  const ordersByDay = new Map()

  orders.forEach((order) => {
    const day = new Date(order.createdAt).toISOString().split('T')[0]
    ordersByDay.set(day, (ordersByDay.get(day) || 0) + 1)
  })

  const ordersByDayArray = Array.from(ordersByDay, ([date, orders]) => ({
    date,
    orders,
  }))

  return { success: true, data: ordersByDayArray }
}

export const getRevenueWithin3MonthsGroupByDay = async () => {
  const currentDate = new Date()
  const threeMonthsAgo = new Date(currentDate)
  threeMonthsAgo.setMonth(currentDate.getMonth() - 3)

  const payload = await getPayloadClient()

  const { docs: orders } = await payload.find({
    collection: 'orders',
    where: {
      and: [
        {
          createdAt: {
            greater_than_equal: threeMonthsAgo,
            less_than_equal: currentDate,
          },
        },
        {
          isPaid: {
            equals: true,
          },
        },
      ],
    },
    pagination: false,
    depth: 1,
    sort: 'createdAt',
    limit: 1000,
  })

  const revenueByDay = new Map()

  orders.forEach((order) => {
    const day = new Date(order.createdAt).toISOString().split('T')[0]
    revenueByDay.set(day, (revenueByDay.get(day) || 0) + order.totalPrice)
  })

  const revenueByDayArray = Array.from(revenueByDay, ([date, revenue]) => ({
    date,
    revenue,
  }))

  return { success: true, data: revenueByDayArray }
}

export const getPaymentMethodCODPercentage = async () => {
  const payload = await getPayloadClient()

  const { docs: orders } = await payload.find({
    collection: 'orders',
    pagination: false,
  })

  const totalOrders = orders.length

  const codOrders = orders.filter((order) => order.type === 'cod').length

  return { success: true, data: (codOrders / totalOrders) * 100 }
}

export const getNumberOfSellingProduct = async () => {
  const payload = await getPayloadClient()

  const { docs: orders } = await payload.find({
    collection: 'orders',
    pagination: false,
    depth: 2,
    sort: 'createdAt',
    limit: 1000,
  })

  const sellingProductMap = new Map()

  orders.forEach((order) => {
    order?.lineItems?.forEach((item) => {
      const productVariant = item.productVariant
      const productVariantId = (productVariant as any)?.id
      sellingProductMap.set(
        productVariantId,
        (sellingProductMap.get(productVariantId) || 0) + item.quantityToBuy,
      )
    })
  })

  const sellingProductArray = await Promise.all(
    Array.from(sellingProductMap, async ([productVariantId, quantitySold]) => {
      const productVariant = await payload.findByID({
        collection: 'productVariants',
        id: productVariantId,
        depth: 0,
        select: {
          id: true,
          title: true,
        },
      })

      return { productVariantId, productVariantTitle: productVariant.title, quantitySold }
    }),
  )
    .then((result) => result.sort((a, b) => b.quantitySold - a.quantitySold))
    .then((result) => result.slice(0, 5))

  return { success: true, data: sellingProductArray }
}
