'use client'

import Spinner from '@/components/Spinner'
import React from 'react'

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Spinner />
    </div>
  )
}
