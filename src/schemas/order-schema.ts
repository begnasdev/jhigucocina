import { z } from "zod";

export const createOrderItemSchema = z.object({
  item_id: z.uuid({ message: "Invalid item ID format" }),
  quantity: z.number().int().positive("Quantity must be a positive integer"),
  // Prices (unit_price, total_price) are intentionally omitted.
  // They should be looked up and calculated on the server inside the RPC function
  // to prevent price tampering by the client.
  customizations: z.record(z.string(), z.any()).optional().nullable(),
});

export const createOrderSchema = z.object({
  restaurant_id: z.uuid(),
  table_id: z.uuid(),
  customer_id: z.uuid().optional().nullable(),
  special_instructions: z.string().optional().nullable(),
  status: z
    .enum(["pending", "accepted", "preparing", "ready", "served", "cancelled"])
    .default("pending"),
  order_items: z
    .array(createOrderItemSchema)
    .min(1, "Order must have at least one item."),
});

export type CreateOrder = z.infer<typeof createOrderSchema>;

export const updateOrderSchema = createOrderSchema
  .omit({ order_items: true })
  .partial();
