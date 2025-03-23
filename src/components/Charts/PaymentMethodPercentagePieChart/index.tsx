'use client'

import { LabelList, Pie, PieChart } from 'recharts'

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
import { getPaymentMethodCODPercentage } from '@/actions/orders'
import { useEffect, useState } from 'react'


const chartConfig = {
  transaction: {
    label: 'Giao Dịch',
  },
  cod: {
    label: 'COD',
    color: 'hsl(var(--chart-1))',
  },
  stripe: {
    label: 'Stripe',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig

export function PaymentMethodPercentagePieChart() {
  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    getPaymentMethodCODPercentage().then((res) => {
      const { data } = res
      setChartData([
        { paymentMethod: 'cod', transaction: data, fill: 'var(--color-cod)' },
        { paymentMethod: 'other', transaction: 100 - data, fill: 'var(--color-stripe)' },
      ])
    })
  }, [])

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Biểu Đồ Tròn - Phương Thức Thanh Toán</CardTitle>
        <CardDescription>Tháng 1 - Tháng 6 năm 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] [&_.recharts-text]:fill-background"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent nameKey="transaction" hideLabel />} />
            <Pie data={chartData} dataKey="transaction">
              <LabelList
                dataKey="paymentMethod"
                className="fill-background"
                stroke="none"
                fontSize={12}
                formatter={(value: keyof typeof chartConfig) => chartConfig[value]?.label}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        Phương thức thanh toán COD và khác trong toàn bộ đơn hàng
      </CardFooter>
    </Card>
  )
}
