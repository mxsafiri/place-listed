// This file provides Supabase functions for place-related operations
import { supabase, handleSupabaseError } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

// Define proper types for our place data
export interface PlaceData {
  name: string;
  description: string;
  category: string;
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
  amenities: string[];
  tags: string[];
  photos?: {
    main?: string;
    gallery?: string[];
    logo?: string;
  } | null;
}

export interface ProductData {
  name: string;
  description: string;
  price: number;
  image?: string;
  category?: string;
}

export interface PlaceWithOwner extends PlaceData {
  id?: string;
  owner_id: string;
  slug: string;
  status: 'pending' | 'active' | 'rejected' | 'inactive';
  views?: number | null;
  average_rating?: number | null;
  review_count?: number | null;
  featured?: boolean | null;
  created_at?: string;
  updated_at?: string;
}

/**
 * Upload an image to Supabase Storage and get the URL
 * @param file - The file to upload
 * @param walletAddress - The wallet address of the authenticated user
 * @returns Promise with the public URL of the uploaded file
 */
export const uploadPlaceImage = async (file: File, walletAddress: string): Promise<string> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    // Use the wallet address (lowercase) in the storage path
    const walletDir = walletAddress.toLowerCase();
    const filePath = `${walletDir}/${fileName}`;
    
    const { error: uploadError, data } = await supabase.storage
      .from('business-images')
      .upload(filePath, file);
      
    if (uploadError) throw handleSupabaseError(uploadError);
    
    const { data: { publicUrl } } = supabase.storage
      .from('business-images')
      .getPublicUrl(filePath);
      
    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// Helper function to generate a URL-friendly slug from a name
const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with a single one
    .trim();
};

/**
 * Create a new place in the database
 * @param placeData - The place data to create
 * @param walletAddress - The wallet address of the authenticated user
 * @returns Promise with the created place data
 */
export const createPlace = async (placeData: PlaceData, walletAddress: string): Promise<any> => {
  try {
    const slug = generateSlug(placeData.name);
    // Use the wallet address (lowercase) as the owner_id
    const ownerId = walletAddress.toLowerCase();
    
    const placeWithOwner: PlaceWithOwner = {
      ...placeData,
      owner_id: ownerId,
      status: 'pending', // Places need approval before being public
      slug,
      views: 0,
      average_rating: 0,
      review_count: 0,
      featured: false
    };

    const { data, error } = await supabase
      .from('businesses')
      .insert(placeWithOwner)
      .select()
      .single();
      
    if (error) throw handleSupabaseError(error);
    return data;
  } catch (error) {
    console.error('Error creating place:', error);
    throw error;
  }
};

/**
 * Get places owned by a specific wallet user
 * @param walletAddress - The wallet address of the authenticated user
 * @returns Promise with an array of place data
 */
export const getPlacesByOwner = async (walletAddress: string): Promise<PlaceWithOwner[]> => {
  try {
    // Use the wallet address (lowercase) for the query
    const ownerId = walletAddress.toLowerCase();
    
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('owner_id', ownerId)
      .order('created_at', { ascending: false });
      
    if (error) throw handleSupabaseError(error);
    return data || [];
  } catch (error) {
    console.error('Error getting places by owner:', error);
    throw error;
  }
};

/**
 * Update an existing place
 * @param placeId - The ID of the place to update
 * @param placeData - The updated place data
 * @param walletAddress - The wallet address of the authenticated user
 * @returns Promise with the updated place data
 */
export const updatePlace = async (placeId: string, placeData: PlaceData, walletAddress: string): Promise<PlaceWithOwner> => {
  try {
    // Use the wallet address (lowercase) for owner verification
    const ownerId = walletAddress.toLowerCase();
    
    // First verify ownership
    const { data: place, error: fetchError } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', placeId)
      .single();
      
    if (fetchError) throw handleSupabaseError(fetchError);
    
    if (!place) {
      throw new Error('Place not found');
    }
    
    if (place.owner_id !== ownerId) {
      throw new Error('Unauthorized: You do not own this place');
    }
    
    // Update the place
    const updatedData: Partial<PlaceWithOwner> = {
      ...placeData,
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('businesses')
      .update(updatedData)
      .eq('id', placeId)
      .select()
      .single();
      
    if (error) throw handleSupabaseError(error);
    return data;
  } catch (error) {
    console.error('Error updating place:', error);
    throw error;
  }
};

/**
 * Delete a place
 * @param placeId - The ID of the place to delete
 * @param walletAddress - The wallet address of the authenticated user
 * @returns Promise with success status and ID
 */
export const deletePlace = async (placeId: string, walletAddress: string): Promise<{ success: boolean, id: string }> => {
  try {
    // Use the wallet address (lowercase) for owner verification
    const ownerId = walletAddress.toLowerCase();
    
    // First verify ownership
    const { data: place, error: fetchError } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', placeId)
      .single();
      
    if (fetchError) throw handleSupabaseError(fetchError);
    
    if (!place) {
      throw new Error('Place not found');
    }
    
    if (place.owner_id !== ownerId) {
      throw new Error('Unauthorized: You do not own this place');
    }
    
    // Delete the place
    const { error } = await supabase
      .from('businesses')
      .delete()
      .eq('id', placeId);
      
    if (error) throw handleSupabaseError(error);
    
    return { success: true, id: placeId };
  } catch (error) {
    console.error('Error deleting place:', error);
    throw error;
  }
};

/**
 * Get place analytics
 * @param placeId - The ID of the place to get analytics for
 * @param walletAddress - The wallet address of the authenticated user
 * @returns Promise with analytics data
 */
export const getPlaceAnalytics = async (placeId: string, walletAddress: string): Promise<{
  views: {
    total: number,
    weekly: number,
    monthly: number
  },
  engagement: {
    clicksToCall: number,
    clicksToWebsite: number,
    clicksToDirections: number
  },
  demographics: {
    ageGroups: {
      '18-24': number,
      '25-34': number,
      '35-44': number,
      '45-54': number,
      '55+': number
    },
    gender: {
      male: number,
      female: number,
      other: number
    }
  }
}> => {
  try {
    // First verify ownership
    const { data: place, error: fetchError } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', placeId)
      .single();
      
    if (fetchError) throw handleSupabaseError(fetchError);
    
    if (!place) {
      throw new Error('Place not found');
    }
    
    if (place.owner_id !== walletAddress.toLowerCase()) {
      throw new Error('Unauthorized: You do not own this place');
    }
    
    // Get analytics data
    // In a real implementation, this would query analytics collections
    // For now, we'll return mock data
    return {
      views: {
        total: place.views || 0,
        weekly: Math.floor(Math.random() * 100),
        monthly: Math.floor(Math.random() * 400)
      },
      engagement: {
        clicksToCall: Math.floor(Math.random() * 30),
        clicksToWebsite: Math.floor(Math.random() * 50),
        clicksToDirections: Math.floor(Math.random() * 40)
      },
      demographics: {
        ageGroups: {
          '18-24': Math.floor(Math.random() * 20),
          '25-34': Math.floor(Math.random() * 30),
          '35-44': Math.floor(Math.random() * 25),
          '45-54': Math.floor(Math.random() * 15),
          '55+': Math.floor(Math.random() * 10)
        },
        gender: {
          male: Math.floor(Math.random() * 60),
          female: Math.floor(Math.random() * 40),
          other: Math.floor(Math.random() * 5)
        }
      }
    };
  } catch (error) {
    console.error('Error getting place analytics:', error);
    throw error;
  }
};
