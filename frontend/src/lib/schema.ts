import {z} from 'zod';

// Login form validation schema
export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must be less than 100 characters'),
});

// Admin registration form validation schema

export const userRegistrationSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must be less than 100 characters'),
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name must be less than 50 characters')
    .trim(),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be less than 50 characters')
    .trim(),
  role: z.enum(['user', 'manager'], {
    error: 'Role must be either user or manager',
  }),
});
// Type inference from schemas for use in components
export type LoginFormData = z.infer<typeof loginSchema>;
export type UserRegistrationFormData = z.infer<typeof userRegistrationSchema>;
