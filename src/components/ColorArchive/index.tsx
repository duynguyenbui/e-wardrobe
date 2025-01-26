'use client'

import { Color } from '@/payload-types'
import { cn } from '@/utilities/ui'
import Link from 'next/link'
import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export type CardColorData = Pick<
  Color,
  'id' | 'slug' | 'title' | 'hex' | 'description' | 'createdAt' | 'updatedAt'
>

export type Props = {
  colors: CardColorData[]
  className?: string
}

export const ColorArchive = ({ colors, className }: Props) => {
  return (
    <div className={cn('container', className)}>
      <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-12 gap-y-4 gap-x-4 lg:gap-y-8 lg:gap-x-8 xl:gap-x-8">
        {colors?.map((color, index) => {
          if (typeof color === 'object' && color !== null) {
            return (
              <div className="col-span-4 shadow-sm rounded-md" key={index}>
                <Link href={`/products?color=${color.id}`}>
                  <Card>
                    <CardHeader>
                      <CardTitle>{color.title}</CardTitle>
                      <CardDescription>
                        {color.description || 'No description available'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center space-x-4">
                        <div
                          className="w-16 h-16 border rounded-full"
                          style={{ backgroundColor: color.hex }}
                        />
                        <div>
                          <p className="font-medium">Hex: {color.hex}</p>
                          <p className="text-sm text-muted-foreground">
                            Slug: {color.slug || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <p className="text-sm text-muted-foreground">
                        Created: {new Date(color.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Updated: {new Date(color.updatedAt).toLocaleDateString()}
                      </p>
                    </CardFooter>
                  </Card>
                </Link>
              </div>
            )
          }

          return null
        })}
      </div>
    </div>
  )
}
