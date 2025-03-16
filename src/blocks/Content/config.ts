import type { Block, Field } from 'payload'

import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { link } from '@/fields/link'
import { Banner } from '../Banner/config'
import { Code } from '../Code/config'
import { MediaBlock } from '../MediaBlock/config'

const columnFields: Field[] = [
  {
    name: 'size',
    label: {
      vi: 'Kích thước',
    },
    type: 'select',
    defaultValue: 'oneThird',
    options: [
      {
        label: {
          vi: 'Một phần ba',
        },
        value: 'oneThird',
      },
      {
        label: {
          vi: 'Một phần hai',
        },
        value: 'half',
      },
      {
        label: {
          vi: 'Hai phần ba',
        },
        value: 'twoThirds',
      },
      {
        label: {
          vi: 'Toàn bộ',
        },
        value: 'full',
      },
    ],
  },
  {
    name: 'richText',
    type: 'richText',
    editor: lexicalEditor({
      features: ({ rootFeatures }) => {
        return [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
          BlocksFeature({ blocks: [Banner, Code, MediaBlock] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ]
      },
    }),
    label: false,
  },
  {
    name: 'enableLink',
    label: {
      vi: 'Cho phép liên kết',
    },
    type: 'checkbox',
  },
  link({
    overrides: {
      admin: {
        condition: (_, { enableLink }) => Boolean(enableLink),
      },
    },
  }),
]

export const Content: Block = {
  slug: 'content',
  labels: {
    singular: {
      vi: 'Nội dung',
    },
    plural: {
      vi: 'Nội dung',
    },
  },
  interfaceName: 'ContentBlock',
  fields: [
    {
      name: 'columns',
      label: {
        vi: 'Cột',
      },
      type: 'array',
      admin: {
        initCollapsed: true,
      },
      fields: columnFields,
    },
  ],
}
