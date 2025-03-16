'use server'

import { getPayloadClient } from '@/get-payload'
import { getServerSideUser } from '@/get-serverside-user'
import { CreateOrderValidator, TCreateOrderValidator } from '@/validation'
import { stripe } from '@/stripe'
import Stripe from 'stripe'
import { redirect } from 'next/navigation'
import { Coupon } from '@/payload-types'
import { revalidatePath } from 'next/cache'
import { SHIPPING_STATUS } from '@/constants'

export const createOrder = async (data: TCreateOrderValidator) => {
  // parse data
  const { success, data: safeData } = await CreateOrderValidator.safeParseAsync(data)

  if (!success) return { success: false, message: 'Invalid data' }

  const { addressId, userId, lineItems, note, couponId, type } = safeData

  const payload = await getPayloadClient()
  const transactionID = await payload.db.beginTransaction()

  let session: Stripe.Response<Stripe.Checkout.Session> | undefined = undefined

  try {
    // get address from server
    const address = await payload.findByID({
      collection: 'addresses',
      id: addressId,
    })

    if (!address) return { success: false, message: 'Address not found' }

    // get user from server
    const { user: currentUser } = await getServerSideUser()

    if (!currentUser || currentUser.id !== userId)
      return { success: false, message: 'User not found' }

    const serverUser = await payload.findByID({
      collection: 'users',
      id: userId,
    })

    // check stock
    const productVariantIds = lineItems.map((lineItem) => lineItem.productVariantId)

    const { docs: productVariants } = await payload.find({
      collection: 'productVariants',
      pagination: false,
      where: {
        id: {
          in: productVariantIds,
        },
      },
    })

    const stockCheck = productVariants.every((productVariant) => {
      const lineItem = lineItems.find((lineItem) => lineItem.productVariantId === productVariant.id)
      return productVariant.quantity >= lineItem!.quantityToBuy
    })

    if (!stockCheck) return { success: false, message: 'Out of stock' }

    // create order
    const lineItemsData = lineItems.map((lineItem) => ({
      productVariant: lineItem.productVariantId,
      quantityToBuy: lineItem.quantityToBuy,
    }))

    // total price
    const totalPrice = lineItems.reduce((acc, lineItem) => {
      const productVariant = productVariants.find(
        (productVariant) => productVariant.id === lineItem.productVariantId,
      )
      return acc + productVariant!.price * lineItem.quantityToBuy
    }, 0)

    // get shipping fee
    const { docs: shippingFees } = await payload.find({
      collection: 'shippingFees',
      pagination: false,
      where: {
        minimumPriceToUse: {
          less_than_equal: totalPrice,
        },
      },
      sort: ['fee'],
    })

    const shippingFee = shippingFees.reduce((minFee, fee) => {
      return fee.fee < minFee ? fee.fee : minFee
    }, shippingFees[0]?.fee || 0)

    // get discount from coupon
    let discount: Coupon | undefined

    if (couponId) {
      const today = new Date()

      discount = await payload.findByID({
        collection: 'coupons',
        id: couponId,
      })

      if (!discount) return { success: false, message: 'Coupon not found' }

      if (new Date(discount.validFrom) > today || new Date(discount.validTo) < today)
        return { success: false, message: 'Coupon is not valid' }

      if ((discount.currentUse?.length ?? 0) > discount.quantity)
        return { success: false, message: 'Coupon is out of stock' }

      if (
        discount.currentUse?.some((user) =>
          typeof user === 'object' ? user?.id === currentUser.id : user === currentUser.id,
        )
      ) {
        return { success: false, message: 'Coupon already used' }
      }

      if (
        !discount.collectedUsers?.some((user) =>
          typeof user === 'object' ? user?.id === currentUser.id : user === currentUser.id,
        )
      ) {
        return { success: false, message: 'Coupon is not collected by user' }
      }

      if (totalPrice < discount.minimumPriceToUse)
        return { success: false, message: 'Minimum price to use coupon is not reached' }

      await payload.update({
        collection: 'coupons',
        id: discount.id,
        data: {
          currentUse: [...(discount.currentUse || []), currentUser],
        },
        req: {
          transactionID: transactionID!,
        },
      })
    }

    if (couponId && !discount) return { success: false, message: 'Coupon not found' }

    const { docs: shippingStatuses } = await payload.find({
      collection: 'shippingStatuses',
      where: {
        code: {
          like: SHIPPING_STATUS.Pending,
        },
      },
      pagination: false,
    })

    const order = await payload.create({
      collection: 'orders',
      data: {
        shippingAddress: address,
        customer: serverUser,
        lineItems: lineItemsData,
        totalPrice: totalPrice,
        discount: discount,
        isPaid: false,
        shippingFee: shippingFee,
        note,
        type: type,
        shippingStatus: shippingStatuses[0] ?? null,
      },
      req: {
        transactionID: transactionID!,
      },
    })

    if (!order) return { success: false, message: 'Failed to create order' }

    // update stock
    await Promise.all(
      productVariants.map((productVariant) => {
        const lineItem = lineItems.find(
          (lineItem) => lineItem.productVariantId === productVariant.id,
        )
        return payload.update({
          collection: 'productVariants',
          id: productVariant.id,
          data: {
            quantity: productVariant.quantity - lineItem!.quantityToBuy,
          },
          req: {
            transactionID: transactionID!,
          },
        })
      }),
    )

    if (type === 'online') {
      // stripe session
      const stripeLineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = []

      productVariants.map((productVariant) => {
        const lineItem = lineItems.find(
          (lineItem) => lineItem.productVariantId === productVariant.id,
        )

        stripeLineItems.push({
          quantity: lineItem!.quantityToBuy,
          price: productVariant.priceId!,
        })
      })

      if (shippingFee > 0) {
        stripeLineItems.push({
          quantity: 1,
          price: shippingFees[0]!.priceId!,
        })
      }

      let stripeCoupon: Stripe.Coupon | undefined
      if (couponId && discount) {
        let stripeCouponData: Stripe.CouponCreateParams = {
          name: `${discount.code}`,
        }

        if (discount.discountType === 'fixed') {
          stripeCouponData = {
            ...stripeCouponData,
            amount_off: discount.discountAmount,
            currency: 'THB',
          }
        } else {
          stripeCouponData = {
            ...stripeCouponData,
            percent_off: discount.discountAmount,
          }

          stripeCoupon = await stripe.coupons.create({
            name: discount.code,
          })
        }

        stripeCoupon = await stripe.coupons.create(stripeCouponData)
      }

      session = await stripe.checkout.sessions.create({
        line_items: stripeLineItems,
        mode: 'payment',
        metadata: {
          orderId: order.id,
        },
        discounts: stripeCoupon ? [{ coupon: stripeCoupon.id }] : [],
        cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/orders/cancel?orderId=${order.id}`,
        success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/orders/success?orderId=${order.id}`,
      })

      if (!session || !session.url) {
        return {
          success: false,
          message: 'Failed to create session. Please check in your orders to continue',
        }
      }
    }

    await payload.db.commitTransaction(transactionID!)
  } catch (_) {
    await payload.db.rollbackTransaction(transactionID!)
    return { success: false, message: 'Failed to create order' }
  } finally {
    if (session?.url) {
      redirect(session.url)
    } else if (type === 'cod') {
      return {
        success: true,
        message: 'Create order successfully!',
      }
    } else {
      return {
        success: false,
        message: 'Failed to create a new session for this order! Please try again later!',
      }
    }
  }
}

export const getOrder = async (orderId: string) => {
  try {
    const payload = await getPayloadClient()

    const { user: currentUser } = await getServerSideUser()

    if (!currentUser) return { success: false, message: 'User not found', data: null }

    const order = await payload.findByID({
      collection: 'orders',
      id: orderId,
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
  } catch (_) {
    return { success: false, message: 'Failed to get order', data: null }
  }
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

  return { success: true, data: orders }
}

export const isReceivedOrder = async (orderId: string) => {
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
