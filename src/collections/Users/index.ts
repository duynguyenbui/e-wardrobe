import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { checkRole } from '@/access/checkRole'
import { protectRoles } from '@/hooks/protectRole'
import { anyone } from '@/access/anyone'
import { admins } from '@/access/admin'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: {
      vi: 'Người dùng',
    },
    plural: {
      vi: 'Người dùng',
    },
  },
  access: {
    admin: ({ req: { user } }) => checkRole(['admin'], user ?? undefined),
    create: anyone,
    delete: admins,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'email'],
    useAsTitle: 'name',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      label: {
        vi: 'Tên người dùng',
      },
      type: 'text',
    },
    {
      name: 'gender',
      label: {
        vi: 'Giới tính',
      },
      type: 'select',
      options: [
        {
          label: {
            vi: 'Nam',
          },
          value: 'male',
        },
        {
          label: {
            vi: 'Nữ',
          },
          value: 'female',
        },
      ],
      required: true,
    },
    {
      name: 'birthday',
      label: {
        vi: 'Ngày sinh',
      },
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'dd/MM/yyyy',
        },
      },
      required: true,
    },
    {
      name: 'roles',
      label: {
        vi: 'Vai trò',
      },
      type: 'select',
      hasMany: true,
      saveToJWT: true,
      required: true,
      hooks: {
        beforeChange: [protectRoles],
      },
      options: [
        {
          label: {
            vi: 'Quản trị viên',
          },
          value: 'admin',
        },
        {
          label: {
            vi: 'Người dùng',
          },
          value: 'user',
        },
      ],
    },
  ],
  timestamps: true,
}
