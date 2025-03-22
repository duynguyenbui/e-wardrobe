import type { CollectionConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { admins } from '@/access/admin'

export const ShippingFees: CollectionConfig = {
  slug: 'shippingFees',
  labels: {
    singular: {
      vi: 'Phí vận chuyển',
    },
    plural: {
      vi: 'Phí vận chuyển',
    },
  },
  access: {
    create: admins,
    delete: admins,
    read: anyone,
    update: () => false,
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
  ],
}
