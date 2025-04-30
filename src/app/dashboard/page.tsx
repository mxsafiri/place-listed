'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/frontend/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/frontend/components/ui/Card';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useRouter } from 'next/navigation';
import { Business } from '@/lib/business-service';
import { Review } from '@/lib/review-service';
import { SavedBusiness } from '@/lib/saved-business-service';

// Import Supabase services
import { getBusinessesByOwner } from '@/backend/api/business';
import { getUserReviews } from '@/backend/api/reviews';
import { getSavedBusinesses } from '@/backend/api/business';

export default function DashboardPage() {
  const router = useRouter();
  const { user, profile, isAuthenticated, isLoading } = useAuth();
  
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [savedBusinesses, setSavedBusinesses] = useState<SavedBusiness[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    // Redirect if not authenticated
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login?redirect=/dashboard');
      return;
    }

    // Fetch data if authenticated
    if (isAuthenticated && user) {
      const fetchData = async () => {
        setIsLoadingData(true);
        try {
          // Fetch businesses owned by the user
          if (profile?.role === 'business_owner') {
            const userBusinesses = await getBusinessesByOwner(user.id);
            setBusinesses(userBusinesses);
          }

          // Fetch saved businesses
          const userSavedBusinesses = await getSavedBusinesses(user.id);
          setSavedBusinesses(userSavedBusinesses);

          // Fetch reviews by the user
          const userReviews = await getUserReviews(user.id);
          setReviews(userReviews);
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
        } finally {
          setIsLoadingData(false);
        }
      };

      fetchData();
    }
  }, [isAuthenticated, isLoading, user, profile, router]);

  // Show loading state
  if (isLoading || isLoadingData) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-900">Loading...</h1>
            <p className="mt-4 text-lg text-gray-500">Please wait while we load your dashboard.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-lg text-gray-600">
            Welcome back, {profile?.display_name || user?.email?.split('@')[0] || 'User'}
          </p>
        </div>

        {/* Dashboard Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`${
                activeTab === 'overview'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Overview
            </button>
            
            {profile?.role === 'business_owner' && (
              <button
                onClick={() => setActiveTab('businesses')}
                className={`${
                  activeTab === 'businesses'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                My Businesses
              </button>
            )}
            
            <button
              onClick={() => setActiveTab('saved')}
              className={`${
                activeTab === 'saved'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Saved Places
            </button>
            
            <button
              onClick={() => setActiveTab('reviews')}
              className={`${
                activeTab === 'reviews'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              My Reviews
            </button>
          </nav>
        </div>

        {/* Dashboard Content */}
        <div className="mt-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Stats Cards */}
              <Card>
                <CardHeader>
                  <CardTitle>My Businesses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{businesses.length}</div>
                  <p className="text-gray-500 mt-2">
                    {businesses.length === 0 
                      ? "You haven't added any businesses yet." 
                      : "Businesses you've added to PlaceListed."}
                  </p>
                  {profile?.role === 'business_owner' && (
                    <Button 
                      className="mt-4" 
                      onClick={() => router.push('/business/create')}
                    >
                      Add Business
                    </Button>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Saved Places</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{savedBusinesses.length}</div>
                  <p className="text-gray-500 mt-2">
                    {savedBusinesses.length === 0 
                      ? "You haven't saved any places yet." 
                      : "Places you've saved for later."}
                  </p>
                  <Button 
                    className="mt-4" 
                    variant="outline" 
                    onClick={() => router.push('/businesses')}
                  >
                    Discover Places
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>My Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{reviews.length}</div>
                  <p className="text-gray-500 mt-2">
                    {reviews.length === 0 
                      ? "You haven't written any reviews yet." 
                      : "Reviews you've written."}
                  </p>
                  <Button 
                    className="mt-4" 
                    variant="outline" 
                    onClick={() => setActiveTab('reviews')}
                  >
                    View Reviews
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* My Businesses Tab */}
          {activeTab === 'businesses' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">My Businesses</h2>
                <Button onClick={() => router.push('/business/create')}>
                  Add Business
                </Button>
              </div>

              {businesses.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-900">No businesses yet</h3>
                  <p className="mt-2 text-gray-500">
                    You haven't added any businesses to PlaceListed yet.
                  </p>
                  <Button 
                    className="mt-4" 
                    onClick={() => router.push('/business/create')}
                  >
                    Add Your First Business
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {businesses.map((business) => (
                    <Card key={business.id}>
                      <div className="relative h-48 w-full">
                        <Image
                          src={business.photos?.main || '/images/placeholders/business.jpg'}
                          alt={business.name}
                          fill
                          className="object-cover rounded-t-lg"
                        />
                      </div>
                      <CardContent className="pt-4">
                        <h3 className="text-xl font-bold">{business.name}</h3>
                        <p className="text-gray-500 text-sm mb-2">{business.category}</p>
                        <p className="text-gray-700 line-clamp-2 mb-4">
                          {business.description || 'No description provided.'}
                        </p>
                        <div className="flex justify-between">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => router.push(`/business/${business.slug}`)}
                          >
                            View
                          </Button>
                          <Button 
                            size="sm" 
                            onClick={() => router.push(`/business/edit/${business.id}`)}
                          >
                            Edit
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Saved Places Tab */}
          {activeTab === 'saved' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Saved Places</h2>
              
              {savedBusinesses.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-900">No saved places</h3>
                  <p className="mt-2 text-gray-500">
                    You haven't saved any places yet. Explore businesses and save the ones you like.
                  </p>
                  <Button 
                    className="mt-4" 
                    onClick={() => router.push('/businesses')}
                  >
                    Discover Places
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {savedBusinesses.map((saved) => {
                    const business = saved.business;
                    if (!business) return null;
                    
                    return (
                      <Card key={saved.id}>
                        <div className="relative h-48 w-full">
                          <Image
                            src={business.photos?.main || '/images/placeholders/business.jpg'}
                            alt={business.name}
                            fill
                            className="object-cover rounded-t-lg"
                          />
                        </div>
                        <CardContent className="pt-4">
                          <h3 className="text-xl font-bold">{business.name}</h3>
                          <p className="text-gray-500 text-sm mb-2">{business.category}</p>
                          <p className="text-gray-700 line-clamp-2 mb-4">
                            {business.description || 'No description provided.'}
                          </p>
                          <Button 
                            className="w-full" 
                            onClick={() => router.push(`/business/${business.slug}`)}
                          >
                            View Details
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* My Reviews Tab */}
          {activeTab === 'reviews' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">My Reviews</h2>
              
              {reviews.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-900">No reviews yet</h3>
                  <p className="mt-2 text-gray-500">
                    You haven't written any reviews yet. Visit a business page to leave a review.
                  </p>
                  <Button 
                    className="mt-4" 
                    onClick={() => router.push('/businesses')}
                  >
                    Discover Places
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-bold">
                              {review.businesses?.name || 'Business'}
                            </h3>
                            <div className="flex items-center mt-1">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`w-5 h-5 ${
                                    i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                                  }`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                              <span className="ml-2 text-gray-600">
                                {review.created_at && new Date(review.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => router.push(`/business/${review.businesses?.slug || '#'}`)}
                          >
                            View Business
                          </Button>
                        </div>
                        <p className="mt-4 text-gray-700">
                          {review.comment || 'No comment provided.'}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
