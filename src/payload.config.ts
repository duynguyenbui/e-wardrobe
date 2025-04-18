// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'

import sharp from 'sharp' // sharp-import
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'
// import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
// import nodemailer from 'nodemailer'
// import { vi } from '@payloadcms/translations/languages/vi'
import { vi } from '@payloadcms/translations/languages/vi'
import { Categories } from './collections/Categories'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Users } from './collections/Users'
import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { plugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'
import { Colors } from './collections/Colors'
import { Materials } from './collections/Materials'
import { Products } from './collections/Products'
import { Sizes } from './collections/Sizes'
import { Addresses } from './collections/Addresses'
import { ProductVariants } from './collections/ProductVariants'
import { Warranties } from './collections/Warranties'
import { Orders } from './collections/Orders'
import { Coupons } from './collections/Coupons'
import { ShippingFees } from './collections/ShippingFees'
import { ShippingStatuses } from './collections/ShippingStatus'
import { Conversation } from './collections/Conversation'
import { CANCEL_ORDER_STATUS } from './constants'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  /*email:
    nodemailerAdapter({
    defaultFromAddress: 'hello@demomailtrap.com',
    defaultFromName: 'eWardrobe - Clothing Store',
    transport: await nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    }),
  }),*/
  admin: {
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
    components: {
      graphics: {
        Logo: './decorators/Logo/index',
        Icon: './decorators/Icon/index',
      },
      beforeDashboard: ['./decorators/BeforeDashboard/index'],
      afterNavLinks: ['./decorators/AfterNavLink/index'],
      views: {
        statistics: {
          path: '/statistics',
          Component: './decorators/Views/Statistics/index',
        },
      },
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  collections: [
    Pages,
    Products,
    ProductVariants,
    Orders,
    Posts,
    Media,
    Categories,
    Colors,
    Materials,
    Sizes,
    Addresses,
    Warranties,
    Coupons,
    Users,
    ShippingFees,
    ShippingStatuses,
    Conversation,
  ],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [Header, Footer],
  plugins: [
    ...plugins,
    // storage-adapter-placeholder
  ],
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  graphQL: {
    disable: true,
  },
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        if (req.user) return true
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${process.env.CRON_SECRET}`
      },
    },
    tasks: [
      {
        retries: 2,
        slug: 'cancelOrder',
        inputSchema: [{ name: 'orderId', type: 'text', required: true }],
        outputSchema: [
          {
            name: 'orderID',
            type: 'text',
            required: true,
          },
          {
            name: 'status',
            type: 'text',
            required: true,
          },
        ],
        handler: async ({ input, job, req }) => {
          const { payload } = req
          const { orderId } = input

          const order = await payload.findByID({
            collection: 'orders',
            id: orderId,
            depth: 2,
          })

          if (!order) {
            return {
              output: {
                orderId: orderId,
                status: CANCEL_ORDER_STATUS.FAILED,
              },
            }
          }

          if (order.isPaid === false) {
            await payload.update({
              collection: 'orders',
              id: orderId,
              data: {
                note:
                  order.note +
                  'NOTE: Đơn hàng đã bị hủy do chưa thanh toán sau 2 phút (Thông báo tự động)',
              },
            })

            order.lineItems?.forEach((item: any) => {
              const productVariantId = item.productVariant.id
              const quantityToBuy = item.quantityToBuy

              payload.update({
                collection: 'productVariants',
                id: productVariantId,
                data: {
                  quantity: item.productVariant.quantity + quantityToBuy,
                },
              })
            })

            return {
              output: {
                orderId: orderId,
                status: CANCEL_ORDER_STATUS.SUCCESS,
              },
            }
          }

          return {
            output: {
              orderId: orderId,
              status: CANCEL_ORDER_STATUS.FAILED,
            },
          }
        },
      },
    ],
    autoRun: [
      {
        cron: '* * * * *',
        limit: 100,
        queue: 'checkPayment',
      },
    ],
    shouldAutoRun: async (payload) => {
      return true
    },
  },
  i18n: {
    supportedLanguages: { vi },
    fallbackLanguage: 'vi',
  },
})
