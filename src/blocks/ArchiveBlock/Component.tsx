import type {
  Post,
  ArchiveBlock as ArchiveBlockProps,
  Color,
  Category,
  Material,
} from '@/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import RichText from '@/components/RichText'
import { PostArchive } from '@/components/PostArchive'
import { ColorArchive } from '@/components/ColorArchive'
import { CategoryArchive } from '@/components/CategoryArchive'
import { MaterialArchive } from '@/components/MaterialArchive'

export const ArchiveBlock: React.FC<
  ArchiveBlockProps & {
    id?: string
  }
> = async (props) => {
  const {
    id,
    postCategories,
    introContent,
    limit: limitFromProps,
    populateBy,
    selectedDocs,
    relationTo,
  } = props

  const limit = limitFromProps || 3
  const payload = await getPayload({ config: configPromise })

  let posts: Post[] = []
  let colors: Color[] = []
  let categories: Category[] = []
  let materials: Material[] = []

  if (relationTo === 'posts') {
    if (populateBy === 'collection') {
      const flattenedCategories = postCategories?.map((category) => {
        if (typeof category === 'object') return category.id
        else return category
      })

      const fetchedPosts = await payload.find({
        collection: 'posts',
        depth: 1,
        limit,
        ...(flattenedCategories && flattenedCategories.length > 0
          ? {
              where: {
                categories: {
                  in: flattenedCategories,
                },
              },
            }
          : {}),
      })

      posts = fetchedPosts.docs
    } else {
      if (selectedDocs?.length) {
        const filteredSelectedPosts = selectedDocs.map((post) => {
          if (typeof post.value === 'object') return post.value
        }) as Post[]

        posts = filteredSelectedPosts
      }
    }
  }

  if (relationTo === 'colors' && populateBy === 'collection') {
    const fetchedColors = await payload.find({
      collection: 'colors',
      depth: 1,
      limit,
    })
    colors = fetchedColors.docs
  }

  if (relationTo === 'categories' && populateBy === 'collection') {
    const fetchedCategories = await payload.find({
      collection: 'categories',
      depth: 1,
      limit,
    })
    categories = fetchedCategories.docs
  }

  if (relationTo === 'materials' && populateBy === 'collection') {
    const fetchedMaterials = await payload.find({
      collection: 'materials',
      depth: 1,
      limit,
    })
    materials = fetchedMaterials.docs
  }

  return (
    <div className="my-16" id={`block-${id}`}>
      {introContent && (
        <div className="container mb-16">
          <RichText className="ml-0 max-w-[48rem]" data={introContent} enableGutter={false} />
        </div>
      )}
      {relationTo === 'posts' && <PostArchive posts={posts} />}
      {relationTo === 'colors' && <ColorArchive colors={colors} />}
      {relationTo === 'categories' && <CategoryArchive categories={categories} />}
      {relationTo === 'materials' && <MaterialArchive materials={materials} />}
    </div>
  )
}
