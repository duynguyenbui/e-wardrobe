import { Material } from '@/payload-types'
import React from 'react'
import { MaterialCard } from '../MaterialCard'

export type Props = {
  materials: Material[]
  className?: string
}

export const MaterialArchive = (props: Props) => {
  const { materials } = props

  return (
    <div className="container">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {materials &&
          materials.map((material, index) => (
            <MaterialCard
              title={material.title}
              description={material?.description || 'No description available'}
              key={index}
            />
          ))}
      </div>
    </div>
  )
}
