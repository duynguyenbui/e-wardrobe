'use client'

import { useEffect, useState } from 'react'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useModals } from '@/stores/useModals'
import { ModalType } from '@/types'
import { type District, type Province, type Ward } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { CreateAddressValidator, type TCreateAddressValidator } from '@/validation'
import { useAuth } from '@/providers/Auth'
import { createAddress } from '@/actions/addresses'
import { toast } from 'sonner'
import { vietnameProvinceData } from '@/external_data/province'

export const AddressModal = () => {
  const { isOpen, type, close } = useModals()
  const { user } = useAuth()
  const [provinces, setProvinces] = useState<Province[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [wards, setWards] = useState<Ward[]>([])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const form = useForm<TCreateAddressValidator>({
    resolver: zodResolver(CreateAddressValidator),
    defaultValues: {
      name: 'Nhà',
      contactName: 'Nhu Nhàn',
      contactPhone: '0908080808',
      province: '',
      district: '',
      ward: '',
      detailAddress: '99, Cửu Tuyền',
    },
  })

  useEffect(() => {
    setProvinces(vietnameProvinceData as Province[])
  }, [])

  useEffect(() => {
    const provinceValue = form.watch('province')
    if (provinceValue) {
      const selectedProvince = provinces.find((p) => p.name === provinceValue)
      if (selectedProvince) {
        setDistricts(selectedProvince.districts)
        form.setValue('district', '')
        form.setValue('ward', '')
      }
    } else {
      setDistricts([])
    }
  }, [form.watch('province'), provinces, form])

  useEffect(() => {
    const districtValue = form.watch('district')
    if (districtValue) {
      const selectedDistrict = districts.find((d) => d.name === districtValue)
      if (selectedDistrict) {
        setWards(selectedDistrict.wards)
        form.setValue('ward', '')
      }
    } else {
      setWards([])
    }
  }, [form.watch('district'), districts, form])

  useEffect(() => {
    if (provinces.length === 1 && !form.getValues('province')) {
      form.setValue('province', provinces[0]?.name || '')
    }
  }, [provinces, form])

  async function onSubmit(values: TCreateAddressValidator) {
    createAddress(values).then((data) => {
      if (data.success) {
        toast.success(data.message)
        close()
      } else toast.error(data.message)
    })
  }

  if (!isClient) return null

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

            {/* Province Select */}
            <FormField
              control={form.control}
              name="province"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tỉnh/Thành phố</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn Tỉnh/Thành phố" className="text-sm" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {provinces.map((province) => (
                        <SelectItem key={province.name} value={province.name}>
                          {province.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* District Select */}
            <FormField
              control={form.control}
              name="district"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quận/Huyện</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={districts.length === 0}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn Quận/Huyện" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {districts.map((district) => (
                        <SelectItem key={district.name} value={district.name}>
                          {district.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Ward Select */}
            <FormField
              control={form.control}
              name="ward"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phường/Xã</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={wards.length === 0}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn Phường/Xã" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {wards.map((ward) => (
                        <SelectItem key={ward.name} value={ward.name}>
                          {ward.name}
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
              name="detailAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa chỉ chi tiết</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Đường ABC" {...field} />
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
