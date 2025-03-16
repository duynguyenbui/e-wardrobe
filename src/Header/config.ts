import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
  label: {
    vi: 'Đầu trang',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'navItems',
      label: {
        vi: 'Mục menu',
      },
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 15,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
      },
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
