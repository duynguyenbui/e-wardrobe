import React from 'react'
import PageClient from './page.client'
import { RadarChartGrid } from '@/components/Charts/RadarChartGrid'
import { RadialChart } from '@/components/Charts/RadialChart'
import { LineCharts } from '@/components/Charts/LineChart'

export default function Page() {
  return (
    <div className="container">
      <PageClient />
      <div className="flex flex-col space-y-2 mb-2">
        <div className="col-span-12">
          <LineCharts />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <RadarChartGrid />
          <RadialChart />
        </div>
      </div>
    </div>
  )
}
