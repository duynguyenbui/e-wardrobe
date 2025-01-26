import type { CollectionConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'
import { populateStripe } from './hook/populateStripe'
import { deactivateProduct } from '../Hooks/deactivateProduct'

export const ShippingFees: CollectionConfig = {
  slug: 'shippingFees',
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
      name: 'minimumPriceToUse',
      type: 'number',
      required: true,
    },
    {
      name: 'fee',
      type: 'number',
      required: true,
    },
    {
      name: 'productId',
      type: 'text',
      required: false,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'priceId',
      type: 'text',
      required: false,
      admin: {
        readOnly: true,
      },
    },
  ],
}
