import React from 'react'
import PageClient from '../page.client'
import { getPayloadClient } from '@/get-payload'
import { redirect } from 'next/navigation'
import { ProductCard } from '@/components/ProductCard'
import Variants from '@/components/Variants'
import { cn } from '@/utilities/ui'

type Args = {
  params: Promise<{
    slug?: string
  }>
}

const ProductPage = async ({ params }: Args) => {
  const { slug } = await params

  if (!slug) {
    redirect('/products')
  }

  const payload = await getPayloadClient()
  const [product, variantsResult] = await Promise.all([
    payload.findByID({
      collection: 'products',
      id: slug,
    }),
    payload.find({
      collection: 'productVariants',
      where: {
        'product.id': {
          equals: slug,
        },
      },
      pagination: false,
    }),
  ])

  if (!product) {
    redirect('/products')
  }

  const { docs: variants } = variantsResult

  return (
    <div className={cn('container mt-5')}>
      <PageClient />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="col-span-1 pb-20">
          <ProductCard doc={product} goInto={false} relationTo="products" />
        </div>
        <div className="col-span-2">
          <Variants variants={variants} />
        </div>
      </div>
    </div>
  )
}

export default ProductPage
