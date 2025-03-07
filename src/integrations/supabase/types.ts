export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      carbon_emissions: {
        Row: {
          amount: number
          created_at: string | null
          date: string
          id: string
          notes: string | null
          scope: string
          source: string
          unit: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          date: string
          id?: string
          notes?: string | null
          scope: string
          source: string
          unit?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          date?: string
          id?: string
          notes?: string | null
          scope?: string
          source?: string
          unit?: string
          user_id?: string
        }
        Relationships: []
      }
      compliance_frameworks: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: string
          name: string
          region: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          region?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          region?: string | null
        }
        Relationships: []
      }
      compliance_status: {
        Row: {
          created_at: string | null
          framework_id: string
          id: string
          notes: string | null
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          framework_id: string
          id?: string
          notes?: string | null
          status: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          framework_id?: string
          id?: string
          notes?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "compliance_status_framework_id_fkey"
            columns: ["framework_id"]
            isOneToOne: false
            referencedRelation: "compliance_frameworks"
            referencedColumns: ["id"]
          },
        ]
      }
      data_sources: {
        Row: {
          category: string
          created_at: string | null
          format: string
          id: string
          last_updated: string | null
          name: string
          record_count: number | null
          status: string
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string | null
          format: string
          id?: string
          last_updated?: string | null
          name: string
          record_count?: number | null
          status: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string | null
          format?: string
          id?: string
          last_updated?: string | null
          name?: string
          record_count?: number | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      esg_data: {
        Row: {
          category: string
          created_at: string | null
          data_source_id: string | null
          date: string | null
          id: string
          metric_name: string
          notes: string | null
          unit: string | null
          user_id: string
          value: number
        }
        Insert: {
          category: string
          created_at?: string | null
          data_source_id?: string | null
          date?: string | null
          id?: string
          metric_name: string
          notes?: string | null
          unit?: string | null
          user_id: string
          value: number
        }
        Update: {
          category?: string
          created_at?: string | null
          data_source_id?: string | null
          date?: string | null
          id?: string
          metric_name?: string
          notes?: string | null
          unit?: string | null
          user_id?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "esg_data_data_source_id_fkey"
            columns: ["data_source_id"]
            isOneToOne: false
            referencedRelation: "data_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company: string | null
          created_at: string | null
          full_name: string | null
          id: string
          role: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
