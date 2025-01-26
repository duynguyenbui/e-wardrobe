'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { useEffect } from 'react'
import { useCart } from '@/stores/useCart'
import { useRouter, useSearchParams } from 'next/navigation'
import { cn } from '@/utilities/ui'
import { buttonVariants } from '@/components/ui/button'
import { XCircle } from 'lucide-react'

const Page = () => {
  const { clear } = useCart()
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  const router = useRouter()

  useEffect(() => {
    if (orderId) {
      clear()
    }
  }, [clear, orderId])

  if (!orderId) {
    router.push('/')
  }

  return (
    <div className="container">
      <div className="flex flex-col items-center justify-center ">
        <Card className="max-w-md w-full space-y-6 p-6 rounded-lg shadow-lg">
          <div className="flex flex-col items-center">
            <XCircle className="text-red-500 h-16 w-16" />
            <h1 className="text-3xl font-bold mt-4">Payment Cancelled</h1>
            <p className="mt-2">Your payment has been cancelled.</p>
          </div>

          <div className="flex justify-center">
            <Link
              href={`/orders/${orderId || ''}`}
              className={cn(buttonVariants(), 'mt-4')}
              prefetch={false}
            >
              View your order
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Page
