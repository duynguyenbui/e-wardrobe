'use server'

import { getPayloadClient } from '@/get-payload'
import { getServerSideUser } from '@/get-serverside-user'
import { CreateOrderValidator, TCreateOrderValidator } from '@/validation'
import { stripe } from '@/stripe'
import Stripe from 'stripe'
import { redirect } from 'next/navigation'

export const createOrder = async (data: TCreateOrderValidator) => {
  // parse data
  const { success, data: safeData } = await CreateOrderValidator.safeParseAsync(data)

  if (!success) return { success: false, message: 'Invalid data' }

  const { addressId, userId, lineItems, note } = safeData

  // get address from server
  const payload = await getPayloadClient()

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

  const order = await payload.create({
    collection: 'orders',
    data: {
      shippingAddress: address,
      customer: serverUser,
      lineItems: lineItemsData,
      totalPrice: totalPrice,
      isPaid: false,
      shippingFee: shippingFee,
      note,
    },
  })

  if (!order) return { success: false, message: 'Failed to create order' }

  // update stock
  await Promise.all(
    productVariants.map((productVariant) => {
      const lineItem = lineItems.find((lineItem) => lineItem.productVariantId === productVariant.id)
      return payload.update({
        collection: 'productVariants',
        id: productVariant.id,
        data: {
          quantity: productVariant.quantity - lineItem!.quantityToBuy,
        },
      })
    }),
  )

  // stripe session
  const stripeLineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = []

  productVariants.map((productVariant) => {
    const lineItem = lineItems.find((lineItem) => lineItem.productVariantId === productVariant.id)

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

  const session = await stripe.checkout.sessions.create({
    line_items: stripeLineItems,
    mode: 'payment',
    metadata: {
      orderId: order.id,
    },
    cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/orders/cancel?orderId=${order.id}`,
    success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/orders/success?orderId=${order.id}`,
  })

  if (!session || !session.url) {
    return {
      success: false,
      message: 'Failed to create session. Please check in your orders to continue',
    }
  }

  redirect(session.url)
}
