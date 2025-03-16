'use client'

import { isReceivedOrder } from '@/actions/orders'
import { Fragment, useState } from 'react'
import { Button } from '../ui/button'
import { toast } from 'sonner'
import { Order } from '@/payload-types'
import { PiggyBank } from 'lucide-react'
import { SHIPPING_STATUS } from '@/constants'

export default function ChangeOrderStatus({ order }: { order: Order }) {
  const [loading, setLoading] = useState(false)

  async function onClick() {
    if (order.id) {
      setLoading(true)
      try {
        const { success } = await isReceivedOrder(order.id)

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
        <PiggyBank className="w-4 h-4 ml-2" />
      </Button>
    </Fragment>
  )
}
