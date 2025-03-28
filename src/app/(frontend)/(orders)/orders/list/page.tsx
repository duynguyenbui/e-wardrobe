import { getServerSideUser } from '@/get-serverside-user'
import { OrderTableType, columns } from './columns'
import { DataTable } from './data-table'
import { redirect } from 'next/navigation'
import { getOrders } from '@/actions/orders'
import moment from 'moment'
import { formatVND } from '@/utilities/currency'

export default async function Page() {
  const { user: currentUser } = await getServerSideUser()

  if (!currentUser) {
    redirect('/login')
  }

  const { data: orders } = await getOrders()
  let orderTables: OrderTableType[] = []

  if (orders) {
    orderTables = orders.filter(Boolean).map((order: any) => ({
      id: order.id,
      totalPrice: formatVND(order.totalPrice),
      isPaid: order.isPaid ? 'Paid' : 'Unpaid',
      shippingFee: formatVND(order.shippingFee),
      note: order.note ?? '',
      createdAt: moment(order.createdAt).format('LL'),
      type: order.type?.toUpperCase(),
      shippingStatus: (order.shippingStatus as any)?.name,
    }))
  }

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={orderTables} />
    </div>
  )
}
