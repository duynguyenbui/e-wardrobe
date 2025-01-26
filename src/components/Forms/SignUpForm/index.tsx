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
          toast.success('Your account has been created successfully.')
        } else {
          toast.error(res)
        }
      } catch (_) {
        toast.error('Something went wrong when creating your account.')
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
              <p className="text-muted-foreground">Sign up your account within 2 minutes.</p>
            </div>
            <div>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your name" {...field} required />
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
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your email" {...field} required />
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
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your password"
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
                    Sign up
                  </Button>
                </form>
              </Form>
              <div className="mx-auto mt-8 flex justify-center gap-1 text-sm text-muted-foreground">
                <p>Already have an account?</p>
                <Link href="/login" className="font-medium text-primary">
                  Click here
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
