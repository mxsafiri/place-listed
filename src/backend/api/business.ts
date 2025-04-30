// Business API using Supabase
import { businessService, Business } from '@/lib/business-service';
import { reviewService } from '@/lib/review-service';
import { businessClaimService } from '@/lib/business-claim-service';
import { savedBusinessService } from '@/lib/saved-business-service';

// Create a new business
export const createBusiness = async (business: Omit<Business, 'id' | 'created_at' | 'updated_at'>): Promise<Business> => {
  try {
    return await businessService.createBusiness(business);
  } catch (error) {
    console.error('Error creating business:', error);
    throw error;
  }
};

// Get business by ID
export const getBusinessById = async (id: string): Promise<Business | null> => {
  try {
    return await businessService.getBusinessById(id);
  } catch (error) {
    console.error('Error getting business by ID:', error);
    throw error;
  }
};

// Get business by slug
export const getBusinessBySlug = async (slug: string): Promise<Business | null> => {
  try {
    return await businessService.getBusinessBySlug(slug);
  } catch (error) {
    console.error('Error getting business by slug:', error);
    throw error;
  }
};

// Get businesses by owner
export const getBusinessesByOwner = async (ownerId: string): Promise<Business[]> => {
  try {
    return await businessService.getBusinessesByOwner(ownerId);
  } catch (error) {
    console.error('Error getting businesses by owner:', error);
    throw error;
  }
};

// Search businesses
export const searchBusinesses = async (
  query: string, 
  filters?: { category?: string, location?: string }
): Promise<Business[]> => {
  try {
    return await businessService.searchBusinesses(query, filters);
  } catch (error) {
    console.error('Error searching businesses:', error);
    throw error;
  }
};

// Update business
export const updateBusiness = async (
  id: string, 
  updates: Partial<Business>
): Promise<Business> => {
  try {
    return await businessService.updateBusiness(id, updates);
  } catch (error) {
    console.error('Error updating business:', error);
    throw error;
  }
};

// Delete business
export const deleteBusiness = async (id: string): Promise<void> => {
  try {
    await businessService.deleteBusiness(id);
  } catch (error) {
    console.error('Error deleting business:', error);
    throw error;
  }
};

// Get featured businesses
export const getFeaturedBusinesses = async (limit = 6): Promise<Business[]> => {
  try {
    return await businessService.getFeaturedBusinesses(limit);
  } catch (error) {
    console.error('Error getting featured businesses:', error);
    throw error;
  }
};

// Get businesses by category
export const getBusinessesByCategory = async (
  category: string, 
  limit = 10
): Promise<Business[]> => {
  try {
    return await businessService.getBusinessesByCategory(category, limit);
  } catch (error) {
    console.error('Error getting businesses by category:', error);
    throw error;
  }
};

// Get popular categories with counts
export const getPopularCategories = async (
  limit = 10
): Promise<{ name: string; count: number }[]> => {
  try {
    return await businessService.getPopularCategories(limit);
  } catch (error) {
    console.error('Error getting popular categories:', error);
    throw error;
  }
};

// Save a business (for a user's favorites)
export const saveBusiness = async (
  userId: string, 
  businessId: string
): Promise<{ success: boolean }> => {
  try {
    await savedBusinessService.saveBusiness(userId, businessId);
    return { success: true };
  } catch (error) {
    console.error('Error saving business:', error);
    throw error;
  }
};

// Unsave a business
export const unsaveBusiness = async (
  userId: string, 
  businessId: string
): Promise<{ success: boolean }> => {
  try {
    await savedBusinessService.unsaveBusiness(userId, businessId);
    return { success: true };
  } catch (error) {
    console.error('Error unsaving business:', error);
    throw error;
  }
};

// Check if a business is saved by a user
export const isBusinessSaved = async (
  userId: string, 
  businessId: string
): Promise<boolean> => {
  try {
    return await savedBusinessService.isBusinessSaved(userId, businessId);
  } catch (error) {
    console.error('Error checking if business is saved:', error);
    throw error;
  }
};

// Get saved businesses for a user
export const getSavedBusinesses = async (userId: string) => {
  try {
    return await savedBusinessService.getSavedBusinesses(userId);
  } catch (error) {
    console.error('Error getting saved businesses:', error);
    throw error;
  }
};

// Claim a business
export const claimBusiness = async (
  userId: string, 
  businessId: string, 
  evidence: string | null = null
) => {
  try {
    return await businessClaimService.createClaim(userId, businessId, evidence);
  } catch (error) {
    console.error('Error claiming business:', error);
    throw error;
  }
};

// Check if a user has claimed a business
export const hasUserClaimedBusiness = async (
  userId: string, 
  businessId: string
): Promise<boolean> => {
  try {
    return await businessClaimService.hasUserClaimedBusiness(userId, businessId);
  } catch (error) {
    console.error('Error checking if user claimed business:', error);
    throw error;
  }
};
