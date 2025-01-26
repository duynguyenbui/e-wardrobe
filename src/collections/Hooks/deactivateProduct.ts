import type { CollectionAfterDeleteHook } from 'payload'
import { stripe } from '@/stripe'

export const deactivateProduct: CollectionAfterDeleteHook = async ({ doc }) => {
  const { productId } = doc

  if (productId) {
    await stripe.products.update(productId, {
      active: false,
    })
  }
}
