'use server'

import { getPayloadClient } from '@/get-payload'
import { generateEmbedding } from '@/utilities/generateEmbedding'
import { index } from '@/index'

export const searchProductRelevance = async (input: string) => {
  try {
    if (!index) {
      return { success: false, message: 'Atificical intelligence is not available' }
    }

    const vector = await generateEmbedding(input)

    if (vector.length === 0) {
      return { success: false, message: 'Cannot generate embedding' }
    }

    const queries = await index.query({
      vector,
      topK: 3,
      includeData: true,
    })

    const _embeddingsIds = queries.map((query) => query.id)

    const client = await getPayloadClient()

    const { docs: products } = await client.find({
      collection: 'products',
      pagination: false,
      where: {
        and: [
          {
            embedding: {
              in: _embeddingsIds,
            },
          },
          {
            published: {
              equals: true,
            },
          },
        ],
      },
    })

    if (products.length === 0) {
      return { success: false, message: 'No products found' }
    }

    return {
      success: true,
      data: products,
      message: 'Here are some products you might be interested in',
    }
  } catch (_) {
    return { success: false, message: 'Something went wrong' }
  }
}
