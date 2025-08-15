import { z } from 'zod';

export const createRestaurantSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  address: z.string().min(1, { message: 'Address is required' }),
  description: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email({ message: 'Invalid email address' }).optional(),
  image_url: z.string().url({ message: 'Invalid URL' }).optional(),
  operating_hours: z.string().optional(),
  timezone: z.string().optional(),
  currency: z.string().optional(),
  tax_rate: z.number().optional(),
  service_charge: z.number().optional(),
  is_active: z.boolean().optional(),
});

export const updateRestaurantSchema = createRestaurantSchema.partial();

export type CreateRestaurant = z.infer<typeof createRestaurantSchema>;
export type UpdateRestaurant = z.infer<typeof updateRestaurantSchema>;
