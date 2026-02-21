import { z } from 'zod';

export const phoneSchema = z
  .string()
  .transform((val) => val.replace(/\D/g, ''))
  .refine((val) => val.length === 10 || (val.length === 11 && val.startsWith('1')), {
    message: 'Invalid US phone number',
  });

export const emailSchema = z.string().email('Invalid email address');

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const uuidSchema = z.string().uuid('Invalid ID format');

export const tradeTypeSchema = z.enum(['plumbing', 'hvac', 'electrical']);

export const urgencySchema = z.enum(['emergency', 'urgent', 'routine']);

export const businessHoursSchema = z.record(
  z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']),
  z.object({
    open: z.string().regex(/^\d{2}:\d{2}$/, 'Use HH:MM format'),
    close: z.string().regex(/^\d{2}:\d{2}$/, 'Use HH:MM format'),
    closed: z.boolean().optional(),
  })
);

export const pricingSchema = z.object({
  service_call: z.number().positive(),
  emergency_fee: z.number().positive(),
  hourly_rate: z.number().positive().optional(),
});
