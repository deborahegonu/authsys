"use client"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {LuLoaderCircle} from "react-icons/lu"

const formSchema = z.object({
  email: z.string()
  .min(1, "Email is required.").email('Please use a valid email address.'),
  password: z.string()
  .min(1, "Password is required.").min(8, 'Password must have at least 8 characters.'),
  confirmPassword: z.string()
  .min(1, "Passwords confirmation is required.")
}).refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match.'
})

export function SignUpForm() {
  const [isLoading, setIsLoading ] = useState<boolean>(false)
  const router = useRouter();
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  })
 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true)
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password
        })
      })
        if(response.status === 201) {
          setIsLoading(false)
          router.push('/my-account')
        }
        if(response.status === 409) {
          setIsLoading(false)
          toast('User already exists with this email.')
        } else {
          setIsLoading(false)
          toast('Sign up failed! Please try again later.')
        }
      } catch(error) {
        setIsLoading(false)
        console.log(error)
      } finally {
        setIsLoading(false)
      }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 min-w-sm">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
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
                <Input type="password" placeholder="shadcn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Re-enter your password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="shadcn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isLoading} type="submit" className="w-full">
          {isLoading && <LuLoaderCircle className="animate-spin" />}
          Sign Up
        </Button>
      </form>
    </Form>
  )
}
