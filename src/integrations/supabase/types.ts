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
      drivers: {
        Row: {
          assigned_vehicle: string | null
          created_at: string
          id: string
          license: string
          license_expiry: string
          name: string
          organization_id: string
          performance: Database["public"]["Enums"]["driver_performance"]
          phone: string
          status: Database["public"]["Enums"]["driver_status"]
          updated_at: string
        }
        Insert: {
          assigned_vehicle?: string | null
          created_at?: string
          id?: string
          license: string
          license_expiry: string
          name: string
          organization_id: string
          performance?: Database["public"]["Enums"]["driver_performance"]
          phone: string
          status?: Database["public"]["Enums"]["driver_status"]
          updated_at?: string
        }
        Update: {
          assigned_vehicle?: string | null
          created_at?: string
          id?: string
          license?: string
          license_expiry?: string
          name?: string
          organization_id?: string
          performance?: Database["public"]["Enums"]["driver_performance"]
          phone?: string
          status?: Database["public"]["Enums"]["driver_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "drivers_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      fuel_records: {
        Row: {
          created_at: string
          date: string
          driver_id: string | null
          driver_name: string
          fuel_amount: number
          fuel_cost: number
          fuel_station: string
          id: string
          odometer: number
          organization_id: string
          price_per_liter: number
          receipt_number: string | null
          updated_at: string
          vehicle_id: string
          vehicle_reg_number: string
        }
        Insert: {
          created_at?: string
          date: string
          driver_id?: string | null
          driver_name: string
          fuel_amount: number
          fuel_cost: number
          fuel_station: string
          id?: string
          odometer: number
          organization_id: string
          price_per_liter: number
          receipt_number?: string | null
          updated_at?: string
          vehicle_id: string
          vehicle_reg_number: string
        }
        Update: {
          created_at?: string
          date?: string
          driver_id?: string | null
          driver_name?: string
          fuel_amount?: number
          fuel_cost?: number
          fuel_station?: string
          id?: string
          odometer?: number
          organization_id?: string
          price_per_liter?: number
          receipt_number?: string | null
          updated_at?: string
          vehicle_id?: string
          vehicle_reg_number?: string
        }
        Relationships: [
          {
            foreignKeyName: "fuel_records_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fuel_records_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fuel_records_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_records: {
        Row: {
          completed_date: string | null
          cost: number
          created_at: string
          description: string
          id: string
          mileage: number
          next_service_mileage: number | null
          notes: string | null
          organization_id: string
          parts_replaced: string[] | null
          scheduled_date: string
          service_provider: string
          status: Database["public"]["Enums"]["maintenance_status"]
          type: Database["public"]["Enums"]["maintenance_type"]
          updated_at: string
          vehicle_id: string
          vehicle_reg_number: string
        }
        Insert: {
          completed_date?: string | null
          cost: number
          created_at?: string
          description: string
          id?: string
          mileage: number
          next_service_mileage?: number | null
          notes?: string | null
          organization_id: string
          parts_replaced?: string[] | null
          scheduled_date: string
          service_provider: string
          status?: Database["public"]["Enums"]["maintenance_status"]
          type: Database["public"]["Enums"]["maintenance_type"]
          updated_at?: string
          vehicle_id: string
          vehicle_reg_number: string
        }
        Update: {
          completed_date?: string | null
          cost?: number
          created_at?: string
          description?: string
          id?: string
          mileage?: number
          next_service_mileage?: number | null
          notes?: string | null
          organization_id?: string
          parts_replaced?: string[] | null
          scheduled_date?: string
          service_provider?: string
          status?: Database["public"]["Enums"]["maintenance_status"]
          type?: Database["public"]["Enums"]["maintenance_type"]
          updated_at?: string
          vehicle_id?: string
          vehicle_reg_number?: string
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_records_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_records_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          features: string[] | null
          id: string
          max_users: number
          max_vehicles: number
          name: string
          owner_email: string
          owner_id: string
          slug: string
          subscription_ends_at: string | null
          subscription_status: Database["public"]["Enums"]["subscription_status"]
          subscription_tier: Database["public"]["Enums"]["subscription_tier"]
          trial_ends_at: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          features?: string[] | null
          id?: string
          max_users?: number
          max_vehicles?: number
          name: string
          owner_email: string
          owner_id: string
          slug: string
          subscription_ends_at?: string | null
          subscription_status?: Database["public"]["Enums"]["subscription_status"]
          subscription_tier?: Database["public"]["Enums"]["subscription_tier"]
          trial_ends_at?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          features?: string[] | null
          id?: string
          max_users?: number
          max_vehicles?: number
          name?: string
          owner_email?: string
          owner_id?: string
          slug?: string
          subscription_ends_at?: string | null
          subscription_status?: Database["public"]["Enums"]["subscription_status"]
          subscription_tier?: Database["public"]["Enums"]["subscription_tier"]
          trial_ends_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          last_login: string | null
          name: string
          organization_id: string
          role: Database["public"]["Enums"]["app_role"]
          status: Database["public"]["Enums"]["driver_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          last_login?: string | null
          name: string
          organization_id: string
          role?: Database["public"]["Enums"]["app_role"]
          status?: Database["public"]["Enums"]["driver_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          last_login?: string | null
          name?: string
          organization_id?: string
          role?: Database["public"]["Enums"]["app_role"]
          status?: Database["public"]["Enums"]["driver_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_records: {
        Row: {
          created_at: string
          distance: number | null
          driver_id: string | null
          driver_name: string
          end_location: string
          end_mileage: number | null
          end_time: string | null
          fuel_cost: number | null
          fuel_used: number | null
          id: string
          notes: string | null
          organization_id: string
          purpose: Database["public"]["Enums"]["trip_purpose"]
          start_location: string
          start_mileage: number
          start_time: string
          status: Database["public"]["Enums"]["trip_status"]
          updated_at: string
          vehicle_id: string
          vehicle_reg_number: string
        }
        Insert: {
          created_at?: string
          distance?: number | null
          driver_id?: string | null
          driver_name: string
          end_location: string
          end_mileage?: number | null
          end_time?: string | null
          fuel_cost?: number | null
          fuel_used?: number | null
          id?: string
          notes?: string | null
          organization_id: string
          purpose: Database["public"]["Enums"]["trip_purpose"]
          start_location: string
          start_mileage: number
          start_time: string
          status?: Database["public"]["Enums"]["trip_status"]
          updated_at?: string
          vehicle_id: string
          vehicle_reg_number: string
        }
        Update: {
          created_at?: string
          distance?: number | null
          driver_id?: string | null
          driver_name?: string
          end_location?: string
          end_mileage?: number | null
          end_time?: string | null
          fuel_cost?: number | null
          fuel_used?: number | null
          id?: string
          notes?: string | null
          organization_id?: string
          purpose?: Database["public"]["Enums"]["trip_purpose"]
          start_location?: string
          start_mileage?: number
          start_time?: string
          status?: Database["public"]["Enums"]["trip_status"]
          updated_at?: string
          vehicle_id?: string
          vehicle_reg_number?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_records_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_records_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_records_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          created_at: string
          driver: string | null
          fuel_level: number | null
          id: string
          insurance: string | null
          make: string
          model: string
          next_service: string | null
          organization_id: string
          reg_number: string
          status: Database["public"]["Enums"]["vehicle_status"]
          updated_at: string
          year: number
        }
        Insert: {
          created_at?: string
          driver?: string | null
          fuel_level?: number | null
          id?: string
          insurance?: string | null
          make: string
          model: string
          next_service?: string | null
          organization_id: string
          reg_number: string
          status?: Database["public"]["Enums"]["vehicle_status"]
          updated_at?: string
          year: number
        }
        Update: {
          created_at?: string
          driver?: string | null
          fuel_level?: number | null
          id?: string
          insurance?: string | null
          make?: string
          model?: string
          next_service?: string | null
          organization_id?: string
          reg_number?: string
          status?: Database["public"]["Enums"]["vehicle_status"]
          updated_at?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_organization_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["app_role"]
      }
      is_organization_owner: {
        Args: { org_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "fleet_admin" | "fleet_manager" | "driver" | "viewer"
      driver_performance: "excellent" | "good" | "average" | "poor"
      driver_status: "active" | "inactive"
      maintenance_status:
        | "scheduled"
        | "in_progress"
        | "completed"
        | "cancelled"
      maintenance_type:
        | "routine"
        | "repair"
        | "inspection"
        | "oil_change"
        | "tire_change"
        | "other"
      subscription_status: "active" | "inactive" | "trial" | "cancelled"
      subscription_tier: "free" | "basic" | "premium" | "enterprise"
      trip_purpose:
        | "business"
        | "personal"
        | "maintenance"
        | "delivery"
        | "other"
      trip_status: "ongoing" | "completed" | "cancelled"
      vehicle_status: "active" | "maintenance" | "idle" | "issue"
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
      app_role: ["fleet_admin", "fleet_manager", "driver", "viewer"],
      driver_performance: ["excellent", "good", "average", "poor"],
      driver_status: ["active", "inactive"],
      maintenance_status: [
        "scheduled",
        "in_progress",
        "completed",
        "cancelled",
      ],
      maintenance_type: [
        "routine",
        "repair",
        "inspection",
        "oil_change",
        "tire_change",
        "other",
      ],
      subscription_status: ["active", "inactive", "trial", "cancelled"],
      subscription_tier: ["free", "basic", "premium", "enterprise"],
      trip_purpose: [
        "business",
        "personal",
        "maintenance",
        "delivery",
        "other",
      ],
      trip_status: ["ongoing", "completed", "cancelled"],
      vehicle_status: ["active", "maintenance", "idle", "issue"],
    },
  },
} as const
