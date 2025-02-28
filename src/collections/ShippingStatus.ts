import type { CollectionConfig } from 'payload'
import { admins } from '@/access/admin'

export const ShippingStatuses: CollectionConfig = {
  slug: 'shippingStatuses',
  access: {
    create: admins,
    read: () => true,
    update: admins,
    delete: admins,
  },
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
    },
  ],
}
