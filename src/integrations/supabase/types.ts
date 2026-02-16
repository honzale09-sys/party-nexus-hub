export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      customers: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string | null
          notes: string | null
          phone: string | null
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name?: string | null
          notes?: string | null
          phone?: string | null
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          notes?: string | null
          phone?: string | null
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          age_restriction: string | null
          capacity_sold: number | null
          capacity_total: number | null
          category: string
          created_at: string
          date: string
          description: string | null
          dress_code: string | null
          featured: boolean
          gallery_urls: string[] | null
          id: string
          lineup: string[] | null
          map_link: string | null
          poster_url: string | null
          slug: string
          status: string
          tagline: string | null
          tags: string[] | null
          time: string
          title: string
          updated_at: string
          venue_address: string
          venue_name: string
        }
        Insert: {
          age_restriction?: string | null
          capacity_sold?: number | null
          capacity_total?: number | null
          category?: string
          created_at?: string
          date: string
          description?: string | null
          dress_code?: string | null
          featured?: boolean
          gallery_urls?: string[] | null
          id?: string
          lineup?: string[] | null
          map_link?: string | null
          poster_url?: string | null
          slug: string
          status?: string
          tagline?: string | null
          tags?: string[] | null
          time?: string
          title: string
          updated_at?: string
          venue_address: string
          venue_name: string
        }
        Update: {
          age_restriction?: string | null
          capacity_sold?: number | null
          capacity_total?: number | null
          category?: string
          created_at?: string
          date?: string
          description?: string | null
          dress_code?: string | null
          featured?: boolean
          gallery_urls?: string[] | null
          id?: string
          lineup?: string[] | null
          map_link?: string | null
          poster_url?: string | null
          slug?: string
          status?: string
          tagline?: string | null
          tags?: string[] | null
          time?: string
          title?: string
          updated_at?: string
          venue_address?: string
          venue_name?: string
        }
        Relationships: []
      }
      inventory_logs: {
        Row: {
          changed_by: string | null
          created_at: string
          delta: number
          id: string
          product_variant_id: string
          reason: string | null
        }
        Insert: {
          changed_by?: string | null
          created_at?: string
          delta: number
          id?: string
          product_variant_id: string
          reason?: string | null
        }
        Update: {
          changed_by?: string | null
          created_at?: string
          delta?: number
          id?: string
          product_variant_id?: string
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_logs_product_variant_id_fkey"
            columns: ["product_variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          item_type: string
          order_id: string
          product_variant_id: string | null
          quantity: number
          ticket_tier_id: string | null
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          id?: string
          item_type: string
          order_id: string
          product_variant_id?: string | null
          quantity?: number
          ticket_tier_id?: string | null
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string
          id?: string
          item_type?: string
          order_id?: string
          product_variant_id?: string | null
          quantity?: number
          ticket_tier_id?: string | null
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_order_items_product_variant"
            columns: ["product_variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_ticket_tier_id_fkey"
            columns: ["ticket_tier_id"]
            isOneToOne: false
            referencedRelation: "ticket_tiers"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          currency: string
          customer_email: string
          customer_id: string | null
          customer_name: string | null
          discount_amount: number | null
          fulfillment_status: string
          id: string
          payment_status: string
          promo_code_id: string | null
          stripe_payment_intent_id: string | null
          stripe_session_id: string | null
          total_amount: number
          tracking_number: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency?: string
          customer_email: string
          customer_id?: string | null
          customer_name?: string | null
          discount_amount?: number | null
          fulfillment_status?: string
          id?: string
          payment_status?: string
          promo_code_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          total_amount?: number
          tracking_number?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency?: string
          customer_email?: string
          customer_id?: string | null
          customer_name?: string | null
          discount_amount?: number | null
          fulfillment_status?: string
          id?: string
          payment_status?: string
          promo_code_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          total_amount?: number
          tracking_number?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_orders_promo_code"
            columns: ["promo_code_id"]
            isOneToOne: false
            referencedRelation: "promo_codes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          color: string | null
          created_at: string
          id: string
          product_id: string
          size: string | null
          sku: string | null
          stock: number
        }
        Insert: {
          color?: string | null
          created_at?: string
          id?: string
          product_id: string
          size?: string | null
          sku?: string | null
          stock?: number
        }
        Update: {
          color?: string | null
          created_at?: string
          id?: string
          product_id?: string
          size?: string | null
          sku?: string | null
          stock?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          active: boolean
          category: string
          created_at: string
          currency: string
          description: string | null
          featured: boolean
          id: string
          images: string[] | null
          name: string
          price: number
          shipping_class: string | null
          sku: string | null
          slug: string
          updated_at: string
          weight_grams: number | null
        }
        Insert: {
          active?: boolean
          category?: string
          created_at?: string
          currency?: string
          description?: string | null
          featured?: boolean
          id?: string
          images?: string[] | null
          name: string
          price: number
          shipping_class?: string | null
          sku?: string | null
          slug: string
          updated_at?: string
          weight_grams?: number | null
        }
        Update: {
          active?: boolean
          category?: string
          created_at?: string
          currency?: string
          description?: string | null
          featured?: boolean
          id?: string
          images?: string[] | null
          name?: string
          price?: number
          shipping_class?: string | null
          sku?: string | null
          slug?: string
          updated_at?: string
          weight_grams?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      promo_codes: {
        Row: {
          active: boolean
          applies_to: string
          code: string
          created_at: string
          discount_type: string
          discount_value: number
          id: string
          minimum_spend: number | null
          per_customer_limit: number | null
          usage_count: number
          usage_limit: number | null
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          active?: boolean
          applies_to?: string
          code: string
          created_at?: string
          discount_type?: string
          discount_value: number
          id?: string
          minimum_spend?: number | null
          per_customer_limit?: number | null
          usage_count?: number
          usage_limit?: number | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          active?: boolean
          applies_to?: string
          code?: string
          created_at?: string
          discount_type?: string
          discount_value?: number
          id?: string
          minimum_spend?: number | null
          per_customer_limit?: number | null
          usage_count?: number
          usage_limit?: number | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: []
      }
      scan_logs: {
        Row: {
          event_id: string | null
          id: string
          result: string
          scanned_at: string
          scanned_by: string | null
          ticket_instance_id: string
        }
        Insert: {
          event_id?: string | null
          id?: string
          result: string
          scanned_at?: string
          scanned_by?: string | null
          ticket_instance_id: string
        }
        Update: {
          event_id?: string | null
          id?: string
          result?: string
          scanned_at?: string
          scanned_by?: string | null
          ticket_instance_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scan_logs_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scan_logs_ticket_instance_id_fkey"
            columns: ["ticket_instance_id"]
            isOneToOne: false
            referencedRelation: "ticket_instances"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_instances: {
        Row: {
          created_at: string
          event_id: string
          id: string
          order_id: string
          order_item_id: string
          qr_code: string
          scanned_at: string | null
          status: string
          ticket_tier_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          order_id: string
          order_item_id: string
          qr_code: string
          scanned_at?: string | null
          status?: string
          ticket_tier_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          order_id?: string
          order_item_id?: string
          qr_code?: string
          scanned_at?: string | null
          status?: string
          ticket_tier_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_instances_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ticket_instances_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ticket_instances_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ticket_instances_ticket_tier_id_fkey"
            columns: ["ticket_tier_id"]
            isOneToOne: false
            referencedRelation: "ticket_tiers"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_tiers: {
        Row: {
          created_at: string
          currency: string
          event_id: string
          id: string
          max_per_order: number
          name: string
          price: number
          quantity_sold: number
          quantity_total: number
          sales_end: string | null
          sales_start: string | null
          visible: boolean
        }
        Insert: {
          created_at?: string
          currency?: string
          event_id: string
          id?: string
          max_per_order?: number
          name: string
          price: number
          quantity_sold?: number
          quantity_total?: number
          sales_end?: string | null
          sales_start?: string | null
          visible?: boolean
        }
        Update: {
          created_at?: string
          currency?: string
          event_id?: string
          id?: string
          max_per_order?: number
          name?: string
          price?: number
          quantity_sold?: number
          quantity_total?: number
          sales_end?: string | null
          sales_start?: string | null
          visible?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "ticket_tiers_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
