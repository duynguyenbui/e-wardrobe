import type { CollectionConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'
import { slugField } from '@/fields/slug'
import { revalidatePath } from 'next/cache'
import { indexProduct } from './hooks/indexProduct'
import { deleteIndex } from './hooks/deleteIndex'
import { uuidv4 } from '@/utilities/uuid'

export const Products: CollectionConfig = {
  slug: 'products',
  labels: {
    singular: {
      vi: 'Sản phẩm',
    },
    plural: {
      vi: 'Sản phẩm',
    },
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  hooks: {
    afterChange: [
      async () => {
        revalidatePath('/products')
      },
      indexProduct,
    ],
    afterDelete: [deleteIndex],
    beforeChange: [
      async ({ data }) => {
        if (!data.embedding) {
          data.embedding = uuidv4()
        }
        return data
      },
    ],
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      label: {
        vi: 'Tên sản phẩm',
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
      name: 'instruction',
      label: {
        vi: 'Hướng dẫn sử dụng',
      },
      type: 'textarea',
      required: true,
    },
    {
      name: 'image',
      label: {
        vi: 'Ảnh',
      },
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'category',
      label: {
        vi: 'Danh mục',
      },
      type: 'relationship',
      relationTo: 'categories',
      hasMany: false,
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'material',
      label: {
        vi: 'Chất liệu',
      },
      type: 'relationship',
      relationTo: 'materials',
      hasMany: false,
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'published',
      label: {
        vi: 'Công khai',
      },
      type: 'checkbox',
    },
    {
      name: 'embedding',
      label: {
        vi: 'Vector nhúng',
      },
      type: 'text',
      admin: {
        disableListFilter: true,
        description: 'Trường này được tự động tạo',
      },
    },
    ...slugField(),
  ],
}
