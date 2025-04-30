'use client';

import { supabase, handleSupabaseError } from './supabase';
import { User } from '@supabase/supabase-js';

export type UserRole = 'customer' | 'business_owner' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  display_name: string | null;
  business_name: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
  subscription: string | null;
  verified: boolean;
}

export const authService = {
  // Register a business owner
  async registerBusinessOwner(
    email: string,
    password: string,
    displayName: string,
    businessName: string
  ): Promise<User | null> {
    try {
      // Register with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
            role: 'business_owner'
          }
        }
      });

      if (authError) throw handleSupabaseError(authError);

      // Create profile
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            email,
            display_name: displayName,
            business_name: businessName,
            role: 'business_owner',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            subscription: 'free',
            verified: false
          });

        if (profileError) throw handleSupabaseError(profileError);
      }

      return authData.user;
    } catch (error) {
      console.error('Error registering business owner:', error);
      throw error;
    }
  },

  // Login
  async login(email: string, password: string): Promise<User | null> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw handleSupabaseError(error);
      return data.user;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },

  // Logout
  async logout(): Promise<{ success: boolean }> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw handleSupabaseError(error);
      return { success: true };
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  },

  // Reset password
  async resetPassword(email: string): Promise<{ success: boolean }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      
      if (error) throw handleSupabaseError(error);
      return { success: true };
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  },

  // Get user profile
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw handleSupabaseError(error);
      return data as UserProfile;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  },

  // Update user profile
  async updateUserProfile(userId: string, profileData: Partial<UserProfile>): Promise<{ success: boolean, [key: string]: any }> {
    try {
      // Ensure we're not updating sensitive fields
      const safeProfileData = {
        ...profileData,
        updated_at: new Date().toISOString(),
      };
      
      // Remove fields that shouldn't be updated directly
      delete safeProfileData.id;
      delete safeProfileData.email;
      delete safeProfileData.created_at;
      delete safeProfileData.role; // Don't allow role changes through this method
      
      const { error } = await supabase
        .from('profiles')
        .update(safeProfileData)
        .eq('id', userId);

      if (error) throw handleSupabaseError(error);
      
      return { success: true, ...safeProfileData };
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },
  
  // Get current session
  async getSession() {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw handleSupabaseError(error);
      return data.session;
    } catch (error) {
      console.error('Error getting session:', error);
      throw error;
    }
  },
  
  // Get current user
  async getCurrentUser() {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw handleSupabaseError(error);
      return data.user;
    } catch (error) {
      console.error('Error getting current user:', error);
      throw error;
    }
  }
};
