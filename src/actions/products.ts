'use server'

import { getPayloadClient } from '@/get-payload'
import { generateEmbedding } from '@/utilities/generateEmbedding'
import { index } from '@/index'

export const searchProductRelevance = async (input: string) => {
  try {
    if (!index) {
      return { success: false, message: 'Trí tuệ nhân tạo không khả dụng' }
    }

    const vector = await generateEmbedding(input)

    if (vector.length === 0) {
      return { success: false, message: 'Không thể tạo embedding' }
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
      return { success: false, message: 'Không tìm thấy sản phẩm nào' }
    }

    return {
      success: true,
      data: products,
      message: 'Dưới đây là một số sản phẩm bạn có thể quan tâm',
    }
  } catch (_) {
    return { success: false, message: 'Đã xảy ra lỗi' }
  }
}
