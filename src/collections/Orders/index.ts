import type { CollectionConfig } from 'payload'

import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'

export const Orders: CollectionConfig = {
  slug: 'orders',
  labels: {
    singular: {
      vi: 'Đơn hàng',
    },
    plural: {
      vi: 'Đơn hàng',
    },
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'id',
    description: 'Tổng quan tất cả đơn hàng trên e-wardrobe.',
    defaultColumns: ['id', 'customer', 'isPaid'],
  },
  fields: [
    {
      name: 'lineItems',
      label: {
        vi: 'Sản phẩm',
      },
      type: 'array',
      fields: [
        {
          name: 'productVariant',
          label: {
            vi: 'Biến thể sản phẩm',
          },
          type: 'relationship',
          relationTo: 'productVariants',
          required: true,
        },
        {
          name: 'quantityToBuy',
          label: {
            vi: 'Số lượng',
          },
          type: 'number',
          required: true,
        },
      ],
      minRows: 1,
      maxRows: 10,
    },
    {
      name: 'customer',
      label: {
        vi: 'Khách hàng',
      },
      type: 'relationship',
      relationTo: 'users',
      hasMany: false,
      required: true,
    },
    {
      name: 'isPaid',
      label: {
        vi: 'Đã thanh toán',
      },
      type: 'checkbox',
      defaultValue: false,
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'totalPrice',
      label: {
        vi: 'Tổng giá trị',
      },
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
      label: {
        vi: 'Phí vận chuyển',
      },
      type: 'number',
      required: true,
      defaultValue: 2,
    },
    {
      name: 'shippingAddress',
      label: {
        vi: 'Địa chỉ giao hàng',
      },
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
      label: {
        vi: 'Mã giảm giá',
      },
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
      label: {
        vi: 'Ghi chú',
      },
      type: 'textarea',
      required: false,
    },
    {
      name: 'shippingStatus',
      label: {
        vi: 'Trạng thái vận chuyển',
      },
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
      label: {
        vi: 'Phương thức thanh toán',
      },
      admin: {
        isClearable: true,
        isSortable: true, // use mouse to drag and drop different values, and sort them according to your choice
        position: 'sidebar',
      },
      options: [
        {
          label: {
            vi: 'Thanh toán tiền mặt (COD)',
          },
          value: 'cod',
        },
        {
          label: {
            vi: 'Thanh toán online (Stripe)',
          },
          value: 'online',
        },
      ],
    },
  ],
}
