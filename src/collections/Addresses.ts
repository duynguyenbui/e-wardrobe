import { provinces } from '@/constants'
import type { CollectionConfig } from 'payload'
import adminsAndUser from '@/access/adminAndUser'
import { admins } from '@/access/admin'

export const Addresses: CollectionConfig = {
  slug: 'addresses',
  access: {
    create: adminsAndUser,
    read: () => true,
    update: admins,
    delete: admins,
  },
  hooks: {
    beforeChange: [
      async ({ operation, data }) => {
        if (operation === 'create') {
          data.name = `${data.name} - ${data.user}`
        }

        if (operation === 'update') {
          const nameParts = data.name.split(' - ')
          if (nameParts.length > 1 && nameParts[1] !== data.user) {
            data.name = nameParts[0]
          }

          data.name = `${data.name} - ${data.user}`
        }

        return data
      },
    ],
  },
  labels: {
    singular: 'Address',
    plural: 'Addresses',
  },
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'province',
      label: 'Province',
      type: 'select',
      options: provinces,
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'district',
      label: 'District',
      type: 'text',
      required: true,
    },
    {
      name: 'ward',
      label: 'Ward',
      type: 'text',
      required: true,
    },
    {
      name: 'detailAddress',
      label: 'Detail Address',
      type: 'textarea',
      required: true,
    },
    {
      name: 'contactName',
      label: 'Contact Name',
      type: 'text',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'contactPhone',
      label: 'Contact Phone',
      type: 'text',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'user',
      label: 'User',
      type: 'relationship',
      relationTo: 'users',
      hasMany: false,
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
