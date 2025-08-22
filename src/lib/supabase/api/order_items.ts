import { createServerClient } from "@/lib/supabase/server";
import { OrderItem } from "@/types/order";

/**
 * Retrieves all order items associated with a specific order ID.
 * @param orderId The UUID of the order.
 * @returns A promise that resolves to an array of order items.
 */
export async function getOrderItemsByOrderId(
  orderId: string
): Promise<OrderItem[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", orderId);

  if (error)
    throw new Error(`Error fetching order items: ${error.message}`);
  return data || [];
}

// Note: Functions for creating, updating, and deleting individual order items
// have been intentionally removed for security and simplicity.
// - Creating items is handled atomically by the 'create_order_with_items' RPC.
// - Updating/deleting items requires significant business logic (e.g., checking
//   order status, recalculating totals) and should be implemented in a dedicated,
//   secure RPC function when the feature is required.