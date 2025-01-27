'use server'

import { getPayloadClient } from '@/get-payload'
import { Material } from '@/payload-types'

export const getMaterials = async (): Promise<Pick<Material, 'id' | 'title'>[]> => {
  const client = await getPayloadClient()

  const { docs: materials } = await client.find({
    collection: 'materials',
    pagination: false,
    select: {
      id: true,
      title: true,
    },
  })

  return materials
}
