'use client';

import { supabase, handleSupabaseError } from './supabase';

export interface Review {
  id?: string;
  business_id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  created_at?: string;
  updated_at?: string;
  user_name?: string; // Joined from profiles
}

export const reviewService = {
  // Create a review
  async createReview(review: Omit<Review, 'id' | 'created_at' | 'updated_at'>): Promise<Review> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert({
          ...review,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw handleSupabaseError(error);
      
      // Update business average rating and review count
      await this.updateBusinessRatingStats(review.business_id);
      
      return data;
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  },
  
  // Get reviews for a business
  async getBusinessReviews(businessId: string): Promise<Review[]> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles:user_id (
            display_name
          )
        `)
        .eq('business_id', businessId)
        .order('created_at', { ascending: false });
      
      if (error) throw handleSupabaseError(error);
      
      // Format the data to match our Review interface
      return data.map(review => ({
        ...review,
        user_name: review.profiles?.display_name || 'Anonymous'
      }));
    } catch (error) {
      console.error('Error getting business reviews:', error);
      throw error;
    }
  },
  
  // Get a specific review
  async getReview(reviewId: string): Promise<Review | null> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles:user_id (
            display_name
          )
        `)
        .eq('id', reviewId)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw handleSupabaseError(error);
      }
      
      return {
        ...data,
        user_name: data.profiles?.display_name || 'Anonymous'
      };
    } catch (error) {
      console.error('Error getting review:', error);
      throw error;
    }
  },
  
  // Update a review
  async updateReview(reviewId: string, updates: Partial<Review>): Promise<Review> {
    try {
      // Ensure we're not updating critical fields
      const safeUpdates = { ...updates };
      delete safeUpdates.id;
      delete safeUpdates.business_id;
      delete safeUpdates.user_id;
      delete safeUpdates.created_at;
      delete safeUpdates.user_name;
      
      // Add updated timestamp
      safeUpdates.updated_at = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('reviews')
        .update(safeUpdates)
        .eq('id', reviewId)
        .select()
        .single();
      
      if (error) throw handleSupabaseError(error);
      
      // Update business average rating
      await this.updateBusinessRatingStats(data.business_id);
      
      return data;
    } catch (error) {
      console.error('Error updating review:', error);
      throw error;
    }
  },
  
  // Delete a review
  async deleteReview(reviewId: string): Promise<void> {
    try {
      // Get the business ID before deleting
      const { data: review, error: getError } = await supabase
        .from('reviews')
        .select('business_id')
        .eq('id', reviewId)
        .single();
      
      if (getError) throw handleSupabaseError(getError);
      
      const businessId = review.business_id;
      
      // Delete the review
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);
      
      if (error) throw handleSupabaseError(error);
      
      // Update business average rating
      await this.updateBusinessRatingStats(businessId);
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  },
  
  // Get user reviews
  async getUserReviews(userId: string): Promise<Review[]> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          businesses:business_id (
            name,
            slug
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw handleSupabaseError(error);
      
      return data;
    } catch (error) {
      console.error('Error getting user reviews:', error);
      throw error;
    }
  },
  
  // Helper: Update business rating statistics
  async updateBusinessRatingStats(businessId: string): Promise<void> {
    try {
      // Calculate average rating and count
      const { data, error } = await supabase
        .from('reviews')
        .select('rating')
        .eq('business_id', businessId);
      
      if (error) throw handleSupabaseError(error);
      
      const reviewCount = data.length;
      const totalRating = data.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = reviewCount > 0 ? totalRating / reviewCount : 0;
      
      // Update business stats
      const { error: updateError } = await supabase
        .from('businesses')
        .update({
          average_rating: averageRating,
          review_count: reviewCount,
          updated_at: new Date().toISOString()
        })
        .eq('id', businessId);
      
      if (updateError) throw handleSupabaseError(updateError);
    } catch (error) {
      console.error('Error updating business rating stats:', error);
      throw error;
    }
  }
};
