import { Database } from "./database";

export type ApiResponse<T> = {
  data: T | null;
  message: string;
  status: number;
  errors?: unknown;
};

export type Order = Database["public"]["Tables"]["orders"]["Row"];
export type InsertOrder = Database["public"]["Tables"]["orders"]["Insert"];
export type UpdateOrder = Database["public"]["Tables"]["orders"]["Update"];

export type OrderItem = Database["public"]["Tables"]["order_items"]["Row"];
export type InsertOrderItem =
  Database["public"]["Tables"]["order_items"]["Insert"];
export type UpdateOrderItem =
  Database["public"]["Tables"]["order_items"]["Update"];

// Represents a complete Order with its associated line items.
// This is the standard shape returned by our API's GET endpoints.
export type OrderWithItems = Order & {
  order_items: OrderItem[];
  restaurant: {
    name: string;
    restaurant_id: string;
  };
  customer: {
    name: string;
    user_id: string;
  };
};
