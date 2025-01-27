import { getValidCoupons } from '@/actions/coupons'
import { CouponCard } from '@/components/CouponCard'
import React from 'react'

export default async function Page() {
  const coupons = await getValidCoupons()

  return (
    <div className="container">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.map((coupon) => (
          <CouponCard key={coupon.id} coupon={coupon} />
        ))}
      </div>
    </div>
  )
}
