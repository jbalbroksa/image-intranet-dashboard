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
      branches: {
        Row: {
          address: string
          city: string
          contact_person: string
          created_at: string
          email: string
          id: string
          name: string
          phone: string | null
          postal_code: string
          province: string
          website: string | null
        }
        Insert: {
          address: string
          city: string
          contact_person: string
          created_at?: string
          email: string
          id?: string
          name: string
          phone?: string | null
          postal_code: string
          province: string
          website?: string | null
        }
        Update: {
          address?: string
          city?: string
          contact_person?: string
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string | null
          postal_code?: string
          province?: string
          website?: string | null
        }
        Relationships: []
      }
      calendar_events: {
        Row: {
          category: string
          description: string | null
          end_date: string
          id: string
          location: string | null
          start_date: string
          title: string
          user_id: string
        }
        Insert: {
          category: string
          description?: string | null
          end_date: string
          id?: string
          location?: string | null
          start_date: string
          title: string
          user_id: string
        }
        Update: {
          category?: string
          description?: string | null
          end_date?: string
          id?: string
          location?: string | null
          start_date?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "calendar_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          agent_access_url: string | null
          classification: string | null
          contact_email: string | null
          created_at: string
          id: string
          last_updated: string
          logo: string | null
          name: string
          website: string | null
        }
        Insert: {
          agent_access_url?: string | null
          classification?: string | null
          contact_email?: string | null
          created_at?: string
          id?: string
          last_updated?: string
          logo?: string | null
          name: string
          website?: string | null
        }
        Update: {
          agent_access_url?: string | null
          classification?: string | null
          contact_email?: string | null
          created_at?: string
          id?: string
          last_updated?: string
          logo?: string | null
          name?: string
          website?: string | null
        }
        Relationships: []
      }
      company_specifications: {
        Row: {
          category: string
          company_id: string
          content: string
          id: string
        }
        Insert: {
          category: string
          company_id: string
          content: string
          id?: string
        }
        Update: {
          category?: string
          company_id?: string
          content?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_specifications_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          category_id: string
          company_id: string | null
          description: string | null
          file_size: number
          file_type: string
          file_url: string
          id: string
          product_category_id: string | null
          product_id: string | null
          product_subcategory_id: string | null
          tags: Json | null
          title: string
          uploaded_at: string
          uploaded_by: string
        }
        Insert: {
          category_id: string
          company_id?: string | null
          description?: string | null
          file_size: number
          file_type: string
          file_url: string
          id?: string
          product_category_id?: string | null
          product_id?: string | null
          product_subcategory_id?: string | null
          tags?: Json | null
          title: string
          uploaded_at?: string
          uploaded_by: string
        }
        Update: {
          category_id?: string
          company_id?: string | null
          description?: string | null
          file_size?: number
          file_type?: string
          file_url?: string
          id?: string
          product_category_id?: string | null
          product_id?: string | null
          product_subcategory_id?: string | null
          tags?: Json | null
          title?: string
          uploaded_at?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      news: {
        Row: {
          author: string
          category: string
          company_id: string | null
          content: string
          cover_image: string | null
          excerpt: string | null
          featured: boolean | null
          id: string
          published_at: string
          tags: Json | null
          title: string
        }
        Insert: {
          author: string
          category: string
          company_id?: string | null
          content: string
          cover_image?: string | null
          excerpt?: string | null
          featured?: boolean | null
          id?: string
          published_at?: string
          tags?: Json | null
          title: string
        }
        Update: {
          author?: string
          category?: string
          company_id?: string | null
          content?: string
          cover_image?: string | null
          excerpt?: string | null
          featured?: boolean | null
          id?: string
          published_at?: string
          tags?: Json | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "news_author_fkey"
            columns: ["author"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "news_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          link: string | null
          message: string
          read: boolean | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          link?: string | null
          message: string
          read?: boolean | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          link?: string | null
          message?: string
          read?: boolean | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      product_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          parent_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          parent_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          parent_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          author: string
          category_id: string
          company_id: string
          created_at: string | null
          description: string | null
          id: string
          name: string
          processes: string | null
          status: string
          strengths: string | null
          subcategory_id: string | null
          tags: string[] | null
          updated_at: string | null
          weaknesses: string | null
        }
        Insert: {
          author: string
          category_id: string
          company_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          processes?: string | null
          status: string
          strengths?: string | null
          subcategory_id?: string | null
          tags?: string[] | null
          updated_at?: string | null
          weaknesses?: string | null
        }
        Update: {
          author?: string
          category_id?: string
          company_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          processes?: string | null
          status?: string
          strengths?: string | null
          subcategory_id?: string | null
          tags?: string[] | null
          updated_at?: string | null
          weaknesses?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar: string | null
          branch_id: string | null
          created_at: string
          email: string
          extension: string | null
          id: string
          name: string
          position: string | null
          role: string
          social_contact: string | null
          type: string
        }
        Insert: {
          avatar?: string | null
          branch_id?: string | null
          created_at?: string
          email: string
          extension?: string | null
          id?: string
          name: string
          position?: string | null
          role: string
          social_contact?: string | null
          type: string
        }
        Update: {
          avatar?: string | null
          branch_id?: string | null
          created_at?: string
          email?: string
          extension?: string | null
          id?: string
          name?: string
          position?: string | null
          role?: string
          social_contact?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
        ]
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
