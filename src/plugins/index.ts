import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { searchPlugin } from '@payloadcms/plugin-search'
import { Plugin } from 'payload'
import { revalidateRedirects } from '@/hooks/revalidateRedirects'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { searchFields } from '@/search/fieldOverrides'
import { beforeSyncWithSearch } from '@/search/beforeSync'
import { stripePlugin } from '@payloadcms/plugin-stripe'
import { Page, Post } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'
import Stripe from 'stripe'

const generateTitle: GenerateTitle<Post | Page> = ({ doc }) => {
  return doc?.title ? `${doc.title} | Payload Website Template` : 'Payload Website Template'
}

const generateURL: GenerateURL<Post | Page> = ({ doc }) => {
  const url = getServerSideURL()

  return doc?.slug ? `${url}/${doc.slug}` : url
}

export const plugins: Plugin[] = [
  redirectsPlugin({
    collections: ['pages', 'posts'],
    overrides: {
      admin: {
        hidden: true,
      },
      labels: {
        singular: {
          vi: 'Chuyển hướng',
        },
        plural: {
          vi: 'Chuyển hướng',
        },
      },
      // @ts-expect-error - This is a valid override, mapped fields don't resolve to the same type
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'from') {
            return {
              ...field,
              admin: {
                description: 'Bạn sẽ cần phải xây dựng lại trang web khi thay đổi trường này.',
              },
            }
          }
          return field
        })
      },
      hooks: {
        afterChange: [revalidateRedirects],
      },
    },
  }),
  nestedDocsPlugin({
    collections: ['categories'],
    generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`, ''),
  }),
  seoPlugin({
    generateTitle,
    generateURL,
  }),
  formBuilderPlugin({
    formSubmissionOverrides: {
      labels: {
        singular: {
          vi: 'Biểu mẫu đã nhận',
        },
        plural: {
          vi: 'Biểu mẫu đã nhận',
        },
      },
    },
    formOverrides: {
      labels: {
        singular: {
          vi: 'Biểu mẫu',
        },
        plural: {
          vi: 'Biểu mẫu',
        },
      },
      admin: {
        hidden: true,
      },
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'confirmationMessage') {
            return {
              ...field,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    FixedToolbarFeature(),
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                  ]
                },
              }),
            }
          }
          return field
        })
      },
    },
  }),
  searchPlugin({
    collections: ['posts'],
    beforeSync: beforeSyncWithSearch,
    searchOverrides: {
      admin: {
        hidden: true,
      },
      labels: {
        singular: {
          vi: 'Tìm kiếm',
        },
        plural: {
          vi: 'Tìm kiếm',
        },
      },
      fields: ({ defaultFields }) => {
        return [...defaultFields, ...searchFields]
      },
    },
  }),
  stripePlugin({
    stripeSecretKey: process.env.STRIPE_SECRET_KEY!,
    stripeWebhooksEndpointSecret: process.env.STRIPE_WEBHOOKS_ENDPOINT_SECRET,
    webhooks: {
      'checkout.session.completed': async ({ event, req }) => {
        const { payload } = req
        const session = event.data.object as Stripe.Checkout.Session
        const orderId = session?.metadata?.orderId

        if (orderId) {
          await payload.update({
            collection: 'orders',
            id: orderId,
            data: {
              isPaid: true,
            },
          })
        }
      },
    },
  }),
  payloadCloudPlugin(),
]
