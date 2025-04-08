import Image from 'next/image'
import { Star } from 'lucide-react'

import { Button, buttonVariants } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { getProductVariantsByBestSeller } from '@/actions/productVariants'
import ImageSlider from '@/components/ImageSlider'
import { formatVND } from '@/utilities/currency'
import Link from 'next/link'
import { cn } from '@/utilities/ui'

export default async function Page() {
  const productVariants = await getProductVariantsByBestSeller()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Sản phẩm bán chạy nhất
            <span className="text-blue-500"> tháng này</span>
          </h1>
          <p className="text-muted-foreground mt-1">Những sản phẩm được yêu thích nhất tháng này</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {productVariants.map((variant) => {
          const imageUrls = variant.images.map((image: any) => {
            if (image?.url) {
              return image.url
            }
            return '/best-seller-placeholder.svg?height=400&width=400'
          })

          return (
            <Card key={variant.id} className="overflow-hidden">
              <div className="relative aspect-square">
                <ImageSlider images={imageUrls} autoSlide={false} />
              </div>
              <CardHeader className="p-4 pb-0">
                <CardTitle className="text-lg flex items-center justify-between">
                  {variant.title}
                  <span className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-xs px-2 py-1 rounded">
                    Bán chạy nhất
                  </span>
                </CardTitle>
                <CardDescription>{variant.description}</CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex items-center gap-1 mb-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-semibold">Số lượng đã bán</span>
                  <span className="text-xs text-muted-foreground ml-1">
                    {variant.salesCount} sản phẩm
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="font-bold">
                    {formatVND(variant.price - (variant.discount * variant.price) / 100 || 0)}
                  </div>
                  {variant.discount > 0 && (
                    <div className="text-sm text-muted-foreground line-through">
                      {formatVND(variant.price)}
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Link
                  href={`/products/${variant.product.id}?variant=${variant.id}`}
                  className={cn(
                    '"w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white border-0',
                    buttonVariants({ variant: 'default' }),
                  )}
                >
                  Xem chi tiết
                </Link>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

const bestSellerProducts = [
  {
    id: 1,
    name: 'Wireless Noise-Cancelling',
    category: 'Electronics',
    price: 249.99,
    oldPrice: 299.99,
    rating: 5,
    reviewCount: 1243,
    image: '/best-seller-placeholder.svg?height=400&width=400',
    badge: 'Best Seller',
  },
  {
    id: 2,
    name: 'Smart Fitness Tracker',
    category: 'Electronics',
    price: 99.95,
    rating: 4,
    reviewCount: 857,
    image: '/best-seller-placeholder.svg?height=400&width=400',
  },
  {
    id: 3,
    name: 'Organic Cotton T-Shirt',
    category: 'Clothing',
    price: 29.99,
    rating: 4,
    reviewCount: 432,
    image: '/best-seller-placeholder.svg?height=400&width=400',
  },
  {
    id: 4,
    name: 'Stainless Steel Water Bottle',
    category: 'Home & Kitchen',
    price: 24.95,
    oldPrice: 34.95,
    rating: 5,
    reviewCount: 1876,
    image: '/best-seller-placeholder.svg?height=400&width=400',
    badge: 'Sale',
  },
]
