/* eslint-disable @typescript-eslint/no-explicit-any */
import type { CollectionSlug, GlobalSlug, Payload, PayloadRequest, File } from 'payload'
import { contactForm as contactFormData } from './contact-form'
import { contact as contactPageData } from './contact-page'
import { home } from './home'
import { image1 } from './image-1'
import { image2 } from './image-2'
import { imageHero1 } from './image-hero-1'
import { post1 } from './post-1'
import { post2 } from './post-2'
import { post3 } from './post-3'
import { faker } from '@faker-js/faker'
import path from 'path'
import fs from 'fs/promises'

const NUM_COLORS = 20
const NUM_MATERIALS = 20
const NUM_CATEGORIES = 17
const NUM_PRODUCTS = 10

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

const collections: CollectionSlug[] = [
  'categories',
  'media',
  'pages',
  'posts',
  'forms',
  'form-submissions',
  'search',
]
const globals: GlobalSlug[] = ['header', 'footer']

export const seed = async ({ payload, req }: { payload: Payload; req: PayloadRequest }) => {
  payload.logger.info('Seeding database...')

  payload.logger.info(`— Clearing collections and globals...`)
  // clear the database
  await Promise.all(
    globals.map((global) =>
      payload.updateGlobal({
        slug: global,
        data: {
          navItems: [],
        },
        depth: 0,
        context: {
          disableRevalidate: true,
        },
      }),
    ),
  )

  await Promise.all(
    collections.map((collection) => payload.db.deleteMany({ collection, req, where: {} })),
  )

  await Promise.all(
    collections
      .filter((collection) => Boolean(payload.collections[collection].config.versions))
      .map((collection) => payload.db.deleteVersions({ collection, req, where: {} })),
  )

  payload.logger.info(`— Seeding demo author and user...`)

  await payload.delete({
    collection: 'users',
    depth: 0,
    where: {
      email: {
        equals: 'demo@ewardrobe.com',
      },
    },
  })

  const [image1Buffer, image2Buffer, image3Buffer, hero1Buffer] = await Promise.all([
    fetchFileByDisk(
      '/Users/buiduynguyen/Projects/Payload/e-wardrobe/src/endpoints/seed',
      'image-post1.webp',
    ),
    fetchFileByDisk(
      '/Users/buiduynguyen/Projects/Payload/e-wardrobe/src/endpoints/seed',
      'image-post2.webp',
    ),
    fetchFileByDisk(
      '/Users/buiduynguyen/Projects/Payload/e-wardrobe/src/endpoints/seed',
      'image-post3.webp',
    ),
    fetchFileByDisk(
      '/Users/buiduynguyen/Projects/Payload/e-wardrobe/src/endpoints/seed',
      'image-hero1.webp',
    ),
  ])

  const [
    demoAuthor,
    image1Doc,
    image2Doc,
    image3Doc,
    imageHomeDoc,
    menCategory,
    womenCategory,
    kidsCategory,
  ] = await Promise.all([
    // USERS
    payload.create({
      collection: 'users',
      data: {
        name: 'Demo',
        email: 'demo@ewardrobe.com',
        password: 'demo',
        roles: ['user'],
      },
    }),
    // MEDIA
    payload.create({
      collection: 'media',
      data: image1,
      file: image1Buffer,
    }),
    payload.create({
      collection: 'media',
      data: image2,
      file: image2Buffer,
    }),
    payload.create({
      collection: 'media',
      data: image2,
      file: image3Buffer,
    }),
    payload.create({
      collection: 'media',
      data: imageHero1,
      file: hero1Buffer,
    }),
    // CATEGORIES
    payload.create({
      collection: 'categories',
      data: {
        title: 'Men',
        breadcrumbs: [
          {
            label: 'Men',
            url: '/men',
          },
        ],
      },
    }),

    payload.create({
      collection: 'categories',
      data: {
        title: 'Women',
        breadcrumbs: [
          {
            label: 'Women',
            url: '/women',
          },
        ],
      },
    }),

    payload.create({
      collection: 'categories',
      data: {
        title: 'Kids',
        breadcrumbs: [
          {
            label: 'Kids',
            url: '/kids',
          },
        ],
      },
    }),
    payload.create({
      collection: 'categories',
      data: {
        title: 'Accessories',
        breadcrumbs: [
          {
            label: 'Accessories',
            url: '/accessories',
          },
        ],
      },
    }),

    payload.create({
      collection: 'categories',
      data: {
        title: 'Footwear',
        breadcrumbs: [
          {
            label: 'Footwear',
            url: '/footwear',
          },
        ],
      },
    }),

    payload.create({
      collection: 'categories',
      data: {
        title: 'Outerwear',
        breadcrumbs: [
          {
            label: 'Outerwear',
            url: '/outerwear',
          },
        ],
      },
    }),
  ])

  let demoAuthorID: number | string = demoAuthor.id

  let image1ID: number | string = image1Doc.id
  let image2ID: number | string = image2Doc.id
  let image3ID: number | string = image3Doc.id
  let imageHomeID: number | string = imageHomeDoc.id

  if (payload.db.defaultIDType === 'text') {
    image1ID = `"${image1Doc.id}"`
    image2ID = `"${image2Doc.id}"`
    image3ID = `"${image3Doc.id}"`
    imageHomeID = `"${imageHomeDoc.id}"`
    demoAuthorID = `"${demoAuthorID}"`
  }

  payload.logger.info(`— Seeding posts...`)

  // Do not create posts with `Promise.all` because we want the posts to be created in order
  // This way we can sort them by `createdAt` or `publishedAt` and they will be in the expected order
  const post1Doc = await payload.create({
    collection: 'posts',
    depth: 0,
    context: {
      disableRevalidate: true,
    },
    data: JSON.parse(
      JSON.stringify({ ...post1, categories: [menCategory.id] })
        .replace(/"\{\{IMAGE_1\}\}"/g, String(image1ID))
        .replace(/"\{\{IMAGE_2\}\}"/g, String(image2ID))
        .replace(/"\{\{AUTHOR\}\}"/g, String(demoAuthorID)),
    ),
  })

  const post2Doc = await payload.create({
    collection: 'posts',
    depth: 0,
    context: {
      disableRevalidate: true,
    },
    data: JSON.parse(
      JSON.stringify({ ...post2, categories: [womenCategory.id] })
        .replace(/"\{\{IMAGE_1\}\}"/g, String(image2ID))
        .replace(/"\{\{IMAGE_2\}\}"/g, String(image3ID))
        .replace(/"\{\{AUTHOR\}\}"/g, String(demoAuthorID)),
    ),
  })

  const post3Doc = await payload.create({
    collection: 'posts',
    depth: 0,
    context: {
      disableRevalidate: true,
    },
    data: JSON.parse(
      JSON.stringify({ ...post3, categories: [kidsCategory.id] })
        .replace(/"\{\{IMAGE_1\}\}"/g, String(image3ID))
        .replace(/"\{\{IMAGE_2\}\}"/g, String(image1ID))
        .replace(/"\{\{AUTHOR\}\}"/g, String(demoAuthorID)),
    ),
  })

  // update each post with related posts
  await payload.update({
    id: post1Doc.id,
    collection: 'posts',
    data: {
      relatedPosts: [post2Doc.id, post3Doc.id],
    },
  })

  await payload.update({
    id: post2Doc.id,
    collection: 'posts',
    data: {
      relatedPosts: [post1Doc.id, post3Doc.id],
    },
  })
  await payload.update({
    id: post3Doc.id,
    collection: 'posts',
    data: {
      relatedPosts: [post1Doc.id, post2Doc.id],
    },
  })

  payload.logger.info(`— Seeding contact form...`)

  const contactForm = await payload.create({
    collection: 'forms',
    depth: 0,
    data: JSON.parse(JSON.stringify(contactFormData)),
  })

  let contactFormID: number | string = contactForm.id

  if (payload.db.defaultIDType === 'text') {
    contactFormID = `"${contactFormID}"`
  }

  payload.logger.info(`— Seeding pages...`)

  const [homePage, contactPage] = await Promise.all([
    payload.create({
      collection: 'pages',
      depth: 0,
      data: JSON.parse(
        JSON.stringify(home)
          .replace(/"\{\{IMAGE_1\}\}"/g, String(imageHomeID))
          .replace(/"\{\{IMAGE_2\}\}"/g, String(image2ID)),
      ),
    }),
    payload.create({
      collection: 'pages',
      depth: 0,
      data: JSON.parse(
        JSON.stringify(contactPageData).replace(
          /"\{\{CONTACT_FORM_ID\}\}"/g,
          String(contactFormID),
        ),
      ),
    }),
  ])

  payload.logger.info(`— Seeding globals...`)

  await Promise.all([
    payload.updateGlobal({
      slug: 'header',
      data: {
        navItems: [
          {
            link: {
              type: 'reference',
              label: 'Home',
              reference: {
                relationTo: 'pages',
                value: homePage.id,
              },
            },
          },
          {
            link: {
              type: 'custom',
              label: 'Posts',
              url: '/posts',
            },
          },
          {
            link: {
              type: 'custom',
              label: 'Products',
              url: '/products',
            },
          },
          {
            link: {
              type: 'reference',
              label: 'Contact',
              reference: {
                relationTo: 'pages',
                value: contactPage.id,
              },
            },
          },
          {
            link: {
              type: 'custom',
              label: 'Chat',
              url: '/chat',
            },
          },
          {
            link: {
              type: 'custom',
              label: 'Login',
              url: '/login',
            },
          },
          {
            link: {
              type: 'custom',
              label: 'Register',
              url: '/register',
            },
          },
          {
            link: {
              type: 'custom',
              label: 'Account',
              url: '/account',
            },
          },
          {
            link: {
              type: 'custom',
              label: 'Logout',
              url: '/logout',
            },
          },
        ],
      },
    }),
    payload.updateGlobal({
      slug: 'footer',
      data: {
        navItems: [
          {
            link: {
              type: 'custom',
              label: 'Admin',
              url: '/admin',
            },
          },
        ],
      },
    }),
  ])

  payload.logger.info(`— Seeding materials...`)
  const createdMaterials = await create(payload, 'materials', materials())

  payload.logger.info(`— Seeding sizes...`)
  await create(payload, 'sizes', sizes())

  payload.logger.info(`— Seeding colors...`)
  await create(payload, 'colors', colors())

  payload.logger.info(`— Seeding image products...`)
  const createdImageBuffer: any[] = []

  for (let i = 1; i <= 30; i++) {
    const imageBuffer = await fetchFileByDisk(
      '/Users/buiduynguyen/Projects/Payload/e-wardrobe/pics',
      `${i}.jpg`,
    )

    createdImageBuffer.push(imageBuffer)
  }
  const createdImages: any[] = []

  await Promise.all(
    createdImageBuffer.map(async (imageBuffer) => {
      const createdImage = await payload.create({
        collection: 'media',
        data: {
          alt: faker.commerce.productName(),
        },
        file: imageBuffer,
      })

      createdImages.push(createdImage)

      return createdImage
    }),
  )

  payload.logger.info(`— Seeding products...`)
  const seedProducts = (): any[] => {
    return Array.from({ length: NUM_PRODUCTS }).map(() => ({
      title: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      instruction: faker.commerce.productAdjective(),
      material: faker.helpers.arrayElement(createdMaterials).id,
      category: faker.helpers.arrayElement([kidsCategory, menCategory, womenCategory]).id,
      image: faker.helpers.arrayElement(createdImages).id,
      published: faker.datatype.boolean(),
    }))
  }

  await create(payload, 'products', seedProducts())

  payload.logger.info(`— Seeding categories...`)

  await create(payload, 'categories', categories(), true)

  payload.logger.info('Seeded database successfully!')
}

