/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { Fragment, useEffect, useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { useRouter } from 'next/navigation'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { useDebounce } from '@/utilities/useDebounce'

export default function ProductFilter({
  materials,
  categories,
  route,
  totalDocs = 0,
}: {
  materials: any
  categories: any
  route: string
  totalDocs: number
}) {
  const router = useRouter()
  const [category, setCategory] = useState<string>('all')
  const [material, setMaterial] = useState<string>('all')
  const [pageSize, setPageSize] = useState<number>(4)
  const [pageIndex, setPageIndex] = useState<number>(1)
  const [value, setValue] = useState('')
  const debouncedValue = useDebounce(value)

  const totalPages = Math.ceil(totalDocs / pageSize)

  useEffect(() => {
    const query = new URLSearchParams()

    if (category !== 'all') query.set('category', category)

    if (material !== 'all') query.set('material', material)

    if (pageSize !== 4) query.set('pageSize', pageSize.toString())

    if (pageIndex !== 1) query.set('pageIndex', pageIndex.toString())

    if (debouncedValue) query.set('q', debouncedValue)

    router.push(`/${route}?${query.toString()}`)
  }, [material, category, pageSize, pageIndex, router, route, debouncedValue])

  return (
    <Fragment>
      <div className="flex flex-col md:flex md:flex-row space-x-2 mb-3 items-center justify-center space-y-2">
        <div className="flex space-x-2 md:mt-2 ml-2">
          <div>
            <Select onValueChange={setCategory} defaultValue={category}>
              <SelectTrigger className="w-[180px] rounded-sm">
                <SelectValue placeholder="Chọn danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                {categories.map((category: any) => (
                  <SelectItem key={category.id} value={category.title}>
                    {category.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select onValueChange={setMaterial} defaultValue={material}>
              <SelectTrigger className="w-[180px] rounded-sm">
                <SelectValue placeholder="Chọn chất liệu" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                {materials.map((material: any) => (
                  <SelectItem key={material.id} value={material.title}>
                    {material.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex space-x-2">
          <div>
            <Select
              onValueChange={(value) => {
                setPageSize(Number.parseInt(value))
                setPageIndex(1)
              }}
            >
              <SelectTrigger className="w-[180px] rounded-sm">
                <SelectValue placeholder="Chọn kích thước trang" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="8">8</SelectItem>
                <SelectItem value="12">12</SelectItem>
                <SelectItem value="16">16</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select
              onValueChange={(value) => {
                setPageIndex(Number.parseInt(value))
              }}
            >
              <SelectTrigger className="w-[180px] rounded-sm">
                <SelectValue placeholder="Chọn trang" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: totalPages }).map((_, index) => (
                  <SelectItem key={index} value={(index + 1).toString()}>
                    {index + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="max-w-[50rem] mx-auto">
        <div>
          <form
            onSubmit={(e) => {
              e.preventDefault()
            }}
          >
            <Label htmlFor="search" className="sr-only">
              Tìm kiếm
            </Label>
            <Input
              id="search"
              onChange={(event) => {
                setValue(event.target.value)
              }}
              placeholder="Tìm kiếm"
              className="rounded-sm"
            />
            <button type="submit" className="sr-only">
              gửi
            </button>
          </form>
        </div>
      </div>
    </Fragment>
  )
}
