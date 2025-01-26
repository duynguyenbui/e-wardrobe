import React from 'react'
import PageClient from '../page.client'
import { getPayloadClient } from '@/get-payload'
import { redirect } from 'next/navigation'
import { ProductCard } from '@/components/ProductCard'
import Variants from '@/components/Variants'

type Args = {
  params: Promise<{
    slug?: string
  }>
}

const ProductPage = async ({ params }: Args) => {
  const { slug } = await params

  if (!slug) {
    return redirect('/products')
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

  const { docs: variants } = variantsResult

  return (
    <article className="pt-16 pb-16">
      <PageClient />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 container gap-5">
        <div className="col-span-1">
          <ProductCard doc={product} goInto={false} relationTo="products" />
        </div>
        <div className="col-span-1">
          <Variants variants={variants} />
        </div>
      </div>
    </article>
  )
}

export default ProductPage
