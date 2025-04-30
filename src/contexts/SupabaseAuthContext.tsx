'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { authService, UserProfile, UserRole } from '@/lib/auth-service';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  login: (email: string, password: string) => Promise<User | null>;
  registerBusinessOwner: (email: string, password: string, displayName: string, businessName: string) => Promise<User | null>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
  // Demo mode for development/testing
  demoMode: boolean;
  setDemoMode: (demoMode: boolean) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(false); // Demo mode for presentation/testing

  const isAuthenticated = !!user;

  const hasRole = (role: UserRole | UserRole[]): boolean => {
    if (!profile) return false;
    
    if (Array.isArray(role)) {
      return role.includes(profile.role);
    }
    
    return profile.role === role;
  };

  const login = async (email: string, password: string) => {
    if (demoMode) {
      // Create a fake user for demo mode
      const demoUser = {
        id: 'demo-user-id',
        email: 'demo@example.com',
        user_metadata: {
          display_name: 'Demo Business Owner',
          role: 'business_owner'
        }
      } as User;
      
      setUser(demoUser);
      
      // Create a fake profile for demo mode
      const demoProfile: UserProfile = {
        id: 'demo-user-id',
        email: 'demo@example.com',
        display_name: 'Demo Business Owner',
        business_name: 'Demo Business',
        role: 'business_owner',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        subscription: 'free',
        verified: true
      };
      
      setProfile(demoProfile);
      return demoUser;
    }
    
    const user = await authService.login(email, password);
    if (user) await loadUserProfile(user.id);
    return user;
  };

  const registerBusinessOwner = async (
    email: string, 
    password: string, 
    displayName: string,
    businessName: string
  ) => {
    if (demoMode) {
      // Create a fake user for demo mode
      const demoUser = {
        id: 'demo-user-id',
        email,
        user_metadata: {
          display_name: displayName,
          role: 'business_owner'
        }
      } as User;
      
      setUser(demoUser);
      
      // Create a fake profile for demo mode
      const demoProfile: UserProfile = {
        id: 'demo-user-id',
        email,
        display_name: displayName,
        business_name: businessName,
        role: 'business_owner',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        subscription: 'free',
        verified: false
      };
      
      setProfile(demoProfile);
      return demoUser;
    }
    
    const user = await authService.registerBusinessOwner(
      email, 
      password, 
      displayName,
      businessName
    );
    if (user) await loadUserProfile(user.id);
    return user;
  };

  const logout = async () => {
    if (demoMode) {
      setUser(null);
      setProfile(null);
      return;
    }
    
    await authService.logout();
    setUser(null);
    setProfile(null);
  };

  const resetPassword = async (email: string) => {
    if (demoMode) {
      console.log('Demo mode: Password reset email would be sent to', email);
      return;
    }
    
    await authService.resetPassword(email);
  };

  const loadUserProfile = async (userId: string) => {
    try {
      const profile = await authService.getUserProfile(userId);
      setProfile(profile);
    } catch (error) {
      console.error('Error loading profile:', error);
      setProfile(null);
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) throw new Error('User not authenticated');
    
    if (demoMode) {
      setProfile(prev => prev ? { ...prev, ...data, updated_at: new Date().toISOString() } : null);
      return;
    }
    
    await authService.updateUserProfile(user.id, data);
    await refreshProfile();
  };

  const refreshProfile = async () => {
    if (user) {
      await loadUserProfile(user.id);
    }
  };

  useEffect(() => {
    if (demoMode) {
      setIsLoading(false);
      return;
    }
    
    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        if (session?.user) {
          await loadUserProfile(session.user.id);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeAuth();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          await loadUserProfile(session.user.id);
        } else {
          setProfile(null);
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, [demoMode]);

  const value = {
    user,
    profile,
    isLoading,
    isAuthenticated,
    hasRole,
    login,
    registerBusinessOwner,
    logout,
    resetPassword,
    updateProfile,
    refreshProfile,
    demoMode,
    setDemoMode
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading ? children : null}
    </AuthContext.Provider>
  );
}
