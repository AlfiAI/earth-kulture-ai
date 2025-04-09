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
      ai_requests: {
        Row: {
          created_at: string | null
          error_message: string | null
          id: string
          manual_override: boolean | null
          metadata: Json | null
          model_requested: string | null
          model_used: string
          processing_time_ms: number | null
          prompt: string
          status: string
          tokens_used: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          manual_override?: boolean | null
          metadata?: Json | null
          model_requested?: string | null
          model_used: string
          processing_time_ms?: number | null
          prompt: string
          status: string
          tokens_used?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          manual_override?: boolean | null
          metadata?: Json | null
          model_requested?: string | null
          model_used?: string
          processing_time_ms?: number | null
          prompt?: string
          status?: string
          tokens_used?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      carbon_data: {
        Row: {
          emissions: number
          id: string
          reported_at: string | null
          scope: number
          source: string
          unit: string | null
          user_id: string | null
        }
        Insert: {
          emissions: number
          id?: string
          reported_at?: string | null
          scope: number
          source: string
          unit?: string | null
          user_id?: string | null
        }
        Update: {
          emissions?: number
          id?: string
          reported_at?: string | null
          scope?: number
          source?: string
          unit?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "carbon_data_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
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
      compliance_status_2024: {
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
        Relationships: []
      }
      compliance_status_2025: {
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
        Relationships: []
      }
      compliance_status_2026: {
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
        Relationships: []
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
      esg_benchmark_results: {
        Row: {
          benchmark_date: string
          category: string
          comparison_details: Json | null
          id: string
          industry_average: number
          percentile: number | null
          recommendations: Json | null
          score: number
          trend: string | null
          user_id: string
        }
        Insert: {
          benchmark_date?: string
          category: string
          comparison_details?: Json | null
          id?: string
          industry_average: number
          percentile?: number | null
          recommendations?: Json | null
          score: number
          trend?: string | null
          user_id: string
        }
        Update: {
          benchmark_date?: string
          category?: string
          comparison_details?: Json | null
          id?: string
          industry_average?: number
          percentile?: number | null
          recommendations?: Json | null
          score?: number
          trend?: string | null
          user_id?: string
        }
        Relationships: []
      }
      esg_benchmarks: {
        Row: {
          benchmark_name: string
          benchmark_value: number | null
          category: string
          created_at: string | null
          id: string
          industry: string
          region: string | null
          source: string
          unit: string | null
          year: number | null
        }
        Insert: {
          benchmark_name: string
          benchmark_value?: number | null
          category: string
          created_at?: string | null
          id?: string
          industry: string
          region?: string | null
          source: string
          unit?: string | null
          year?: number | null
        }
        Update: {
          benchmark_name?: string
          benchmark_value?: number | null
          category?: string
          created_at?: string | null
          id?: string
          industry?: string
          region?: string | null
          source?: string
          unit?: string | null
          year?: number | null
        }
        Relationships: []
      }
      esg_competitors: {
        Row: {
          company_name: string
          created_at: string | null
          environmental_score: number | null
          esg_score: number | null
          governance_score: number | null
          highlights: string[] | null
          id: string
          industry: string
          last_updated: string | null
          report_url: string | null
          report_year: number | null
          social_score: number | null
        }
        Insert: {
          company_name: string
          created_at?: string | null
          environmental_score?: number | null
          esg_score?: number | null
          governance_score?: number | null
          highlights?: string[] | null
          id?: string
          industry: string
          last_updated?: string | null
          report_url?: string | null
          report_year?: number | null
          social_score?: number | null
        }
        Update: {
          company_name?: string
          created_at?: string | null
          environmental_score?: number | null
          esg_score?: number | null
          governance_score?: number | null
          highlights?: string[] | null
          id?: string
          industry?: string
          last_updated?: string | null
          report_url?: string | null
          report_year?: number | null
          social_score?: number | null
        }
        Relationships: []
      }
      esg_compliance_alerts: {
        Row: {
          alert_type: string
          compliance_framework: string | null
          created_at: string
          id: string
          message: string
          resolution_steps: Json | null
          resolved_at: string | null
          severity: string
          source_data: Json | null
          status: string
          user_id: string
        }
        Insert: {
          alert_type: string
          compliance_framework?: string | null
          created_at?: string
          id?: string
          message: string
          resolution_steps?: Json | null
          resolved_at?: string | null
          severity: string
          source_data?: Json | null
          status?: string
          user_id: string
        }
        Update: {
          alert_type?: string
          compliance_framework?: string | null
          created_at?: string
          id?: string
          message?: string
          resolution_steps?: Json | null
          resolved_at?: string | null
          severity?: string
          source_data?: Json | null
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
      esg_intelligence_cache: {
        Row: {
          cached_at: string
          category: string
          expires_at: string
          id: string
          industries: string[]
          publish_date: string
          regions: string[]
          relevance_score: number
          source: string
          source_url: string | null
          summary: string
          title: string
          topics: string[]
        }
        Insert: {
          cached_at?: string
          category: string
          expires_at?: string
          id?: string
          industries: string[]
          publish_date: string
          regions: string[]
          relevance_score: number
          source: string
          source_url?: string | null
          summary: string
          title: string
          topics: string[]
        }
        Update: {
          cached_at?: string
          category?: string
          expires_at?: string
          id?: string
          industries?: string[]
          publish_date?: string
          regions?: string[]
          relevance_score?: number
          source?: string
          source_url?: string | null
          summary?: string
          title?: string
          topics?: string[]
        }
        Relationships: []
      }
      esg_regulatory_updates: {
        Row: {
          category: string
          content: string
          country: string | null
          id: string
          impact_level: string | null
          published_date: string | null
          relevance_score: number | null
          scraped_at: string | null
          source: string
          tags: string[] | null
          title: string
          url: string
        }
        Insert: {
          category: string
          content: string
          country?: string | null
          id?: string
          impact_level?: string | null
          published_date?: string | null
          relevance_score?: number | null
          scraped_at?: string | null
          source: string
          tags?: string[] | null
          title: string
          url: string
        }
        Update: {
          category?: string
          content?: string
          country?: string | null
          id?: string
          impact_level?: string | null
          published_date?: string | null
          relevance_score?: number | null
          scraped_at?: string | null
          source?: string
          tags?: string[] | null
          title?: string
          url?: string
        }
        Relationships: []
      }
      esg_risk_predictions: {
        Row: {
          confidence_level: number
          id: string
          is_critical: boolean
          model_version: string
          notification_sent: boolean
          prediction_date: string
          prediction_details: Json
          risk_category: string
          risk_score: number
          training_data_range: Json | null
          user_id: string
        }
        Insert: {
          confidence_level: number
          id?: string
          is_critical?: boolean
          model_version: string
          notification_sent?: boolean
          prediction_date?: string
          prediction_details: Json
          risk_category: string
          risk_score: number
          training_data_range?: Json | null
          user_id: string
        }
        Update: {
          confidence_level?: number
          id?: string
          is_critical?: boolean
          model_version?: string
          notification_sent?: boolean
          prediction_date?: string
          prediction_details?: Json
          risk_category?: string
          risk_score?: number
          training_data_range?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      external_esg_datasets: {
        Row: {
          category: string
          data: Json
          dataset_description: string | null
          dataset_name: string
          id: string
          last_updated: string | null
          metrics: string[] | null
          next_update: string | null
          source: string
        }
        Insert: {
          category: string
          data: Json
          dataset_description?: string | null
          dataset_name: string
          id?: string
          last_updated?: string | null
          metrics?: string[] | null
          next_update?: string | null
          source: string
        }
        Update: {
          category?: string
          data?: Json
          dataset_description?: string | null
          dataset_name?: string
          id?: string
          last_updated?: string | null
          metrics?: string[] | null
          next_update?: string | null
          source?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company: string | null
          created_at: string | null
          dashboard_preference: string | null
          data_visualization_preference: string | null
          full_name: string | null
          id: string
          industry: string | null
          report_frequency: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string | null
          dashboard_preference?: string | null
          data_visualization_preference?: string | null
          full_name?: string | null
          id: string
          industry?: string | null
          report_frequency?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string | null
          dashboard_preference?: string | null
          data_visualization_preference?: string | null
          full_name?: string | null
          id?: string
          industry?: string | null
          report_frequency?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      reports: {
        Row: {
          ai_generated: boolean | null
          created_at: string | null
          file_url: string | null
          id: string
          report_type: string | null
          user_id: string | null
        }
        Insert: {
          ai_generated?: boolean | null
          created_at?: string | null
          file_url?: string | null
          id?: string
          report_type?: string | null
          user_id?: string | null
        }
        Update: {
          ai_generated?: boolean | null
          created_at?: string | null
          file_url?: string | null
          id?: string
          report_type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reports_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          expires_at: string | null
          id: string
          plan: string | null
          started_at: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          expires_at?: string | null
          id?: string
          plan?: string | null
          started_at?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          expires_at?: string | null
          id?: string
          plan?: string | null
          started_at?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          role: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name?: string | null
          id?: string
          role?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          role?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      carbon_emissions_summary: {
        Row: {
          month: string | null
          scope: string | null
          total_emissions: number | null
          user_id: string | null
        }
        Relationships: []
      }
      esg_analytics_summary: {
        Row: {
          average_value: number | null
          category: string | null
          data_points: number | null
          month: string | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      create_compliance_partition_tables: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      prune_esg_intelligence_cache: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      refresh_materialized_views: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
