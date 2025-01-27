'use server'

import { getPayloadClient } from '@/get-payload'
import { Category } from '@/payload-types'

export const getCategories = async (): Promise<Pick<Category, 'id' | 'title'>[]> => {
  const client = await getPayloadClient()

  const { docs: categories } = await client.find({
    collection: 'categories',
    pagination: false,
    select: {
      id: true,
      title: true,
    },
  })

  return categories
}
