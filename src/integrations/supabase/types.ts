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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      app_records: {
        Row: {
          created_at: string
          id: string
          owner_id: string | null
          payload: Json
          record_id: string | null
          resource_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          owner_id?: string | null
          payload?: Json
          record_id?: string | null
          resource_type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          owner_id?: string | null
          payload?: Json
          record_id?: string | null
          resource_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          id: string
          metadata: Json
          resource_id: string | null
          resource_type: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json
          resource_id?: string | null
          resource_type?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json
          resource_id?: string | null
          resource_type?: string | null
        }
        Relationships: []
      }
      marketplace_product_analytics: {
        Row: {
          clicks: number | null
          day: string
          id: string
          product_id: string
          revenue: number | null
          sales: number | null
          views: number | null
        }
        Insert: {
          clicks?: number | null
          day?: string
          id?: string
          product_id: string
          revenue?: number | null
          sales?: number | null
          views?: number | null
        }
        Update: {
          clicks?: number | null
          day?: string
          id?: string
          product_id?: string
          revenue?: number | null
          sales?: number | null
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_product_analytics_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "marketplace_products"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_product_changelog: {
        Row: {
          change_type: string | null
          description: string | null
          entry_date: string | null
          id: string
          product_id: string
          title: string
        }
        Insert: {
          change_type?: string | null
          description?: string | null
          entry_date?: string | null
          id?: string
          product_id: string
          title: string
        }
        Update: {
          change_type?: string | null
          description?: string | null
          entry_date?: string | null
          id?: string
          product_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_product_changelog_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "marketplace_products"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_product_commission: {
        Row: {
          affiliate_pct: number | null
          franchise_pct: number | null
          franchise_price: number | null
          product_id: string
          reseller_pct: number | null
          reseller_price: number | null
          updated_at: string
          vendor_pct: number | null
          vendor_price: number | null
        }
        Insert: {
          affiliate_pct?: number | null
          franchise_pct?: number | null
          franchise_price?: number | null
          product_id: string
          reseller_pct?: number | null
          reseller_price?: number | null
          updated_at?: string
          vendor_pct?: number | null
          vendor_price?: number | null
        }
        Update: {
          affiliate_pct?: number | null
          franchise_pct?: number | null
          franchise_price?: number | null
          product_id?: string
          reseller_pct?: number | null
          reseller_price?: number | null
          updated_at?: string
          vendor_pct?: number | null
          vendor_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_product_commission_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: true
            referencedRelation: "marketplace_products"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_product_documentation: {
        Row: {
          content: string | null
          created_at: string
          id: string
          product_id: string
          sort_order: number | null
          title: string
          url: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          product_id: string
          sort_order?: number | null
          title: string
          url?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          product_id?: string
          sort_order?: number | null
          title?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_product_documentation_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "marketplace_products"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_product_downloads: {
        Row: {
          created_at: string
          file_size: number | null
          id: string
          label: string
          product_id: string
          url: string
          version: string | null
        }
        Insert: {
          created_at?: string
          file_size?: number | null
          id?: string
          label: string
          product_id: string
          url: string
          version?: string | null
        }
        Update: {
          created_at?: string
          file_size?: number | null
          id?: string
          label?: string
          product_id?: string
          url?: string
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_product_downloads_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "marketplace_products"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_product_features: {
        Row: {
          description: string | null
          icon: string | null
          id: string
          product_id: string
          sort_order: number | null
          title: string
        }
        Insert: {
          description?: string | null
          icon?: string | null
          id?: string
          product_id: string
          sort_order?: number | null
          title: string
        }
        Update: {
          description?: string | null
          icon?: string | null
          id?: string
          product_id?: string
          sort_order?: number | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_product_features_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "marketplace_products"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_product_hashtags: {
        Row: {
          created_at: string
          id: string
          kind: string
          product_id: string
          tag: string
        }
        Insert: {
          created_at?: string
          id?: string
          kind?: string
          product_id: string
          tag: string
        }
        Update: {
          created_at?: string
          id?: string
          kind?: string
          product_id?: string
          tag?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_product_hashtags_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "marketplace_products"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_product_modules: {
        Row: {
          description: string | null
          id: string
          name: string
          product_id: string
          sort_order: number | null
        }
        Insert: {
          description?: string | null
          id?: string
          name: string
          product_id: string
          sort_order?: number | null
        }
        Update: {
          description?: string | null
          id?: string
          name?: string
          product_id?: string
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_product_modules_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "marketplace_products"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_product_pricing_plans: {
        Row: {
          billing_period: string | null
          cost_price: number | null
          created_at: string
          features: Json | null
          id: string
          plan_name: string
          product_id: string
          selling_price: number | null
          sort_order: number | null
        }
        Insert: {
          billing_period?: string | null
          cost_price?: number | null
          created_at?: string
          features?: Json | null
          id?: string
          plan_name: string
          product_id: string
          selling_price?: number | null
          sort_order?: number | null
        }
        Update: {
          billing_period?: string | null
          cost_price?: number | null
          created_at?: string
          features?: Json | null
          id?: string
          plan_name?: string
          product_id?: string
          selling_price?: number | null
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_product_pricing_plans_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "marketplace_products"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_product_profit: {
        Row: {
          cost_price: number | null
          estimated_profit: number | null
          product_id: string
          profit_margin_pct: number | null
          selling_price: number | null
          updated_at: string
        }
        Insert: {
          cost_price?: number | null
          estimated_profit?: number | null
          product_id: string
          profit_margin_pct?: number | null
          selling_price?: number | null
          updated_at?: string
        }
        Update: {
          cost_price?: number | null
          estimated_profit?: number | null
          product_id?: string
          profit_margin_pct?: number | null
          selling_price?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_product_profit_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: true
            referencedRelation: "marketplace_products"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_product_related: {
        Row: {
          id: string
          product_id: string
          related_product_id: string
          relation_kind: string
        }
        Insert: {
          id?: string
          product_id: string
          related_product_id: string
          relation_kind?: string
        }
        Update: {
          id?: string
          product_id?: string
          related_product_id?: string
          relation_kind?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_product_related_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "marketplace_products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_product_related_related_product_id_fkey"
            columns: ["related_product_id"]
            isOneToOne: false
            referencedRelation: "marketplace_products"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_product_screenshots: {
        Row: {
          caption: string | null
          id: string
          product_id: string
          sort_order: number | null
          url: string
        }
        Insert: {
          caption?: string | null
          id?: string
          product_id: string
          sort_order?: number | null
          url: string
        }
        Update: {
          caption?: string | null
          id?: string
          product_id?: string
          sort_order?: number | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_product_screenshots_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "marketplace_products"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_product_seo: {
        Row: {
          breadcrumb_schema: Json | null
          canonical_url: string | null
          created_at: string
          focus_keywords: string[] | null
          index_status: string | null
          json_ld: Json | null
          meta_description: string | null
          meta_title: string | null
          og_description: string | null
          og_image: string | null
          og_title: string | null
          product_id: string
          robots_meta: string | null
          schema_software_app: Json | null
          secondary_keywords: string[] | null
          seo_slug: string | null
          seo_title: string | null
          sitemap_included: boolean | null
          twitter_card: string | null
          twitter_description: string | null
          twitter_title: string | null
          updated_at: string
        }
        Insert: {
          breadcrumb_schema?: Json | null
          canonical_url?: string | null
          created_at?: string
          focus_keywords?: string[] | null
          index_status?: string | null
          json_ld?: Json | null
          meta_description?: string | null
          meta_title?: string | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          product_id: string
          robots_meta?: string | null
          schema_software_app?: Json | null
          secondary_keywords?: string[] | null
          seo_slug?: string | null
          seo_title?: string | null
          sitemap_included?: boolean | null
          twitter_card?: string | null
          twitter_description?: string | null
          twitter_title?: string | null
          updated_at?: string
        }
        Update: {
          breadcrumb_schema?: Json | null
          canonical_url?: string | null
          created_at?: string
          focus_keywords?: string[] | null
          index_status?: string | null
          json_ld?: Json | null
          meta_description?: string | null
          meta_title?: string | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          product_id?: string
          robots_meta?: string | null
          schema_software_app?: Json | null
          secondary_keywords?: string[] | null
          seo_slug?: string | null
          seo_title?: string | null
          sitemap_included?: boolean | null
          twitter_card?: string | null
          twitter_description?: string | null
          twitter_title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_product_seo_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: true
            referencedRelation: "marketplace_products"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_product_technology: {
        Row: {
          category: string | null
          id: string
          name: string
          product_id: string
          version: string | null
        }
        Insert: {
          category?: string | null
          id?: string
          name: string
          product_id: string
          version?: string | null
        }
        Update: {
          category?: string | null
          id?: string
          name?: string
          product_id?: string
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_product_technology_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "marketplace_products"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_product_versions: {
        Row: {
          id: string
          is_current: boolean | null
          notes: string | null
          product_id: string
          released_at: string | null
          version: string
        }
        Insert: {
          id?: string
          is_current?: boolean | null
          notes?: string | null
          product_id: string
          released_at?: string | null
          version: string
        }
        Update: {
          id?: string
          is_current?: boolean | null
          notes?: string | null
          product_id?: string
          released_at?: string | null
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_product_versions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "marketplace_products"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_products: {
        Row: {
          attachments: Json | null
          banner_url: string | null
          business_category: string | null
          cost_price: number | null
          coupons: Json | null
          created_at: string
          created_by: string | null
          currency: string | null
          demo_url: string | null
          deployment: string | null
          description: string | null
          discount_rules: Json | null
          gallery: Json | null
          git_url: string | null
          icon_url: string | null
          id: string
          industry: string | null
          is_published: boolean
          license: string | null
          live_url: string | null
          metadata: Json | null
          name: string
          product_manager: string | null
          product_owner: string | null
          selling_price: number | null
          slug: string
          software_type: string | null
          status: string
          stock_available: boolean | null
          stock_quantity: number | null
          sub_category: string | null
          tagline: string | null
          target_audience: string | null
          thumbnail_url: string | null
          timeline_end: string | null
          timeline_start: string | null
          updated_at: string
          version: string | null
          videos: Json | null
        }
        Insert: {
          attachments?: Json | null
          banner_url?: string | null
          business_category?: string | null
          cost_price?: number | null
          coupons?: Json | null
          created_at?: string
          created_by?: string | null
          currency?: string | null
          demo_url?: string | null
          deployment?: string | null
          description?: string | null
          discount_rules?: Json | null
          gallery?: Json | null
          git_url?: string | null
          icon_url?: string | null
          id?: string
          industry?: string | null
          is_published?: boolean
          license?: string | null
          live_url?: string | null
          metadata?: Json | null
          name: string
          product_manager?: string | null
          product_owner?: string | null
          selling_price?: number | null
          slug: string
          software_type?: string | null
          status?: string
          stock_available?: boolean | null
          stock_quantity?: number | null
          sub_category?: string | null
          tagline?: string | null
          target_audience?: string | null
          thumbnail_url?: string | null
          timeline_end?: string | null
          timeline_start?: string | null
          updated_at?: string
          version?: string | null
          videos?: Json | null
        }
        Update: {
          attachments?: Json | null
          banner_url?: string | null
          business_category?: string | null
          cost_price?: number | null
          coupons?: Json | null
          created_at?: string
          created_by?: string | null
          currency?: string | null
          demo_url?: string | null
          deployment?: string | null
          description?: string | null
          discount_rules?: Json | null
          gallery?: Json | null
          git_url?: string | null
          icon_url?: string | null
          id?: string
          industry?: string | null
          is_published?: boolean
          license?: string | null
          live_url?: string | null
          metadata?: Json | null
          name?: string
          product_manager?: string | null
          product_owner?: string | null
          selling_price?: number | null
          slug?: string
          software_type?: string | null
          status?: string
          stock_available?: boolean | null
          stock_quantity?: number | null
          sub_category?: string | null
          tagline?: string | null
          target_audience?: string | null
          thumbnail_url?: string | null
          timeline_end?: string | null
          timeline_start?: string | null
          updated_at?: string
          version?: string | null
          videos?: Json | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          payload: Json
          seen: boolean
          title: string | null
          type: string | null
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          payload?: Json
          seen?: boolean
          title?: string | null
          type?: string | null
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          payload?: Json
          seen?: boolean
          title?: string | null
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      partner_commissions: {
        Row: {
          created_at: string
          currency: string
          effective_from: string
          id: string
          model: string
          partner_id: string
          rate_pct: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency?: string
          effective_from?: string
          id?: string
          model?: string
          partner_id: string
          rate_pct?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency?: string
          effective_from?: string
          id?: string
          model?: string
          partner_id?: string
          rate_pct?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_commissions_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partner_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_events: {
        Row: {
          created_at: string
          event_type: string
          id: string
          partner_id: string | null
          payload: Json
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          partner_id?: string | null
          payload?: Json
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          partner_id?: string | null
          payload?: Json
        }
        Relationships: [
          {
            foreignKeyName: "partner_events_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partner_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_members: {
        Row: {
          created_at: string
          id: string
          partner_id: string
          role: string
          status: Database["public"]["Enums"]["partner_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          partner_id: string
          role?: string
          status?: Database["public"]["Enums"]["partner_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          partner_id?: string
          role?: string
          status?: Database["public"]["Enums"]["partner_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_members_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partner_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_organizations: {
        Row: {
          contact_email: string | null
          created_at: string
          id: string
          metadata: Json
          name: string
          owner_user_id: string | null
          status: Database["public"]["Enums"]["partner_status"]
          tier: string | null
          type: Database["public"]["Enums"]["partner_type"]
          updated_at: string
        }
        Insert: {
          contact_email?: string | null
          created_at?: string
          id?: string
          metadata?: Json
          name: string
          owner_user_id?: string | null
          status?: Database["public"]["Enums"]["partner_status"]
          tier?: string | null
          type: Database["public"]["Enums"]["partner_type"]
          updated_at?: string
        }
        Update: {
          contact_email?: string | null
          created_at?: string
          id?: string
          metadata?: Json
          name?: string
          owner_user_id?: string | null
          status?: Database["public"]["Enums"]["partner_status"]
          tier?: string | null
          type?: Database["public"]["Enums"]["partner_type"]
          updated_at?: string
        }
        Relationships: []
      }
      partner_payouts: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          partner_id: string
          period_end: string | null
          period_start: string | null
          status: string
          updated_at: string
        }
        Insert: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          partner_id: string
          period_end?: string | null
          period_start?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          partner_id?: string
          period_end?: string | null
          period_start?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_payouts_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partner_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          active_role: Database["public"]["Enums"]["app_role"] | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          active_role?: Database["public"]["Enums"]["app_role"] | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          active_role?: Database["public"]["Enums"]["app_role"] | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
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
      app_role:
        | "admin"
        | "moderator"
        | "user"
        | "author"
        | "vendor"
        | "reseller"
        | "affiliate"
        | "influencer"
        | "franchise"
        | "seo"
      partner_status: "pending" | "active" | "suspended" | "terminated"
      partner_type:
        | "vendor"
        | "reseller"
        | "affiliate"
        | "franchise"
        | "influencer"
        | "partner"
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
      app_role: [
        "admin",
        "moderator",
        "user",
        "author",
        "vendor",
        "reseller",
        "affiliate",
        "influencer",
        "franchise",
        "seo",
      ],
      partner_status: ["pending", "active", "suspended", "terminated"],
      partner_type: [
        "vendor",
        "reseller",
        "affiliate",
        "franchise",
        "influencer",
        "partner",
      ],
    },
  },
} as const
