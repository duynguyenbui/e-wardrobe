'use client'

import Image from 'next/image'
import '../tailwinds.css'
import { usePathname, useRouter } from 'next/navigation'

const Icon: React.FC = () => {
  const pathname = usePathname()
  const router = useRouter()

  const back = () => {
    if (['/admin', '/admin/statistics'].includes(pathname)) {
      router.push('/')
    }
  }

  return <Image src="/logo.svg" alt="Logo" width={50} height={50} onClick={back} className='hover:scale-110 hover:cursor-pointer'/>
}

export default Icon
