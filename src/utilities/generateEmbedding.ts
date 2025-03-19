'use server'

import { embeddings as vector } from '@/embeddings'

export const generateEmbedding = async (input: string) => {
  const response = await vector?.embeddings.create({
    input,
    model: process.env.OPENAI_EMBEDDING_MODEL!,
    encoding_format: 'float',
  })

  const data = response?.data

  if (data) {
    return (data[0] as any).embedding
  }

  return []
}
