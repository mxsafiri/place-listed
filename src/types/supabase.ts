import { Database as SupabaseDatabase } from '@supabase/supabase-js';

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          display_name: string | null;
          business_name: string | null;
          role: string;
          created_at: string;
          updated_at: string;
          subscription: string | null;
          verified: boolean;
        };
        Insert: {
          id: string;
          email: string;
          display_name?: string | null;
          business_name?: string | null;
          role?: string;
          created_at?: string;
          updated_at?: string;
          subscription?: string | null;
          verified?: boolean;
        };
        Update: {
          id?: string;
          email?: string;
          display_name?: string | null;
          business_name?: string | null;
          role?: string;
          created_at?: string;
          updated_at?: string;
          subscription?: string | null;
          verified?: boolean;
        };
      };
      wallet_users: {
        Row: {
          id: string;
          wallet_address: string;
          display_name: string;
          email: string | null;
          bio: string | null;
          avatar_url: string | null;
          role: string;
          verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          wallet_address: string;
          display_name: string;
          email?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          role?: string;
          verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          wallet_address?: string;
          display_name?: string;
          email?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          role?: string;
          verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      businesses: {
        Row: {
          id: string;
          name: string;
          description: string;
          address: string;
          city: string;
          state: string;
          zip: string;
          phone: string;
          website: string | null;
          email: string | null;
          logo_url: string | null;
          owner: string;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          // Define insert type
        };
        Update: {
          // Define update type
        };
      };
      reviews: {
        Row: {
          // Define row type
        };
        Insert: {
          // Define insert type
        };
        Update: {
          // Define update type
        };
      };
      saved_businesses: {
        Row: {
          // Define row type
        };
        Insert: {
          // Define insert type
        };
        Update: {
          // Define update type
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
};

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];
