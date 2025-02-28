import type { CollectionConfig } from 'payload'

import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'

export const Orders: CollectionConfig = {
  slug: 'orders',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'id',
    description: 'A summary of all orders on e-wardrobe.',
    defaultColumns: ['id', 'customer', 'isPaid'],
  },
  fields: [
    {
      name: 'lineItems',
      type: 'array',
      fields: [
        {
          name: 'productVariant',
          type: 'relationship',
          relationTo: 'productVariants',
          required: true,
        },
        {
          name: 'quantityToBuy',
          type: 'number',
          required: true,
        },
      ],
      minRows: 1,
      maxRows: 10,
    },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'users',
      hasMany: false,
      required: true,
    },
    {
      name: 'isPaid',
      type: 'checkbox',
      defaultValue: false,
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'totalPrice',
      type: 'number',
      required: true,
      defaultValue: 0,
      admin: {
        condition: (_, siblingData) => siblingData?.customer && siblingData?.lineItems.length > 0,
        position: 'sidebar',
      },
    },
    {
      name: 'shippingFee',
      type: 'number',
      required: true,
      defaultValue: 2,
    },
    {
      name: 'shippingAddress',
      type: 'relationship',
      relationTo: 'addresses',
      hasMany: false,
      required: true,
      admin: {
        condition: (_, siblingData) => siblingData?.customer && siblingData?.lineItems.length > 0,
      },
    },
    {
      name: 'discount',
      type: 'relationship',
      relationTo: 'coupons',
      hasMany: false,
      required: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'note',
      type: 'textarea',
      required: false,
    },
    {
      name: 'shippingStatus',
      type: 'relationship',
      relationTo: 'shippingStatuses',
      hasMany: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'type',
      type: 'select',
      admin: {
        isClearable: true,
        isSortable: true, // use mouse to drag and drop different values, and sort them according to your choice
        position: 'sidebar',
      },
      options: [
        {
          label: 'Ship COD',
          value: 'cod',
        },
        {
          label: 'Online Payment',
          value: 'online',
        },
      ],
    },
  ],
}
