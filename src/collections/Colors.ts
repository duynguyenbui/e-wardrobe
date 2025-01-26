import type { CollectionConfig } from 'payload'
import { admins } from '@/access/admin'
import { slugField } from '@/fields/slug'

export const Colors: CollectionConfig = {
  slug: 'colors',
  access: {
    create: admins,
    read: () => true,
    update: admins,
    delete: admins,
  },
  admin: {
    useAsTitle: 'title',
    description: 'Colors for products that are used to group products together',
  },
  fields: [
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      required: true,
    },
    {
      name: 'hex',
      label: 'Hex',
      type: 'text',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
    },
    ...slugField(),
  ],
}
