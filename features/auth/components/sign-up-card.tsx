'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { FaGithub } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import { z } from 'zod'

import { DottedSeparator } from '@/components/dotted-separator'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import { useRegister } from '../api/use-register'
import { signUpFormSchema } from '../schema'

export const SignUpCard = () => {
  const { mutate: register, isPending } = useRegister()

  const signUpForm = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  })

  const onSubmit = (values: z.infer<typeof signUpFormSchema>) => {
    register({
      json: values,
    })
  }

  return (
    <Card className="size-full border-none shadow-none md:w-[487px]">
      <CardHeader className="flex flex-col items-center justify-center p-7 text-center">
        <CardTitle className="text-2xl">Create an account</CardTitle>
        <CardDescription>
          By signing up, you agree to{' '}
          <Link href="#">
            <span className="text-blue-700">Privacy Policy</span>
          </Link>{' '}
          and{' '}
          <Link href="#">
            <span className="text-blue-700">Terms of Service</span>
          </Link>
        </CardDescription>
      </CardHeader>

      <div className="px-7">
        <DottedSeparator />
      </div>

      <CardContent className="p-7">
        <Form {...signUpForm}>
          <form
            onSubmit={signUpForm.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={signUpForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="Full name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={signUpForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      type="email"
                      placeholder="Email address"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={signUpForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      type="password"
                      placeholder="Password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              disabled={isPending}
              type="submit"
              size="lg"
              className="w-full"
            >
              Register
            </Button>
          </form>
        </Form>
      </CardContent>

      <div className="px-7">
        <DottedSeparator />
      </div>

      <CardContent className="flex flex-col gap-y-4 p-7">
        <Button variant="secondary" size="lg" className="w-full">
          <FcGoogle className="mr-2 size-5" />
          Login With Google
        </Button>
        <Button variant="secondary" size="lg" className="w-full">
          <FaGithub className="mr-2 size-5" />
          Login With Github
        </Button>
      </CardContent>

      <div className="px-7">
        <DottedSeparator />
      </div>

      <CardContent className="flex items-center justify-center p-7">
        <p>
          Already have an account?{' '}
          <Link href="/sign-in">
            <span className="text-blue-700">Sign In</span>
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
