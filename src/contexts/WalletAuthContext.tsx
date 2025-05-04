'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAddress, useUser, useDisconnect, useSDK, useConnect } from "@thirdweb-dev/react";
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export type WalletUserRole = 'customer' | 'business_owner' | 'admin';

export interface WalletUserProfile {
  id: string;
  wallet_address: string;
  display_name: string;
  business_name?: string;
  role: WalletUserRole;
  created_at: string;
  updated_at: string;
  subscription?: string;
  verified: boolean;
  email?: string;
  bio?: string;
  avatar_url?: string;
}

interface WalletAuthContextType {
  address: string | undefined;
  isConnected: boolean;
  isLoading: boolean;
  walletUser: WalletUserProfile | null;
  hasRole: (role: WalletUserRole | WalletUserRole[]) => boolean;
  disconnect: () => Promise<void>;
  updateProfile: (data: Partial<WalletUserProfile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
  signMessage: (message: string) => Promise<string | undefined>;
  createWalletUser: (displayName: string, businessName?: string) => Promise<WalletUserProfile | null>;
  autoCreateWalletUser: (redirectTo?: string) => Promise<void>;
  isEmailWallet: boolean;
  userEmail: string | null;
}

const WalletAuthContext = createContext<WalletAuthContextType | null>(null);

export function useWalletAuth() {
  const context = useContext(WalletAuthContext);
  if (!context) throw new Error('useWalletAuth must be used within WalletAuthProvider');
  return context;
}

export function WalletAuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const address = useAddress();
  const { user, isLoggedIn, isLoading: isUserLoading } = useUser();
  const disconnectWallet = useDisconnect();
  const sdk = useSDK();
  const connect = useConnect();
  
