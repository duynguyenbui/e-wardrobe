'use client'

import type React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { ProductVariant } from '@/payload-types'
import { parseObject } from '@/utilities/parseObject'
import { Media } from '../Media'
import { useCart } from '@/stores/useCart'
import { Button } from '../ui/button'
import { ShoppingBasket } from 'lucide-react'
import { useModals } from '@/stores/useModals'
import { ModalType } from '@/types'

export type ProductVariantCardProps = Omit<ProductVariant, 'product'> & {
  showImage?: boolean
  showAddToCart?: boolean
}

const ProductVariantCard: React.FC<{
  productVariant: ProductVariantCardProps
  showImage?: boolean
  showAddToCart?: boolean
}> = ({ productVariant, showImage = false, showAddToCart = false }) => {
  const {
    id,
    title,
    description,
    price,
    quantity,
    image,
    size: sizePrimitive,
    color: colorPrimitive,
  } = productVariant
  const size = parseObject(sizePrimitive)
  const color = parseObject(colorPrimitive)
  const { add } = useCart()
  const { open } = useModals()

  return (
    <Card className="w-full max-w-sm overflow-hidden group">
      {showImage && (
        <div className="relative aspect-square overflow-hidden">
          <Media
            resource={image}
            fill
            alt={title}
            className="object-cover transition-transform duration-300"
          />{' '}
        </div>
      )}
      <CardContent className="p-4 space-y-4">
        <div
          className="flex justify-between items-start"
          onClick={() => open({ modal: ModalType.ADD_TO_CART, data: productVariant })}
        >
          <div>
            <h3 className="text-lg font-semibold line-clamp-1">{title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{description}</p>
          </div>
          <Badge className="w-28">Số lượng: {quantity}</Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold">${price.toFixed(2)}</span>
          <div className="flex items-center space-x-2">
            <div className="text-sm">
              <span className="font-semibold">Kích thước:</span> {size.name}
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-4 h-4 rounded-full" style={{ backgroundColor: color.hex }}></span>
              <span className="text-sm">{color.title}</span>
            </div>
          </div>
        </div>
        {showAddToCart && (
          <Button
            onClick={() => add({ id, title, price, quantity, quantityToBuy: 1 })}
            className="w-full"
          >
            Thêm vào giỏ hàng
            <ShoppingBasket className="size-4" />
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

export default ProductVariantCard
