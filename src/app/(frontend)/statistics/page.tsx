import React from 'react'
import PageClient from './page.client'
import { NumberOfOrderLineChart } from '@/components/Charts/NumberOfOrderLineChart'
import { RevenueBarChart } from '@/components/Charts/RevenueBarChart'
import { PaymentMethodPercentagePieChart } from '@/components/Charts/PaymentMethodPercentagePieChart'
import { SoldOutProductBarChart } from '@/components/Charts/SoldOutProductBarChart'

export default function Page() {
  return (
    <div className="container">
      <PageClient />
      <div className="flex flex-col space-y-2 mb-2">
        <div className="col-span-12">
          <NumberOfOrderLineChart />
        </div>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-4">
            <RevenueBarChart />
          </div>
          <div className="col-span-4">
            <PaymentMethodPercentagePieChart />
          </div>
          <div className="col-span-4">
            <SoldOutProductBarChart />
          </div>
        </div>
      </div>
    </div>
  )
}
