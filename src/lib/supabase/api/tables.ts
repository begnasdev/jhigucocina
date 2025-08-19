import { Database } from "@/types/database";
import { createServerClient } from "@/lib/supabase/server";

import { InsertTable, Table, UpdateTable } from "@/types/table";

/**
 * Creates a new table.
 * @param tableData - The data for the new table.
 * @returns The created table.
 */
export async function createTable(tableData: InsertTable): Promise<Table> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("tables")
    .insert(tableData)
    .select()
    .single();

  if (error) throw new Error(`Error creating table: ${error.message}`);
  return data;
}

/**
 * Fetches a single table by its ID.
 * @param tableId - The ID of the table to fetch.
 * @returns The table object or null if not found.
 */
export async function getTableById(tableId: string): Promise<Table | null> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("tables")
    .select("*")
    .eq("table_id", tableId)
    .single();

  if (error) throw new Error(`Error fetching table: ${error.message}`);
  return data;
}

/**
 * Fetches all tables for a given restaurant.
 * @param restaurantId - The ID of the restaurant.
 * @returns An array of table objects.
 */
export async function getAllTablesByRestaurant(
  restaurantId: string
): Promise<Table[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("tables")
    .select("*")
    .eq("restaurant_id", restaurantId);

  if (error) throw new Error(`Error fetching tables: ${error.message}`);
  return data || [];
}

/**
 * Updates an existing table.
 * @param tableId - The ID of the table to update.
 * @param updateData - The data to update.
 * @returns The updated table.
 */
export async function updateTable(
  tableId: string,
  updateData: UpdateTable
): Promise<Table> {
  const supabase = await createServerClient();
  
  // First check if the table exists and get current user info
  const { data: { user } } = await supabase.auth.getUser();
  
  console.log("Current user ID:", user?.id);
  console.log("Updating table ID:", tableId);
  console.log("Update data:", updateData);
  
  // Check if table exists and user has access
  const { data: existingTable, error: checkError } = await supabase
    .from("tables")
    .select("*")
    .eq("table_id", tableId)
    .maybeSingle();
    
  if (checkError) {
    console.error("Error checking table:", checkError);
    throw new Error(`Error checking table: ${checkError.message}`);
  }
  
  console.log("Existing table:", existingTable);
  
  if (!existingTable) {
    throw new Error(`Table with ID ${tableId} not found`);
  }
  
  // Check user role
  const { data: userRole } = await supabase
    .from("user_roles")
    .select("*")
    .eq("user_id", user?.id)
    .eq("restaurant_id", existingTable.restaurant_id)
    .maybeSingle();
    
  console.log("User role:", userRole);
  
  // Now perform the update
  const { data, error, count } = await supabase
    .from("tables")
    .update(updateData)
    .eq("table_id", tableId)
    .select();

  console.log("Update result - data:", data, "error:", error, "count:", count);

  if (error) {
    console.error("Update error:", error);
    throw new Error(`Error updating table: ${error.message}`);
  }
  
  if (!data || data.length === 0) {
    // This likely means RLS policy is blocking the update
    throw new Error(`Failed to update table. You may not have permission to update this table.`);
  }
  
  return data[0];
}

/**
 * Deletes a table by its ID.
 * @param tableId - The ID of the table to delete.
 */
export async function deleteTable(tableId: string): Promise<void> {
  const supabase = await createServerClient();
  const { error } = await supabase
    .from("tables")
    .delete()
    .eq("table_id", tableId);

  if (error) throw new Error(`Error deleting table: ${error.message}`);
}

/**
 * Fetches all tables.
 * @returns An array of all table objects.
 */
export async function getAllTables(): Promise<Table[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase.from("tables").select("*");

  if (error) throw new Error(`Error fetching all tables: ${error.message}`);
  return data || [];
}
