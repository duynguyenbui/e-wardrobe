import React from 'react'
import '../tailwinds.css'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

const Logo: React.FC = () => {
  return (
    <Link href="/" className="group flex items-center space-x-3 font-bold">
      <ArrowLeft className="h-5 w-5 text-primary transition-transform group-hover:-translate-x-1" />
      <div className="flex items-center space-x-2">
        <Image
          src="/logo.svg"
          alt="eWardrobe Logo"
          width={50}
          height={50}
          className="rounded-full"
        />
        <span className="text-3xl">
          <span className="text-primary">e</span>
          <span className="font-bold text-4xl">Wardrobe</span>
        </span>
      </div>
    </Link>
  )
}

export default Logo
