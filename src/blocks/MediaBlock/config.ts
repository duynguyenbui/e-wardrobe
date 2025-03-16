import type { Block } from 'payload'

export const MediaBlock: Block = {
  slug: 'mediaBlock',
  labels: {
    singular: {
      vi: 'Khối hình ảnh',
    },
    plural: {
      vi: 'Khối hình ảnh',
    },
  },
  interfaceName: 'MediaBlock',
  fields: [
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: {
        vi: 'Hình ảnh',
      },
    },
  ],
}
