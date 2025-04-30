'use client';

import { supabase, handleSupabaseError } from './supabase';

export interface Business {
  id?: string;
  owner_id: string;
  name: string;
  slug: string;
  description: string | null;
  category: string;
  subcategory?: string | null;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    }
  };
  contact: {
    phone?: string;
    email?: string;
    website?: string;
    socialMedia?: {
      facebook?: string;
      instagram?: string;
      twitter?: string;
      linkedin?: string;
    }
  } | null;
  business_hours: {
    monday?: { open: string; close: string; closed: boolean };
    tuesday?: { open: string; close: string; closed: boolean };
    wednesday?: { open: string; close: string; closed: boolean };
    thursday?: { open: string; close: string; closed: boolean };
    friday?: { open: string; close: string; closed: boolean };
    saturday?: { open: string; close: string; closed: boolean };
    sunday?: { open: string; close: string; closed: boolean };
  } | null;
  photos: {
    main?: string;
    gallery?: string[];
    logo?: string;
  } | null;
  amenities: string[] | null;
  tags: string[] | null;
  created_at?: string;
  updated_at?: string;
  status: 'pending' | 'active' | 'rejected' | 'inactive';
  views?: number | null;
  average_rating?: number | null;
  review_count?: number | null;
  featured?: boolean | null;
}

export const businessService = {
  // Create a business
  async createBusiness(business: Omit<Business, 'id' | 'created_at' | 'updated_at'>): Promise<Business> {
    try {
      // Generate slug from name if not provided
      if (!business.slug) {
        business.slug = business.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
      }
      
      const { data, error } = await supabase
        .from('businesses')
        .insert(business)
        .select()
        .single();
      
      if (error) throw handleSupabaseError(error);
      return data;
    } catch (error) {
      console.error('Error creating business:', error);
      throw error;
    }
  },
  
  // Get business by ID
  async getBusinessById(id: string): Promise<Business | null> {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw handleSupabaseError(error);
      }
      
      return data;
    } catch (error) {
      console.error('Error getting business by ID:', error);
      throw error;
    }
  },
  
  // Get business by slug
  async getBusinessBySlug(slug: string): Promise<Business | null> {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw handleSupabaseError(error);
      }
      
      return data;
    } catch (error) {
      console.error('Error getting business by slug:', error);
      throw error;
    }
  },
  
  // Get businesses by owner
  async getBusinessesByOwner(ownerId: string): Promise<Business[]> {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('owner_id', ownerId)
        .order('created_at', { ascending: false });
      
      if (error) throw handleSupabaseError(error);
      return data || [];
    } catch (error) {
      console.error('Error getting businesses by owner:', error);
      throw error;
    }
  },
  
  // Search businesses
  async searchBusinesses(query: string, filters?: { category?: string, location?: string }): Promise<Business[]> {
    try {
      let queryBuilder = supabase
        .from('businesses')
        .select('*')
        .eq('status', 'active');
      
      // Full-text search if query provided
      if (query && query.trim() !== '') {
        queryBuilder = queryBuilder.or(`name.ilike.%${query}%,description.ilike.%${query}%`);
      }
      
      // Apply category filter
      if (filters?.category && filters.category.trim() !== '') {
        queryBuilder = queryBuilder.eq('category', filters.category);
      }
      
      // Apply location filter (simplified - in real app would use PostGIS)
      if (filters?.location && filters.location.trim() !== '') {
        queryBuilder = queryBuilder.or(`address->>'city'.ilike.%${filters.location}%,address->>'country'.ilike.%${filters.location}%`);
      }
      
      const { data, error } = await queryBuilder.order('created_at', { ascending: false });
      
      if (error) throw handleSupabaseError(error);
      return data || [];
    } catch (error) {
      console.error('Error searching businesses:', error);
      throw error;
    }
  },
  
  // Update business
  async updateBusiness(id: string, updates: Partial<Business>): Promise<Business> {
    try {
      // Ensure we're not updating critical fields
      const safeUpdates = { ...updates };
      delete safeUpdates.id;
      delete safeUpdates.owner_id;
      delete safeUpdates.created_at;
      
      // Add updated timestamp
      safeUpdates.updated_at = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('businesses')
        .update(safeUpdates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw handleSupabaseError(error);
      return data;
    } catch (error) {
      console.error('Error updating business:', error);
      throw error;
    }
  },
  
  // Delete business
  async deleteBusiness(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('businesses')
        .delete()
        .eq('id', id);
      
      if (error) throw handleSupabaseError(error);
    } catch (error) {
      console.error('Error deleting business:', error);
      throw error;
    }
  },
  
  // Get featured businesses
  async getFeaturedBusinesses(limit = 6): Promise<Business[]> {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('status', 'active')
        .eq('featured', true)
        .order('average_rating', { ascending: false })
        .limit(limit);
      
      if (error) throw handleSupabaseError(error);
      return data || [];
    } catch (error) {
      console.error('Error getting featured businesses:', error);
      throw error;
    }
  },
  
  // Get businesses by category
  async getBusinessesByCategory(category: string, limit = 10): Promise<Business[]> {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('status', 'active')
        .eq('category', category)
        .order('average_rating', { ascending: false })
        .limit(limit);
      
      if (error) throw handleSupabaseError(error);
      return data || [];
    } catch (error) {
      console.error('Error getting businesses by category:', error);
      throw error;
    }
  },
  
  // Get popular categories with counts
  async getPopularCategories(limit = 10): Promise<{ name: string; count: number }[]> {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('category')
        .eq('status', 'active');
      
      if (error) throw handleSupabaseError(error);
      
      // Count categories
      const categoryCounts: Record<string, number> = {};
      data.forEach(business => {
        const category = business.category;
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      });
      
      // Convert to array and sort
      const categories = Object.entries(categoryCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, limit);
      
      return categories;
    } catch (error) {
      console.error('Error getting popular categories:', error);
      throw error;
    }
  }
};
