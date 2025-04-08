'use client'
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
import { useRouter } from 'next/navigation'

interface VariantsProps {
  variants: ProductVariant[]
}

export default function Variants({ variants }: VariantsProps) {
  const { open } = useModals()
  const router = useRouter()

  return (
    <div className="flex flex-col space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Phiên bản</h2>
        <p className="text-sm text-muted-foreground">
          Chọn một phiên bản để thêm vào giỏ hàng. Nếu bạn cần giúp đỡ về kích cỡ, hãy sử dụng công
          cụ khuyến nghị kích cỡ bên dưới.
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
        <p className="text-center text-gray-500">Không có phiên bản</p>
      )}

      <div className="flex space-x-2 items-center justify-center">
        <Button
          variant="secondary"
          onClick={() => open({ modal: ModalType.SIZE_SELECTOR })}
          className="flex items-center justify-center"
        >
          Khuyến nghị kích cỡ
          <PaintRollerIcon className="w-5 h-5 ml-2" />
        </Button>
        <Button
          variant="default"
          className="bg-gradient-to-r from-blue-600 to-indigo-400"
          onClick={() => router.push('/chatbot')}
        >
          Chat với AI Stylist
        </Button>
      </div>
      <Warranties />
    </div>
  )
}
