'use client'

import { Bar, BarChart, XAxis, YAxis } from 'recharts'

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
import { useEffect, useState } from 'react'
import { getNumberOfSellingProduct } from '@/actions/orders'

export function SoldOutProductBarChart() {
  const chartConfig = {
    quantitySold: {
      label: 'Số lượng bán',
      color: 'hsl(var(--chart-1))',
    },
  } satisfies ChartConfig

  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    getNumberOfSellingProduct().then((res) => {
      setChartData(res.data)
    })
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Biểu Đồ Cột - Sản Phẩm Bán Chạy</CardTitle>
        <CardDescription>Tháng 1 - Tháng 6 năm 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: 0,
            }}
          >
            <YAxis
              dataKey="productVariantTitle"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value}
            />
            <XAxis dataKey="quantitySold" type="number" hide />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="quantitySold" fill="hsl(var(--chart-1))" layout="vertical" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        Biểu đồ thể hiện số lượng sản phẩm bán ra
      </CardFooter>
    </Card>
  )
}
