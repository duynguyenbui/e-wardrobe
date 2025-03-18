'use client'

import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type OrderTableType = {
  id: string
  totalPrice: string
  shippingFee: string
  isPaid: 'Paid' | 'Unpaid'
  note: string
  createdAt: string
  type: string
  shippingStatus: string
}

export const columns: ColumnDef<OrderTableType>[] = [
  {
    accessorKey: 'id',
    header: 'Mã đơn hàng',
  },
  {
    accessorKey: 'totalPrice',
    header: 'Tổng tiền',
  },
  {
    accessorKey: 'isPaid',
    header: 'Trạng thái thanh toán',
  },
  {
    accessorKey: 'shippingFee',
    header: 'Phí vận chuyển',
  },
  {
    accessorKey: 'note',
    header: 'Ghi chú',
  },
  {
    accessorKey: 'type',
    header: 'Loại đơn hàng',
  },
  {
    accessorKey: 'shippingStatus',
    header: 'Trạng thái vận chuyển',
  },
  {
    accessorKey: 'createdAt',
    header: 'Ngày tạo',
  },
  {
    id: 'actions',
    cell: async ({ row }) => {
      const order = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Mở menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Hành động</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(order.id)}>
              Sao chép mã đơn hàng
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={`/orders/${order.id}`}>Xem chi tiết đơn hàng</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
