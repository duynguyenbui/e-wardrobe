'use server'

import { getPayloadClient } from '@/get-payload'

export const getWarranties = async () => {
  const client = await getPayloadClient()

  const { docs } = await client.find({
    collection: 'warranties',
    pagination: false,
    where: {
      published: {
        equals: true,
      },
    },
  })

  return docs
}
