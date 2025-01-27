/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import PageClient from './page.client'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { cn } from '@/utilities/ui'
import { ProductCard } from '@/components/ProductCard'
import ProductFilter from '@/components/ProductFilter'
import { getMaterials } from '@/actions/materials'
import { getCategories } from '@/actions/categories'

type Args = {
  searchParams: Promise<{
    q: string
    category: string
    material: string
    pageSize: number
    pageIndex: number
  }>
}
export default async function Page({ searchParams: searchParamsPromise }: Args) {
  const { q: query, category, material, pageIndex = 1, pageSize = 4 } = await searchParamsPromise

  const payload = await getPayload({ config: configPromise })
  const [materials, categories] = await Promise.all([getMaterials(), getCategories()])
  const where: any = {
    published: {
      equals: true,
    },
    or: [],
  }

  if (query) {
    where.or = [
      {
        title: {
          like: query,
        },
      },
      {
        instruction: {
          like: query,
        },
      },
      {
        description: {
          like: query,
        },
      },
    ]
  }

  if (category) {
    where.or.push({
      'category.title': {
        like: category,
      },
    })
  }

  if (material) {
    where.or.push({
      'material.title': {
        like: material,
      },
    })
  }

  const { docs: products, totalDocs } = await payload.find({
    collection: 'products',
    limit: pageSize,
    page: pageIndex,
    pagination: true,
    where,
    sort: ['-createdAt'],
  })

  return (
    <div className="pb-2">
      <PageClient />
      <div className="container mb-2">
        <div className="prose dark:prose-invert max-w-none text-center">
          <ProductFilter
            materials={materials}
            categories={categories}
            route="products"
            totalDocs={totalDocs}
          />
        </div>
      </div>

      <div className={cn('container mt-5')}>
        <div>
          <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-12 gap-2">
            {products?.map((result, index) => {
              if (typeof result === 'object' && result !== null) {
                return (
                  <div className="col-span-3" key={index}>
                    <ProductCard
                      className="h-full"
                      doc={result}
                      relationTo="products"
                      showCategories
                    />
                  </div>
                )
              }

              return null
            })}
          </div>
          {products?.length === 0 && (
            <div className="container col-span-12 text-center mt-2">No results.</div>
          )}
        </div>
      </div>
    </div>
  )
}
