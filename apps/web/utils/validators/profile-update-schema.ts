import { z } from 'zod';

export const profileUpdateSchema = z.object({
  profileName: z
    .string()
    .max(100, 'Profile name cannot exceed 100 characters')
    .optional()
    .or(z.literal('')),
  slug: z
    .string()
    .min(3, 'Slug must be at least 3 characters long')
    .max(50, 'Slug cannot exceed 50 characters')
    .regex(
      /^[a-z0-9-]+$/,
      'Slug can only contain lowercase letters, numbers, and hyphens',
    )
    .optional()
    .or(z.literal('')),
  description: z
    .string()
    .max(1000, 'Description cannot exceed 1000 characters')
    .optional()
    .or(z.literal('')),
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters long')
    .max(50, 'Name cannot exceed 50 characters')
    .optional()
    .or(z.literal('')),
  surname: z
    .string()
    .min(2, 'Surname must be at least 2 characters long')
    .max(50, 'Surname cannot exceed 50 characters')
    .optional()
    .or(z.literal('')),
  birthday: z
    .string()

    .or(z.literal(''))
    .refine(
      (dateString) => {
        if (!dateString) {
          return true;
        }
        const date = new Date(dateString);
        return (
          /^\d{4}-\d{2}-\d{2}$/.test(dateString) &&
          !isNaN(date.getTime()) &&
          date.toISOString().slice(0, 10) === dateString
        );
      },
      {
        message: 'register.form.birthday.invalid_date',
      },
    )
    .optional(),
  sex: z
    .union([z.literal('m'), z.literal('f')])
    .refine((val) => val === 'm' || val === 'f', {
      message: 'register.form.sex.invalid',
    })
    .optional(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/[0-9]/, 'Password must contain at least one digit')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[^\s\w]/, 'Password must contain at least one special character')
    .optional()
    .or(z.literal('')),

  profileImage: z.any().optional(),
  coverImage: z.any().optional(),
});

export type ProfileUpdateSchema = z.infer<typeof profileUpdateSchema>;

export const profileUpdateApiSchema = z
  .object({
    profileName: z.string().optional(),
    slug: z.string().optional(),
    description: z.string().optional(),
    name: z.string().optional(),
    surname: z.string().optional(),
    birthday: z.string().optional(),
    sex: z.enum(['Male', 'Female', 'Other']).optional(),
    password: z.string().optional(),
    profileImage: z.string().optional(),
    coverImage: z.string().optional(),
  })
  .partial();
