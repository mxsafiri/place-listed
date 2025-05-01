// Supabase authentication API operations
import { supabase, handleSupabaseError } from '@/lib/supabase';
import { authService, UserProfile } from '@/lib/auth-service';

// Register a new business owner
export const registerBusinessOwner = async (
  email: string, 
  password: string, 
  displayName: string,
  businessName: string
) => {
  try {
    return await authService.registerBusinessOwner(
      email, 
      password, 
      displayName,
      businessName
    );
  } catch (error) {
    console.error('Error registering business owner:', error);
    throw error;
  }
};

// Login a user
export const loginUser = async (email: string, password: string) => {
  try {
    return await authService.login(email, password);
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

// Logout a user
export const logoutUser = async () => {
  try {
    return await authService.logout();
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
};

// Reset password
export const resetPassword = async (email: string) => {
  try {
    return await authService.resetPassword(email);
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
};

// Get user profile
export const getUserProfile = async (userId: string) => {
  try {
    return await authService.getUserProfile(userId);
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

// Define interface for user profile data
export interface UserProfileData {
  display_name?: string;
  business_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  bio?: string;
  website?: string;
  social_links?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  settings?: {
    email_notifications?: boolean;
    sms_notifications?: boolean;
    marketing_emails?: boolean;
  };
}

// Update user profile
export const updateUserProfile = async (userId: string, profileData: UserProfileData) => {
  try {
    return await authService.updateUserProfile(userId, profileData);
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Get current session
export const getCurrentSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw handleSupabaseError(error);
    return data.session;
  } catch (error) {
    console.error('Error getting current session:', error);
    throw error;
  }
};

// Get current user
export const getCurrentUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw handleSupabaseError(error);
    return data.user;
  } catch (error) {
    console.error('Error getting current user:', error);
    throw error;
  }
};

// Refresh session
export const refreshSession = async () => {
  try {
    const { data, error } = await supabase.auth.refreshSession();
    if (error) throw handleSupabaseError(error);
    return data;
  } catch (error) {
    console.error('Error refreshing session:', error);
    throw error;
  }
};
