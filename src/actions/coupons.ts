/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { getPayloadClient } from '@/get-payload'
import { getServerSideUser } from '@/get-serverside-user'

export const getCollectedCoupons = async (minimumPriceToUse: number) => {
  const payload = await getPayloadClient()

  const { user: currentUser } = await getServerSideUser()

  if (!currentUser) return []

  const today = new Date()

  const { docs: collectedCoupons } = await payload.find({
    collection: 'coupons',
    pagination: false,
    where: {
      and: [
        {
          validFrom: {
            less_than_equal: today,
          },
        },
        {
          validTo: {
            greater_than_equal: today,
          },
        },
        {
          collectedUsers: {
            contains: currentUser,
          },
        },
        {
          active: {
            equals: true,
          },
        },
        {
          minimumPriceToUse: {
            less_than_equal: minimumPriceToUse,
          },
        },
      ],
    },
  })

  const validCollectedCoupons = collectedCoupons.filter((coupon) => {
    if (Array.isArray(coupon.currentUse)) {
      return !coupon.currentUse.some(
        (user) => typeof user === 'object' && user.id === currentUser.id,
      )
    }

    return true
  })

  return validCollectedCoupons
}

export const getValidCoupons = async () => {
  const payload = await getPayloadClient()

  const today = new Date()

  const where: any = {
    and: [
      {
        validFrom: {
          less_than_equal: today,
        },
      },
      {
        validTo: {
          greater_than_equal: today,
        },
      },
      {
        active: {
          equals: true,
        },
      },
    ],
  }

  const { docs: validRangeTimeCoupons } = await payload.find({
    collection: 'coupons',
    pagination: false,
    where,
  })

  const validCoupons =
    validRangeTimeCoupons.filter((coupon) => {
      const hasRemainingQuantity = (coupon.quantity ?? 0) > (coupon.currentUse?.length ?? 0)
      const hasRemainingCollectedUsers =
        (coupon.collectedUsers?.length ?? 0) < (coupon.quantity ?? 0)

      return hasRemainingCollectedUsers && hasRemainingQuantity
    }) ?? []

  return validCoupons
}

export const collectCoupon = async (couponId: string) => {
  const payload = await getPayloadClient()

  const today = new Date()

  const { user: currentUser } = await getServerSideUser()

  if (!currentUser) return { success: false, message: 'User not found' }

  const coupon = await payload.findByID({
    collection: 'coupons',
    id: couponId,
  })

  if (!coupon) return { success: false, message: 'Coupon not found' }

  if (new Date(coupon.validFrom) > today || new Date(coupon.validTo) < today) {
    return { success: false, message: 'Coupon is not valid' }
  }

  if (
    coupon.collectedUsers?.some((user) =>
      typeof user === 'object' ? user?.id === currentUser.id : user === currentUser.id,
    )
  ) {
    return { success: false, message: 'Coupon already collected' }
  }

  if (
    coupon.currentUse?.some((user) =>
      typeof user === 'object' ? user?.id === currentUser.id : user === currentUser.id,
    )
  ) {
    return { success: false, message: 'Coupon already used' }
  }

  if ((coupon.currentUse?.length || 0) >= coupon.quantity) {
    return { success: false, message: 'Coupon has been used up' }
  }

  if ((coupon.collectedUsers?.length ?? 0) >= coupon.quantity) {
    return { success: false, message: 'Coupon has been collected by enough users' }
  }

  await payload.update({
    collection: 'coupons',
    id: couponId,
    data: {
      collectedUsers: [...(coupon.collectedUsers ?? []), currentUser.id],
    },
  })

  return { success: true, message: 'Coupon collected' }
}
