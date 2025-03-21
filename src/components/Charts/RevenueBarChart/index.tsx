'use client'

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { useState, useEffect } from 'react'
import { getRevenueWithin3MonthsGroupByDay } from '@/actions/orders'

const chartConfig = {
  revenue: {
    label: 'Doanh thu',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig

export function RevenueBarChart() {
  const [chartData, setChartData] = useState<{ date: string; revenue: number }[]>([])

  useEffect(() => {
    getRevenueWithin3MonthsGroupByDay().then((response) => {
      const { data: revenueData } = response

      setChartData(revenueData)
    })
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Biểu đồ cột - Doanh thu hàng ngày</CardTitle>
        <CardDescription>Doanh thu theo ngày</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' })
              }
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
            <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        Tổng doanh thu trong 3 tháng qua
      </CardFooter>
    </Card>
  )
}
