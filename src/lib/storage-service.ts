'use client';

import { supabase, handleSupabaseError } from './supabase';
import { v4 as uuidv4 } from 'uuid';

// Define allowed file types
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const storageService = {
  /**
   * Upload a business image (logo, main photo, or gallery image)
   */
  async uploadBusinessImage(
    businessId: string, 
    file: File, 
    type: 'logo' | 'main' | 'gallery' = 'gallery'
  ): Promise<string> {
    try {
      // Validate file type
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        throw new Error(`File type not allowed. Allowed types: ${ALLOWED_IMAGE_TYPES.join(', ')}`);
      }
      
      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        throw new Error(`File size exceeds maximum allowed (${MAX_FILE_SIZE / 1024 / 1024}MB)`);
      }
      
      // Generate a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${type}_${uuidv4()}.${fileExt}`;
      const filePath = `businesses/${businessId}/${fileName}`;
      
      // Upload file to Supabase Storage
      const { error } = await supabase.storage
        .from('business-images')
        .upload(filePath, file);
      
      if (error) throw handleSupabaseError(error);
      
      // Get public URL
      const { data } = supabase.storage
        .from('business-images')
        .getPublicUrl(filePath);
      
      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading business image:', error);
      throw error;
    }
  },
  
  /**
   * Delete a business image
   */
  async deleteBusinessImage(imageUrl: string): Promise<void> {
    try {
      // Extract the path from the URL
      const url = new URL(imageUrl);
      const pathParts = url.pathname.split('/');
      const bucketName = pathParts[1]; // e.g., 'business-images'
      const filePath = pathParts.slice(2).join('/'); // e.g., 'businesses/123/image.jpg'
      
      // Delete the file
      const { error } = await supabase.storage
        .from(bucketName)
        .remove([filePath]);
      
      if (error) throw handleSupabaseError(error);
    } catch (error) {
      console.error('Error deleting business image:', error);
      throw error;
    }
  },
  
  /**
   * Upload a profile avatar
   */
  async uploadProfileAvatar(userId: string, file: File): Promise<string> {
    try {
      // Validate file type
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        throw new Error(`File type not allowed. Allowed types: ${ALLOWED_IMAGE_TYPES.join(', ')}`);
      }
      
      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        throw new Error(`File size exceeds maximum allowed (${MAX_FILE_SIZE / 1024 / 1024}MB)`);
      }
      
      // Generate a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `avatar_${uuidv4()}.${fileExt}`;
      const filePath = `profiles/${userId}/${fileName}`;
      
      // Upload file to Supabase Storage
      const { error } = await supabase.storage
        .from('profile-images')
        .upload(filePath, file);
      
      if (error) throw handleSupabaseError(error);
      
      // Get public URL
      const { data } = supabase.storage
        .from('profile-images')
        .getPublicUrl(filePath);
      
      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading profile avatar:', error);
      throw error;
    }
  },
  
  /**
   * Delete a profile avatar
   */
  async deleteProfileAvatar(avatarUrl: string): Promise<void> {
    try {
      // Extract the path from the URL
      const url = new URL(avatarUrl);
      const pathParts = url.pathname.split('/');
      const bucketName = pathParts[1]; // e.g., 'profile-images'
      const filePath = pathParts.slice(2).join('/'); // e.g., 'profiles/123/avatar.jpg'
      
      // Delete the file
      const { error } = await supabase.storage
        .from(bucketName)
        .remove([filePath]);
      
      if (error) throw handleSupabaseError(error);
    } catch (error) {
      console.error('Error deleting profile avatar:', error);
      throw error;
    }
  }
};
