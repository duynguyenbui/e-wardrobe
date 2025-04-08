'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { format } from 'date-fns'
import React, { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PayloadUserSignUpValidator, TPayloadUserSignUpValidator } from '@/validation'
import Link from 'next/link'

import { toast } from 'sonner'
import { useAuth } from '@/providers/Auth'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { CalendarIcon, MountainIcon } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/utilities/ui'

const SignUpForm = () => {
  const { create } = useAuth()
  const form = useForm<TPayloadUserSignUpValidator>({
    resolver: zodResolver(PayloadUserSignUpValidator),
    defaultValues: {
      email: 'nhu@ewardrobe.com',
      password: 'nhu',
      name: 'Nhu',
      gender: 'male',
      birthday: new Date('1990-01-01'),
    },
  })

  const { isSubmitting } = form.formState

  const onSubmit = useCallback(
    async (values: TPayloadUserSignUpValidator) => {
      try {
        const res = await create(values)
        if (typeof res === 'object') {
          toast.success('Tài khoản của bạn đã được tạo thành công.')
        } else {
          toast.error(res)
        }
      } catch (_) {
        toast.error('Đã xảy ra lỗi khi tạo tài khoản của bạn.')
      }
    },
    [create],
  )

  return (
    <section className="py-3">
      <div className="container">
        <div className="flex flex-col gap-4">
          <div className="mx-auto w-full max-w-sm rounded-md p-6 shadow-xl border">
            <div className="mb-6 flex flex-col items-center space-y-2">
              <div className="flex gap-2 items-center">
                <MountainIcon className="h-10 w-10 text-blue-800" />
                <h1 className="text-2xl font-bold text-muted-foreground">E-Wardrobe</h1>
              </div>
              <p className="text-muted-foreground">Đăng ký tài khoản trong vòng 2 phút.</p>
            </div>
            <div>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên</FormLabel>
                        <FormControl>
                          <Input placeholder="Nhập tên của bạn" {...field} required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Thư điện tử</FormLabel>
                        <FormControl>
                          <Input placeholder="Nhập email của bạn" {...field} required />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Giới tính</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn giới tính của bạn" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">Nam</SelectItem>
                            <SelectItem value="female">Nữ</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="birthday"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Ngày sinh</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={'outline'}
                                className={cn(
                                  'w-full pl-3 text-left font-normal',
                                  !field.value && 'text-muted-foreground',
                                )}
                              >
                                {field.value ? (
                                  format(field.value, 'PPP')
                                ) : (
                                  <span>Chọn ngày sinh</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() || date < new Date('1900-01-01')
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mật khẩu</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nhập mật khẩu của bạn"
                            type="password"
                            {...field}
                            required
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="mt-2 w-full" disabled={isSubmitting}>
                    Đăng ký
                  </Button>
                </form>
              </Form>
              <div className="mx-auto mt-8 flex justify-center gap-1 text-sm text-muted-foreground">
                <p>Đã có tài khoản?</p>
                <Link href="/login" className="font-medium text-primary">
                  Nhấn vào đây
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SignUpForm
