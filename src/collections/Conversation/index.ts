import type { CollectionConfig } from 'payload'

export const Conversation: CollectionConfig = {
  slug: 'conversation',
  labels: {
    singular: {
      vi: 'Cuộc trò chuyện',
    },
    plural: {
      vi: 'Cuộc trò chuyện',
    },
  },
  fields: [
    {
      name: 'uuid',
      label: {
        vi: 'Mã cuộc trò chuyện',
      },
      type: 'text',
      unique: true,
      required: true,
    },
    {
      name: 'user',
      label: {
        vi: 'Người dùng',
      },
      type: 'relationship',
      relationTo: 'users',
      required: true,
      hasMany: false,
    },
    {
      name: 'messages',
      label: {
        vi: 'Tin nhắn',
      },
      type: 'array',
      fields: [
        {
          name: 'content',
          type: 'textarea',
          required: true,
        },
        {
          name: 'role',
          type: 'select',
          options: ['user', 'assistant'],
          required: true,
          hasMany: false,
        },
      ],
    },
  ],
}
