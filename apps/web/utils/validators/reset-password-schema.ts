import { z } from 'zod';

export const resetPasswordSchema = z.object({
    token: z
        .string()
        .min(1, 'reset_password.form.token.required'),
    newPassword: z
        .string()
        .min(8, 'reset_password.form.password.min_length')
        .regex(/[A-Z]/, 'reset_password.form.password.uppercase_required')
        .regex(/[a-z]/, 'reset_password.form.password.lowercase_required')
        .regex(/[0-9]/, 'reset_password.form.password.number_required')
        .regex(/[^a-zA-Z0-9]/, 'reset_password.form.password.special_char_required'),
    confirmPassword: z
        .string()
        .min(1, 'reset_password.form.confirm_password.required'),
})
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "reset_password.form.passwords_mismatch",
        path: ['confirmPassword'],
    });

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;

export type ResetPasswordRequest = Omit<ResetPasswordSchema, 'confirmPassword'>;