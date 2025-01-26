'use client'

import { Address } from '@/payload-types'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '../ui/button'
import { Flag, Plus, Trash2 } from 'lucide-react'
import { useModals } from '@/stores/useModals'
import { ModalType } from '@/types'
import { deleteAddress } from '@/actions/addresses'
import { toast } from 'sonner'
// import { toast } from 'sonner'
// import { deleteAddress } from '@/server/addresses'

export const AddressCollection = ({ addresses = [] }: { addresses: Address[] }) => {
  const { open } = useModals()

  const onDelete = async (addressId: string) => {
    const res = await deleteAddress(addressId)

    if (res.success) toast.success(`Address - ${addressId} has been deleted`)
    else toast.error('Failed to delete address')
  }

  return (
    <ScrollArea className="max-w-[900px]">
      <Table>
        <TableCaption>
          <Button
            variant="secondary"
            className="flex gap-2"
            onClick={() => open({ modal: ModalType.ADD_ADDRESS })}
          >
            Add <Plus className="size-4 ml-2" />
          </Button>
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead className="w-[100px]">Province</TableHead>
            <TableHead className="hidden md:table-cell w-[100px]">District</TableHead>
            <TableHead className="hidden lg:table-cell w-[100px]">Ward</TableHead>
            <TableHead className="hidden lg:table-cell w-[150px]">Name</TableHead>
            <TableHead className="w-[120px]">Phone</TableHead>
            <TableHead className="hidden xl:table-cell">Detail</TableHead>
            <TableHead>
              <Flag className="size-5" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {addresses.map((address) => (
            <TableRow key={address.id}>
              <TableCell className="font-medium">{address.name.split('-')[0]?.trim()}</TableCell>
              <TableCell>{address.province}</TableCell>
              <TableCell className="hidden md:table-cell">{address.district}</TableCell>
              <TableCell className="hidden md:table-cell">{address.ward}</TableCell>
              <TableCell className="hidden lg:table-cell">{address.contactName}</TableCell>
              <TableCell>{address.contactPhone}</TableCell>
              <TableCell className="hidden xl:table-cell max-w-[400px] truncate">
                {address.detailAddress}
              </TableCell>
              <TableCell className="flex justify-center" onClick={() => onDelete(address.id)}>
                <Trash2 className="size-4" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  )
}
