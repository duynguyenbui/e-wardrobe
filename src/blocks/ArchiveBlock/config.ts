import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const Archive: Block = {
  slug: 'archive',
  interfaceName: 'ArchiveBlock',
  fields: [
    {
      name: 'introContent',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: {
        vi: 'Nội dung giới thiệu',
      },
    },
    {
      name: 'populateBy',
      label: {
        vi: 'Phương thức hiển thị',
      },
      type: 'select',
      defaultValue: 'collection',
      options: [
        {
          label: {
            vi: 'Tập hợp',
          },
          value: 'collection',
        },
        {
          label: {
            vi: 'Chọn từng bài viết',
          },
          value: 'selection',
        },
      ],
    },
    {
      name: 'relationTo',
      type: 'select',
      defaultValue: 'posts',
      label: {
        vi: 'Tập hợp hiển thị',
      },
      options: [
        {
          label: {
            vi: 'Bài viết',
          },
          value: 'posts',
        },
        {
          label: {
            vi: 'Màu sắc',
          },
          value: 'colors',
        },
        {
          label: {
            vi: 'Danh mục',
          },
          value: 'categories',
        },
        {
          label: {
            vi: 'Chất liệu',
          },
          value: 'materials',
        },
      ],
    },
    {
      name: 'postCategories',
      type: 'relationship',
      admin: {
        condition: (_, siblingData) =>
          siblingData.populateBy === 'collection' && siblingData.relationTo === 'posts',
      },
      hasMany: true,
      label: {
        vi: 'Danh mục hiển thị',
      },
      relationTo: 'categories',
    },
    {
      name: 'limit',
      type: 'number',
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === 'collection',
        step: 1,
      },
      defaultValue: 10,
      label: {
        vi: 'Giới hạn',
      },
    },
    {
      name: 'selectedDocs',
      type: 'relationship',
      admin: {
        condition: (_, siblingData) =>
          siblingData.populateBy === 'selection' && siblingData.relationTo === 'posts',
      },
      hasMany: true,
      label: {
        vi: 'Chọn từng bài viết',
      },
      relationTo: ['posts'],
    },
  ],
  labels: {
    plural: {
      vi: 'Tập hợp',
    },
    singular: {
      vi: 'Tập hợp',
    },
  },
}
