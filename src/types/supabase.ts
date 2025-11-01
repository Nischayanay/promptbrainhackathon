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
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      analytics: {
        Row: {
          avg_latency: number | null
          created_at: string
          date: string
          framework_usage_stats: Json | null
          id: string
          success_rate: number | null
          updated_at: string
        }
        Insert: {
          avg_latency?: number | null
          created_at?: string
          date?: string
          framework_usage_stats?: Json | null
          id?: string
          success_rate?: number | null
          updated_at?: string
        }
        Update: {
          avg_latency?: number | null
          created_at?: string
          date?: string
          framework_usage_stats?: Json | null
          id?: string
          success_rate?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      kv_store_08c24b4c: {
        Row: {
          key: string
          value: Json
        }
        Insert: {
          key: string
          value: Json
        }
        Update: {
          key?: string
          value?: Json
        }
        Relationships: []
      }
      prompt_logs: {
        Row: {
          created_at: string
          id: string
          input_text: string
          output_text: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          input_text: string
          output_text: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          input_text?: string
          output_text?: string
          user_id?: string
        }
        Relationships: []
      }
      prompts: {
        Row: {
          created_at: string
          domain_classified: string | null
          enhanced_prompt: string
          enhancement_type: string
          framework_used: string | null
          id: string
          input_type: string | null
          is_favorite: boolean | null
          metadata: Json | null
          mode: string | null
          original_prompt: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          domain_classified?: string | null
          enhanced_prompt: string
          enhancement_type?: string
          framework_used?: string | null
          id?: string
          input_type?: string | null
          is_favorite?: boolean | null
          metadata?: Json | null
          mode?: string | null
          original_prompt: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          domain_classified?: string | null
          enhanced_prompt?: string
          enhancement_type?: string
          framework_used?: string | null
          id?: string
          input_type?: string | null
          is_favorite?: boolean | null
          metadata?: Json | null
          mode?: string | null
          original_prompt?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_credits: {
        Row: {
          balance: number
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      credits_log: {
        Row: {
          action: string
          amount: number
          balance_after: number
          created_at: string
          id: string
          prompt_id: string | null
          reason: string | null
          user_id: string
        }
        Insert: {
          action: string
          amount: number
          balance_after: number
          created_at?: string
          id?: string
          prompt_id?: string | null
          reason?: string | null
          user_id: string
        }
        Update: {
          action?: string
          amount?: number
          balance_after?: number
          created_at?: string
          id?: string
          prompt_id?: string | null
          reason?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          plan_type: string
          preferences: Json | null
          timezone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          plan_type?: string
          preferences?: Json | null
          timezone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          plan_type?: string
          preferences?: Json | null
          timezone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          created_at: string
          id: string
          plan_type: string
          timezone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          plan_type?: string
          timezone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          plan_type?: string
          timezone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_credits: {
        Args: {
          p_user_id: string
          p_amount: number
          p_reason?: string
        }
        Returns: Json
      }
      get_user_balance: {
        Args: { p_user_id: string }
        Returns: Json
      }
      spend_credits: {
        Args: {
          p_user_id: string
          p_prompt_id?: string
          p_amount?: number
          p_reason?: string
        }
        Returns: Json
      }
      get_user_profile_with_credits: {
        Args: { p_user_id: string }
        Returns: Json
      }
      update_user_profile: {
        Args: {
          p_user_id: string
          p_full_name?: string
          p_timezone?: string
          p_preferences?: Json
        }
        Returns: Json
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
    Enums: {},
  },
} as const
