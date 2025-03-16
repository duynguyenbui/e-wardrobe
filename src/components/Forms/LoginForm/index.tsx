'use client'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PayloadUserLoginValidator, TPayloadUserLoginValidator } from '@/validation'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/providers/Auth'
import { toast } from 'sonner'
import { useCallback, useRef } from 'react'
import Link from 'next/link'
import { Logo } from '@/components/Logo/Logo'

export const LoginForm = () => {
  const { login } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = useRef(searchParams.get('redirect'))
  const form = useForm<TPayloadUserLoginValidator>({
    resolver: zodResolver(PayloadUserLoginValidator),
    defaultValues: {
      email: 'admin@ewardrobe.com',
      password: 'admin',
    },
  })

  const onSubmit = useCallback(
    async (values: TPayloadUserLoginValidator) => {
      try {
        const user = await login(values)
        if (user) {
          if (user.roles.includes('admin')) {
            router.push('/admin')
          } else {
            router.push(redirect.current || '/')
          }
        } else {
          toast.error('Thông tin đăng nhập không chính xác. Vui lòng thử lại.')
        }
      } catch (_) {
        toast.error('Đã xảy ra lỗi.')
      }
    },
    [login, router],
  )

  return (
    <section className="py-10">
      <div className="container">
        <div className="flex flex-col gap-4">
          <div className="mx-auto w-full max-w-sm rounded-md p-6 shadow-xl border">
            <div className="mb-6 flex flex-col items-center space-y-2">
              <Logo />
              <p className="text-muted-foreground">Đăng nhập vào tài khoản của bạn.</p>
            </div>
            <div>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nhập email của bạn"
                            {...field}
                            required
                            className="rounded-md"
                          />
                        </FormControl>
                        <FormDescription>Đây là tên hiển thị công khai của bạn.</FormDescription>
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
                            className="rounded-md"
                          />
                        </FormControl>
                        <FormDescription>Đây là mật khẩu của bạn.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="mt-2 w-full">
                    Đăng nhập
                  </Button>
                </form>
              </Form>
              <div className="mx-auto mt-8 flex flex-col items-center gap-1 text-sm text-muted-foreground">
                <div className="flex space-x-2">
                  <p>Tiếp tục với tư cách người bán?</p>
                  <Link href="/admin" className="font-medium text-primary text-blue-500">
                    Nhấn vào đây
                  </Link>
                </div>
                <div className="flex space-x-2">
                  <p>Chưa có tài khoản?</p>
                  <Link href="/register" className="font-medium text-primary text-blue-500">
                    Đăng ký
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
