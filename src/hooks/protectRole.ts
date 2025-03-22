import type { FieldHook } from 'payload'
import type { User } from '@/payload-types'

export const protectRoles: FieldHook<{ id: string } & User> = ({ data, req }) => {
  const isAdmin = req.user?.roles?.includes('admin') || data?.email === 'admin@ewardrobe.com'

  if (!isAdmin) {
    return ['user']
  }

  const userRoles = new Set(data?.roles || [])

  if (!userRoles.has('user')) {
    userRoles.add('user')
  }

  return Array.from(userRoles)
}
