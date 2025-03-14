// This file simulates Firebase Cloud Functions for authentication-related operations
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User,
  Auth
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

// Register a new business owner
export const registerBusinessOwner = async (
  email: string, 
  password: string, 
  displayName: string,
  businessName: string
) => {
  try {
    // Check if auth is available
    if (!auth) {
      throw new Error('Authentication service is not available');
    }
    
    // Create the user account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update the user's display name
    await updateProfile(user, { displayName });
    
    // Create a user profile document in Firestore
    if (!db) {
      throw new Error('Database service is not available');
    }
    
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email,
      displayName,
      businessName,
      role: 'business_owner',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      subscription: 'free', // Default subscription tier
      verified: false // Business owners need verification
    });
    
    return user;
  } catch (error) {
    console.error('Error registering business owner:', error);
    throw error;
  }
};

// Login a user
export const loginUser = async (email: string, password: string) => {
  try {
    // Check if auth is available
    if (!auth) {
      throw new Error('Authentication service is not available');
    }
    
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

// Logout a user
export const logoutUser = async () => {
  try {
    // Check if auth is available
    if (!auth) {
      throw new Error('Authentication service is not available');
    }
    
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
};

// Reset password
export const resetPassword = async (email: string) => {
  try {
    // Check if auth is available
    if (!auth) {
      throw new Error('Authentication service is not available');
    }
    
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
};

// Get user profile
export const getUserProfile = async (userId: string) => {
  try {
    // Check if db is available
    if (!db) {
      throw new Error('Database service is not available');
    }
    
    const userDoc = await getDoc(doc(db, 'users', userId));
    
    if (!userDoc.exists()) {
      throw new Error('User profile not found');
    }
    
    return userDoc.data();
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

// Define interface for user profile data
export interface UserProfileData {
  displayName?: string;
  businessName?: string;
  email?: string;
  phone?: string;
  address?: string;
  bio?: string;
  website?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  settings?: {
    emailNotifications?: boolean;
    smsNotifications?: boolean;
    marketingEmails?: boolean;
  };
  [key: string]: any; // For any additional properties
}

// Update user profile
export const updateUserProfile = async (userId: string, profileData: UserProfileData) => {
  try {
    // Check if db is available
    if (!db) {
      throw new Error('Database service is not available');
    }
    
    const userRef = doc(db, 'users', userId);
    
    // Ensure we're not updating sensitive fields
    const safeProfileData = {
      ...profileData,
      updatedAt: new Date().toISOString(),
      // Preserve fields that shouldn't be updated directly
      uid: userId,
      role: profileData.role || 'business_owner',
      createdAt: profileData.createdAt,
      subscription: profileData.subscription || 'free',
      verified: profileData.verified || false
    };
    
    await updateDoc(userRef, safeProfileData);
    
    // If display name is being updated, also update it in Firebase Auth
    if (profileData.displayName && auth && auth.currentUser) {
      await updateProfile(auth.currentUser, { 
        displayName: profileData.displayName 
      });
    }
    
    return { success: true, ...safeProfileData };
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};
