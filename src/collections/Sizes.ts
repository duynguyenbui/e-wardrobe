import type { CollectionConfig } from 'payload'
import { admins } from '@/access/admin'

export const Sizes: CollectionConfig = {
  slug: 'sizes',
  labels: {
    singular: {
      vi: 'Kích cỡ',
    },
    plural: {
      vi: 'Kích cỡ',
    },
  },
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
      label: {
        vi: 'Tên kích cỡ',
      },
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      label: {
        vi: 'Mô tả',
      },
      type: 'textarea',
    },
    {
      name: 'minHeight',
      label: {
        vi: 'Chiều cao tối thiểu (cm)',
      },
      type: 'number',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'maxHeight',
      label: {
        vi: 'Chiều cao tối đa (cm)',
      },
      type: 'number',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'minWeight',
      label: {
        vi: 'Cân nặng tối thiểu (kg)',
      },
      type: 'number',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'maxWeight',
      label: {
        vi: 'Cân nặng tối đa (kg)',
      },
      type: 'number',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
