// src/types/menu_item.ts
import { Database } from "./database";

export type ApiResponse<T> = {
  data: T | null;
  message: string;
  status: number;
  errors?: unknown;
};

export type MenuItem = Database["public"]["Tables"]["menu_items"]["Row"];
export type InsertMenuItem =
  Database["public"]["Tables"]["menu_items"]["Insert"];
export type UpdateMenuItem =
  Database["public"]["Tables"]["menu_items"]["Update"];

export interface MenuItemFilters {
  restaurant_id?: string;
  name?: string;
  is_available?: boolean;
  is_featured?: boolean;
  min_price?: number;
  max_price?: number;
}
