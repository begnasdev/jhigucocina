// src/types/menu_item.ts
import { Database } from "./database";

export type MenuItem = Database["public"]["Tables"]["menu_items"]["Row"];
export type InsertMenuItem = Database["public"]["Tables"]["menu_items"]["Insert"];
export type UpdateMenuItem = Database["public"]["Tables"]["menu_items"]["Update"];
