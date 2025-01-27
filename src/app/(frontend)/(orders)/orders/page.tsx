import { OrderForm } from '@/components/Forms/OrderForm'
import { getServerSideUser } from '@/get-serverside-user'
import { redirect } from 'next/navigation'
import { Fragment } from 'react'
import PageClient from './page.client'

export default async function Page() {
  const { user } = await getServerSideUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <Fragment>
      <PageClient />
      <OrderForm />
    </Fragment>
  )
}
