import type { Block } from 'payload'

export const Code: Block = {
  slug: 'code',
  labels: {
    singular: {
      vi: 'Mã lập trình',
    },
    plural: {
      vi: 'Mã lập trình',
    },
  },
  interfaceName: 'CodeBlock',
  fields: [
    {
      name: 'language',
      label: {
        vi: 'Ngôn ngữ lập trình',
      },
      type: 'select',
      defaultValue: 'typescript',
      options: [
        {
          label: {
            vi: 'Typescript',
          },
          value: 'typescript',
        },
        {
          label: {
            vi: 'Javascript',
          },
          value: 'javascript',
        },
        {
          label: {
            vi: 'CSS',
          },
          value: 'css',
        },
      ],
    },
    {
      name: 'code',
      type: 'code',
      label: false,
      required: true,
    },
  ],
}
