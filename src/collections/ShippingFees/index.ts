import type { CollectionConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'
import { populateStripe } from './hook/populateStripe'
import { deactivateProduct } from '../Hooks/deactivateProduct'
import { admins } from '@/access/admin'

export const ShippingFees: CollectionConfig = {
  slug: 'shippingFees',
  labels: {
    singular: {
      vi: 'Phí vận chuyển (Hệ thống)',
    },
    plural: {
      vi: 'Phí vận chuyển (Hệ thống)',
    },
  },
  access: {
    create: admins,
    delete: admins,
    read: anyone,
    update: () => false,
  },
  hooks: {
    // beforeChange: [populateStripe],
    // afterDelete: [deactivateProduct],
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      label: {
        vi: 'Tên phí vận chuyển',
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
      name: 'minimumPriceToUse',
      label: {
        vi: 'Giá trị tối thiểu để áp dụng',
      },
      type: 'number',
      required: true,
    },
    {
      name: 'fee',
      label: {
        vi: 'Giá trị phí vận chuyển',
      },
      type: 'number',
      required: true,
    },
    {
      name: 'productId',
      label: {
        vi: 'Sản phẩm Stripe ID',
      },
      type: 'text',
      required: false,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'priceId',
      label: {
        vi: 'Giá sản phẩm Stripe ID',
      },
      type: 'text',
      required: false,
      admin: {
        readOnly: true,
      },
    },
  ],
}
