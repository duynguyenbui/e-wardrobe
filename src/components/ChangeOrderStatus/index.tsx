'use client'

import { receiveOrder } from '@/actions/orders'
import { Fragment, useState } from 'react'
import { Button } from '../ui/button'
import { toast } from 'sonner'
import { Order } from '@/payload-types'
import { PiggyBank, ShoppingCart } from 'lucide-react'
import { SHIPPING_STATUS } from '@/constants'

export default function ChangeOrderStatus({ order }: { order: Order }) {
  const [loading, setLoading] = useState(false)

  async function onClick() {
    if (order.id) {
      setLoading(true)
      try {
        const { success } = await receiveOrder(order.id)

        if (success) {
          toast.success('Đơn hàng đã được nhận')
        } else {
          toast.error('Thay đổi trạng thái đơn hàng thất bại')
        }
      } catch (error) {
        console.error(error)
        toast.error('Thay đổi trạng thái đơn hàng thất bại')
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <Fragment>
      <Button
        className="font-bold cursor-pointer ml-2"
        onClick={onClick}
        disabled={(order.shippingStatus as any)?.code === SHIPPING_STATUS.Received || loading}
      >
        {loading ? 'Đang xử lý...' : 'Đã nhận hàng'}
        <ShoppingCart className="w-5 h-5 ml-2" />
      </Button>
    </Fragment>
  )
}
