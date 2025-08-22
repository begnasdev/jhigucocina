// src/schemas/menu_item-schema.ts
import { z } from "zod";

const customizationOptionSchema = z.object({
  name: z.string(),
  description: z.string(),
});

const customizationOptionsSchema = z.record(
  z.string(),
  z.array(customizationOptionSchema)
);

export const createMenuItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.number().positive("Price must be a positive number"),
  restaurant_id: z.uuid("Invalid restaurant ID"),
  description: z.string().nullable().optional(),
  image_url: z.url().nullable().optional(),
  is_available: z.boolean().nullable().optional(),
  is_featured: z.boolean().nullable().optional(),
  preparation_time: z.number().int().positive().nullable().optional(),
  ingredients: z.string().nullable().optional(),
  allergens: z.string().nullable().optional(),
  customization_options: customizationOptionsSchema.nullable().optional(),
});

export const updateMenuItemSchema = createMenuItemSchema.partial();
