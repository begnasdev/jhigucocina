export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      applied_promotions: {
        Row: {
          applied_promotion_id: string
          discount_amount: number
          order_id: string
          promotion_id: string
        }
        Insert: {
          applied_promotion_id?: string
          discount_amount: number
          order_id: string
          promotion_id: string
        }
        Update: {
          applied_promotion_id?: string
          discount_amount?: number
          order_id?: string
          promotion_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "applied_promotions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["order_id"]
          },
          {
            foreignKeyName: "applied_promotions_promotion_id_fkey"
            columns: ["promotion_id"]
            isOneToOne: false
            referencedRelation: "promotions"
            referencedColumns: ["promotion_id"]
          },
        ]
      }
      cart_items: {
        Row: {
          cart_id: string
          created_at: string
          id: string
          menu_item_id: string
          price_at_time_of_addition: number
          quantity: number
          updated_at: string
        }
        Insert: {
          cart_id: string
          created_at?: string
          id?: string
          menu_item_id: string
          price_at_time_of_addition: number
          quantity: number
          updated_at?: string
        }
        Update: {
          cart_id?: string
          created_at?: string
          id?: string
          menu_item_id?: string
          price_at_time_of_addition?: number
          quantity?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_cart_id_fkey"
            columns: ["cart_id"]
            isOneToOne: false
            referencedRelation: "carts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["item_id"]
          },
        ]
      }
      carts: {
        Row: {
          created_at: string
          id: string
          restaurant_id: string
          session_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          restaurant_id: string
          session_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          restaurant_id?: string
          session_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "carts_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["restaurant_id"]
          },
        ]
      }
      diet_type: {
        Row: {
          diet_type_id: string
          name: string
          restaurant_id: string | null
        }
        Insert: {
          diet_type_id?: string
          name: string
          restaurant_id?: string | null
        }
        Update: {
          diet_type_id?: string
          name?: string
          restaurant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "diet_type_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["restaurant_id"]
          },
        ]
      }
      menu_categories: {
        Row: {
          available_from: string | null
          available_until: string | null
          category_id: string
          created_at: string | null
          description: string | null
          image_url: string | null
          is_active: boolean | null
          name: string
          restaurant_id: string | null
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          available_from?: string | null
          available_until?: string | null
          category_id?: string
          created_at?: string | null
          description?: string | null
          image_url?: string | null
          is_active?: boolean | null
          name: string
          restaurant_id?: string | null
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          available_from?: string | null
          available_until?: string | null
          category_id?: string
          created_at?: string | null
          description?: string | null
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          restaurant_id?: string | null
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "menu_categories_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["restaurant_id"]
          },
        ]
      }
      menu_item_categories: {
        Row: {
          category_id: string
          menu_item_id: string
        }
        Insert: {
          category_id: string
          menu_item_id: string
        }
        Update: {
          category_id?: string
          menu_item_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_category"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "menu_categories"
            referencedColumns: ["category_id"]
          },
          {
            foreignKeyName: "fk_menu_item"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["item_id"]
          },
        ]
      }
      menu_item_diet_types: {
        Row: {
          diet_type_id: string
          menu_item_id: string
        }
        Insert: {
          diet_type_id: string
          menu_item_id: string
        }
        Update: {
          diet_type_id?: string
          menu_item_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "menu_item_diet_types_diet_type_id_fkey"
            columns: ["diet_type_id"]
            isOneToOne: false
            referencedRelation: "diet_type"
            referencedColumns: ["diet_type_id"]
          },
          {
            foreignKeyName: "menu_item_diet_types_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["item_id"]
          },
        ]
      }
      menu_items: {
        Row: {
          allergens: string | null
          created_at: string | null
          customization_options: Json | null
          description: string | null
          image_url: string | null
          ingredients: string | null
          is_available: boolean | null
          is_featured: boolean | null
          item_id: string
          name: string
          preparation_time: number | null
          price: number
          restaurant_id: string | null
          updated_at: string | null
        }
        Insert: {
          allergens?: string | null
          created_at?: string | null
          customization_options?: Json | null
          description?: string | null
          image_url?: string | null
          ingredients?: string | null
          is_available?: boolean | null
          is_featured?: boolean | null
          item_id?: string
          name: string
          preparation_time?: number | null
          price: number
          restaurant_id?: string | null
          updated_at?: string | null
        }
        Update: {
          allergens?: string | null
          created_at?: string | null
          customization_options?: Json | null
          description?: string | null
          image_url?: string | null
          ingredients?: string | null
          is_available?: boolean | null
          is_featured?: boolean | null
          item_id?: string
          name?: string
          preparation_time?: number | null
          price?: number
          restaurant_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["restaurant_id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          expires_at: string | null
          is_read: boolean | null
          message: string
          metadata: Json | null
          notification_id: string
          order_id: string | null
          priority: Database["public"]["Enums"]["notification_priority"] | null
          read_at: string | null
          restaurant_id: string | null
          sent_at: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          is_read?: boolean | null
          message: string
          metadata?: Json | null
          notification_id?: string
          order_id?: string | null
          priority?: Database["public"]["Enums"]["notification_priority"] | null
          read_at?: string | null
          restaurant_id?: string | null
          sent_at?: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          is_read?: boolean | null
          message?: string
          metadata?: Json | null
          notification_id?: string
          order_id?: string | null
          priority?: Database["public"]["Enums"]["notification_priority"] | null
          read_at?: string | null
          restaurant_id?: string | null
          sent_at?: string | null
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["order_id"]
          },
          {
            foreignKeyName: "notifications_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["restaurant_id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string | null
          customizations: Json | null
          item_id: string | null
          order_id: string | null
          order_item_id: string
          quantity: number
          status: Database["public"]["Enums"]["order_item_status"] | null
          total_price: number
          unit_price: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          customizations?: Json | null
          item_id?: string | null
          order_id?: string | null
          order_item_id?: string
          quantity: number
          status?: Database["public"]["Enums"]["order_item_status"] | null
          total_price: number
          unit_price: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          customizations?: Json | null
          item_id?: string | null
          order_id?: string | null
          order_item_id?: string
          quantity?: number
          status?: Database["public"]["Enums"]["order_item_status"] | null
          total_price?: number
          unit_price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["order_id"]
          },
        ]
      }
      order_payments: {
        Row: {
          amount_paid: number
          change_given: number | null
          created_at: string | null
          order_id: string | null
          payment_id: string
          payment_method: Database["public"]["Enums"]["payment_method"]
          payment_reference: string | null
          payment_status: Database["public"]["Enums"]["payment_status"] | null
          payment_time: string | null
          processed_by: string | null
          updated_at: string | null
        }
        Insert: {
          amount_paid: number
          change_given?: number | null
          created_at?: string | null
          order_id?: string | null
          payment_id?: string
          payment_method: Database["public"]["Enums"]["payment_method"]
          payment_reference?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          payment_time?: string | null
          processed_by?: string | null
          updated_at?: string | null
        }
        Update: {
          amount_paid?: number
          change_given?: number | null
          created_at?: string | null
          order_id?: string | null
          payment_id?: string
          payment_method?: Database["public"]["Enums"]["payment_method"]
          payment_reference?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          payment_time?: string | null
          processed_by?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["order_id"]
          },
          {
            foreignKeyName: "order_payments_processed_by_fkey"
            columns: ["processed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      order_status_history: {
        Row: {
          estimated_time: number | null
          history_id: string
          is_valid_progression: boolean | null
          new_status: Database["public"]["Enums"]["order_status"]
          notes: string | null
          old_status: Database["public"]["Enums"]["order_status"] | null
          order_id: string | null
          updated_at: string | null
          updated_by: string | null
          validation_errors: string | null
        }
        Insert: {
          estimated_time?: number | null
          history_id?: string
          is_valid_progression?: boolean | null
          new_status: Database["public"]["Enums"]["order_status"]
          notes?: string | null
          old_status?: Database["public"]["Enums"]["order_status"] | null
          order_id?: string | null
          updated_at?: string | null
          updated_by?: string | null
          validation_errors?: string | null
        }
        Update: {
          estimated_time?: number | null
          history_id?: string
          is_valid_progression?: boolean | null
          new_status?: Database["public"]["Enums"]["order_status"]
          notes?: string | null
          old_status?: Database["public"]["Enums"]["order_status"] | null
          order_id?: string | null
          updated_at?: string | null
          updated_by?: string | null
          validation_errors?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_status_history_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["order_id"]
          },
          {
            foreignKeyName: "order_status_history_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      orders: {
        Row: {
          accepted_at: string | null
          actual_prep_time: number | null
          calculated_total: number | null
          cancellation_deadline: string | null
          cancelled_at: string | null
          created_at: string | null
          customer_id: string | null
          estimated_prep_time: number | null
          is_total_validated: boolean | null
          kitchen_cutoff_time: string | null
          max_prep_time: number | null
          order_id: string
          order_number: string
          order_time: string | null
          processed_by: string | null
          ready_at: string | null
          restaurant_id: string | null
          served_at: string | null
          service_charge: number | null
          special_instructions: string | null
          status: Database["public"]["Enums"]["order_status"] | null
          subtotal: number | null
          table_id: string | null
          tax_amount: number | null
          total_amount: number | null
          updated_at: string | null
        }
        Insert: {
          accepted_at?: string | null
          actual_prep_time?: number | null
          calculated_total?: number | null
          cancellation_deadline?: string | null
          cancelled_at?: string | null
          created_at?: string | null
          customer_id?: string | null
          estimated_prep_time?: number | null
          is_total_validated?: boolean | null
          kitchen_cutoff_time?: string | null
          max_prep_time?: number | null
          order_id?: string
          order_number: string
          order_time?: string | null
          processed_by?: string | null
          ready_at?: string | null
          restaurant_id?: string | null
          served_at?: string | null
          service_charge?: number | null
          special_instructions?: string | null
          status?: Database["public"]["Enums"]["order_status"] | null
          subtotal?: number | null
          table_id?: string | null
          tax_amount?: number | null
          total_amount?: number | null
          updated_at?: string | null
        }
        Update: {
          accepted_at?: string | null
          actual_prep_time?: number | null
          calculated_total?: number | null
          cancellation_deadline?: string | null
          cancelled_at?: string | null
          created_at?: string | null
          customer_id?: string | null
          estimated_prep_time?: number | null
          is_total_validated?: boolean | null
          kitchen_cutoff_time?: string | null
          max_prep_time?: number | null
          order_id?: string
          order_number?: string
          order_time?: string | null
          processed_by?: string | null
          ready_at?: string | null
          restaurant_id?: string | null
          served_at?: string | null
          service_charge?: number | null
          special_instructions?: string | null
          status?: Database["public"]["Enums"]["order_status"] | null
          subtotal?: number | null
          table_id?: string | null
          tax_amount?: number | null
          total_amount?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "orders_processed_by_fkey"
            columns: ["processed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "orders_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["restaurant_id"]
          },
          {
            foreignKeyName: "orders_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "tables"
            referencedColumns: ["table_id"]
          },
        ]
      }
      promotion_categories: {
        Row: {
          category_id: string
          promotion_id: string
        }
        Insert: {
          category_id: string
          promotion_id: string
        }
        Update: {
          category_id?: string
          promotion_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "promotion_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "menu_categories"
            referencedColumns: ["category_id"]
          },
          {
            foreignKeyName: "promotion_categories_promotion_id_fkey"
            columns: ["promotion_id"]
            isOneToOne: false
            referencedRelation: "promotions"
            referencedColumns: ["promotion_id"]
          },
        ]
      }
      promotions: {
        Row: {
          description: string | null
          end_date: string
          is_active: boolean | null
          name: string
          promotion_id: string
          restaurant_id: string
          start_date: string
          type: string
          value: number
          voucher_code: string | null
        }
        Insert: {
          description?: string | null
          end_date: string
          is_active?: boolean | null
          name: string
          promotion_id?: string
          restaurant_id: string
          start_date: string
          type: string
          value: number
          voucher_code?: string | null
        }
        Update: {
          description?: string | null
          end_date?: string
          is_active?: boolean | null
          name?: string
          promotion_id?: string
          restaurant_id?: string
          start_date?: string
          type?: string
          value?: number
          voucher_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "promotions_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["restaurant_id"]
          },
        ]
      }
      qr_scans: {
        Row: {
          customer_id: string | null
          device_info: Json | null
          expires_at: string | null
          ip_address: unknown | null
          is_active_session: boolean | null
          led_to_order: boolean | null
          order_id: string | null
          referrer_url: string | null
          scan_id: string
          scanned_at: string | null
          session_id: string | null
          session_status: Database["public"]["Enums"]["session_status"] | null
          table_id: string | null
          user_agent: string | null
        }
        Insert: {
          customer_id?: string | null
          device_info?: Json | null
          expires_at?: string | null
          ip_address?: unknown | null
          is_active_session?: boolean | null
          led_to_order?: boolean | null
          order_id?: string | null
          referrer_url?: string | null
          scan_id?: string
          scanned_at?: string | null
          session_id?: string | null
          session_status?: Database["public"]["Enums"]["session_status"] | null
          table_id?: string | null
          user_agent?: string | null
        }
        Update: {
          customer_id?: string | null
          device_info?: Json | null
          expires_at?: string | null
          ip_address?: unknown | null
          is_active_session?: boolean | null
          led_to_order?: boolean | null
          order_id?: string | null
          referrer_url?: string | null
          scan_id?: string
          scanned_at?: string | null
          session_id?: string | null
          session_status?: Database["public"]["Enums"]["session_status"] | null
          table_id?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "qr_scans_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "qr_scans_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["order_id"]
          },
          {
            foreignKeyName: "qr_scans_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "tables"
            referencedColumns: ["table_id"]
          },
        ]
      }
      restaurants: {
        Row: {
          address: string
          created_at: string | null
          currency: string | null
          description: string | null
          email: string | null
          image_url: string | null
          is_active: boolean | null
          name: string
          operating_hours: string | null
          phone: string | null
          restaurant_id: string
          service_charge: number | null
          tax_rate: number | null
          timezone: string | null
          updated_at: string | null
        }
        Insert: {
          address: string
          created_at?: string | null
          currency?: string | null
          description?: string | null
          email?: string | null
          image_url?: string | null
          is_active?: boolean | null
          name: string
          operating_hours?: string | null
          phone?: string | null
          restaurant_id?: string
          service_charge?: number | null
          tax_rate?: number | null
          timezone?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string
          created_at?: string | null
          currency?: string | null
          description?: string | null
          email?: string | null
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          operating_hours?: string | null
          phone?: string | null
          restaurant_id?: string
          service_charge?: number | null
          tax_rate?: number | null
          timezone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      tables: {
        Row: {
          capacity: number | null
          created_at: string | null
          is_active: boolean | null
          last_scanned: string | null
          location_coordinates: Json | null
          qr_code_data: string | null
          qr_code_url: string | null
          restaurant_id: string | null
          status: Database["public"]["Enums"]["table_status"] | null
          table_id: string
          table_number: string
          updated_at: string | null
        }
        Insert: {
          capacity?: number | null
          created_at?: string | null
          is_active?: boolean | null
          last_scanned?: string | null
          location_coordinates?: Json | null
          qr_code_data?: string | null
          qr_code_url?: string | null
          restaurant_id?: string | null
          status?: Database["public"]["Enums"]["table_status"] | null
          table_id?: string
          table_number: string
          updated_at?: string | null
        }
        Update: {
          capacity?: number | null
          created_at?: string | null
          is_active?: boolean | null
          last_scanned?: string | null
          location_coordinates?: Json | null
          qr_code_data?: string | null
          qr_code_url?: string | null
          restaurant_id?: string | null
          status?: Database["public"]["Enums"]["table_status"] | null
          table_id?: string
          table_number?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tables_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["restaurant_id"]
          },
        ]
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          expires_at: string | null
          is_active: boolean | null
          restaurant_id: string | null
          role: Database["public"]["Enums"]["roles_enum"]
          user_id: string | null
          user_role_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          expires_at?: string | null
          is_active?: boolean | null
          restaurant_id?: string | null
          role: Database["public"]["Enums"]["roles_enum"]
          user_id?: string | null
          user_role_id?: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          expires_at?: string | null
          is_active?: boolean | null
          restaurant_id?: string | null
          role?: Database["public"]["Enums"]["roles_enum"]
          user_id?: string | null
          user_role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_roles_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["restaurant_id"]
          },
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          is_active: boolean | null
          last_login: string | null
          name: string | null
          phone: string | null
          profile_picture: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          is_active?: boolean | null
          last_login?: string | null
          name?: string | null
          phone?: string | null
          profile_picture?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          is_active?: boolean | null
          last_login?: string | null
          name?: string | null
          phone?: string | null
          profile_picture?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_order_totals: {
        Args: { order_id_param: string }
        Returns: {
          subtotal: number
          tax_amount: number
          service_charge: number
          total_amount: number
        }[]
      }
      get_user_restaurant_context: {
        Args: Record<PropertyKey, never>
        Returns: {
          restaurant_id: string
          role: string
        }[]
      }
      validate_order_status_progression: {
        Args: {
          old_status: Database["public"]["Enums"]["order_status"]
          new_status: Database["public"]["Enums"]["order_status"]
        }
        Returns: boolean
      }
    }
    Enums: {
      notification_priority: "low" | "normal" | "high" | "urgent"
      notification_type:
        | "order_placed"
        | "order_accepted"
        | "order_preparing"
        | "order_ready"
        | "order_served"
        | "order_cancelled"
        | "system_alert"
      order_item_status: "pending" | "preparing" | "ready" | "served"
      order_status:
        | "pending"
        | "accepted"
        | "preparing"
        | "ready"
        | "served"
        | "cancelled"
      payment_method: "cash" | "card" | "digital_wallet" | "other"
      payment_status: "pending" | "completed" | "failed" | "refunded"
      roles_enum: "super_admin" | "manager" | "staff" | "customer"
      session_status: "active" | "expired" | "completed"
      table_status:
        | "available"
        | "occupied"
        | "reserved"
        | "maintenance"
        | "out_of_service"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      notification_priority: ["low", "normal", "high", "urgent"],
      notification_type: [
        "order_placed",
        "order_accepted",
        "order_preparing",
        "order_ready",
        "order_served",
        "order_cancelled",
        "system_alert",
      ],
      order_item_status: ["pending", "preparing", "ready", "served"],
      order_status: [
        "pending",
        "accepted",
        "preparing",
        "ready",
        "served",
        "cancelled",
      ],
      payment_method: ["cash", "card", "digital_wallet", "other"],
      payment_status: ["pending", "completed", "failed", "refunded"],
      roles_enum: ["super_admin", "manager", "staff", "customer"],
      session_status: ["active", "expired", "completed"],
      table_status: [
        "available",
        "occupied",
        "reserved",
        "maintenance",
        "out_of_service",
      ],
    },
  },
} as const
