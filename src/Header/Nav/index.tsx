'use client'

import React, { useState } from 'react'

import type { Header as HeaderType } from '@/payload-types'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { CMSLink } from '@/components/Link'
import Link from 'next/link'
import { Menu, SearchIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/providers/Auth'
import { Cart } from '@/components/Cart'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const { user } = useAuth()
  const navItems = data?.navItems || []
  const [open, setOpen] = useState(false)

  const filteredNavItems = navItems.filter(({ link }) => {
    const label = link.label.toLowerCase()
    return user
      ? !['login', 'register'].includes(label)
      : !['logout', 'account', 'register'].includes(label)
  })

  return (
    <nav className="flex gap-3">
      {/* Desktop Navigation */}
      <div className="hidden md:flex gap-3 items-center">
        {filteredNavItems.map(({ link }, i) => (
          <CMSLink key={i} {...link} appearance="link" />
        ))}
        <Link href="/search">
          <span className="sr-only">Search</span>
          <SearchIcon className="w-5 text-primary" />
        </Link>
        <Cart />
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTitle></SheetTitle>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-6 w-6 dark:text-white" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[300px] sm:w-[200pxpx]">
            <Cart />
            <div className="flex flex-col gap-4 justify-center mt-2">
              {filteredNavItems.map(({ link }, i) => (
                <CMSLink key={i} {...link} appearance="link" />
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  )
}
