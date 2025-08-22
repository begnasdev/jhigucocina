// src/lib/supabase/api/menu_items.ts
import { createServerClient } from "@/lib/supabase/server";
import {
  MenuItem,
  InsertMenuItem,
  UpdateMenuItem,
  MenuItemFilters,
} from "@/types/menu_item";

// Get all menu items
export async function getAllMenuItems(
  filters?: MenuItemFilters
): Promise<MenuItem[]> {
  const supabase = await createServerClient();
  let query = supabase.from("menu_items").select("*");

  if (filters) {
    if (filters.restaurant_id) {
      query = query.eq("restaurant_id", filters.restaurant_id);
    }
    if (filters.name) {
      query = query.ilike("name", `%${filters.name}%`);
    }
    if (filters.is_available !== undefined) {
      query = query.eq("is_available", filters.is_available);
    }
    if (filters.is_featured !== undefined) {
      query = query.eq("is_featured", filters.is_featured);
    }
    if (filters.min_price !== undefined) {
      query = query.gte("price", filters.min_price);
    }
    if (filters.max_price !== undefined) {
      query = query.lte("price", filters.max_price);
    }
  }

  const { data, error } = await query;

  if (error) throw new Error(`Error fetching menu items: ${error.message}`);
  return data || [];
}

// Get a single menu item by its ID
export async function getMenuItemById(id: string): Promise<MenuItem | null> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .eq("item_id", id)
    .single();
  if (error)
    throw new Error(`Error fetching menu item ${id}: ${error.message}`);
  return data;
}

// Create a new menu item
export async function createMenuItem(
  menuItemData: InsertMenuItem
): Promise<MenuItem> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("menu_items")
    .insert(menuItemData)
    .select()
    .single();
  if (error) throw new Error(`Error creating menu item: ${error.message}`);
  return data;
}

// Update an existing menu item
export async function updateMenuItem(
  id: string,
  updateData: UpdateMenuItem
): Promise<MenuItem> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("menu_items")
    .update(updateData)
    .eq("item_id", id)
    .select()
    .single();
  if (error)
    throw new Error(`Error updating menu item ${id}: ${error.message}`);
  return data;
}

// Delete a menu item
export async function deleteMenuItem(id: string): Promise<void> {
  const supabase = await createServerClient();
  const { error } = await supabase
    .from("menu_items")
    .delete()
    .eq("item_id", id);
  if (error)
    throw new Error(`Error deleting menu item ${id}: ${error.message}`);
}
