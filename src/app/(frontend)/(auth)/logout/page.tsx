'use client'

import { ArrowDownRight, ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAuth } from '@/providers/Auth'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'
import PageClient from './page.client'

export default function Page() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (user) {
      logout()
        .then(() => {
          setMessage('You have been successfully logged out.')
        })
        .catch((_) => {})
    } else {
      setMessage('You are already logged out.')
    }
  }, [logout, user])

  return (
    <section className="py-32">
      <PageClient />
      <div className="container">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <Badge variant="outline">
              Logout <ArrowDownRight className="ml-2 size-4" />
            </Badge>
            <h1 className="my-6 text-pretty text-4xl font-bold lg:text-5xl">{message}</h1>
            <div className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">
              <Button className="w-full sm:w-auto" onClick={() => router.push('/')}>
                Home
              </Button>
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => router.push('/login')}
              >
                Login
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
