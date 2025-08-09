export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          role: "super_admin" | "manager" | "staff" | "customer";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          role?: "super_admin" | "manager" | "staff" | "customer";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          role?: "super_admin" | "manager" | "staff" | "customer";
          created_at?: string;
          updated_at?: string;
        };
      };
      restaurants: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          address: string;
          phone: string;
          email: string;
          owner_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          address: string;
          phone: string;
          email: string;
          owner_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          address?: string;
          phone?: string;
          email?: string;
          owner_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      menu_categories: {
        Row: {
          id: string;
          restaurant_id: string;
          name: string;
          description: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          name: string;
          description?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          restaurant_id?: string;
          name?: string;
          description?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      menu_items: {
        Row: {
          id: string;
          restaurant_id: string;
          category_id: string;
          name: string;
          description: string | null;
          price: number;
          image_url: string | null;
          is_available: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          category_id: string;
          name: string;
          description?: string | null;
          price: number;
          image_url?: string | null;
          is_available?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          restaurant_id?: string;
          category_id?: string;
          name?: string;
          description?: string | null;
          price?: number;
          image_url?: string | null;
          is_available?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      tables: {
        Row: {
          id: string;
          restaurant_id: string;
          table_number: string;
          capacity: number;
          status:
            | "available"
            | "occupied"
            | "reserved"
            | "maintenance"
            | "out_of_service";
          qr_code: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          table_number: string;
          capacity: number;
          status?:
            | "available"
            | "occupied"
            | "reserved"
            | "maintenance"
            | "out_of_service";
          qr_code?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          restaurant_id?: string;
          table_number?: string;
          capacity?: number;
          status?:
            | "available"
            | "occupied"
            | "reserved"
            | "maintenance"
            | "out_of_service";
          qr_code?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          restaurant_id: string;
          table_id: string;
          customer_id: string | null;
          status:
            | "pending"
            | "accepted"
            | "preparing"
            | "ready"
            | "served"
            | "cancelled";
          total_amount: number;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          table_id: string;
          customer_id?: string | null;
          status?:
            | "pending"
            | "accepted"
            | "preparing"
            | "ready"
            | "served"
            | "cancelled";
          total_amount?: number;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          restaurant_id?: string;
          table_id?: string;
          customer_id?: string | null;
          status?:
            | "pending"
            | "accepted"
            | "preparing"
            | "ready"
            | "served"
            | "cancelled";
          total_amount?: number;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          menu_item_id: string;
          quantity: number;
          unit_price: number;
          total_price: number;
          status: "pending" | "preparing" | "ready" | "served";
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          menu_item_id: string;
          quantity: number;
          unit_price: number;
          total_price?: number;
          status?: "pending" | "preparing" | "ready" | "served";
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          menu_item_id?: string;
          quantity?: number;
          unit_price?: number;
          total_price?: number;
          status?: "pending" | "preparing" | "ready" | "served";
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      notification_type:
        | "order_placed"
        | "order_accepted"
        | "order_preparing"
        | "order_ready"
        | "order_served"
        | "order_cancelled"
        | "system_alert";
      notification_priority: "low" | "normal" | "high" | "urgent";
      order_status:
        | "pending"
        | "accepted"
        | "preparing"
        | "ready"
        | "served"
        | "cancelled";
      payment_method: "cash" | "card" | "digital_wallet" | "other";
      payment_status: "pending" | "completed" | "failed" | "refunded";
      roles_enum: "super_admin" | "manager" | "staff" | "customer";
      table_status:
        | "available"
        | "occupied"
        | "reserved"
        | "maintenance"
        | "out_of_service";
      order_item_status: "pending" | "preparing" | "ready" | "served";
      session_status: "active" | "expired" | "completed";
    };
  };
}
