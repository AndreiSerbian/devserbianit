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
      analytics_events: {
        Row: {
          case_id: string | null
          consent_decision_id: string | null
          consent_id: string | null
          created_at: string
          event_name: string
          id: string
          locale: string | null
          page: string | null
          session_id: string | null
        }
        Insert: {
          case_id?: string | null
          consent_decision_id?: string | null
          consent_id?: string | null
          created_at?: string
          event_name: string
          id?: string
          locale?: string | null
          page?: string | null
          session_id?: string | null
        }
        Update: {
          case_id?: string | null
          consent_decision_id?: string | null
          consent_id?: string | null
          created_at?: string
          event_name?: string
          id?: string
          locale?: string | null
          page?: string | null
          session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_events_consent_decision_id_fkey"
            columns: ["consent_decision_id"]
            isOneToOne: false
            referencedRelation: "consent_decisions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analytics_events_consent_id_fkey"
            columns: ["consent_id"]
            isOneToOne: false
            referencedRelation: "consent_receipts"
            referencedColumns: ["consent_id"]
          },
        ]
      }
      consent_decisions: {
        Row: {
          analytics_allowed: boolean
          consent_id: string
          decided_at: string
          decision_seq: number
          id: string
          policy_version: string
          preferences_allowed: boolean
        }
        Insert: {
          analytics_allowed: boolean
          consent_id: string
          decided_at?: string
          decision_seq?: never
          id?: string
          policy_version: string
          preferences_allowed: boolean
        }
        Update: {
          analytics_allowed?: boolean
          consent_id?: string
          decided_at?: string
          decision_seq?: never
          id?: string
          policy_version?: string
          preferences_allowed?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "consent_decisions_consent_id_fkey"
            columns: ["consent_id"]
            isOneToOne: false
            referencedRelation: "consent_receipts"
            referencedColumns: ["consent_id"]
          },
        ]
      }
      consent_receipts: {
        Row: {
          consent_id: string
          created_at: string
        }
        Insert: {
          consent_id?: string
          created_at?: string
        }
        Update: {
          consent_id?: string
          created_at?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          budget_and_timeline: string | null
          contact_value: string
          created_at: string
          email_delivery_status: string
          id: string
          locale: string
          name: string
          overall_status: string
          page_url: string | null
          preferred_contact_method: string
          request: string
          telegram_delivery_status: string
          updated_at: string
        }
        Insert: {
          budget_and_timeline?: string | null
          contact_value: string
          created_at?: string
          email_delivery_status?: string
          id?: string
          locale?: string
          name: string
          overall_status?: string
          page_url?: string | null
          preferred_contact_method: string
          request: string
          telegram_delivery_status?: string
          updated_at?: string
        }
        Update: {
          budget_and_timeline?: string | null
          contact_value?: string
          created_at?: string
          email_delivery_status?: string
          id?: string
          locale?: string
          name?: string
          overall_status?: string
          page_url?: string | null
          preferred_contact_method?: string
          request?: string
          telegram_delivery_status?: string
          updated_at?: string
        }
        Relationships: []
      }
      rate_limit_hits: {
        Row: {
          created_at: string
          id: number
          ip_hmac: string
          scope: string
        }
        Insert: {
          created_at?: string
          id?: number
          ip_hmac: string
          scope?: string
        }
        Update: {
          created_at?: string
          id?: number
          ip_hmac?: string
          scope?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_rate_limit: {
        Args: {
          p_ip_hmac: string
          p_max_hits?: number
          p_scope?: string
          p_window_seconds?: number
        }
        Returns: {
          allowed: boolean
          retry_after: number
        }[]
      }
      consent_policy_version: { Args: never; Returns: string }
      consent_status: {
        Args: { p_consent_id: string }
        Returns: {
          analytics_allowed: boolean
          current_policy_version: string
          decided_at: string
          decision_id: string
          decision_seq: number
          policy_version: string
          preferences_allowed: boolean
        }[]
      }
      delete_expired_leads: { Args: { retain_months: number }; Returns: number }
      insert_analytics_event: {
        Args: {
          p_case_id: string
          p_consent_id: string
          p_event_name: string
          p_locale: string
          p_page: string
          p_session_id: string
        }
        Returns: boolean
      }
      purge_rate_limit_hits: { Args: never; Returns: number }
      record_consent_decision: {
        Args: {
          p_analytics_allowed: boolean
          p_consent_id: string
          p_preferences_allowed: boolean
        }
        Returns: {
          analytics_allowed: boolean
          consent_id: string
          decided_at: string
          decision_id: string
          decision_seq: number
          policy_version: string
          preferences_allowed: boolean
        }[]
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