const fetchFileByDisk = async (folder: string, url: string): Promise<File> => {
  const filePath = path.resolve(folder, url)
  const data = await fs.readFile(filePath)

  return {
    name: path.basename(filePath),
    data: Buffer.from(data),
    mimetype: `image/${path.extname(filePath).slice(1)}`,
    size: data.byteLength,
  }
}

const create = async (
  payload: Payload,
  collection: any,
  data: any[],
  ignoreExistingData: boolean = false,
) => {
  const createdData: any[] = []

  const { totalDocs } = await payload.find({
    collection,
    pagination: false,
  })

  if (totalDocs <= 0 || ignoreExistingData) {
    await Promise.all(
      data.map(async (item) => {
        const createdItem = await payload.create({
          collection,
          data: item,
        })
        createdData.push(createdItem)
      }),
    )

    return createdData
  }

  return createdData
}

const categories = () =>
  Array.from({ length: NUM_CATEGORIES }).map(() => {
    const title = capitalize(faker.commerce.department())

    return {
      title,
      breadcrumbs: [
        {
          label: title,
          url: `/${title.toLowerCase().replace(/ /g, '-').trim()}`,
        },
      ],
    }
  })

const colors = () =>
  Array.from({ length: NUM_COLORS }).map(() => ({
    title: capitalize(faker.color.human()),
    description: capitalize(faker.commerce.productDescription()),
    hex: faker.color.rgb({ format: 'hex' }),
  }))

const sizes = () =>
  Array.from([
    ['XXXS', 120, 140, 25, 35],
    ['XXS', 130, 150, 35, 45],
    ['XS', 140, 160, 40, 50],
    ['S', 150, 170, 45, 60],
    ['M', 160, 180, 55, 75],
    ['L', 170, 190, 65, 85],
    ['XL', 180, 200, 75, 100],
    ['XXL', 185, 210, 85, 120],
    ['3XL', 190, 220, 100, 150],
    ['4XL', 195, 230, 120, 180],
    ['5XL', 200, 240, 140, 210],
    ['6XL', 205, 250, 160, 240],
    ['7XL', 210, 260, 180, 280],
  ]).map(([name, minHeight, maxHeight, minWeight, maxWeight]) => ({
    name,
    description: `Size ${name}, suitable for height ${minHeight}-${maxHeight}cm and weight ${minWeight}-${maxWeight}kg.`,
    minHeight,
    maxHeight,
    minWeight,
    maxWeight,
  }))

const materials = () =>
  Array.from({ length: NUM_MATERIALS }).map(() => ({
    title: capitalize(faker.commerce.productMaterial()),
    description: capitalize(faker.lorem.sentence({ min: 20, max: 30 })),
  }))
