import { createServerClient } from "@/lib/supabase/server";
import {
  InsertOrder,
  Order,
  OrderItem,
  OrderWithItems, // Import the centralized type
  UpdateOrder,
} from "@/types/order";
import { z } from "zod";
import { CreateOrder, createOrderSchema } from "@/schemas/order-schema";

export async function getAllOrders(): Promise<OrderWithItems[]> {
  const supabase = await createServerClient();
  // Fetch orders and their related items in a single query.
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)");

  if (error) throw new Error(`Error fetching orders: ${error.message}`);
  return data || [];
}

export async function getOrderById(id: string): Promise<OrderWithItems | null> {
  const supabase = await createServerClient();
  // Fetch a single order and its related items.
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("order_id", id)
    .single();

  if (error) throw new Error(`Error fetching order ${id}: ${error.message}`);
  return data;
}

export async function createOrder(
  orderData: CreateOrder
): Promise<OrderWithItems> {
  const supabase = await createServerClient();
  const { order_items, ...newOrderData } = orderData;

  // --- Step 1: Fetch menu item prices to prevent client-side price tampering ---
  const itemIds = order_items.map((item) => item.item_id);
  const { data: menuItems, error: itemError } = await supabase
    .from("menu_items")
    .select("item_id, price")
    .in("item_id", itemIds);

  if (itemError) {
    throw new Error(`Error fetching item prices: ${itemError.message}`);
  }

  if (menuItems.length !== itemIds.length) {
    throw new Error("Could not find all items for the order.");
  }

  const priceMap = new Map(menuItems.map((item) => [item.item_id, item.price]));

  // --- Step 2: Insert the main order record ---
  // Manually create an order number to satisfy the NOT NULL constraint.
  // The database trigger for this is only a fallback.
  const orderNumber = `ORD-${new Date()
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, "")}-${Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase()}`;

  const { data: insertedOrder, error: orderError } = await supabase
    .from("orders")
    .insert({
      ...newOrderData,
      order_number: orderNumber,
      // Ensure status is set if not provided
      status: newOrderData.status ?? "pending",
    })
    .select()
    .single();

  if (orderError) {
    throw new Error(`Error creating order: ${orderError.message}`);
  }

  // --- Step 3: Prepare and insert the associated order items ---
  const itemsToInsert = order_items.map((item) => {
    const unit_price = priceMap.get(item.item_id);
    if (unit_price === undefined) {
      // This should theoretically not be reached due to the check above
      throw new Error(`Price for item ${item.item_id} not found.`);
    }
    const total_price = unit_price * item.quantity;

    return {
      ...item,
      order_id: insertedOrder.order_id,
      unit_price,
      total_price,
      // Ensure customizations is not undefined
      customizations: item.customizations ?? undefined,
    };
  });

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(itemsToInsert);

  if (itemsError) {
    // ATTEMPT TO ROLLBACK: This is the main weakness of this approach.
    // If this cleanup fails, the order remains orphaned.
    await supabase
      .from("orders")
      .delete()
      .eq("order_id", insertedOrder.order_id);
    throw new Error(
      `Error creating order items: ${itemsError.message}. Orphaned order may exist.`
    );
  }

  // --- Step 4: Fetch and return the complete order with its items ---
  // We need to re-fetch because the insert operations don't return the nested items.
  const finalOrder = await getOrderById(insertedOrder.order_id);

  if (!finalOrder) {
    throw new Error("Failed to retrieve the final created order.");
  }

  return finalOrder;
}

export async function updateOrder(
  id: string,
  updateData: UpdateOrder
): Promise<OrderWithItems> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("orders")
    .update(updateData)
    .eq("order_id", id)
    .select("*, order_items(*)") // Fetch the items as well
    .single();

  if (error) throw new Error(`Error updating order ${id}: ${error.message}`);
  return data;
}

export async function deleteOrder(id: string): Promise<void> {
  const supabase = await createServerClient();
  // Note: You might want to handle cascading deletes in your database schema
  // to also remove associated order_items.
  const { error } = await supabase.from("orders").delete().eq("order_id", id);
  if (error) throw new Error(`Error deleting order ${id}: ${error.message}`);
}
