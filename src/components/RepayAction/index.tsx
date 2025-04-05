'use client'

import React from 'react'
import { Button } from '../ui/button'
import { toast } from 'sonner'
import { repay } from '@/actions/orders'

export default function RepayAction({ orderId }: { orderId: string }) {
  async function onClick() {
    repay(orderId).then((res) => {
      if (res.success) {
        toast.success(res.message)
      } else {
        toast.error(res.message)
      }
    })
  }

  if (!orderId) {
    return null
  }

  return (
    <Button onClick={onClick} variant="outline">
      Thanh toán lại (Stripe)
    </Button>
  )
}
