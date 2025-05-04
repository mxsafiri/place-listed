'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/frontend/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/frontend/components/ui/Card';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/frontend/components/ui/LoadingSpinner';
import ProfileCompletion from './ProfileCompletion';
import { ConnectWallet, embeddedWallet } from "@thirdweb-dev/react";
import { useWalletAuth } from '@/contexts/WalletAuthContext';
import { supabase } from '@/lib/supabase';

export default function DashboardPage() {
  const router = useRouter();
  const { 
    address, 
    walletUser, 
    isLoading, 
    isConnected,
    autoCreateWalletUser 
  } = useWalletAuth();

  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [businesses, setBusinesses] = useState<any[]>([]);
  
  // Auto-authenticate when wallet connects
  useEffect(() => {
    if (address && !walletUser && !isLoading) {
      autoCreateWalletUser('/dashboard');
    }
  }, [address, walletUser, isLoading, autoCreateWalletUser]);
  
  // Fetch businesses when wallet user is available
  useEffect(() => {
    const fetchBusinesses = async () => {
      if (!address || !walletUser) return;
      
      setIsLoadingData(true);
      setError(null);
      
      try {
        // Fetch businesses owned by this wallet user
        const { data: businessData, error: businessErr } = await supabase
          .from("businesses")
          .select("*")
          .eq("owner_id", address.toLowerCase());
          
        if (businessErr) {
          console.error("Error fetching businesses:", businessErr);
          throw businessErr;
        }
        
        setBusinesses(businessData || []);
      } catch (err: any) {
        console.error("Dashboard data error:", err);
        setError(err.message || "Error loading dashboard data");
      } finally {
        setIsLoadingData(false);
      }
    };
    
    if (walletUser) {
      fetchBusinesses();
    } else {
      setIsLoadingData(false);
    }
  }, [address, walletUser]);

  // Show loading state
  if (isLoading || isLoadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // Show wallet connection screen if not connected
  if (!isConnected) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-center">Sign in to continue</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <p className="text-center text-gray-600 mb-6">
              Please sign in with your email or connect a wallet to access your dashboard
            </p>
            <ConnectWallet 
              theme="light"
              btnTitle="Sign In"
              modalSize="wide"
              className="w-full"
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
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <div className="text-red-600 max-w-lg text-center">
          {error}
        </div>
        <Button 
          onClick={() => window.location.reload()}
          variant="outline"
        >
          Retry
        </Button>
      </div>
    );
  }

  // If user not found in database
  if (!walletUser) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <div className="text-red-600 max-w-lg text-center">
          Your wallet is connected but we couldn't find your user data. 
          Please try refreshing the page.
        </div>
        <Button 
          onClick={() => window.location.reload()}
          variant="outline"
        >
          Refresh Page
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Profile completion prompt if missing info */}
          {(!walletUser?.display_name) && (
            <ProfileCompletion
              initialDisplayName={walletUser?.display_name ?? undefined}
              initialBusinessName={walletUser?.business_name ?? undefined}
              onComplete={() => window.location.reload()}
            />
          )}
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Welcome, {walletUser?.display_name || 'Business Owner'}</h2>
            <p>Wallet: {address}</p>
            <p>Role: {walletUser?.role || 'Business Owner'}</p>
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Your Businesses</h3>
            {businesses.length > 0 ? (
              <ul className="list-disc pl-5">
                {businesses.map((business) => (
                  <li key={business.id}>
                    {business.name} - {business.status || 'Active'}
                  </li>
                ))}
              </ul>
            ) : (
              <p>You don't have any businesses yet. Add your first business to get started.</p>
            )}
          </div>
          <div className="flex space-x-4 mt-6">
            <Link href="/add-place">
              <Button>
                Add Business
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline">
                Back to Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
