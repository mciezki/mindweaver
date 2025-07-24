import { RegisterRequest } from '@mindweave/types';
import { z } from 'zod'

export const registerSchema = z.object({
    email: z
        .string()
        .min(1, 'register.form.email.required')
        .email('register.form.email.invalid'),
    password: z
        .string()
        .min(8, 'register.form.password.min_length')
        .regex(/[A-Z]/, 'register.form.password.uppercase_required')
        .regex(/[a-z]/, 'register.form.password.lowercase_required')
        .regex(/[0-9]/, 'register.form.password.number_required')
        .regex(/[^a-zA-Z0-9]/, 'register.form.password.special_char_required'),
    confirmPassword: z
        .string()
        .min(1, 'register.form.confirm_password.required'),
    name: z
        .string()
        .min(1, 'register.form.name.required'),
    surname: z
        .string()
        .min(1, 'register.form.surname.required'),
    birthday: z // <--- To pole powinno być stringiem na poziomie formularza
        .string()
        .min(1, 'register.form.birthday.required')
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'register.form.birthday.invalid_format')
        .refine((dateString) => {
            // Ta walidacja sprawdza tylko poprawność stringa daty
            const date = new Date(dateString);
            return !isNaN(date.getTime()) && date.toISOString().slice(0, 10) === dateString;
        }, {
            message: 'register.form.birthday.invalid_date'
        }),
    sex: z
        .union([z.literal('m'), z.literal('f')])
        .refine(val => val === 'm' || val === 'f', {
            message: 'register.form.sex.invalid'
        }),
})
    .refine((data) => data.password === data.confirmPassword, {
        message: "register.form.passwords_mismatch",
        path: ['confirmPassword'],
    });

export type RegisterSchema = z.infer<typeof registerSchema>;

export const registerApiSchema = registerSchema.omit({ confirmPassword: true }).extend({
    birthday: z.string().transform((str) => new Date(str)),
}) satisfies z.ZodType<RegisterRequest>;