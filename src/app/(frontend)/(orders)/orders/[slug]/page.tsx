/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import moment from 'moment'
import { formatTHB } from '@/utilities/currency'
import Link from 'next/link'
import { cn } from '@/utilities/ui'
import { getOrder } from '@/actions/orders'
import { getServerSideUser } from '@/get-serverside-user'
import { notFound } from 'next/navigation'
import { PiggyBank } from 'lucide-react'
import ChangeOrderStatus from '@/components/ChangeOrderStatus'

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function OrderDetailsPage({ params: paramsPromise }: Args) {
  const { slug } = await paramsPromise

  if (!slug) {
    notFound()
  }

  const { user: currentUser } = await getServerSideUser()
  const { data: order } = await getOrder(slug!)

  if (!order || !currentUser) {
    notFound()
  }

  const { lineItems, shippingAddress, customer } = order

  if (
    !Array.isArray(lineItems) ||
    typeof shippingAddress !== 'object' ||
    typeof customer !== 'object'
  ) {
    notFound()
  }

  return (
    <div className="grid min-h-screen w-full overflow-hidden container">
      <div className="flex flex-col">
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          <div className="flex items-center gap-4">
            <h1 className="font-semibold text-lg md:text-xl items-center">
              Order #{order.id}
              <span className="font-normal text-gray-500 dark:text-gray-400">
                on {moment(order.createdAt).format('LL')}
              </span>
              <ChangeOrderStatus order={order!} />
            </h1>
          </div>
          <div className="flex flex-col md:grid md:grid-cols-6 gap-6">
            <div className="md:col-span-4 lg:col-span-3 xl:col-span-4 flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="flex items-center">
                      <div>Order Number:</div>
                      <div className="ml-auto">#{order.id}</div>
                    </div>
                    <div className="flex items-center">
                      <div>Date:</div>
                      <div className="ml-auto">
                        {moment(order.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div>Status:</div>
                      <div className="ml-auto">
                        <Badge variant={order.isPaid ? 'default' : 'destructive'}>
                          {order.isPaid ? 'Paid' : 'Unpaid'}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div>Note:</div>
                      <div className="ml-auto">{order.note}</div>
                    </div>
                    <div className="flex items-center">
                      <div>Payment Method:</div>
                      <div className="ml-auto">{order.type?.toUpperCase()}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="max-w-[150px]">Name</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {order.lineItems!.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">
                            {(item.productVariant as any).title}
                          </TableCell>
                          <TableCell>{item.quantityToBuy}</TableCell>
                          <TableCell>
                            {typeof item.productVariant === 'object' &&
                              formatTHB((item.productVariant as any).price || 0)}
                          </TableCell>
                          <TableCell>
                            {formatTHB((item.productVariant as any).price * item.quantityToBuy)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Details</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="flex items-center">
                    <div>Address:</div>
                    <div className="ml-auto">
                      {(order.shippingAddress as any).detailAddress},{' '}
                      {(order.shippingAddress as any).ward},{' '}
                      {(order.shippingAddress as any).district},{' '}
                      {(order.shippingAddress as any).province}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div>Contact Name:</div>
                    <div className="ml-auto">{(order.shippingAddress as any).contactName}</div>
                  </div>
                  <div className="flex items-center">
                    <div>Contact Phone:</div>
                    <div className="ml-auto">{(order.shippingAddress as any).contactPhone}</div>
                  </div>
                  <div className="flex items-center">
                    <div>Shipping Status:</div>
                    <div className="ml-auto">{(order.shippingStatus as any).name || 'N/A'}</div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="md:col-span-2 lg:col-span-3 xl:col-span-2 flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Information</CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <div className="grid gap-1 grid-cols-2">
                    <div>Name:</div>
                    <div className="font-medium">
                      {typeof order.customer === 'string' ? order.customer : order.customer.name}
                    </div>
                  </div>
                  <div className="grid gap-1 grid-cols-2">
                    <div>Email:</div>
                    <div className="font-medium">
                      {typeof order.customer === 'object' ? order.customer.email : ''}
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Payment Information</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="flex items-center">
                    <div>Subtotal:</div>
                    <div className="ml-auto">{formatTHB((order as any).totalPrice || 0)}</div>
                  </div>
                  <div className="flex items-center">
                    <div>Shipping Fee:</div>
                    <div className="ml-auto">{formatTHB(order.shippingFee)}</div>
                  </div>
                  <div className="flex items-center">
                    <div>Discount:</div>
                    <div className="ml-auto">
                      -{formatTHB((order as any)?.discount?.discountAmount || 0)}
                    </div>
                  </div>
                  <div className="flex items-center font-bold">
                    <div>Total:</div>
                    <div className="ml-auto">
                      {formatTHB(
                        (order as any)!.totalPrice +
                          order.shippingFee -
                          ((order?.discount as any)?.discountAmount || 0),
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Discount Applied</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="flex items-center">
                    <div>Code:</div>
                    <div className="ml-auto">{(order.discount as any)?.code}</div>
                  </div>
                  <div className="flex items-center">
                    <div>Description:</div>
                    <div className="ml-auto">{(order.discount as any)?.description}</div>
                  </div>
                  <div className="flex items-center">
                    <div>Amount:</div>
                    <div className="ml-auto">
                      {formatTHB((order.discount as any)?.discountAmount)}{' '}
                      {(order.discount as any)?.discountType}
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Link
                href="/contact"
                className={cn('w-full', buttonVariants({ variant: 'outline', size: 'lg' }))}
              >
                Contact Support
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
