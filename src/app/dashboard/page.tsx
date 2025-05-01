'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/frontend/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/frontend/components/ui/Card';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/frontend/components/ui/LoadingSpinner';

// Import Supabase services
import { getBusinessesByOwner } from '@/backend/api/business';

export default function DashboardPage() {
  const router = useRouter();
  const { user, profile, isAuthenticated, isLoading, setDemoMode } = useAuth();
  
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [businesses, setBusinesses] = useState<any[]>([]);

  // Enable demo mode for testing
  useEffect(() => {
    // This will enable demo mode automatically for testing
    if (!isAuthenticated && !isLoading) {
      console.log('Enabling demo mode for testing');
      setDemoMode(true);
    }
  }, [isAuthenticated, isLoading, setDemoMode]);

  useEffect(() => {
    // For debugging - log authentication state
    console.log('Auth State:', { isLoading, isAuthenticated, user, profile });
    
    // Wait for auth to initialize
    if (isLoading) {
      return;
    }
    
    // Skip redirect for now to allow demo mode to work
    // if (!isAuthenticated) {
    //   window.location.href = '/auth/login?redirect=/dashboard';
    //   return;
    // }

    // Fetch minimal data if authenticated
    if (isAuthenticated && user) {
      const fetchData = async () => {
        setIsLoadingData(true);
        setError(null);
        
        try {
          // Only try to fetch businesses if user is a business owner
          if (profile?.role === 'business_owner') {
            console.log('Fetching businesses for owner:', user.id);
            const userBusinesses = await getBusinessesByOwner(user.id);
            console.log('Fetched businesses:', userBusinesses);
            setBusinesses(userBusinesses || []);
          }
        } catch (error: any) {
          console.error('Error fetching dashboard data:', error);
          setError(error.message || 'Error loading dashboard data');
        } finally {
          setIsLoadingData(false);
        }
      };

      fetchData();
    } else {
      // For demo mode, set loading to false even without authentication
      setIsLoadingData(false);
    }
  }, [isLoading, isAuthenticated, user, profile, router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen p-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Error Loading Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{error}</p>
            <p className="mb-4">Please try refreshing the page or contact support if the issue persists.</p>
            <Button onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show demo dashboard if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen p-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Demo Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">Welcome, Demo Business Owner</h2>
              <p>Email: demo@example.com</p>
              <p>Role: business_owner</p>
              <p>Business Name: Demo Business</p>
            </div>
            
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Your Businesses</h3>
              <ul className="list-disc pl-5">
                <li>Demo Restaurant - Active</li>
                <li>Demo Shop - Active</li>
              </ul>
            </div>
            
            <div className="flex space-x-4 mt-6">
              <Button>
                Add Business
              </Button>
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

  // Render simplified dashboard for authenticated users
  return (
    <div className="min-h-screen p-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Welcome, {profile?.display_name || 'Business Owner'}</h2>
            <p>Email: {user?.email}</p>
            <p>Role: {profile?.role || 'Unknown'}</p>
            <p>Business Name: {profile?.business_name || 'Not set'}</p>
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
            <Button>
              Add Business
            </Button>
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
