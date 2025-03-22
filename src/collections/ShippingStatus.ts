import type { CollectionConfig } from 'payload'
import { admins } from '@/access/admin'
import { anyone } from '@/access/anyone'

export const ShippingStatuses: CollectionConfig = {
  slug: 'shippingStatuses',
  labels: {
    singular: {
      vi: 'Trạng thái vận chuyển',
    },
    plural: {
      vi: 'Trạng thái vận chuyển',
    },
  },
  access: {
    create: admins,
    read: anyone,
    update: () => false,
    delete: admins,
  },
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      label: {
        vi: 'Tên trạng thái vận chuyển',
      },
      type: 'text',
      required: true,
    },
    {
      name: 'code',
      label: {
        vi: 'Mã trạng thái vận chuyển',
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
  ],
}
