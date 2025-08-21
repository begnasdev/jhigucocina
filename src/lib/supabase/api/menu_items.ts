// src/lib/supabase/api/menu_items.ts
import { createServerClient } from "@/lib/supabase/server";
import { MenuItem, InsertMenuItem, UpdateMenuItem } from "@/types/menu_item";

// Get all menu items
export async function getAllMenuItems(): Promise<MenuItem[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase.from("menu_items").select("*");
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
  if (error) throw new Error(`Error fetching menu item ${id}: ${error.message}`);
  return data;
}

// Create a new menu item
export async function createMenuItem(menuItemData: InsertMenuItem): Promise<MenuItem> {
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
  if (error) throw new Error(`Error updating menu item ${id}: ${error.message}`);
  return data;
}

// Delete a menu item
export async function deleteMenuItem(id: string): Promise<void> {
  const supabase = await createServerClient();
  const { error } = await supabase.from("menu_items").delete().eq("item_id", id);
  if (error) throw new Error(`Error deleting menu item ${id}: ${error.message}`);
}
