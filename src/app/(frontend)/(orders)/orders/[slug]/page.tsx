import { buttonVariants } from '@/components/ui/button'
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
import { formatVND } from '@/utilities/currency'
import Link from 'next/link'
import { cn } from '@/utilities/ui'
import { getOrder } from '@/actions/orders'
import { getServerSideUser } from '@/get-serverside-user'
import { notFound } from 'next/navigation'
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

  const subTotal = lineItems.reduce((acc, item) => {
    return acc + item.finalProductPrice
  }, 0)

  const discountCouponValue =
    (order.coupon as any)?.discountType === 'percentage'
      ? ((order.coupon as any)?.discountAmount * subTotal) / 100
      : (order.coupon as any)?.discountAmount || 0

  const totalPrice = subTotal + (order.shippingFee || 0) - discountCouponValue

  return (
    <div className="grid min-h-screen w-full overflow-hidden container">
      <div className="flex flex-col">
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          <div className="flex items-center gap-4">
            <h1 className="font-semibold text-lg md:text-xl items-center">
              Đơn hàng #{order.id}
              <span className="font-normal text-gray-500 dark:text-gray-400">
                vào ngày {moment(order.createdAt).format('LL')}
              </span>
              <ChangeOrderStatus order={order!} />
            </h1>
          </div>
          <div className="flex flex-col md:grid md:grid-cols-6 gap-6">
            <div className="md:col-span-4 lg:col-span-3 xl:col-span-4 flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tóm tắt đơn hàng</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="flex items-center">
                      <div>Số đơn hàng:</div>
                      <div className="ml-auto">#{order.id}</div>
                    </div>
                    <div className="flex items-center">
                      <div>Ngày:</div>
                      <div className="ml-auto">
                        {moment(order.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div>Trạng thái:</div>
                      <div className="ml-auto">
                        <Badge variant={order.isPaid ? 'default' : 'destructive'}>
                          {order.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div>Ghi chú:</div>
                      <div className="ml-auto">{order.note}</div>
                    </div>
                    <div className="flex items-center">
                      <div>Phương thức thanh toán:</div>
                      <div className="ml-auto">{order.type?.toUpperCase()}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Sản phẩm</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="max-w-[150px]">Tên</TableHead>
                        <TableHead>Số lượng</TableHead>
                        <TableHead>Giá</TableHead>
                        <TableHead>Giảm giá (%) (VNĐ)</TableHead>
                        <TableHead>Tổng</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {order.lineItems!.map((item) => {
                        return (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">
                              {(item.productVariant as any).title}
                            </TableCell>
                            <TableCell>{item.quantityToBuy}</TableCell>
                            <TableCell>{formatVND(item.productPrice)}</TableCell>
                            <TableCell>{item.productDiscount} %</TableCell>
                            <TableCell>{formatVND(item.finalProductPrice)}</TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Chi tiết giao hàng</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="flex items-center">
                    <div>Địa chỉ:</div>
                    <div className="ml-auto">
                      {(order.shippingAddress as any).detailAddress},{' '}
                      {(order.shippingAddress as any).ward},{' '}
                      {(order.shippingAddress as any).district},{' '}
                      {(order.shippingAddress as any).province}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div>Tên liên hệ:</div>
                    <div className="ml-auto">{(order.shippingAddress as any)?.contactName}</div>
                  </div>
                  <div className="flex items-center">
                    <div>Số điện thoại liên hệ:</div>
                    <div className="ml-auto">{(order.shippingAddress as any)?.contactPhone}</div>
                  </div>
                  <div className="flex items-center">
                    <div>Trạng thái giao hàng:</div>
                    <div className="ml-auto">{(order.shippingStatus as any)?.name || 'N/A'}</div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="md:col-span-2 lg:col-span-3 xl:col-span-2 flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin khách hàng</CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <div className="grid gap-1 grid-cols-2">
                    <div>Tên:</div>
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
                  <CardTitle>Thông tin thanh toán</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="flex items-center">
                    <div>Tổng phụ:</div>
                    <div className="ml-auto">{formatVND(subTotal)}</div>
                  </div>
                  <div className="flex items-center">
                    <div>Phí vận chuyển:</div>
                    <div className="ml-auto">{formatVND(order.shippingFee)}</div>
                  </div>
                  <div className="flex items-center">
                    <div>Giảm giá:</div>
                    <div className="ml-auto">- {formatVND(discountCouponValue)}</div>
                  </div>
                  <div className="flex items-center font-bold">
                    <div>Tổng cộng:</div>
                    <div className="ml-auto">{formatVND(totalPrice)}</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Giảm giá áp dụng</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="flex items-center">
                    <div>Mã:</div>
                    <div className="ml-auto">{(order.coupon as any)?.code}</div>
                  </div>
                  <div className="flex items-center">
                    <div>Mô tả:</div>
                    <div className="ml-auto">{(order.coupon as any)?.description}</div>
                  </div>
                  <div className="flex items-center">
                    <div>Số tiền:</div>
                    <div className="ml-auto">
                      {(order.coupon as any)?.discountType === 'percentage'
                        ? `${(order.coupon as any)?.discountAmount}%`
                        : formatVND((order.coupon as any)?.discountAmount)}
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Link
                href="/contact"
                className={cn('w-full', buttonVariants({ variant: 'outline', size: 'lg' }))}
              >
                Liên hệ hỗ trợ
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
