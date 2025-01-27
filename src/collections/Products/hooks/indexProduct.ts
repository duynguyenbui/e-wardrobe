import type { CollectionAfterChangeHook } from 'payload'
import { index } from '@/index'
import { generateEmbedding } from '@/utilities/generateEmbedding'

export const indexProduct: CollectionAfterChangeHook = async ({ doc, previousDoc }) => {
  const hasChanges = ['title', 'description', 'instruction'].some(
    (key) => doc[key] !== previousDoc[key],
  )

  const { id, title, description, instruction, embedding } = doc

  if (index && hasChanges && embedding) {
    const vector = await generateEmbedding(`${title} ${description} ${instruction}`)

    if (vector.length > 0) {
      await index.upsert({
        id: embedding,
        vector,
        metadata: { id, title },
      })

      return doc
    }
  }

  return doc
}
