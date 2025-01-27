import type { CollectionAfterDeleteHook } from 'payload'
import { index } from '@/index'

export const deleteIndex: CollectionAfterDeleteHook = async ({ doc }) => {
  try {
    if (index && doc.embedding) {
      await index?.delete(doc.embedding)
    }
  } catch (_) {
    console.error('Something went wrong with indexing the image')
  }

  return doc
}
