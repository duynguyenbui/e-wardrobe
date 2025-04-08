'use server'

import { getPayloadClient } from '@/get-payload'

export async function getProductVariants() {
  const payload = await getPayloadClient()
  const { docs: productVariants } = await payload.find({
    collection: 'productVariants',
    depth: 2,
    pagination: false,
    limit: 200,
  })
  return productVariants ?? []
}

export const getProductVariantsByBestSeller = async () => {
  const payload = await getPayloadClient()

  const currentDate = new Date()
  const threeMonthsAgo = new Date()
  threeMonthsAgo.setMonth(currentDate.getMonth() - 3)

  const { docs: orders } = await payload.find({
    collection: 'orders',
    where: {
      createdAt: {
        greater_than_equal: threeMonthsAgo,
        less_than_equal: currentDate,
      },
    },
    depth: 2,
    pagination: false,
  })

  interface VariantSalesItem {
    count: number
    variant: any
  }

  const variantSalesCount: Record<string, VariantSalesItem> = {}

  orders.forEach((order) => {
    if (order.lineItems && Array.isArray(order.lineItems)) {
      order.lineItems.forEach((item) => {
        if (item.productVariant && (item.productVariant as any).id) {
          const variantId = (item.productVariant as any).id
          const quantity = item.quantityToBuy || 1

          if (!variantSalesCount[variantId]) {
            variantSalesCount[variantId] = {
              count: 0,
              variant: item.productVariant,
            }
          }
          variantSalesCount[variantId].count += quantity
        }
      })
    }
  })

  const bestSellerVariants = Object.values(variantSalesCount)
    .sort((a, b) => b.count - a.count)
    .map((item) => ({
      ...item.variant,
      salesCount: item.count,
    }))
    .slice(0, 10)

  
    
  return bestSellerVariants
}
