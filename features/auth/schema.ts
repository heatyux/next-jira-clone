import { z } from 'zod'

export const signInFormSchema = z.object({
  email: z.string().email({
    message: 'Invalid email.',
  }),
  password: z.string().min(1, 'Password is required.'),
})

export const signUpFormSchema = z.object({
  name: z.string().min(1, 'Full name is required.'),
  email: z.string().email({
    message: 'Invalid email.',
  }),
  password: z
    .string()
    .min(8, 'Password must be atleast 8 characters.')
    .max(256, 'Password cannot exceed 256 characters.'),
})
