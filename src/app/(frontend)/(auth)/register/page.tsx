import React from 'react'
import PageClient from './page.client'
import SignUpForm from '@/components/Forms/SignUpForm'
import { cn } from '@/utilities/ui'
import { getMeUser } from '@/utilities/getMeUser'
import { redirect } from 'next/navigation'

const Page = async () => {
  const { user } = await getMeUser()

  if (user) {
    redirect(`/home?message=${encodeURIComponent('You are already logged in.')}`)
  }
  
  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className={cn('container')}>
        <SignUpForm />
      </div>
    </div>
  )
}

export default Page
