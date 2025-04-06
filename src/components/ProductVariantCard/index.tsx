'use client'

import type React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { ProductVariant } from '@/payload-types'
import { parseObject } from '@/utilities/parseObject'
import { useCart } from '@/stores/useCart'
import { Button } from '../ui/button'
import { ShoppingBasket } from 'lucide-react'
import { useModals } from '@/stores/useModals'
import { ModalType } from '@/types'
import ImageSlider from '../ImageSlider'
import { formatVND } from '@/utilities/currency'
import { cn } from '@/utilities/ui'
import { Fragment } from 'react'

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
    discount,
    price,
    quantity,
    images,
    size: sizePrimitive,
    color: colorPrimitive,
  } = productVariant
  const size = parseObject(sizePrimitive)
  const color = parseObject(colorPrimitive)
  const { add } = useCart()
  const { open } = useModals()

  const discountedPrice = discount ? price - (price * discount) / 100 : price

  return (
    <Card className="w-full max-w-sm overflow-hidden group">
      {showImage && (
        <div className="relative aspect-square overflow-hidden">
          <ImageSlider images={images} />
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
          <Badge className="w-28">SL: {quantity}</Badge>
        </div>
        <div className="flex items-center justify-between">
          <Fragment>
            <span className={cn(discount > 0 && 'line-through text-zinc-500 text-sm mr-2')}>
              ₫{formatVND(price)}
            </span>
            {discount > 0 && <span>₫{formatVND(discountedPrice)}</span>}
          </Fragment>
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
            onClick={() => add({ id, title, price, quantity, quantityToBuy: 1, discount, isBuying: true })}
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
