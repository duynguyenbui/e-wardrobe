import { Field } from 'payload'

export const searchFields: Field[] = [
  {
    name: 'slug',
    label: {
      vi: 'Khoá slug',
    },
    type: 'text',
    index: true,
    admin: {
      readOnly: true,
    },
  },
  {
    name: 'meta',
    label: {
      vi: 'Meta',
    },
    type: 'group',
    index: true,
    admin: {
      readOnly: true,
    },
    fields: [
      {
        type: 'text',
        name: 'title',
        label: {
          vi: 'Tiêu đề',
        },
      },
      {
        type: 'text',
        name: 'description',
        label: {
          vi: 'Mô tả',
        },
      },
      {
        name: 'image',
        label: {
          vi: 'Hình ảnh',
        },
        type: 'upload',
        relationTo: 'media',
      },
    ],
  },
  {
    label: {
      vi: 'Danh mục',
    },
    name: 'categories',
    type: 'array',
    admin: {
      readOnly: true,
    },
    fields: [
      {
        name: 'relationTo',
        type: 'text',
        label: {
          vi: 'Liên kết',
        },
      },
      {
        name: 'id',
        type: 'text',
        label: {
          vi: 'ID',
        },
      },
      {
        name: 'title',
        type: 'text',
        label: {
          vi: 'Tiêu đề',
        },
      },
    ],
  },
]
