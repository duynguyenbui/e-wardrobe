import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { slugField } from '@/fields/slug'

export const Materials: CollectionConfig = {
  slug: 'materials',
  labels: {
    singular: {
      vi: 'Chất liệu',
    },
    plural: {
      vi: 'Chất liệu',
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
  },
  fields: [
    {
      name: 'title',
      label: {
        vi: 'Tên chất liệu',
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
    ...slugField(),
  ],
}
