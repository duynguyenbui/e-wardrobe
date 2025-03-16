import type { CollectionConfig } from 'payload'
import { admins } from '@/access/admin'
import { slugField } from '@/fields/slug'

export const Colors: CollectionConfig = {
  slug: 'colors',
  labels: {
    singular: {
      vi: 'Màu sắc',
    },
    plural: {
      vi: 'Màu sắc',
    },
  },
  access: {
    create: admins,
    read: () => true,
    update: admins,
    delete: admins,
  },
  admin: {
    useAsTitle: 'title',
    description: 'Màu sắc cho sản phẩm được sử dụng để nhóm sản phẩm lại với nhau',
  },
  fields: [
    {
      name: 'title',
      label: {
        vi: 'Tên màu sắc',
      },
      type: 'text',
      required: true,
    },
    {
      name: 'hex',
      label: {
        vi: 'Mã hex',
      },
      type: 'text',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'description',
      label: {
        vi: 'Mô tả',
      },
      type: 'textarea',
    },
    ...slugField(),
  ],
}
