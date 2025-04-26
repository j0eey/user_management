import { z } from 'zod';

export interface User {
  id: string;
  firstName: string;
  lastName?: string; 
  email: string;
  status: 'active' | 'locked';
  dateOfBirth: string;
}

export const userSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().optional(),
  email: z.string().email('Invalid email'),
  status: z.enum(['active', 'locked']),
  dateOfBirth: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
});

export type UserFormValues = z.infer<typeof userSchema>;
