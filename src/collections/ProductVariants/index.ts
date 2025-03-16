import type { CollectionConfig } from 'payload'

import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import { populateStripe } from './hooks/populateStripe'
import { deactivateProduct } from '../Hooks/deactivateProduct'
import { revalidatePath } from 'next/cache'

export const ProductVariants: CollectionConfig = {
  slug: 'productVariants',
  labels: {
    singular: {
      vi: 'Biến thể sản phẩm',
    },
    plural: {
      vi: 'Biến thể sản phẩm',
    },
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  hooks: {
    // beforeChange: [populateStripe],
    // afterDelete: [deactivateProduct],
    afterChange: [
      ({ doc }) => {
        revalidatePath(`$/products/${doc.id}`)
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
        vi: 'Tên biến thể sản phẩm',
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
      name: 'images',
      label: {
        vi: 'Hình ảnh (sản phẩm sẽ có nhiều hình ảnh)',
      },
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      minRows: 1,
      required: true,
    },
    {
      name: 'quantity',
      label: {
        vi: 'Số lượng',
      },
      type: 'number',
      required: true,
    },
    {
      name: 'price',
      label: {
        vi: 'Giá',
      },
      type: 'number',
      required: true,
    },
    {
      name: 'size',
      label: {
        vi: 'Kích cỡ',
      },
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
      label: {
        vi: 'Màu sắc',
      },
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
      label: {
        vi: 'Sản phẩm',
      },
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
      label: {
        vi: 'Giá sản phẩm Stripe ID',
      },
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'productId',
      label: {
        vi: 'Sản phẩm Stripe ID',
      },
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
  ],
}
