import React from 'react'
import PageClient from './page.client'
import { cn } from '@/utilities/ui'
import { getMeUser } from '@/utilities/getMeUser'
import { redirect } from 'next/navigation'
import { LoginForm } from '@/components/Forms/LoginForm'

const Page = async () => {
  const { user } = await getMeUser()

  if (user) {
    redirect(`/?message=${encodeURIComponent('You are already logged in.')}`)
  }

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className={cn('container')}>
        <LoginForm />
      </div>
    </div>
  )
}

export default Page
