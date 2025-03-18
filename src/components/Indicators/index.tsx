'use client'

import { useAuth } from '@/providers/Auth'
import { DoorClosed, PiIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function AdminIndicator() {
  const { user } = useAuth()

  if (!user) return null

  return (
    user?.roles.includes('admin') && (
      <div className="flex gap-2">
        <Link href="/admin" className="flex items-center gap-2">
          Trang quản trị
          <DoorClosed className="w-4 h-4" />
        </Link>
        <Link href="/statistics" className="flex items-center gap-2">
          Thống kê
          <PiIcon className="w-4 h-4" />
        </Link>
      </div>
    )
  )
}
