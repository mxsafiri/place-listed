'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  UserCredential,
  Auth
} from 'firebase/auth';
import { auth } from '../backend/services/firebase';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (email: string, password: string, displayName: string) => Promise<User>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  demoMode: boolean;
  setDemoMode: (demoMode: boolean) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(true); // Demo mode for presentation

  function login(email: string, password: string): Promise<User> {
    if (!auth) {
      return Promise.reject(new Error('Authentication service is not available'));
    }
    
    return signInWithEmailAndPassword(auth, email, password)
      .then((userCredential: UserCredential) => userCredential.user);
  }

  async function register(email: string, password: string, displayName: string): Promise<User> {
    if (!auth) {
      throw new Error('Authentication service is not available');
    }
    
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update the user's display name
    await updateProfile(user, { displayName });
    
    return user;
  }

  function logout(): Promise<void> {
    if (!auth) {
      return Promise.reject(new Error('Authentication service is not available'));
    }
    
    return signOut(auth);
  }

  function resetPassword(email: string): Promise<void> {
    if (!auth) {
      return Promise.reject(new Error('Authentication service is not available'));
    }
    
    return sendPasswordResetEmail(auth, email);
  }

  useEffect(() => {
    // Skip auth state change listener if auth is not available
    if (!auth) {
      setLoading(false);
      return;
    }

    // For demo purposes, create a fake user if in demo mode
    if (demoMode) {
      const demoUser = {
        uid: 'demo-user-id',
        email: 'demo@example.com',
        displayName: 'Demo Business Owner',
        emailVerified: true,
        isAnonymous: false,
        metadata: {},
        providerData: [],
        refreshToken: '',
        tenantId: null,
        delete: () => Promise.resolve(),
        getIdToken: () => Promise.resolve('demo-token'),
        getIdTokenResult: () => Promise.resolve({ token: 'demo-token', claims: {}, expirationTime: '', authTime: '', issuedAtTime: '', signInProvider: null, signInSecondFactor: null }),
        reload: () => Promise.resolve(),
        toJSON: () => ({}),
        phoneNumber: null,
        photoURL: null,
        providerId: 'password',
      } as User;
      
      setCurrentUser(demoUser);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, [demoMode]);

  const value = {
    currentUser,
    loading,
    login,
    register,
    logout,
    resetPassword,
    demoMode,
    setDemoMode
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
