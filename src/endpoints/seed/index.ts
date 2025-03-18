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
  payload.logger.info(`Clearing collections and globals...`)

  await Promise.all([
    payload.delete({
      collection: 'users',
      depth: 0,
      where: {
        email: {
          equals: 'demo@ewardrobe.com',
        },
      },
    }),
    payload.delete({
      collection: 'users',
      depth: 0,
      where: {
        email: {
          equals: 'user@ewardrobe.com',
        },
      },
    }),
  ])

  await Promise.all([
    payload.delete({
      collection: 'orders',
      where: {
        id: {
          exists: true,
        },
      },
    }),
    payload.delete({
      collection: 'pages',
      where: {
        id: {
          exists: true,
        },
      },
    }),
    payload.delete({
      collection: 'posts',
      where: {
        id: {
          exists: true,
        },
      },
    }),
    payload.delete({
      collection: 'productVariants',
      where: {
        id: {
          exists: true,
        },
      },
    }),
    payload.delete({
      collection: 'products',
      where: {
        id: {
          exists: true,
        },
      },
    }),
    payload.delete({
      collection: 'shippingFees',
      where: {
        id: {
          exists: true,
        },
      },
    }),
    payload.delete({
      collection: 'addresses',
      where: {
        id: {
          exists: true,
        },
      },
    }),
    payload.delete({
      collection: 'categories',
      where: {
        id: {
          exists: true,
        },
      },
    }),
    payload.delete({
      collection: 'colors',
      where: {
        id: {
          exists: true,
        },
      },
    }),
    payload.delete({
      collection: 'coupons',
      where: {
        id: {
          exists: true,
        },
      },
    }),
    payload.delete({
      collection: 'materials',
      where: {
        id: {
          exists: true,
        },
      },
    }),
    payload.delete({
      collection: 'sizes',
      where: {
        id: {
          exists: true,
        },
      },
    }),
    payload.delete({
      collection: 'shippingStatuses',
      where: {
        id: {
          exists: true,
        },
      },
    }),
    payload.delete({
      collection: 'warranties',
      where: {
        id: {
          exists: true,
        },
      },
    }),
    payload.delete({
      collection: 'media',
      where: {
        id: {
          exists: true,
        },
      },
    }),
  ])

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

  payload.logger.info(`Seeding demo author and user...`)

  const [image1Buffer, image2Buffer, image3Buffer, hero1Buffer] = await Promise.all([
    fetchFileByDisk('D:/Projects/PayloadCMS/e-wardrobe/src/endpoints/seed', 'image-post1.webp'),
    fetchFileByDisk('D:/Projects/PayloadCMS/e-wardrobe/src/endpoints/seed', 'image-post2.webp'),
    fetchFileByDisk('D:/Projects/PayloadCMS/e-wardrobe/src/endpoints/seed', 'image-post3.webp'),
    fetchFileByDisk('D:/Projects/PayloadCMS/e-wardrobe/src/endpoints/seed', 'image-hero1.webp'),
  ])

  const [
    user,
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
        name: 'User',
        email: 'user@ewardrobe.com',
        password: 'user',
        gender: 'male',
        birthday: '1990-01-01',
        roles: ['user'],
      },
    }),
    payload.create({
      collection: 'users',
      data: {
        name: 'Demo',
        email: 'demo@ewardrobe.com',
        password: 'demo',
        gender: 'male',
        birthday: '1990-01-01',
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
        title: 'Nam',
        breadcrumbs: [
          {
            label: 'Nam',
            url: '/nam',
          },
        ],
      },
    }),
    payload.create({
      collection: 'categories',
      data: {
        title: 'Nữ',
        breadcrumbs: [
          {
            label: 'Nữ',
            url: '/nu',
          },
        ],
      },
    }),
    payload.create({
      collection: 'categories',
      data: {
        title: 'Trẻ em',
        breadcrumbs: [
          {
            label: 'Trẻ em',
            url: '/tre-em',
          },
        ],
      },
    }),
    payload.create({
      collection: 'categories',
      data: {
        title: 'Phụ kiện',
        breadcrumbs: [
          {
            label: 'Phụ kiện',
            url: '/phu-kien',
          },
        ],
      },
    }),
    payload.create({
      collection: 'categories',
      data: {
        title: 'Giày dép',
        breadcrumbs: [
          {
            label: 'Giày dép',
            url: '/giay-dep',
          },
        ],
      },
    }),
    payload.create({
      collection: 'categories',
      data: {
        title: 'Áo khoác',
        breadcrumbs: [
          {
            label: 'Áo khoác',
            url: '/ao-khoac',
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

  payload.logger.info(`Seeding posts...`)

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

  payload.logger.info(`Seeding contact form...`)

  const contactForm = await payload.create({
    collection: 'forms',
    depth: 0,
    data: JSON.parse(JSON.stringify(contactFormData)),
  })

  let contactFormID: number | string = contactForm.id

  if (payload.db.defaultIDType === 'text') {
    contactFormID = `"${contactFormID}"`
  }

  payload.logger.info(`Seeding pages...`)

  const [_, contactPage] = await Promise.all([
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

  payload.logger.info(`Seeding globals...`)

  await Promise.all([
    payload.updateGlobal({
      slug: 'header',
      data: {
        navItems: [
          {
            link: {
              type: 'custom',
              label: 'Trang chủ',
              url: '/',
            },
          },
          {
            link: {
              type: 'custom',
              label: 'Bài viết',
              url: '/posts',
            },
          },
          {
            link: {
              type: 'custom',
              label: 'Sản phẩm',
              url: '/products',
            },
          },
          {
            link: {
              type: 'custom',
              label: 'Trò chuyện',
              url: '/chat',
            },
          },
          {
            link: {
              type: 'custom',
              label: 'Mã giảm giá',
              url: '/coupons',
            },
          },
          {
            link: {
              type: 'custom',
              label: 'Đơn hàng',
              url: '/orders/list',
            },
          },
          {
            link: {
              type: 'custom',
              label: 'Giỏ hàng',
              url: '/orders',
            },
          },
          {
            link: {
              type: 'custom',
              label: 'Đăng nhập',
              url: '/login',
            },
          },
          {
            link: {
              type: 'custom',
              label: 'Đăng ký',
              url: '/register',
            },
          },
          {
            link: {
              type: 'custom',
              label: 'Tài khoản',
              url: '/account',
            },
          },
          {
            link: {
              type: 'custom',
              label: 'Đăng xuất',
              url: '/logout',
            },
          },
          {
            link: {
              type: 'reference',
              label: 'Liên hệ',
              reference: {
                relationTo: 'pages',
                value: contactPage.id,
              },
            },
          },
        ],
      },
    }),
  ])

  // Seeding custom data
  payload.logger.info(`Seeding materials...`)
  const materials = [
    {
      title: 'Da',
      description:
        'Chất liệu cao cấp, mềm mại, thường dùng trong các sản phẩm thời trang và nội thất sang trọng.',
    },
    {
      title: 'Vải',
      description:
        'Chất liệu linh hoạt, thoáng khí, lý tưởng cho quần áo và đồ trang trí nội thất.',
    },
    {
      title: 'Cotton',
      description:
        'Chất liệu tự nhiên, thoáng mát, thường dùng cho quần áo và các sản phẩm gia dụng.',
    },
    {
      title: 'Polyester',
      description: 'Chất liệu tổng hợp, bền bỉ, thường dùng cho quần áo thể thao và đồ gia dụng.',
    },
    {
      title: 'Nilon',
      description: 'Chất liệu nhẹ, chống thấm nước, lý tưởng cho các sản phẩm ngoài trời.',
    },
    {
      title: 'Denim',
      description: 'Chất liệu bền, thường dùng cho quần áo casual và thời trang đường phố.',
    },
    {
      title: 'Tổng hợp',
      description: 'Chất liệu kết hợp, đa năng, phù hợp với nhiều loại sản phẩm khác nhau.',
    },
    {
      title: 'Vải dệt',
      description:
        'Chất liệu truyền thống, bền bỉ, thường dùng cho các sản phẩm thủ công và trang trí.',
    },
    {
      title: 'Vải thô',
      description: 'Chất liệu tự nhiên, mộc mạc, lý tưởng cho các sản phẩm nội thất và trang trí.',
    },
    {
      title: 'Vải dệt',
      description:
        'Chất liệu truyền thống, bền bỉ, thường dùng cho các sản phẩm thủ công và trang trí.',
    },
  ]
  const createdMaterials = await createPayloadData(payload, 'materials', materials)

  payload.logger.info(`Seeding sizes...`)
  const sizes = [
    {
      name: 'M',
      minHeight: 160,
      maxHeight: 180,
      minWeight: 55,
      maxWeight: 75,
      description: 'Kích cỡ M, phù hợp với chiều cao 160-180cm và cân nặng 55-75kg.',
    },
    {
      name: 'L',
      minHeight: 170,
      maxHeight: 190,
      minWeight: 65,
      maxWeight: 85,
      description: 'Kích cỡ L, phù hợp với chiều cao 170-190cm và cân nặng 65-85kg.',
    },
    {
      name: 'XL',
      minHeight: 180,
      maxHeight: 200,
      minWeight: 75,
      maxWeight: 100,
      description: 'Kích cỡ XL, phù hợp với chiều cao 180-200cm và cân nặng 75-100kg.',
    },
    {
      name: 'XXL',
      minHeight: 185,
      maxHeight: 210,
      minWeight: 85,
      maxWeight: 120,
      description: 'Kích cỡ XXL, phù hợp với chiều cao 185-210cm và cân nặng 85-120kg.',
    },
    {
      name: '3XL',
      minHeight: 190,
      maxHeight: 220,
      minWeight: 100,
      maxWeight: 150,
      description: 'Kích cỡ 3XL, phù hợp với chiều cao 190-220cm và cân nặng 100-150kg.',
    },
    {
      name: '4XL',
      minHeight: 195,
      maxHeight: 230,
      minWeight: 120,
      maxWeight: 180,
      description: 'Kích cỡ 4XL, phù hợp với chiều cao 195-230cm và cân nặng 120-180kg.',
    },
    {
      name: '5XL',
      minHeight: 200,
      maxHeight: 240,
      minWeight: 140,
      maxWeight: 210,
      description: 'Kích cỡ 5XL, phù hợp với chiều cao 200-240cm và cân nặng 140-210kg.',
    },
    {
      name: '6XL',
      minHeight: 205,
      maxHeight: 250,
      minWeight: 160,
      maxWeight: 240,
      description: 'Kích cỡ 6XL, phù hợp với chiều cao 205-250cm và cân nặng 160-240kg.',
    },
    {
      name: '7XL',
      minHeight: 210,
      maxHeight: 260,
      minWeight: 180,
      maxWeight: 280,
      description: 'Kích cỡ 7XL, phù hợp với chiều cao 210-260cm và cân nặng 180-280kg.',
    },
  ]
  const createdSizes = await createPayloadData(payload, 'sizes', sizes)

  payload.logger.info(`Seeding colors...`)
  const colors = [
    {
      title: 'Đỏ',
      description: 'Màu đỏ nổi bật, phù hợp với sản phẩm thời trang và nội thất hiện đại.',
      hex: '#FF5733',
    },
    {
      title: 'Xanh dương',
      description:
        'Màu xanh dương dịu mắt, thường được sử dụng cho sản phẩm văn phòng và công nghệ.',
      hex: '#337DFF',
    },
    {
      title: 'Xanh lá',
      description:
        'Màu xanh lá tự nhiên, mang đến cảm giác gần gũi, phù hợp với nội thất và đồ trang trí.',
      hex: '#33FF57',
    },
    {
      title: 'Vàng',
      description: 'Màu vàng sáng, phù hợp với các sản phẩm trang trí và chiếu sáng nội thất.',
      hex: '#FFC300',
    },
    {
      title: 'Tím',
      description:
        'Màu tím nhẹ nhàng, thường được sử dụng cho sản phẩm thời trang cao cấp và nội thất sang trọng.',
      hex: '#9B59B6',
    },
    {
      title: 'Cam',
      description: 'Màu cam ấm áp, phù hợp với nội thất phong cách hiện đại hoặc Scandinavia.',
      hex: '#E67E22',
    },
    {
      title: 'Trắng',
      description: 'Màu trắng tinh khiết, dễ kết hợp với nhiều sản phẩm và phong cách khác nhau.',
      hex: '#FFFFFF',
    },
    {
      title: 'Đen',
      description:
        'Màu đen sang trọng, thường được sử dụng trong các sản phẩm thời trang và nội thất.',
      hex: '#000000',
    },
    {
      title: 'Hồng',
      description: 'Màu hồng ngọt ngào, phù hợp với các sản phẩm thời trang và trang trí.',
      hex: '#FFC0CB',
    },
    {
      title: 'Xám',
      description: 'Màu xám trung tính, dễ kết hợp với nhiều phong cách nội thất và thời trang.',
      hex: '#808080',
    },
    {
      title: 'Nâu',
      description: 'Màu nâu ấm áp, thường được sử dụng trong nội thất và sản phẩm thời trang.',
      hex: '#A52A2A',
    },
    {
      title: 'Bạc',
      description:
        'Màu bạc hiện đại, thường được sử dụng trong các sản phẩm công nghệ và trang trí.',
      hex: '#C0C0C0',
    },
  ]
  const createdColors = await createPayloadData(payload, 'colors', colors)

  payload.logger.info(`Seeding shipping statuses...`)
  const shippingStatuses = [
    { name: 'Chờ xác nhận', description: 'Chờ xác nhận', code: 'pending' },
    { name: 'Đã giao hàng', description: 'Đã giao hàng', code: 'delivered' },
    { name: 'Đã nhận hàng', description: 'Đã nhận hàng', code: 'received' },
  ]
  await createPayloadData(payload, 'shippingStatuses', shippingStatuses)

  payload.logger.info(`Seeding categories...`)
  const categories = [
    {
      title: 'Áo thun',
      description:
        'Áo thun là loại áo thoải mái, thường được sử dụng trong các hoạt động hàng ngày và thể thao.',
      breadcrumbs: [{ label: 'Áo thun', url: '/ao-thun' }],
    },
    {
      title: 'Áo sơ mi',
      description:
        'Áo sơ mi là loại áo trang trọng, thường được mặc trong các dịp công sở hoặc sự kiện.',
      breadcrumbs: [{ label: 'Áo sơ mi', url: '/ao-so-mi' }],
    },
    {
      title: 'Quần jean',
      description:
        'Quần jean là loại quần bền bỉ, phù hợp cho cả công việc và các hoạt động thường ngày.',
      breadcrumbs: [{ label: 'Quần jean', url: '/quan-jean' }],
    },
    {
      title: 'Quần short',
      description:
        'Quần short là loại quần ngắn, lý tưởng cho các hoạt động ngoài trời và thời tiết nóng.',
      breadcrumbs: [{ label: 'Quần short', url: '/quan-short' }],
    },
    {
      title: 'Váy đầm',
      description:
        'Váy đầm là trang phục nữ tính, thường được mặc trong các dịp đặc biệt hoặc dạo phố.',
      breadcrumbs: [{ label: 'Váy đầm', url: '/vay-dam' }],
    },
    {
      title: 'Áo khoác',
      description: 'Áo khoác là loại áo ngoài, giúp giữ ấm và bảo vệ khỏi thời tiết lạnh.',
      breadcrumbs: [{ label: 'Áo khoác', url: '/ao-khoac' }],
    },
    {
      title: 'Đồ thể thao',
      description:
        'Đồ thể thao được thiết kế để tối ưu hóa hiệu suất và sự thoải mái trong các hoạt động thể thao.',
      breadcrumbs: [{ label: 'Đồ thể thao', url: '/do-the-thao' }],
    },
    {
      title: 'Phụ kiện',
      description:
        'Phụ kiện bao gồm các sản phẩm như mũ, khăn quàng, và túi xách để hoàn thiện trang phục.',
      breadcrumbs: [{ label: 'Phụ kiện', url: '/phu-kien' }],
    },
    {
      title: 'Giày dép',
      description:
        'Giày dép là sản phẩm thiết yếu, cung cấp sự thoải mái và phong cách cho đôi chân.',
      breadcrumbs: [{ label: 'Giày dép', url: '/giay-dep' }],
    },
    {
      title: 'Đồ ngủ',
      description: 'Đồ ngủ được thiết kế để mang lại sự thoải mái tối đa trong khi ngủ.',
      breadcrumbs: [{ label: 'Đồ ngủ', url: '/do-ngu' }],
    },
  ]
  const createdCategories = await createPayloadData(payload, 'categories', categories)

  payload.logger.info(`Seeding shipping fees...`)
  const shippingFees = [
    {
      title: 'Phí từ 0 đến 99.999 VNĐ',
      description: 'Phí vận chuyển từ 0 đến 99.999 VNĐ',
      minimumPriceToUse: 0,
      fee: 30000,
    },
    {
      title: 'Phí từ 100.000 đến 499.999 VNĐ',
      description: 'Phí vận chuyển từ 100.000 đến 499.999 VNĐ',
      minimumPriceToUse: 100000,
      fee: 25000,
    },
    {
      title: 'Phí từ 500.000 VNĐ trở lên (Miễn phí)',
      description: 'Phí vận chuyển từ 500.000 VNĐ trở lên (Miễn phí)',
      minimumPriceToUse: 500000,
      fee: 0,
    },
  ]
  await createPayloadData(payload, 'shippingFees', shippingFees)

  payload.logger.info('Seeding addresses...')
  await Promise.all([
    payload.create({
      collection: 'addresses',
      data: {
        name: 'Nhà riêng',
        province: 'HCM',
        district: 'Quận 1',
        ward: 'Bến Nghé',
        detailAddress: 'Số 15 Nguyễn Huệ',
        contactName: 'Trần Thị C',
        contactPhone: '0987654321',
        user: user,
      },
    }),
    payload.create({
      collection: 'addresses',
      data: {
        name: 'Công ty',
        province: 'HN',
        district: 'Ba Đình',
        ward: 'Phúc Xá',
        detailAddress: 'Số 10 Phúc Xá',
        contactName: 'Nguyễn Văn B',
        contactPhone: '0912345678',
        user: demoAuthor,
      },
    }),
    payload.create({
      collection: 'addresses',
      data: {
        name: 'Nhà bạn',
        province: 'DN',
        district: 'Hải Châu',
        ward: 'Hòa Cường Bắc',
        detailAddress: 'Số 20 Lê Duẩn',
        contactName: 'Lê Thị D',
        contactPhone: '0901234567',
        user: user,
      },
    }),
    payload.create({
      collection: 'addresses',
      data: {
        name: 'Văn phòng',
        province: 'CT',
        district: 'Ninh Kiều',
        ward: 'An Khánh',
        detailAddress: 'Số 25 Trần Hưng Đạo',
        contactName: 'Phạm Văn E',
        contactPhone: '0934567890',
        user: demoAuthor,
      },
    }),
  ])

  payload.logger.info('Seeding warranties...')

  const warranties = [
    {
      title: 'Mua hàng không hài lòng',
      description:
        'Bạn có thể đổi trả sản phẩm trong vòng 7 ngày nếu sản phẩm không đáp ứng được yêu cầu của bạn.',
    },
    {
      title: 'Bảo hành 1 năm',
      description: 'Bảo hành 1 năm cho tất cả sản phẩm',
    },
    {
      title: 'Hỗ trợ khách hàng',
      description: 'Hỗ trợ khách hàng 24/7 với AI Stylist',
    },
  ]

  await createPayloadData(payload, 'warranties', warranties)

  payload.logger.info('Seeding coupons...')

  const coupons = [
    {
      code: 'SUMMER10',
      description: 'Khuyến mãi tháng 3',
      minimumPriceToUse: 150000,
      quantity: 50,
      discountType: 'percentage',
      discountAmount: 10,
      active: faker.datatype.boolean(),
      validFrom: faker.date.past({ years: 1 }).toISOString(),
      validTo: faker.date.future({ years: 1 }).toISOString(),
    },
    {
      code: 'WEEKEND50',
      description: 'Ưu đãi đặc biệt cuối tuần',
      minimumPriceToUse: 300000,
      quantity: 30,
      discountType: 'fixed',
      discountAmount: 50000,
      active: faker.datatype.boolean(),
      validFrom: faker.date.past({ years: 1 }).toISOString(),
      validTo: faker.date.future({ years: 1 }).toISOString(),
    },
    {
      code: 'NEWUSER15',
      description: 'Coupon dành cho khách mới',
      minimumPriceToUse: 100000,
      quantity: 100,
      discountType: 'percentage',
      active: faker.datatype.boolean(),
      discountAmount: 15,
      validFrom: faker.date.past({ years: 1 }).toISOString(),
      validTo: faker.date.future({ years: 1 }).toISOString(),
    },
    {
      code: 'SUMMER10',
      description: 'Khuyến mãi giữa tháng',
      minimumPriceToUse: 250000,
      quantity: 40,
      discountType: 'fixed',
      active: faker.datatype.boolean(),
      discountAmount: 30000,
      validFrom: faker.date.past({ years: 1 }).toISOString(),
      validTo: faker.date.future({ years: 1 }).toISOString(),
    },
    {
      code: 'FLASHSALE20',
      description: 'Flash Sale 48 giờ',
      minimumPriceToUse: 500000,
      quantity: 10,
      discountType: 'percentage',
      discountAmount: 20,
      active: faker.datatype.boolean(),
      validFrom: faker.date.past({ years: 1 }).toISOString(),
      validTo: faker.date.future({ years: 1 }).toISOString(),
    },
  ]

  await createPayloadData(payload, 'coupons', coupons)

  payload.logger.info(`Seeding image products...`)
  const createdImageBuffer: any[] = []

  for (let i = 1; i <= 10; i++) {
    const imageBuffer = await fetchFileByDisk(
      'D:/Projects/PayloadCMS/e-wardrobe/pics', // Change it depends on your local path
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

  payload.logger.info('Seeding products...')

  const products = [
    {
      title: 'Áo thun cotton',
      description:
        'Áo thun cotton mềm mại, thoáng khí, phù hợp để mặc hàng ngày hoặc đi chơi. Thiết kế đơn giản nhưng vẫn giữ được phong cách trẻ trung, năng động.',
      instruction: 'Giặt ở nhiệt độ dưới 30°C, không dùng chất tẩy mạnh, phơi trong bóng râm.',
      published: faker.datatype.boolean(),
      category: createdCategories[Math.floor(Math.random() * createdCategories.length)],
      material: createdMaterials[Math.floor(Math.random() * createdMaterials.length)],
      image: createdImages[Math.floor(Math.random() * createdImages.length)],
    },
    {
      title: 'Áo sơ mi công sở',
      description:
        'Áo sơ mi công sở thanh lịch, phù hợp cho môi trường làm việc chuyên nghiệp hoặc các sự kiện quan trọng. Chất liệu thoáng mát, giúp thoải mái suốt ngày dài.',
      instruction: 'Giặt tay hoặc giặt máy ở chế độ nhẹ, ủi ở nhiệt độ thấp, không vắt mạnh.',
      published: faker.datatype.boolean(),
      category: createdCategories[Math.floor(Math.random() * createdCategories.length)],
      material: createdMaterials[Math.floor(Math.random() * createdMaterials.length)],
      image: createdImages[Math.floor(Math.random() * createdImages.length)],
    },
    {
      title: 'Quần jean nam',
      description:
        'Quần jean nam phong cách, bền bỉ, dễ phối với áo thun hoặc sơ mi. Phù hợp với nhiều dịp từ đi làm đến đi chơi.',
      instruction:
        'Giặt máy ở chế độ nhẹ, không dùng chất tẩy mạnh, lộn trái khi giặt để bảo vệ màu vải.',
      published: faker.datatype.boolean(),
      category: createdCategories[Math.floor(Math.random() * createdCategories.length)],
      material: createdMaterials[Math.floor(Math.random() * createdMaterials.length)],
      image: createdImages[Math.floor(Math.random() * createdImages.length)],
    },
    {
      title: 'Váy maxi nữ',
      description:
        'Váy maxi nữ duyên dáng, mềm mại, phù hợp để đi biển hoặc dự tiệc nhẹ. Thiết kế thoải mái giúp tôn lên nét nữ tính và thanh lịch.',
      instruction: 'Giặt tay, không vắt mạnh, không dùng máy sấy, phơi trong bóng râm.',
      published: faker.datatype.boolean(),
      category: createdCategories[Math.floor(Math.random() * createdCategories.length)],
      material: createdMaterials[Math.floor(Math.random() * createdMaterials.length)],
      image: createdImages[Math.floor(Math.random() * createdImages.length)],
    },
    {
      title: 'Giày thể thao nam',
      description:
        'Giày thể thao nam êm ái, bền bỉ, hỗ trợ tốt cho hoạt động chạy bộ hoặc đi chơi hàng ngày. Thiết kế hiện đại, phù hợp với nhiều phong cách thời trang.',
      instruction: 'Vệ sinh bằng khăn ẩm, không giặt máy, tránh tiếp xúc trực tiếp với nước.',
      published: faker.datatype.boolean(),
      category: createdCategories[Math.floor(Math.random() * createdCategories.length)],
      material: createdMaterials[Math.floor(Math.random() * createdMaterials.length)],
      image: createdImages[Math.floor(Math.random() * createdImages.length)],
    },
  ]

  const createdProducts = await createPayloadData(payload, 'products', products)

  payload.logger.info('Seeding product variants...')

  const productVariantForProduct1 = [
    {
      title: 'Áo thun cotton màu trắng',
      description: 'Áo thun cotton màu trắng',
      quantity: 100,
      price: 100000,
      discount: 5,
      product: createdProducts[0],
      size: createdSizes[Math.floor(Math.random() * createdSizes.length)],
      color: createdColors[Math.floor(Math.random() * createdColors.length)],
      images: createdImages.slice(0, 2),
    },
    {
      title: 'Áo thun cotton màu đen',
      description: 'Áo thun cotton màu đen',
      quantity: 150,
      price: 120000,
      discount: 20,
      product: createdProducts[0],
      size: createdSizes[Math.floor(Math.random() * createdSizes.length)],
      color: createdColors[Math.floor(Math.random() * createdColors.length)],
      images: createdImages.slice(1, 3),
    },
    {
      title: 'Áo thun cotton màu xám',
      description: 'Áo thun cotton màu xám',
      quantity: 90,
      price: 115000,
      discount: 10,
      product: createdProducts[0],
      size: createdSizes[Math.floor(Math.random() * createdSizes.length)],
      color: createdColors[Math.floor(Math.random() * createdColors.length)],
      images: createdImages.slice(2, 4),
    },
  ]

  await createPayloadData(payload, 'productVariants', productVariantForProduct1)

  const productVariantForProduct2 = [
    {
      title: 'Áo sơ mi công sở màu trắng',
      description: 'Áo sơ mi công sở màu trắng',
      quantity: 100,
      price: 100000,
      discount: 10,
      product: createdProducts[1],
      size: createdSizes[Math.floor(Math.random() * createdSizes.length)],
      color: createdColors[Math.floor(Math.random() * createdColors.length)],
      images: createdImages.slice(3, 5),
    },
    {
      title: 'Áo sơ mi công sở màu xanh dương',
      description: 'Áo sơ mi công sở màu xanh dương',
      quantity: 200,
      price: 110000,
      discount: 30,
      product: createdProducts[1],
      size: createdSizes[Math.floor(Math.random() * createdSizes.length)],
      color: createdColors[Math.floor(Math.random() * createdColors.length)],
      images: createdImages.slice(4, 6),
    },
  ]

  await createPayloadData(payload, 'productVariants', productVariantForProduct2)

  const productVariantForProduct3 = [
    {
      title: 'Quần jean nam màu xanh',
      description: 'Quần jean nam màu xanh',
      quantity: 100,
      price: 200000,
      discount: 0,
      product: createdProducts[2],
      size: createdSizes[Math.floor(Math.random() * createdSizes.length)],
      color: createdColors[Math.floor(Math.random() * createdColors.length)],
      images: createdImages.slice(5, 7),
    },
    {
      title: 'Quần jean nam màu đen',
      description: 'Quần jean nam màu đen',
      quantity: 150,
      price: 220000,
      discount: 3,
      product: createdProducts[2],
      size: createdSizes[Math.floor(Math.random() * createdSizes.length)],
      color: createdColors[Math.floor(Math.random() * createdColors.length)],
      images: createdImages.slice(6, 8),
    },
  ]

  await createPayloadData(payload, 'productVariants', productVariantForProduct3)

  const productVariantForProduct4 = [
    {
      title: 'Váy maxi nữ màu trắng',
      description: 'Váy maxi nữ màu trắng',
      quantity: 100,
      price: 300000,
      discount: 0,
      product: createdProducts[3],
      size: createdSizes[Math.floor(Math.random() * createdSizes.length)],
      color: createdColors[Math.floor(Math.random() * createdColors.length)],
      images: createdImages.slice(7, 9),
    },
    {
      title: 'Váy maxi nữ màu đỏ',
      description: 'Váy maxi nữ màu đỏ',
      quantity: 150,
      price: 320000,
      discount: 7,
      product: createdProducts[3],
      size: createdSizes[Math.floor(Math.random() * createdSizes.length)],
      color: createdColors[Math.floor(Math.random() * createdColors.length)],
      images: createdImages.slice(8, 10),
    },
  ]

  await createPayloadData(payload, 'productVariants', productVariantForProduct4)

  const productVariantForProduct5 = [
    {
      title: 'Giày thể thao nam màu trắng',
      description: 'Giày thể thao nam màu trắng',
      quantity: 100,
      price: 400000,
      discount: 50,
      product: createdProducts[4],
      size: createdSizes[Math.floor(Math.random() * createdSizes.length)],
      color: createdColors[Math.floor(Math.random() * createdColors.length)],
      images: createdImages.slice(9, 11),
    },
  ]

  await createPayloadData(payload, 'productVariants', productVariantForProduct5)

  payload.logger.info('Seeded database successfully!')
}

export const createPayloadData = async (payload: Payload, collection: any, data: any[]) => {
  const createdData: any[] = []

  await Promise.all(
    data.map(async (item) => {
      const createdItem = await payload.create({
        collection,
        data: item,
      })
      await new Promise((resolve) => setTimeout(resolve, 1000))
      createdData.push(createdItem)
    }),
  )

  return createdData
}

const fetchFileByDisk = async (folder: string, url: string): Promise<File> => {
  const filePath = path.join(folder, url)
  const data = await fs.readFile(filePath)

  return {
    name: path.basename(filePath),
    data: Buffer.from(data),
    mimetype: `image/${path.extname(filePath).slice(1)}`,
    size: data.byteLength,
  }
}
