import { z } from "zod";

export const signInSchema = z.object({
    email: z.string().email({ message: 'Please enter a valid email address' }),
    password: z.string().min(3, { message: 'Password must be at least 3 characters long' }),
})

export type SignInRequest = z.infer<typeof signInSchema>
