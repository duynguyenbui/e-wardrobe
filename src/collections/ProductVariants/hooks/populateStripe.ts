/* eslint-disable @typescript-eslint/no-explicit-any */
import type { CollectionBeforeChangeHook } from 'payload'
import { stripe } from '@/stripe'

export const populateStripe: CollectionBeforeChangeHook = async ({
  data,
  operation,
  originalDoc,
}) => {
  const { size, title, price, image, color, product, quantity } = data

  if (!size || !title || !price || !image || !color || !product || !quantity) return data

  if (operation === 'create') {
    const createdStripeProduct = await stripe.products.create({
      name: title,
      default_price_data: {
        currency: 'THB',
        unit_amount: Math.round(price * 100),
      },
    })

    const { id, default_price } = createdStripeProduct

    const createdProduct = {
      ...data,
      productId: id as string,
      priceId: default_price as string,
    }

    return createdProduct
  }

  if (operation === 'update') {
    let updatedProduct: any = data

    if (data.productId && originalDoc.price !== price) {
      const { id } = await stripe.prices.create({
        product: data.productId!,
        currency: 'THB',
        unit_amount: Math.round(price * 100),
      })

      updatedProduct = {
        ...data,
        priceId: id as string,
      }
    }

    if (data.productId && originalDoc.title !== title) {
      await stripe.products.update(data.productId, {
        name: title,
      })

      updatedProduct = {
        ...data,
      }
    }

    return updatedProduct
  }

  return data
}
