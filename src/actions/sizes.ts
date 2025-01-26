'use server'

import { getPayloadClient } from '@/get-payload'
import { TUserRecommedSizeValidator, UserRecommedSizeValidator } from '@/validation'

export const recommendSizes = async (values: TUserRecommedSizeValidator) => {
  const { data } = await UserRecommedSizeValidator.safeParse(values)

  if (!data) return { success: false, message: 'Invalid data' }

  const { weight, height } = data

  const heightInMeters = height / 100
  const bmi = parseFloat((weight / heightInMeters ** 2).toFixed(2))

  const client = await getPayloadClient()

  const { docs: recommendSizes } = await client.find({
    collection: 'sizes',
    where: {
      minHeight: { less_than_equal: height },
      maxHeight: { greater_than_equal: height },
      minWeight: { less_than_equal: weight },
      maxWeight: { greater_than_equal: weight },
    },
    pagination: false,
    select: {
      id: true,
      name: true,
      description: true,
      minHeight: true,
      maxHeight: true,
      minWeight: true,
      maxWeight: true,
    },
  })

  const filteredSizes = recommendSizes.filter((size) => {
    const minHeightInMeters = size.minHeight / 100
    const maxHeightInMeters = size.maxHeight / 100
    const minBMI = size.minWeight / maxHeightInMeters ** 2
    const maxBMI = size.maxWeight / minHeightInMeters ** 2

    return bmi >= minBMI && bmi <= maxBMI
  })

  await new Promise((resolve) => setTimeout(resolve, 2000))

  if (filteredSizes.length > 0) {
    return {
      success: true,
      message: 'Sizes found',
      data: filteredSizes,
    }
  }

  return {
    success: false,
    message: 'No sizes found for the given measurements',
  }
}
