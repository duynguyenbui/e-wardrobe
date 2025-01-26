'use server'

import { getPayloadClient } from '@/get-payload'

export const getShippingFee = async (totalPrice: number) => {
  const client = await getPayloadClient()

  const { docs: shippingFees } = await client.find({
    collection: 'shippingFees',
    where: {
      minimumPriceToUse: {
        less_than_equal: totalPrice,
      },
    },
    sort: ['fee'],
    limit: 1,
  })

  return shippingFees[0]?.fee ?? 0
}
