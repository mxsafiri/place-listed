'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ConnectWallet, useAddress, embeddedWallet } from "@thirdweb-dev/react";
import { useWalletAuth } from '@/contexts/WalletAuthContext';

export default function UserProfileMenu() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Use our custom wallet auth hook for enhanced functionality
  const { 
    address, 
    walletUser, 
    disconnect, 
    isLoading,
    autoCreateWalletUser
  } = useWalletAuth();

  // When wallet connects, automatically authenticate and create a user profile if needed
  useEffect(() => {
    if (address && !isLoading && !walletUser) {
      autoCreateWalletUser();
    }
  }, [address, walletUser, isLoading, autoCreateWalletUser]);

  const handleLogout = async () => {
    try {
      await disconnect();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // If no wallet is connected, show the Connect Wallet button with email login prioritized
  if (!address) {
    return (
      <div className="flex items-center">
        <ConnectWallet 
          theme="dark"
          btnTitle="Sign In"
          modalSize="wide"
          className="!bg-red-600 hover:!bg-red-700 !text-white !px-4 !py-2 !rounded-md !font-medium !shadow-sm"
          // Prioritize email login by showing embedded wallet options first
          supportedWallets={[
            embeddedWallet({
              auth: {
                // Prioritize email as the first option
                options: ["email", "google", "apple", "facebook"],
              },
            }),
          ]}
          // Make "Continue with Email" the default option
          modalTitleIconUrl=""
          welcomeScreen={{
            title: "Sign in to PlaceListed",
            subtitle: "Connect with your email or wallet",
          }}
        />
      </div>
    );
  }

  // Show wallet profile if connected
  return (
    <div className="relative">
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="flex items-center space-x-2 focus:outline-none"
        aria-expanded={isMenuOpen}
        aria-haspopup="true"
      >
        <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white">
          {walletUser?.display_name ? walletUser.display_name.charAt(0).toUpperCase() : address.slice(0, 2)}
        </div>
        <span className="hidden md:block text-white font-medium">
          {walletUser?.display_name || `${address.slice(0, 6)}...${address.slice(-4)}`}
        </span>
      </button>

      {isMenuOpen && (
        <div 
          className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200"
          onBlur={() => setIsMenuOpen(false)}
        >
          <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-100">
            Connected as<br />
            <span className="font-mono">{`${address.slice(0, 6)}...${address.slice(-4)}`}</span>
          </div>
          
          <Link 
            href="/dashboard" 
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => setIsMenuOpen(false)}
          >
            Dashboard
          </Link>
          
          <Link 
            href="/profile" 
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => setIsMenuOpen(false)}
          >
            Profile
          </Link>
          
          {walletUser?.role === 'business_owner' && (
            <>
              <Link 
                href="/business/manage" 
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Manage Businesses
              </Link>
              <Link 
                href="/add-place" 
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Add Business
              </Link>
            </>
          )}
          
          <button
            onClick={() => {
              setIsMenuOpen(false);
              handleLogout();
            }}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
