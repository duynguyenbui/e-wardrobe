/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { useEffect } from 'react'
import { useCart } from '@/stores/useCart'
import { useRouter, useSearchParams } from 'next/navigation'
import { cn } from '@/utilities/ui'
import { buttonVariants } from '@/components/ui/button'

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
      <div className="flex flex-col items-center justify-center">
        <Card className="max-w-md w-full space-y-6 p-6 rounded-lg shadow-lg ">
          <div className="flex flex-col items-center">
            <CircleCheckIcon className="text-green-500 h-16 w-16" />
            <h1 className="text-3xl font-bold mt-4">Payment Successful</h1>
            <p className="mt-2">Thank you for your payment.</p>
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

function CircleCheckIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}

export default Page
