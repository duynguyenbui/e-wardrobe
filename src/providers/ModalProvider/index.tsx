'use client'

import { AddressModal } from '@/components/Modals/AddressModal'
import { CartModal } from '@/components/Modals/CartModal'
import { SizeSelectorModal } from '@/components/Modals/SizeModal'
import React, { useEffect, useState } from 'react'

export default function ModalProvider() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null
  }

  return (
    <React.Fragment>
      {/* Modals */}
      <CartModal />
      <AddressModal />
      <SizeSelectorModal />
    </React.Fragment>
  )
}
