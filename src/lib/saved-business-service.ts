'use client';

import { supabase, handleSupabaseError } from './supabase';
import { Business } from './business-service';

export interface SavedBusiness {
  id?: string;
  user_id: string;
  business_id: string;
  created_at?: string;
  business?: Business;
}

export const savedBusinessService = {
  // Save a business
  async saveBusiness(userId: string, businessId: string): Promise<SavedBusiness> {
    try {
      const { data, error } = await supabase
        .from('saved_businesses')
        .insert({
          user_id: userId,
          business_id: businessId,
          created_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw handleSupabaseError(error);
      return data;
    } catch (error) {
      console.error('Error saving business:', error);
      throw error;
    }
  },
  
  // Unsave a business
  async unsaveBusiness(userId: string, businessId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('saved_businesses')
        .delete()
        .match({ user_id: userId, business_id: businessId });
      
      if (error) throw handleSupabaseError(error);
    } catch (error) {
      console.error('Error unsaving business:', error);
      throw error;
    }
  },
  
  // Check if a business is saved by a user
  async isBusinessSaved(userId: string, businessId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('saved_businesses')
        .select('id')
        .match({ user_id: userId, business_id: businessId })
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') return false; // Not found
        throw handleSupabaseError(error);
      }
      
      return !!data;
    } catch (error) {
      console.error('Error checking if business is saved:', error);
      throw error;
    }
  },
  
  // Get all saved businesses for a user
  async getSavedBusinesses(userId: string): Promise<SavedBusiness[]> {
    try {
      const { data, error } = await supabase
        .from('saved_businesses')
        .select(`
          *,
          business:businesses(*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw handleSupabaseError(error);
      
      return data.map(item => ({
        ...item,
        business: item.business as unknown as Business
      }));
    } catch (error) {
      console.error('Error getting saved businesses:', error);
      throw error;
    }
  }
};
