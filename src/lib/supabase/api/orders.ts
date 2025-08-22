import { createServerClient } from "@/lib/supabase/server";
import {
  InsertOrder,
  Order,
  OrderItem,
  OrderWithItems, // Import the centralized type
  UpdateOrder,
} from "@/types/order";
import { z } from "zod";
import { createOrderSchema } from "@/schemas/order-schema";

type CreateOrderWithItems = z.infer<typeof createOrderSchema>;

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
  orderData: CreateOrderWithItems
): Promise<any> {
  const supabase = await createServerClient();
  const { order_items, ...newOrderData } = orderData;

  // By using an RPC function, we ensure that the entire operation
  // of creating an order and its items is atomic. If any part fails,
  // the whole transaction is rolled back.
  // NOTE: You will need to create the 'create_order_with_items' function in your
  // Supabase database for this to work.
  const { data, error } = await supabase.rpc("create_order_with_items", {
    order_data: newOrderData,
    items_data: order_items,
  });

  if (error) {
    throw new Error(`Error creating order: ${error.message}`);
  }

  // The RPC might succeed but return no data. This is an unexpected state.
  if (!data) {
    throw new Error(
      "Failed to create order: RPC did not return the expected data."
    );
  }

  // Now, TypeScript knows that 'data' cannot be null and matches the OrderWithItems type.
  return data;
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
