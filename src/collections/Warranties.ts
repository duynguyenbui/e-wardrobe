import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const Warranties: CollectionConfig = {
  slug: 'warranties',
  labels: {
    singular: {
      vi: 'Chế độ bảo hành',
    },
    plural: {
      vi: 'Chế độ bảo hành',
    },
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    hidden: () => true,
  },
  fields: [
    {
      name: 'title',
      label: {
        vi: 'Tên chế độ bảo hành',
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
      required: true,
    },
    {
      name: 'published',
      label: {
        vi: 'Công khai',
      },
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}
