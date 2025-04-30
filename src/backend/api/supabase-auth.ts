// Supabase authentication API
import { authService, UserProfile } from '@/lib/auth-service';
import { User } from '@supabase/supabase-js';

// Register a new business owner
export const registerBusinessOwner = async (
  email: string, 
  password: string, 
  displayName: string,
  businessName: string
): Promise<User | null> => {
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
export const loginUser = async (email: string, password: string): Promise<User | null> => {
  try {
    return await authService.login(email, password);
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

// Logout a user
export const logoutUser = async (): Promise<{ success: boolean }> => {
  try {
    return await authService.logout();
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
};

// Reset password
export const resetPassword = async (email: string): Promise<{ success: boolean }> => {
  try {
    return await authService.resetPassword(email);
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
};

// Get user profile
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    return await authService.getUserProfile(userId);
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

// Define interface for user profile data
export type UserProfileData = Partial<UserProfile>;

// Update user profile
export const updateUserProfile = async (
  userId: string, 
  profileData: UserProfileData
): Promise<{ success: boolean, [key: string]: any }> => {
  try {
    return await authService.updateUserProfile(userId, profileData);
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Get current session
export const getSession = async () => {
  try {
    return await authService.getSession();
  } catch (error) {
    console.error('Error getting session:', error);
    throw error;
  }
};

// Get current user
export const getCurrentUser = async () => {
  try {
    return await authService.getCurrentUser();
  } catch (error) {
    console.error('Error getting current user:', error);
    throw error;
  }
};
