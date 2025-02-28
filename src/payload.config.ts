// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'

import sharp from 'sharp' // sharp-import
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'
// import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
// import nodemailer from 'nodemailer'
// import { vi } from '@payloadcms/translations/languages/vi'
import { en } from '@payloadcms/translations/languages/en'

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
        // Allow logged in users to execute this endpoint (default)
        if (req.user) return true

        // If there is no logged in user, then check
        // for the Vercel Cron secret to be present as an
        // Authorization header:
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${process.env.CRON_SECRET}`
      },
    },
    tasks: [],
  },
  i18n: {
    supportedLanguages: { en },
    fallbackLanguage: 'en',
  },
})
