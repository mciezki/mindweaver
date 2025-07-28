import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'login.form.email.required')
    .email('login.form.email.invalid'),
  password: z.string().min(1, 'login.form.password.required'),
});

export type LoginSchema = z.infer<typeof loginSchema>;
