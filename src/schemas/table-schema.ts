import { z } from "zod";
import { Constants } from "@/types/database";

export const createTableSchema = z.object({
  restaurant_id: z.uuid({ message: "Invalid restaurant ID" }),
  table_number: z.string().min(1, "Table number is required"),
  capacity: z.number().int().positive("Capacity must be a positive number"),
  status: z.enum(Constants.public.Enums.table_status),
  is_active: z.boolean(),
});

export const updateTableSchema = createTableSchema.partial();

export type CreateTable = z.infer<typeof createTableSchema>;
export type UpdateTable = z.infer<typeof updateTableSchema>;
