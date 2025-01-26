import type { CollectionConfig } from 'payload'

import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import { populateStripe } from './hooks/populateStripe'
import { deactivateProduct } from '../Hooks/deactivateProduct'

export const ProductVariants: CollectionConfig = {
  slug: 'productVariants',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  hooks: {
    beforeChange: [populateStripe],
    afterDelete: [deactivateProduct],
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
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'quantity',
      type: 'number',
      required: true,
    },
    {
      name: 'price',
      type: 'number',
      required: true,
    },
    {
      name: 'size',
      type: 'relationship',
      relationTo: 'sizes',
      hasMany: false,
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'color',
      type: 'relationship',
      relationTo: 'colors',
      hasMany: false,
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      hasMany: false,
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'priceId',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'productId',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
  ],
}
