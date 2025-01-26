'use client'

import React from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Button } from '@/components/ui/button'
import ProductVariantCard from '@/components/ProductVariantCard'
import { useModals } from '@/stores/useModals'
import { ModalType } from '@/types'
import { PaintRollerIcon } from 'lucide-react'
import type { ProductVariant } from '@/payload-types'
import Warranties from '../Warranties'

interface VariantsProps {
  variants: ProductVariant[]
}

export default function Variants({ variants }: VariantsProps) {
  const { open } = useModals()

  return (
    <div className="flex flex-col space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Variants</h2>
        <p className="text-sm text-muted-foreground">
          Select a variant to add to your cart. If you need help with sizing, use the size
          recommendation tool below.
        </p>
      </div>

      {variants.length > 0 ? (
        <Carousel className="w-full max-w-md mx-auto">
          <CarouselContent>
            {variants.map((variant, index) => (
              <CarouselItem key={index} className="pl-1">
                <ProductVariantCard productVariant={variant} showAddToCart />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      ) : (
        <p className="text-center text-gray-500">No variants available</p>
      )}

      <Button
        variant="secondary"
        onClick={() => open({ modal: ModalType.SIZE_SELECTOR })}
        className="flex items-center justify-center"
      >
        Size Recommendation
        <PaintRollerIcon className="w-5 h-5 ml-2" />
      </Button>
      <Warranties />
    </div>
  )
}
