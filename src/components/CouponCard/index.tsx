'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Ticket, Clock, DollarSign, Users } from 'lucide-react'
import { Coupon } from '@/payload-types'
import moment from 'moment'
import { collectCoupon } from '@/actions/coupons'
import { useAuth } from '@/providers/Auth'
import { toast } from 'sonner'
import { useEffect, useState } from 'react'

interface CouponCardProps {
  coupon: Coupon
}

export function CouponCard({ coupon }: CouponCardProps) {
  const { user: currentUser } = useAuth()
  const [isCollected, setIsCollected] = useState(false)

  const isSeverCollected =
    currentUser?.id &&
    Array.isArray(coupon.collectedUsers) &&
    coupon.collectedUsers?.some((user) =>
      typeof user === 'object' ? user?.id == currentUser.id : user == currentUser.id,
    )

  useEffect(() => {
    if (isSeverCollected) setIsCollected(true)
  }, [isSeverCollected])

  const onCollectCoupon = async () => {
    if (!currentUser) {
      toast.error('You need to login to collect this coupon')
      return
    }

    if (isCollected) {
      toast.error('You have already collected this coupon')
      return
    }

    await collectCoupon(coupon.id).then((res) => {
      if (res.success) {
        toast.success(res.message)
        setIsCollected(true)
      } else toast.error(res.message)
    })
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold">{coupon.code}</CardTitle>
          <Badge variant="default">Active</Badge>
        </div>
        <CardDescription>{coupon.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Ticket className="h-5 w-5 text-muted-foreground" />
          <span>
            {coupon.discountType === 'fixed'
              ? `$${coupon.discountAmount} off`
              : `${coupon.discountAmount}% off`}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <DollarSign className="h-5 w-5 text-muted-foreground" />
          <span>Minimum purchase: ${coupon.minimumPriceToUse}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Users className="h-5 w-5 text-muted-foreground" />
          <span>
            {coupon.collectedUsers?.length ?? 0} / {coupon.quantity} available
          </span>
        </div>
        <div className="flex items-center text-sm space-x-2 text-muted-foreground">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <span>
            Valid: {moment(coupon.validFrom).format('DD/MM/YYYY, h:mm')} -{' '}
            {moment(coupon.validTo).format('DD/MM/YYYY, h:mm')}
          </span>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" disabled={isCollected || false} onClick={onCollectCoupon}>
          {isCollected ? 'Coupon Collected' : 'Collect Coupon'}
        </Button>
      </CardFooter>
    </Card>
  )
}
