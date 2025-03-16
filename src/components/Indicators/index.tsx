'use client'

import { useAuth } from '@/providers/Auth'
import Link from 'next/link'
import React from 'react'

export default function AdminIndicator() {
  const { user } = useAuth()

  if (!user) return null

  return user?.roles.includes('admin') && <Link href="/admin" className="text-blue-700">Trang quản trị</Link>
}