  const [walletUser, setWalletUser] = useState<WalletUserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEmailWallet, setIsEmailWallet] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const isConnected = !!address;

  const hasRole = (role: WalletUserRole | WalletUserRole[]): boolean => {
    if (!walletUser) return false;
    return Array.isArray(role) 
      ? role.includes(walletUser.role as WalletUserRole) 
      : walletUser.role === role;
  };

  // Detect if the connected wallet is an email wallet and extract the email
  useEffect(() => {
    const checkEmailWallet = async () => {
      if (!user || !isLoggedIn) {
        setIsEmailWallet(false);
        setUserEmail(null);
        return;
      }

      try {
        // Early return if SDK is not available
        if (!sdk) {
          setIsEmailWallet(false);
          setUserEmail(null);
          return;
        }
        
        // For thirdweb SDK, we can sometimes determine the wallet type from the user object
        if (user) {
          // Check if user info contains email data
          const authProvider = user.authDetails?.authType;
          const emailFromUser = user.authDetails?.email || user.authDetails?.userInfo?.email;
          
          if (authProvider === 'email' || 
              authProvider === 'google' || 
              authProvider === 'facebook' || 
              authProvider === 'apple') {
            setIsEmailWallet(true);
            setUserEmail(emailFromUser || null);
            return;
          }
        }
        
        // Fallback to basic checks
        const connectedWalletType = sdk.wallet.getWalletType?.();
        if (connectedWalletType === 'embedded-wallet' || 
            connectedWalletType === 'email' || 
            connectedWalletType === 'embedded') {
          setIsEmailWallet(true);
          // Try to extract email from other sources if available
          setUserEmail(user?.authDetails?.email || user?.authDetails?.userInfo?.email || null);
        } else {
          setIsEmailWallet(false);
          setUserEmail(null);
        }
      } catch (error) {
        console.error('Error checking email wallet status:', error);
        setIsEmailWallet(false);
        setUserEmail(null);
      }
    };

    checkEmailWallet();
  }, [user, isLoggedIn, sdk]);

  // Create wallet user entry in database
  const createWalletUser = async (displayName: string, businessName?: string): Promise<WalletUserProfile | null> => {
    if (!address) return null;
    
    try {
      // Generate wallet user data with email if available
      const userData = {
        wallet_address: address.toLowerCase(),
        display_name: displayName,
        business_name: businessName,
        role: 'business_owner' as WalletUserRole,
        verified: true,
        email: userEmail || undefined  // Include email if available
      };
      
      // Create user in database
      const { data, error } = await supabase
        .from('wallet_users')
        .insert(userData)
        .select()
        .single();
        
      if (error) throw error;
      
      // Set authentication state
      localStorage.setItem('placeListed_wallet', address.toLowerCase());
      localStorage.setItem('placeListed_wallet_authenticated', 'true');
      
      // Update local state
      setWalletUser(data);
      
      return data;
    } catch (error) {
      console.error('Error creating wallet user:', error);
      return null;
    }
  };
  
  // Automatically create wallet user when wallet is connected
  const autoCreateWalletUser = async (redirectTo?: string): Promise<void> => {
    if (!address) return;
    
    try {
      // Try to find existing user
      const { data: existingUser, error: lookupError } = await supabase
        .from('wallet_users')
        .select('*')
        .eq('wallet_address', address.toLowerCase())
        .maybeSingle();
      
      if (lookupError && lookupError.code !== 'PGRST116') {
        throw lookupError;
      }
      
      // If user exists, just set the auth state
      if (existingUser) {
        localStorage.setItem('placeListed_wallet', address.toLowerCase());
        localStorage.setItem('placeListed_wallet_authenticated', 'true');
        
        // Update email if we have one from the wallet but not in the database
        if (userEmail && !existingUser.email) {
          await supabase
            .from('wallet_users')
            .update({ email: userEmail })
            .eq('wallet_address', address.toLowerCase());
            
          existingUser.email = userEmail;
        }
        
        setWalletUser(existingUser);
        
        if (redirectTo) {
          router.push(redirectTo);
        }
        
        return;
      }
      
      // If user doesn't exist, create a new one
      // For email wallets, use a more friendly display name
      let displayName = '';
      
      if (isEmailWallet && userEmail) {
        // Use part before @ in email as display name
        displayName = userEmail.split('@')[0];
        // Capitalize first letter
        displayName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
      } else {
        // Use wallet address for non-email wallets
        displayName = `Wallet ${address.slice(0, 6)}...${address.slice(-4)}`;
      }
      
      await createWalletUser(displayName);
      
      if (redirectTo) {
        router.push(redirectTo);
      }
    } catch (error) {
      console.error('Error in auto-creating wallet user:', error);
    }
  };

  // Sign a message with the connected wallet
  const signMessage = async (message: string): Promise<string | undefined> => {
    if (!address || !sdk) return undefined;
    try {
      return await sdk.wallet.sign(message);
    } catch (error) {
      console.error('Error signing message:', error);
      return undefined;
    }
  };

  // Disconnect wallet and clear local storage
  const disconnect = async () => {
    try {
      // Clear wallet data from localStorage
      localStorage.removeItem('placeListed_wallet');
      localStorage.removeItem('placeListed_wallet_authenticated');
      
      // Disconnect wallet using thirdweb
      await disconnectWallet();
      
      // Clear user state
      setWalletUser(null);
      setIsEmailWallet(false);
      setUserEmail(null);
    } catch (error) {
      console.error('Error during disconnect:', error);
    }
  };

  // Update wallet user profile
  const updateProfile = async (data: Partial<WalletUserProfile>) => {
    if (!address || !walletUser) return;
    
    try {
      const { error } = await supabase
        .from('wallet_users')
        .update({
          ...data,
          updated_at: new Date().toISOString()
        })
        .eq('wallet_address', address.toLowerCase());
        
      if (error) throw error;
      
      // Refresh profile after update
      await refreshProfile();
    } catch (error) {
      console.error('Error updating wallet user profile:', error);
      throw error;
    }
  };

  // Refresh wallet user profile from database
  const refreshProfile = async () => {
    if (!address) return;
    
    try {
      const { data, error } = await supabase
        .from('wallet_users')
        .select('*')
        .eq('wallet_address', address.toLowerCase())
        .single();
        
      if (error) throw error;
      setWalletUser(data);
    } catch (error) {
      console.error('Error refreshing wallet user profile:', error);
    }
  };

  // Fetch wallet user when address changes
  useEffect(() => {
    const fetchWalletUser = async () => {
      if (!address) {
        setWalletUser(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        // Check if user exists in database
        const { data, error } = await supabase
          .from('wallet_users')
          .select('*')
          .eq('wallet_address', address.toLowerCase())
          .single();
          
        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching wallet user:', error);
        }
        
        // If user data exists, set local authentication
        if (data) {
          localStorage.setItem('placeListed_wallet', address.toLowerCase());
          localStorage.setItem('placeListed_wallet_authenticated', 'true');
          setWalletUser(data);
        }
      } catch (error) {
        console.error('Wallet user fetch error:', error);
        setWalletUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWalletUser();
  }, [address]);

  // Check localStorage for wallet auth on init
  useEffect(() => {
    const checkLocalStorage = () => {
      const storedWallet = localStorage.getItem('placeListed_wallet');
      const isAuthenticated = localStorage.getItem('placeListed_wallet_authenticated') === 'true';
      
      if (storedWallet && isAuthenticated && !address) {
        // We have a stored wallet but no active connection
        // You might want to automatically reconnect here or prompt the user
        console.log('Found stored wallet authentication, but wallet not connected');
      }
    };

    checkLocalStorage();
  }, [address]);

  return (
    <WalletAuthContext.Provider
      value={{
        address,
        isConnected,
        isLoading: isLoading || isUserLoading,
        walletUser,
        hasRole,
        disconnect,
        updateProfile,
        refreshProfile,
        signMessage,
        createWalletUser,
        autoCreateWalletUser,
        isEmailWallet,
        userEmail
      }}
    >
      {children}
    </WalletAuthContext.Provider>
  );
}
