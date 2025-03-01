import { endpoints } from '@/constants'
import type { CollectionBeforeChangeHook } from 'payload'

export const preventDefaultRoutes: CollectionBeforeChangeHook = ({ data, operation }) => {
  if (operation === 'create' || operation === 'update') {
    const { slug } = data

    if (!endpoints.includes(slug)) {
      return data
    } else {
      throw new Error('You cannot create or update the predefined routes')
    }
  }
}
