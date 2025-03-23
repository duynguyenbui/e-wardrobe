import type { AdminViewServerProps } from 'payload'

import { DefaultTemplate } from '@payloadcms/next/templates'
import { Gutter } from '@payloadcms/ui'
import React from 'react'
import { NumberOfOrderLineChart } from '@/components/Charts/NumberOfOrderLineChart'
import { PaymentMethodPercentagePieChart } from '@/components/Charts/PaymentMethodPercentagePieChart'
import { SoldOutProductBarChart } from '@/components/Charts/SoldOutProductBarChart'
import { RevenueBarChart } from '@/components/Charts/RevenueBarChart'
import '../../tailwinds.css'
import { BarChartIcon } from 'lucide-react'
import Link from 'next/link'

const Statistics = ({ initPageResult, params, searchParams }: AdminViewServerProps) => {
  return (
    <DefaultTemplate
      i18n={initPageResult.req.i18n}
      locale={initPageResult.locale}
      params={params}
      payload={initPageResult.req.payload}
      permissions={initPageResult.permissions}
      searchParams={searchParams}
      user={initPageResult.req.user || undefined}
      visibleEntities={initPageResult.visibleEntities}
    >
      <Gutter>
        <div className="container">
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
          <Link
            href="/admin"
            className="flex flex-col space-y-2 mb-2 justify-center items-center mt-8"
          >
            <BarChartIcon className="w-10 h-10 text-blue-500" />
            <p className="text-sm text-gray-500 font-bold">
              Biểu đồ cập nhật mỗi lần làm mới sẽ cập nhật dữ liệu mỗi lần làm mới trang web.
            </p>
          </Link>
        </div>
      </Gutter>
    </DefaultTemplate>
  )
}

export default Statistics
