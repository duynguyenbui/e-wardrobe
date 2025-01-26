import type { CollectionConfig } from 'payload'
import { admins } from '@/access/admin'

export const Sizes: CollectionConfig = {
  slug: 'sizes',
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
    {
      name: 'minHeight',
      label: 'Minimum Height (cm)',
      type: 'number',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'maxHeight',
      label: 'Maximum Height (cm)',
      type: 'number',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'minWeight',
      label: 'Minimum Weight (kg)',
      type: 'number',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'maxWeight',
      label: 'Maximum Weight (kg)',
      type: 'number',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
