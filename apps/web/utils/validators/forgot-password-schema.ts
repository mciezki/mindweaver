import { z } from 'zod';

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'forgot_password.form.email.required')
    .email('forgot_password.form.email.invalid'),
});

export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
