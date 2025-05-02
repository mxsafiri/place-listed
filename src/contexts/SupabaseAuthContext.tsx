'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
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
  demoMode: boolean;
  setDemoMode: (demoMode: boolean) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(false);

  const isAuthenticated = !!user;

  const hasRole = (role: UserRole | UserRole[]): boolean => {
    if (!profile) return false;
    return Array.isArray(role) ? role.includes(profile.role) : profile.role === role;
  };

  const login = async (email: string, password: string): Promise<User | null> => {
    if (demoMode) {
      const demoUser = {
        id: 'demo-user-id',
        email: 'demo@example.com',
        user_metadata: {
          display_name: 'Demo Business Owner',
          role: 'business_owner',
        },
        app_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        role: '',
        confirmed_at: new Date().toISOString(),
      } as User;

      const demoProfile: UserProfile = {
        id: 'demo-user-id',
        email: 'demo@example.com',
        display_name: 'Demo Business Owner',
        business_name: 'Demo Business',
        role: 'business_owner',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        subscription: 'free',
        verified: true,
      };

      setUser(demoUser);
      setProfile(demoProfile);
      return demoUser;
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) {
      console.error('Login error:', error);
      return null;
    }

    setUser(data.user);

    try {
      const userProfile = await authService.getUserProfile(data.user.id);
      setProfile(userProfile || null); // If not found, set to null
    } catch (err) {
      // Instead of blocking, log and allow dashboard access
      console.error('Error fetching profile:', err);
      setProfile(null);
    }

    return data.user;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  const registerBusinessOwner = async (
    email: string,
    password: string,
    displayName: string,
    businessName: string
  ): Promise<User | null> => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error || !data.user) {
      console.error('Registration error:', error);
      return null;
    }

    const newProfile: UserProfile = {
      id: data.user.id,
      email,
      display_name: displayName,
      business_name: businessName,
      role: 'business_owner',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      subscription: 'free',
    };

    await authService.createUserProfile(newProfile);

    setUser(data.user);
    setProfile(newProfile);

    return data.user;
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      throw new Error(error.message);
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    // First update the profile
    await authService.updateUserProfile(user.id, data);
    // Then fetch the updated profile
    const updatedProfile = await authService.getUserProfile(user.id);
    setProfile(updatedProfile);
  };

  const refreshProfile = async () => {
    if (!user) return;
    const freshProfile = await authService.getUserProfile(user.id);
    setProfile(freshProfile);
  };

  useEffect(() => {
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user;
      if (currentUser) {
        setUser(currentUser);
        try {
          const userProfile = await authService.getUserProfile(currentUser.id);
          setProfile(userProfile);
        } catch (err) {
          console.error('Profile fetch error:', err);
        }
      }
      setIsLoading(false);
    };

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const user = session?.user ?? null;
      setUser(user);
      if (user) {
        try {
          const userProfile = await authService.getUserProfile(user.id);
          setProfile(userProfile);
        } catch (err) {
          console.error('Profile fetch error (on change):', err);
        }
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
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
        setDemoMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
