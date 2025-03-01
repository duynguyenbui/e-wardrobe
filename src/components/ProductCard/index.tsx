'use client'

import { cn } from '@/utilities/ui'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import type React from 'react'
import type { Product } from '@/payload-types'
import { Media } from '@/components/Media'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ImageOff, ShoppingCart } from 'lucide-react'

export type CardProductData = Product

export const ProductCard: React.FC<{
  alignItems?: 'center'
  className?: string
  doc?: CardProductData
  relationTo?: 'products'
  showCategories?: boolean
  goInto?: boolean
  title?: string
}> = (props) => {
  const { link } = useClickableCard({})
  const { className, doc, relationTo, showCategories, title: titleFromProps, goInto = true } = props

  const {
    slug,
    category,
    title,
    description,
    instruction,
    image: metaImage,
    material,
    id,
  } = doc || {}

  const hasCategory = Boolean(category) && !Array.isArray(category)
  const titleToUse = titleFromProps || title
  const sanitizedDescription = description?.length
    ? `${description.replace(/\s+/g, ' ').slice(0, 100)}${description.length > 100 ? '...' : ''}`
    : null
  const href = `/${relationTo}/${id || slug}`

  return (
    <Card
      className={cn(
        'group relative flex flex-col h-full transition-all duration-200 hover:shadow-lg',
        'border border-border rounded-lg overflow-hidden bg-card',
        className,
      )}
    >
      <div className="relative w-full aspect-square bg-muted overflow-hidden">
        {metaImage && typeof metaImage !== 'string' ? (
          <Media fill resource={metaImage} size="15vw" className="object-cover" />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-muted/50">
            <ImageOff className="w-12 h-12 text-muted-foreground/50" />
          </div>
        )}
      </div>
      <CardHeader className="flex-grow">
        <div className="flex items-center gap-1 flex-wrap mb-1">
          {showCategories && hasCategory && typeof category === 'object' && (
            <Badge variant="secondary" className="font-medium">
              {category.title || 'Untitled category'}
            </Badge>
          )}
          {typeof material === 'object' && (
            <Badge variant="outline" className="font-medium">
              {material.title}
            </Badge>
          )}
        </div>
        <CardTitle className="line-clamp-2">
          <Link
            className="hover:underline decoration-primary/30 underline-offset-2"
            href={href}
            ref={link.ref}
          >
            {titleToUse}
          </Link>
        </CardTitle>
        {sanitizedDescription && (
          <CardContent className="p-0">
            <p className="text-sm text-muted-foreground line-clamp-2">{sanitizedDescription}</p>
          </CardContent>
        )}
      </CardHeader>
      {instruction && (
        <CardFooter className="pt-0 flex justify-between items-center">
          <p className="text-sm text-muted-foreground">{instruction}</p>
          {goInto && (
            <Link
              href={`/products/${id}`}
              className="text-sm text-muted-foreground flex gap-2 items-center hover:scale-105 transition-all duration-100"
            >
              Buy Now
              <ShoppingCart className="w-5 h-5" />
            </Link>
          )}
        </CardFooter>
      )}
    </Card>
  )
}
