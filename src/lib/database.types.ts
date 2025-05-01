/**
 * This file contains TypeScript type definitions for your Supabase database.
 * 
 * NOTE: This is a placeholder. In a production environment, you would:
 * 1. Generate these types automatically using the Supabase CLI
 * 2. Run: npx supabase gen types typescript --project-id your-project-id > src/lib/database.types.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          display_name: string | null
          business_name: string | null
          role: string
          created_at: string
          updated_at: string
          subscription: string | null
          verified: boolean
        }
        Insert: {
          id: string
          email: string
          display_name?: string | null
          business_name?: string | null
          role: string
          created_at?: string
          updated_at?: string
          subscription?: string | null
          verified?: boolean
        }
        Update: {
          id?: string
          email?: string
          display_name?: string | null
          business_name?: string | null
          role?: string
          created_at?: string
          updated_at?: string
          subscription?: string | null
          verified?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      businesses: {
        Row: {
          id: string
          owner_id: string
          name: string
          slug: string
          description: string | null
          category: string
          subcategory: string | null
          address: Json
          contact: Json | null
          business_hours: Json | null
          photos: Json | null
          amenities: string[] | null
          tags: string[] | null
          created_at: string
          updated_at: string
          status: string
          views: number | null
          average_rating: number | null
          review_count: number | null
          featured: boolean | null
        }
        Insert: {
          id?: string
          owner_id: string
          name: string
          slug: string
          description?: string | null
          category: string
          subcategory?: string | null
          address: Json
          contact?: Json | null
          business_hours?: Json | null
          photos?: Json | null
          amenities?: string[] | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string
          status?: string
          views?: number | null
          average_rating?: number | null
          review_count?: number | null
          featured?: boolean | null
        }
        Update: {
          id?: string
          owner_id?: string
          name?: string
          slug?: string
          description?: string | null
          category?: string
          subcategory?: string | null
          address?: Json
          contact?: Json | null
          business_hours?: Json | null
          photos?: Json | null
          amenities?: string[] | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string
          status?: string
          views?: number | null
          average_rating?: number | null
          review_count?: number | null
          featured?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "businesses_owner_id_fkey"
            columns: ["owner_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      reviews: {
        Row: {
          id: string
          business_id: string
          user_id: string
          rating: number
          comment: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          user_id: string
          rating: number
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_id?: string
          user_id?: string
          rating?: number
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_business_id_fkey"
            columns: ["business_id"]
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      saved_businesses: {
        Row: {
          id: string
          user_id: string
          business_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          business_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          business_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_businesses_business_id_fkey"
            columns: ["business_id"]
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_businesses_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_profile_for_user: {
        Args: {
          user_id: string
          user_email: string
          user_display_name: string
          user_business_name: string
        }
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
