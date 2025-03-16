import { Category } from '@/payload-types'
import React from 'react'
import { CategoryCard } from '../CategoryCard'

export type Props = {
  categories: Category[]
  className?: string
}

export const CategoryArchive = (props: Props) => {
  const { categories } = props

  return (
    <div className="container">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories &&
          categories.map((category, index) => (
            <CategoryCard
              title={category.title}
              description={category?.description || 'Không có mô tả'}
              key={index}
            />
          ))}
      </div>
    </div>
  )
}
