'use client'

import { getAddresses } from '@/actions/addresses'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { Address, Coupon } from '@/payload-types'
import { useAuth } from '@/providers/Auth'
import { useCart } from '@/stores/useCart'
import { cn } from '@/utilities/ui'
import { Flag, Minus, PiggyBank, Plus, Trash2Icon } from 'lucide-react'
import Link from 'next/link'
import { Fragment, useEffect, useState, useTransition } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateOrderValidator, TCreateOrderValidator } from '@/validation'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import Spinner from '../../Spinner'
import { createOrder } from '@/actions/orders'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { getShippingFee } from '@/actions/shippingFee'
import { Badge } from '../../ui/badge'
import { getCollectedCoupons } from '@/actions/coupons'
import { capitalize } from '@/utilities/capitalize'
import { formatVND } from '@/utilities/currency'

type AddressExcludeUser = Omit<Address, 'user'>

export const OrderForm = () => {
  const { user } = useAuth()
  const { items, remove, minus, plus, clear } = useCart()
  const [addresses, setAddresses] = useState<AddressExcludeUser[]>([])
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [shippingFee, setShippingFee] = useState(0)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TCreateOrderValidator>({
    resolver: zodResolver(CreateOrderValidator),
    defaultValues: {
      userId: user?.id || '',
      addressId: '',
      lineItems: items.map((item) => ({
        productVariantId: item.id,
        quantityToBuy: item.quantityToBuy,
      })),
      couponId: '',
      note: '',
      type: 'stripe',
    },
  })

  useEffect(() => {
    if (items.length === 0) {
      router.push('/orders/list')
    }

    setValue(
      'lineItems',
      items.map((item) => ({
        productVariantId: item.id,
        quantityToBuy: item.quantityToBuy,
      })),
    )
  }, [items.length, router, items, setValue])

  useEffect(() => {
    getAddresses().then((res) => {
      if (res.success) setAddresses(res.data!)
      else setAddresses([])
    })
  }, [])

  useEffect(() => {
    const totalPrice = items.reduce((acc, item) => acc + item.price * item.quantityToBuy, 0)
    getShippingFee(totalPrice).then((fee) => setShippingFee(fee))
  }, [items])

  useEffect(() => {
    const totalPrice = items.reduce((acc, item) => acc + item.price * item.quantityToBuy, 0)
    getCollectedCoupons(totalPrice).then((data) => {
      if (data) setCoupons(data || [])
      else setCoupons([])
    })
  }, [items])

  const onSubmit = (data: TCreateOrderValidator) => {
    if (!data.addressId) {
      toast.error('Vui lòng chọn địa chỉ')
      return
    }

    startTransition(async () => {
      const res = await createOrder(data)

      if (res?.success) {
        toast.success(res?.message || 'Đơn hàng đã được tạo thành công')
        clear()
        router.push('/orders/list')
      } else {
        toast.error(res?.message || 'Lỗi khi tạo đơn hàng')
      }
    })
  }

  if (isPending || items.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="grid min-h-screen w-full overflow-hidden container">
      <div className="flex flex-col">
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col md:grid md:grid-cols-6 gap-6"
          >
            <div className="md:col-span-4 lg:col-span-3 xl:col-span-4 flex flex-col gap-6">
              {/* Tóm tắt đơn hàng */}
              <Card>
                <CardHeader>
                  <CardTitle>Tóm tắt đơn hàng</CardTitle>
                </CardHeader>
                <CardContent>
                  <Controller
                    name="note"
                    control={control}
                    render={({ field }) => (
                      <div className="space-y-2">
                        <Label htmlFor="note">Ghi chú đơn hàng</Label>
                        <Textarea
                          id="note"
                          {...field}
                          placeholder="Thêm ghi chú cho đơn hàng của bạn"
                        />
                        {errors.note && (
                          <p className="text-red-500 text-sm">{errors.note.message}</p>
                        )}
                      </div>
                    )}
                  />
                </CardContent>
              </Card>
              {/* Sản phẩm */}
              <Card>
                <CardHeader>
                  <CardTitle>Sản phẩm</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[150px] hidden md:table-cell">Tiêu đề</TableHead>
                        <TableHead className="max-w-[80px]">Giá</TableHead>
                        <TableHead>Số lượng</TableHead>
                        <TableHead>Tổng</TableHead>
                        <TableHead className="flex items-center justify-center">
                          <Flag className="size-6" />
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="hidden md:table-cell">{item.title}</TableCell>
                          <TableCell className="font-medium">
                            {formatVND(item.price - (item.price * item.discount) / 100)}
                          </TableCell>
                          <TableCell>{item.quantityToBuy}</TableCell>
                          <TableCell>
                            {formatVND(
                              item.quantityToBuy *
                                (item.price - (item.price * item.discount) / 100),
                            )}
                          </TableCell>
                          <TableCell className="gap-2 flex justify-center">
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              onClick={() => minus(item.id)}
                              disabled={item.quantityToBuy <= 1}
                            >
                              <Minus className="size-2" />
                            </Button>
                            <Button type="button" size="icon" onClick={() => remove(item)}>
                              <Trash2Icon className="size-5" />
                            </Button>
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              onClick={() => plus(item.id)}
                              disabled={item.quantityToBuy >= item.quantity}
                            >
                              <Plus className="size-2" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              {/* Phí vận chuyển */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex space-x-2">
                    <div>Phí vận chuyển </div>
                    <Badge className="ml-2" color="green">
                      {formatVND(shippingFee)}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <Controller
                    name="addressId"
                    control={control}
                    render={({ field }) => (
                      <div className="space-y-2">
                        <Label htmlFor="addressId">Địa chỉ</Label>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn địa chỉ" />
                          </SelectTrigger>
                          <SelectContent>
                            {addresses.map((address) => (
                              <SelectItem key={address.id} value={address.id}>
                                {address.detailAddress}, {address.ward}, {address.district},{' '}
                                {address.province}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.addressId && (
                          <p className="text-red-500 text-sm">{errors.addressId.message}</p>
                        )}
                      </div>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
            <div className="md:col-span-2 lg:col-span-3 xl:col-span-2 flex flex-col gap-6">
              {/* Mã giảm giá */}
              <Card>
                <CardHeader>
                  <CardTitle>Mã giảm giá</CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <Controller
                    name="couponId"
                    control={control}
                    render={({ field }) => (
                      <div className="space-y-2">
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn mã giảm giá" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem key="none" value="none">
                              Không sử dụng mã giảm giá
                            </SelectItem>
                            {coupons.map((coupon) => (
                              <SelectItem key={coupon.id} value={coupon.id}>
                                {coupon.code} -{' '}
                                {capitalize(
                                  coupon.discountType === 'percentage' ? 'phần trăm' : 'tiền mặt',
                                )}
                                , {coupon.discountAmount}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Phương thức thanh toán</CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <Controller
                    name="type"
                    control={control}
                    render={({ field }) => (
                      <div className="space-y-2">
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn phương thức thanh toán" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem key="cod" value="cod">
                              Ship COD
                            </SelectItem>
                            <SelectItem key="stripe" value="stripe">
                              Thanh toán trực tuyến (Stripe)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  />
                </CardContent>
              </Card>
              {/* Thông tin khách hàng */}
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin khách hàng</CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <div className="grid gap-2 grid-cols-2">
                    <div>Tên:</div>
                    <div className="font-medium">{user?.name}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>Liên hệ:</div>
                    <div className="font-medium">{user?.email}</div>
                  </div>
                </CardContent>
              </Card>
              <Button
                type="submit"
                size="lg"
                className="w-full text-green-500"
                disabled={isPending}
              >
                {!isPending ? (
                  <Fragment>
                    Thanh toán
                    <PiggyBank className="size-10" />
                  </Fragment>
                ) : (
                  <Spinner />
                )}
              </Button>
              <Link
                href="/contact"
                className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'w-full')}
              >
                Liên hệ hỗ trợ
              </Link>
            </div>
          </form>
        </main>
      </div>
    </div>
  )
}
