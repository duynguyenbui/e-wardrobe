import React, { Fragment } from 'react'
import PageClient from './page.client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AccountForm } from '@/components/Forms/AccountForm'
import { getServerSideUser } from '@/get-serverside-user'
import { redirect } from 'next/navigation'
import { AddressCollection } from '@/components/AddressCollection'
import { getAddresses } from '@/actions/addresses'

export default async function Page() {
  const { user } = await getServerSideUser()

  if (!user) {
    redirect('/login')
  }

  const { data: addresses } = (await getAddresses()) || [] // get addresses from server

  return (
    <Fragment>
      <PageClient />
      <Tabs defaultValue="account" className="max-w-7xl mx-auto">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="address">Address</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <AccountForm user={user} />
        </TabsContent>
        <TabsContent value="address">
          <AddressCollection addresses={addresses || []} />
        </TabsContent>
      </Tabs>
    </Fragment>
  )
}
