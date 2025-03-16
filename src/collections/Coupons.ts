import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { revalidatePath } from 'next/cache'

export const Coupons: CollectionConfig = {
  slug: 'coupons',
  labels: {
    singular: {
      vi: 'Mã giảm giá',
    },
    plural: {
      vi: 'Mã giảm giá',
    },
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'code',
  },
  hooks: {
    afterChange: [
      () => {
        revalidatePath('/coupons')
      },
    ],
  },
  fields: [
    {
      name: 'code',
      label: {
        vi: 'Mã CODE',
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
        vi: 'Giá trị tối thiểu để sử dụng',
      },
      type: 'number',
      required: true,
    },
    {
      name: 'currentUse',
      label: {
        vi: 'Người đã sử dụng(s)',
      },
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
    },
    {
      name: 'quantity',
      label: {
        vi: 'Số lượng',
      },
      type: 'number',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'discountType',
      label: {
        vi: 'Loại giảm giá',
      },
      type: 'select',
      options: [
        { label: 'Percentage', value: 'percentage' },
        { label: 'Fixed Amount', value: 'fixed' },
      ],
      required: true,
    },
    {
      name: 'discountAmount',
      label: {
        vi: 'Giá trị giảm',
      },
      type: 'number',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'active',
      label: {
        vi: 'Trạng thái',
      },
      type: 'checkbox',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'collectedUsers',
      label: {
        vi: 'Người đã thu thập(s)',
      },
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
    },
    {
      name: 'validFrom',
      label: {
        vi: 'Ngày bắt đầu',
      },
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
          displayFormat: 'MMMM d, yyyy, h:mm a',
        },
      },
    },
    {
      name: 'validTo',
      label: {
        vi: 'Ngày kết thúc',
      },
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
          displayFormat: 'MMMM d, yyyy, h:mm a',
        },
      },
    },
  ],
}
