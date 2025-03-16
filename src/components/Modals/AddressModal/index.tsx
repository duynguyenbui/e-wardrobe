'use client'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useModals } from '@/stores/useModals'
import { ModalType } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { CreateAddressValidator, TCreateAddressValidator } from '@/validation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { provinces } from '@/constants'
import { useAuth } from '@/providers/Auth'
import { createAddress } from '@/actions/addresses'
import { toast } from 'sonner'

export const AddressModal = () => {
  const { isOpen, type, close } = useModals()
  const { user } = useAuth()

  const form = useForm<TCreateAddressValidator>({
    resolver: zodResolver(CreateAddressValidator),
    defaultValues: {
      name: 'Nhà',
      contactName: 'Như Nhân',
      contactPhone: '0908080808',
      province: '',
      district: 'Long Phú',
      ward: 'Hậu Thạnh',
      detailAddress: '99, Cửu Cửu',
    },
  })

  async function onSubmit(values: TCreateAddressValidator) {
    createAddress(values).then((data) => {
      if (data.success) {
        toast.success(data.message)
        close()
      } else toast.error(data.message)
    })
  }

  return (
    <Dialog open={type === ModalType.ADD_ADDRESS && isOpen && Boolean(user)} onOpenChange={close}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Tạo địa chỉ mới</DialogTitle>
          <DialogDescription>
            Nhập thông tin địa chỉ của bạn bên dưới. Nhấn lưu khi hoàn tất.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên địa chỉ</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhà" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contactName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên người nhận</FormLabel>
                  <FormControl>
                    <Input placeholder="Nguyễn Văn A" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contactPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại</FormLabel>
                  <FormControl>
                    <Input placeholder="0123456789" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="province"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tỉnh/Thành phố</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn tỉnh/thành phố" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Array.of(...provinces).map((province) => (
                        <SelectItem key={province.value} value={province.value}>
                          {province.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="district"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quận/Huyện</FormLabel>
                  <FormControl>
                    <Input placeholder="Quận 1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ward"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phường/Xã</FormLabel>
                  <FormControl>
                    <Input placeholder="Phường 1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="detailAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa chỉ chi tiết</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Đường ABC, Phường 1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Lưu địa chỉ</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
