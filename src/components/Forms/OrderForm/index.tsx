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
import { redirect, useRouter } from 'next/navigation'
import { getShippingFee } from '@/actions/shippingFee'
import { Badge } from '../../ui/badge'
import { getCollectedCoupons } from '@/actions/coupons'
import { capitalize } from '@/utilities/capitalize'

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
      type: 'online',
    },
  })

  useEffect(() => {
    if (items.length === 0) {
      router.push('/orders/list')
    }
  }, [items.length, router])

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
    getCollectedCoupons().then((data) => {
      if (data) setCoupons(data || [])
      else setCoupons([])
    })
  }, [])

  const onSubmit = (data: TCreateOrderValidator) => {
    if (!data.addressId) {
      toast.error('Please select an address')
      return
    }

    startTransition(async () => {
      const { success, message, data: createdOrder } = await createOrder(data)

      if (!success) {
        toast.error(message)
      }

      if (success && createdOrder?.type === 'cod') {
        clear()
        router.push('/orders/list')
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
              {/* ORDER SUMMARY */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <Controller
                    name="note"
                    control={control}
                    render={({ field }) => (
                      <div className="space-y-2">
                        <Label htmlFor="note">Order Note</Label>
                        <Textarea id="note" {...field} placeholder="Add a note to your order" />
                        {errors.note && (
                          <p className="text-red-500 text-sm">{errors.note.message}</p>
                        )}
                      </div>
                    )}
                  />
                </CardContent>
              </Card>
              {/* Products Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[150px] hidden md:table-cell">Title</TableHead>
                        <TableHead className="max-w-[80px]">Price</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead className="flex items-center justify-center">
                          <Flag className="size-6" />
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="hidden md:table-cell">{item.title}</TableCell>
                          <TableCell className="font-medium">$ {item.price}</TableCell>
                          <TableCell>{item.quantityToBuy}</TableCell>
                          <TableCell>$ {item.quantityToBuy * item.price}</TableCell>
                          <TableCell className="gap-2 flex justify-center">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => minus(item.id)}
                              disabled={item.quantityToBuy <= 1}
                            >
                              <Minus className="size-2" />
                            </Button>
                            <Button size="icon" onClick={() => remove(item)}>
                              <Trash2Icon className="size-5" />
                            </Button>
                            <Button
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
              {/* SHPPING FEE */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex space-x-2">
                    <div>Shipping Fee </div>
                    <Badge className="ml-2" color="green">
                      ${shippingFee}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <Controller
                    name="addressId"
                    control={control}
                    render={({ field }) => (
                      <div className="space-y-2">
                        <Label htmlFor="addressId">Address</Label>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an address" />
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
              {/* COUPONS */}
              <Card>
                <CardHeader>
                  <CardTitle>Coupons</CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <Controller
                    name="couponId"
                    control={control}
                    render={({ field }) => (
                      <div className="space-y-2">
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a coupon" />
                          </SelectTrigger>
                          <SelectContent>
                            {coupons.map((coupon) => (
                              <SelectItem key={coupon.id} value={coupon.id}>
                                {coupon.code} - {capitalize(coupon.discountType)},{' '}
                                {coupon.discountAmount}
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
                  <CardTitle>Payment method</CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <Controller
                    name="type"
                    control={control}
                    render={({ field }) => (
                      <div className="space-y-2">
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type of payment" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem key="cod" value="cod">
                              Ship COD
                            </SelectItem>
                            <SelectItem key="online" value="online">
                              Online Payment
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  />
                </CardContent>
              </Card>
              {/* CUSTOMER INFORMATION */}
              <Card>
                <CardHeader>
                  <CardTitle>Customer Information</CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <div className="grid gap-2 grid-cols-2">
                    <div>Name:</div>
                    <div className="font-medium">{user?.name}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>Contact:</div>
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
                    Checkout
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
                Contact Support
              </Link>
            </div>
          </form>
        </main>
      </div>
    </div>
  )
}
