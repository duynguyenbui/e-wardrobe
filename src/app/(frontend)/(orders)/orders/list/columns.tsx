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
import { isReceivedOrder } from '@/actions/orders'
import { toast } from 'sonner'
import ChangeOrderStatus from '@/components/ChangeOrderStatus'
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type OrderTableType = {
  id: string
  totalPrice: number
  shippingFee: number
  isPaid: 'Paid' | 'Unpaid'
  note: string
  createdAt: string
  type: string
  shippingStatus: string
}

export const columns: ColumnDef<OrderTableType>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'totalPrice',
    header: 'Total Price',
  },
  {
    accessorKey: 'isPaid',
    header: 'Is Paid',
  },
  {
    accessorKey: 'shippingFee',
    header: 'Shipping Fee',
  },
  {
    accessorKey: 'note',
    header: 'Note',
  },
  {
    accessorKey: 'type',
    header: 'Type',
  },
  {
    accessorKey: 'shippingStatus',
    header: 'Shipping Status',
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
  },
  {
    id: 'actions',
    cell: async ({ row }) => {
      const order = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(order.id)}>
              Copy order ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={`/orders/${order.id}`}>View order detail</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
