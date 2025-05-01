'use client';

import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Use environment variables with fallback for client-side
// This is safe since the anon key is meant to be public
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vqbacnkbnskuawchhdwt.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxYmFjbmtibnNrdWF3Y2hoZHd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4NDI2MzgsImV4cCI6MjA2MTQxODYzOH0.H-_yCZZpm4espAacCzQxWwqh2twayZCgCotdWVqMGqQ';

// Create a single instance of the Supabase client to be used throughout the app
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Helper function to handle Supabase errors consistently
export const handleSupabaseError = (error: any): Error => {
  console.error('Supabase error:', error);
  
  // Return a more user-friendly error message
  if (error.code === 'PGRST116') {
    return new Error('Resource not found');
  }
  
  if (error.code === '23505') {
    return new Error('This record already exists');
  }
  
  if (error.code === 'P0001') {
    return new Error(error.message || 'Database constraint violation');
  }
  
  if (error.code === '42P01') {
    return new Error('Database table does not exist');
  }
  
  if (error.code === '42501') {
    return new Error('Insufficient permissions to perform this action');
  }
  
  if (error.code === 'auth/email-already-in-use') {
    return new Error('Email is already in use');
  }
  
  if (error.code === 'auth/invalid-email') {
    return new Error('Invalid email address');
  }
  
  if (error.code === 'auth/weak-password') {
    return new Error('Password is too weak');
  }
  
  if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
    return new Error('Invalid email or password');
  }
  
  // Return a generic error if we don't have a specific handler
  return new Error(error.message || 'An unexpected error occurred');
};
