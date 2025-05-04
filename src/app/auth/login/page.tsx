'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import LoadingSpinner from '@/frontend/components/ui/LoadingSpinner';
import { useWalletAuth } from '@/contexts/WalletAuthContext';

/**
 * Login page that redirects to appropriate pages based on authentication status
 * We no longer use a dedicated login page since wallet connection happens directly
 * in the navbar and protected pages handle authentication internally
 */
export default function LoginRedirectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/dashboard';
  
  const { address, isConnected, isLoading } = useWalletAuth();

  useEffect(() => {
    // If wallet is already connected, redirect to the target page
    if (isConnected && address && !isLoading) {
      router.replace(redirectPath);
      return;
    }
    
    // If not loading and no wallet connected, redirect to home page 
    // where user can connect wallet using the navbar
    if (!isLoading && !isConnected) {
      router.replace('/');
    }
  }, [address, isConnected, isLoading, redirectPath, router]);

  // Show loading indicator while checking authentication or redirecting
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <LoadingSpinner size="large" />
      <p className="mt-4 text-gray-600">Redirecting...</p>
    </div>
  );
}
