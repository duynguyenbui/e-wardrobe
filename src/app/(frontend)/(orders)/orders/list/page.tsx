import { getServerSideUser } from '@/get-serverside-user'
import { OrderTableType, columns } from './columns'
import { DataTable } from './data-table'
import { redirect } from 'next/navigation'
import { getOrders } from '@/actions/orders'
import moment from 'moment'

export default async function Page() {
  const { user: currentUser } = await getServerSideUser()

  if (!currentUser) {
    redirect('/login')
  }

  const { data: orders } = await getOrders()
  const orderTables: OrderTableType[] = []

  if (orders) {
    orders.forEach(
      (order) =>
        order &&
        orderTables.push({
          id: order.id,
          totalPrice: order.totalPrice ?? 0,
          isPaid: order.isPaid ? 'Paid' : 'Unpaid',
          shippingFee: order.shippingFee,
          note: order.note ?? '',
          createdAt: moment(order.createdAt).format('LL'),
          type: order.type?.toUpperCase() || 'N/A',
          shippingStatus: (order.shippingStatus as any)?.name || 'N/A',
        }),
    )
  }

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={orderTables} />
    </div>
  )
}
