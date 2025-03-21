import { getNumberOfSellingProduct, getRevenueWithin3MonthsGroupByDay } from '@/actions/orders'

export default async function Page() {
  const { data } = await getRevenueWithin3MonthsGroupByDay()
  const { data: sellingProduct } = await getNumberOfSellingProduct()


  return (
    <div>
      <pre>{JSON.stringify(sellingProduct, null, 2)}</pre>
    </div>
  )
}
