import { z } from "zod";

export const createRestaurantSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  phone: z.string().optional(),
  email: z.email("Invalid email address").optional(),
  description: z.string().optional(),
});

export const updateRestaurantSchema = createRestaurantSchema.partial();

export type CreateRestaurant = z.infer<typeof createRestaurantSchema>;
export type UpdateRestaurant = z.infer<typeof updateRestaurantSchema>;
