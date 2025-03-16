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
import React, { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PayloadUserSignUpValidator, TPayloadUserSignUpValidator } from '@/validation'
import Link from 'next/link'
import { Logo } from '@/components/Logo/Logo'
import { toast } from 'sonner'
import { useAuth } from '@/providers/Auth'

const SignUpForm = () => {
  const { create } = useAuth()
  const form = useForm<TPayloadUserSignUpValidator>({
    resolver: zodResolver(PayloadUserSignUpValidator),
    defaultValues: {
      email: 'nhu@ewardrobe.com',
      password: 'nhu',
      name: 'Nhu',
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
    <section className="py-5">
      <div className="container">
        <div className="flex flex-col gap-4">
          <div className="mx-auto w-full max-w-sm rounded-md p-6 shadow-xl border">
            <div className="mb-6 flex flex-col items-center space-y-2">
              <Logo />
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
