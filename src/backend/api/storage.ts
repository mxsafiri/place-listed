'use client';

import { storageService } from '@/lib/storage-service';

// Upload a business image
export const uploadBusinessImage = async (
  businessId: string,
  file: File,
  type: 'logo' | 'main' | 'gallery' = 'gallery'
): Promise<string> => {
  try {
    return await storageService.uploadBusinessImage(businessId, file, type);
  } catch (error) {
    console.error('Error uploading business image:', error);
    throw error;
  }
};

// Delete a business image
export const deleteBusinessImage = async (imageUrl: string): Promise<void> => {
  try {
    await storageService.deleteBusinessImage(imageUrl);
  } catch (error) {
    console.error('Error deleting business image:', error);
    throw error;
  }
};

// Upload a profile avatar
export const uploadProfileAvatar = async (
  userId: string,
  file: File
): Promise<string> => {
  try {
    return await storageService.uploadProfileAvatar(userId, file);
  } catch (error) {
    console.error('Error uploading profile avatar:', error);
    throw error;
  }
};

// Delete a profile avatar
export const deleteProfileAvatar = async (avatarUrl: string): Promise<void> => {
  try {
    await storageService.deleteProfileAvatar(avatarUrl);
  } catch (error) {
    console.error('Error deleting profile avatar:', error);
    throw error;
  }
};
