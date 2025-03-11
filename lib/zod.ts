import { object, string } from "zod";

export const signInSchema = object({
    email: string()
    .min(1, "Email is required").email("Invalid email"),
    password: string().min(1, "Password is required.").min(8, "Password must be at least 8 characters.").max(32, "Password must be less than 32 characters")
})

export const signUpFormSchema = object({
  email: string()
  .min(1, "Email is required.").email('Please use a valid email address.'),
  password: string()
  .min(1, "Password is required.").min(8, 'Password must have at least 8 characters.'),
  confirmPassword: string()
  .min(1, "Passwords confirmation is required.")
}).refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match.'
})