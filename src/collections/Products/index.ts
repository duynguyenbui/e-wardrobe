import type { CollectionConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'
import { slugField } from '@/fields/slug'
import { revalidatePath } from 'next/cache'
import { uuidv4 } from '@/utilities/uuid'
import { deleteIndex } from './hooks/deleteIndex'
import { indexProduct } from './hooks/indexProduct'

export const Products: CollectionConfig = {
  slug: 'products',
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
      indexProduct, // change it if you want to use vector database
    ],
    afterDelete: [deleteIndex], // change it if you want to use vector database
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
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'instruction',
      label: 'Instruction',
      type: 'textarea',
      required: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'category',
      label: 'Category',
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
      label: 'Material',
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
      label: 'Published',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'embedding',
      label: 'Embedding',
      type: 'text',
      admin: {
        disableListFilter: true,
        description: 'This field is automatically generated',
      },
    },
    ...slugField(),
  ],
}
