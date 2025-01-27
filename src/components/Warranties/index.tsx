'use client'

import { getWarranties } from '@/actions/warranties'
import { Warranty } from '@/payload-types'
import React, { useEffect, useState } from 'react'

export default function Warranties() {
  const [warranties, setWarranties] = useState<Warranty[]>([])

  useEffect(() => {
    getWarranties().then((warranties) => {
      setWarranties(warranties)
    })
  }, [])

  return (
    <div className="mt-4 mb-4">
      {warranties?.map((warranty, idx) => (
        <div className="flex gap-3 rounded-lg md:block md:p-2" key={idx}>
          <div>
            <h3 className="font-bold md:mb-1 md:text-md flex items-center space-x-2 text-blue-600">
              {warranty.title}
            </h3>
            <p className="text-sm text-muted-foreground md:text-base">{warranty.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
