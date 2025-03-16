import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const Banner: Block = {
  slug: 'banner',
  labels: {
    singular: {
      vi: 'Tranh treo tường',
    },
    plural: {
      vi: 'Tranh treo tường',
    },
  },
  fields: [
    {
      name: 'style',
      type: 'select',
      defaultValue: 'info',
      options: [
        {
          label: {
            vi: 'Thông tin',
          },
          value: 'info',
        },
        {
          label: {
            vi: 'Cảnh báo',
          },
          value: 'warning',
        },
        {
          label: {
            vi: 'Lỗi',
          },
          value: 'error',
        },
        {
          label: {
            vi: 'Thành công',
          },
          value: 'success',
        },
      ],
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
      label: false,
      required: true,
    },
  ],
  interfaceName: 'BannerBlock',
}
