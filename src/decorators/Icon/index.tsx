'use client'

import '../tailwinds.css'
import { usePathname, useRouter } from 'next/navigation'
import { Home } from 'lucide-react'

const Icon: React.FC = () => {
  const pathname = usePathname()
  const router = useRouter()

  const back = () => {
    if (['/admin'].includes(pathname ?? '/')) {
      router.push('/')
    }
  }

  return <Home className="h-6 w-6 mr-4 hover:cursor-pointer text-blue-700" onClick={back} />
}

export default Icon
