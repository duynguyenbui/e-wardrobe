'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PayloadUserSettingsValidator, TPayloadUserSettingsValidator } from '@/validation'
import { User } from '@/payload-types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { updateUser } from '@/actions/users'
import { toast } from 'sonner'

export function AccountForm({ user }: { user: User }) {
  const form = useForm<TPayloadUserSettingsValidator>({
    resolver: zodResolver(PayloadUserSettingsValidator),
    defaultValues: {
      email: user.email,
      name: user.name || '',
      password: '',
    },
  })

  async function onSubmit(values: TPayloadUserSettingsValidator) {
    const { success, message } = await updateUser(values)
    if (success) toast.success(message)
    else toast.error(message)
  }

  return (
    <Card className="max-w-5xl lg:w-[700px]">
      <CardHeader>
        <CardTitle>Tài khoản</CardTitle>
        <CardDescription>
          Thay đổi thông tin tài khoản của bạn tại đây. Nhấn lưu khi bạn hoàn tất.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="example@domain.com" {...field} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Họ tên</FormLabel>
                  <FormControl>
                    <Input placeholder="Nguyễn Văn A" {...field} />
                  </FormControl>
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
                    <Input type="password" {...field} placeholder="***" />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit">Lưu thay đổi</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
