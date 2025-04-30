'use client';

import { supabase, handleSupabaseError } from './supabase';
import { Business } from './business-service';

export interface BusinessClaim {
  id?: string;
  business_id: string;
  user_id: string;
  status: 'pending' | 'approved' | 'rejected';
  evidence: string | null;
  created_at?: string;
  updated_at?: string;
  business?: Business;
}

export const businessClaimService = {
  // Create a business claim
  async createClaim(
    userId: string, 
    businessId: string, 
    evidence: string | null = null
  ): Promise<BusinessClaim> {
    try {
      const { data, error } = await supabase
        .from('business_claims')
        .insert({
          business_id: businessId,
          user_id: userId,
          status: 'pending',
          evidence,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw handleSupabaseError(error);
      return data;
    } catch (error) {
      console.error('Error creating business claim:', error);
      throw error;
    }
  },
  
  // Get a specific claim
  async getClaim(claimId: string): Promise<BusinessClaim | null> {
    try {
      const { data, error } = await supabase
        .from('business_claims')
        .select(`
          *,
          business:businesses(*)
        `)
        .eq('id', claimId)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw handleSupabaseError(error);
      }
      
      return {
        ...data,
        business: data.business as unknown as Business
      };
    } catch (error) {
      console.error('Error getting claim:', error);
      throw error;
    }
  },
  
  // Get claims by user
  async getUserClaims(userId: string): Promise<BusinessClaim[]> {
    try {
      const { data, error } = await supabase
        .from('business_claims')
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
      console.error('Error getting user claims:', error);
      throw error;
    }
  },
  
  // Get claims for a business
  async getBusinessClaims(businessId: string): Promise<BusinessClaim[]> {
    try {
      const { data, error } = await supabase
        .from('business_claims')
        .select(`
          *,
          profiles:user_id(
            id,
            email,
            display_name,
            business_name
          )
        `)
        .eq('business_id', businessId)
        .order('created_at', { ascending: false });
      
      if (error) throw handleSupabaseError(error);
      
      return data;
    } catch (error) {
      console.error('Error getting business claims:', error);
      throw error;
    }
  },
  
  // Update claim status (admin only)
  async updateClaimStatus(
    claimId: string, 
    status: 'approved' | 'rejected'
  ): Promise<BusinessClaim> {
    try {
      const { data, error } = await supabase
        .from('business_claims')
        .update({
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', claimId)
        .select()
        .single();
      
      if (error) throw handleSupabaseError(error);
      
      // If approved, update business owner
      if (status === 'approved') {
        const claim = await this.getClaim(claimId);
        if (claim) {
          await supabase
            .from('businesses')
            .update({
              owner_id: claim.user_id,
              updated_at: new Date().toISOString()
            })
            .eq('id', claim.business_id);
        }
      }
      
      return data;
    } catch (error) {
      console.error('Error updating claim status:', error);
      throw error;
    }
  },
  
  // Delete a claim (only for pending claims)
  async deleteClaim(claimId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('business_claims')
        .delete()
        .eq('id', claimId);
      
      if (error) throw handleSupabaseError(error);
    } catch (error) {
      console.error('Error deleting claim:', error);
      throw error;
    }
  },
  
  // Check if a user has already claimed a business
  async hasUserClaimedBusiness(userId: string, businessId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('business_claims')
        .select('id, status')
        .match({ user_id: userId, business_id: businessId });
      
      if (error) throw handleSupabaseError(error);
      
      // Return true if there's any approved claim
      return data.some(claim => claim.status === 'approved');
    } catch (error) {
      console.error('Error checking if user claimed business:', error);
      throw error;
    }
  }
};
