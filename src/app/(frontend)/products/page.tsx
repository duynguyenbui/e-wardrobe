/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import PageClient from './page.client'
import { Search } from '@/search/Component'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { cn } from '@/utilities/ui'
import { ProductCard } from '@/components/ProductCard'

type Args = {
  searchParams: Promise<{
    q: string
  }>
}
export default async function Page({ searchParams: searchParamsPromise }: Args) {
  const { q: query } = await searchParamsPromise
  const payload = await getPayload({ config: configPromise })

  const where: any = {
    published: {
      equals: true,
    },
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
      {
        slug: {
          like: query,
        },
      },
    ]
  }

  const { docs: products } = await payload.find({
    collection: 'products',
    depth: 1,
    limit: 8,
    // pagination: false reduces overhead if you don't need totalDocs
    pagination: false,
    where,
  })

  return (
    <div className="pb-2">
      <PageClient />
      <div className="container mb-2">
        <div className="prose dark:prose-invert max-w-none text-center">
          <h1 className="mb-2">Tag Line</h1>
          <div className="max-w-[50rem] mx-auto">
            <Search route="products" />
          </div>
        </div>
      </div>

      <div className={cn('container mt-5')}>
        <div>
          <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-12 gap-y-2 gap-x-2 lg:gap-y-3 lg:gap-x-4 xl:gap-x-4">
            {products?.map((result, index) => {
              if (typeof result === 'object' && result !== null) {
                return (
                  <div className="col-span-4" key={index}>
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
