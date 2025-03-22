'use server'

import { getPayloadClient } from '@/get-payload'

export async function getProductVariants() {
  const payload = await getPayloadClient()
  const { docs: productVariants } = await payload.find({
    collection: 'productVariants',
    depth: 2,
    pagination: false,
    limit: 200,
  })
  return productVariants ?? []
}
