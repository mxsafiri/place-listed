'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/frontend/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/frontend/components/ui/Card';
import AIReviewManager from '@/components/AIReviewManager';
import MiniShop from '@/components/MiniShop';
import { useSearchParams } from 'next/navigation';

// Mock data for saved businesses
const savedBusinesses = [
  {
    id: "1",
    slug: "savory-bites",
    name: "Savory Bites Restaurant",
    description: "Fine dining with a modern twist, serving a fusion of local and international cuisines in an elegant setting.",
    category: "Restaurant",
    location: "Nairobi, Kenya",
    rating: 4.8,
    image: "/images/placeholders/restaurant.jpg",
    products: [
      {
        id: '1',
        name: 'Special Dinner for Two',
        description: 'Three-course meal with wine pairing',
        price: 79.99,
        image: '/images/placeholders/food.jpg'
      },
      {
        id: '2',
        name: 'Cooking Class',
        description: 'Learn to cook our signature dishes',
        price: 49.99,
        image: '/images/placeholders/food.jpg'
      }
    ]
  },
  {
    id: "2",
    slug: "tech-solutions",
    name: "Tech Solutions Hub",
    description: "Professional IT services and computer repairs for individuals and businesses.",
    category: "Services",
    location: "Lagos, Nigeria",
    rating: 4.5,
    image: "/images/placeholders/service.jpg",
    products: [
      {
        id: '1',
        name: 'Computer Repair',
        description: 'Basic diagnostics and repair service',
        price: 59.99,
        image: '/images/placeholders/category.jpg'
      },
      {
        id: '2',
        name: 'Website Setup',
        description: 'Basic business website setup',
        price: 299.99,
        image: '/images/placeholders/category.jpg'
      }
    ]
  },
  {
    id: "3",
    slug: "green-earth",
    name: "Green Earth Market",
    description: "Organic produce and eco-friendly products for environmentally conscious consumers.",
    category: "Retail",
    location: "Cape Town, South Africa",
    rating: 4.7,
    image: "/images/placeholders/retail.jpg",
    products: [
      {
        id: '1',
        name: 'Organic Produce Box',
        description: 'Weekly selection of seasonal organic vegetables',
        price: 35.99,
        image: '/images/placeholders/category.jpg'
      },
      {
        id: '2',
        name: 'Eco-Friendly Starter Kit',
        description: 'Essential reusable household items',
        price: 45.99,
        image: '/images/placeholders/category.jpg'
      }
    ]
  }
];

// Mock data for recent reviews
const recentReviews = [
  {
    id: "r1",
    author: "You",
    businessId: "1",
    businessName: "Savory Bites Restaurant",
    businessSlug: "savory-bites",
    rating: 5,
    comment: "Amazing food and excellent service! Will definitely come back.",
    date: "2023-12-15",
  },
  {
    id: "r2",
    author: "You",
    businessId: "3",
    businessName: "Green Earth Market",
    businessSlug: "green-earth",
    rating: 4,
    comment: "Great selection of organic products. A bit pricey but worth it.",
    date: "2023-11-28",
  },
];

// Mock user data
const userData = {
  name: "John Doe",
  email: "john.doe@example.com",
  joinDate: "January 2023",
};

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState('saved');
  const [expandedBusiness, setExpandedBusiness] = useState<string | null>(null);
  const [viewProducts, setViewProducts] = useState(false);
  
  useEffect(() => {
    // Get tab from URL query params
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    }
    
    // Get business from URL query params
    const businessParam = searchParams.get('business');
    if (businessParam) {
      setExpandedBusiness(businessParam);
    }
    
    // Check if we should view products
    const viewParam = searchParams.get('view');
    if (viewParam === 'products') {
      setViewProducts(true);
    }
  }, [searchParams]);
  
  return (
    <main className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">
          <strong className="font-bold">Updated Dashboard!</strong>
          <span className="text-xs text-red-600">(Updated)</span>
          <span className="block sm:inline"> You're now viewing the enhanced dashboard with Mini Shop features.</span>
        </div>
        
        <h1 className="text-3xl font-bold text-black mb-8">My Dashboard</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center mb-6">
                  <div className="flex items-center mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <h2 className="text-xl font-bold text-black">{userData.name}</h2>
                  </div>
                  <p className="text-black">Member since {userData.joinDate}</p>
                </div>
                
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full text-left px-4 py-2 rounded-lg transition ${
                      activeTab === 'profile' 
                        ? 'bg-red-100 text-red-700' 
                        : 'hover:bg-gray-100 text-black'
                    }`}
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => setActiveTab('saved')}
                    className={`w-full text-left px-4 py-2 rounded-lg transition ${
                      activeTab === 'saved' 
                        ? 'bg-red-100 text-red-700' 
                        : 'hover:bg-gray-100 text-black'
                    }`}
                  >
                    Saved Businesses
                  </button>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className={`w-full text-left px-4 py-2 rounded-lg transition ${
                      activeTab === 'reviews' 
                        ? 'bg-red-100 text-red-700' 
                        : 'hover:bg-gray-100 text-black'
                    }`}
                  >
                    My Reviews
                  </button>
                  <button
                    onClick={() => setActiveTab('ai-manager')}
                    className={`w-full text-left px-4 py-2 rounded-lg transition ${
                      activeTab === 'ai-manager' 
                        ? 'bg-red-100 text-red-700' 
                        : 'hover:bg-gray-100 text-black'
                    }`}
                  >
                    AI Review Manager
                  </button>
                  <button
                    onClick={() => setActiveTab('shop')}
                    className={`w-full text-left px-4 py-2 rounded-lg transition ${
                      activeTab === 'shop' 
                        ? 'bg-red-100 text-red-700' 
                        : 'hover:bg-gray-100 text-black'
                    }`}
                  >
                    Mini Shop
                  </button>
                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`w-full text-left px-4 py-2 rounded-lg transition ${
                      activeTab === 'settings' 
                        ? 'bg-red-100 text-red-700' 
                        : 'hover:bg-gray-100 text-black'
                    }`}
                  >
                    Account Settings
                  </button>
                </nav>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <Button variant="outline" fullWidth={true}>
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-black">My Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="border border-gray-200 rounded-md p-4 bg-white">
                      <h3 className="text-lg font-medium text-black mb-2">Personal Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-1">Full Name</label>
                          <input
                            type="text"
                            value={userData.name}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
                            readOnly
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-1">Email Address</label>
                          <input
                            type="email"
                            value={userData.email}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
                            readOnly
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-black mb-2">Account Statistics</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white p-4 rounded-lg">
                          <div className="text-3xl font-bold text-red-600">{savedBusinesses.length}</div>
                          <div className="text-black">Saved Businesses</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg">
                          <div className="text-3xl font-bold text-red-600">{recentReviews.length}</div>
                          <div className="text-black">Reviews Written</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg">
                          <div className="text-3xl font-bold text-red-600">0</div>
                          <div className="text-black">Business Claimed</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <Button variant="primary">Edit Profile</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Saved Businesses Tab */}
            {activeTab === 'saved' && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-black">Saved Businesses <span className="text-xs text-red-600">(Updated)</span></CardTitle>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      Filter
                    </Button>
                    <Button variant="outline" size="sm">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Sort
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {savedBusinesses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {savedBusinesses.map((business) => (
                        <div key={business.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                          {/* Image Section with Category Badge */}
                          <div className="relative h-40 bg-gray-100">
                            <Image
                              src={business.category === "Restaurant" ? "/images/placeholders/food.jpg" : 
                                   business.category === "Hospitality" ? "/images/placeholders/hotel.jpg" : 
                                   "/images/placeholders/category.jpg"}
                              alt={business.name}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                            {/* Category Badge */}
                            <div className="absolute top-2 left-2">
                              <span className="bg-white/90 text-red-600 text-xs font-medium px-2 py-1 rounded-full">
                                {business.category}
                              </span>
                            </div>
                            {/* Rating Badge */}
                            <div className="absolute bottom-2 right-2">
                              <span className="bg-white/90 text-yellow-600 text-xs font-medium px-2 py-1 rounded-full flex items-center">
                                <span className="text-yellow-400 mr-1">★</span>
                                {business.rating}
                              </span>
                            </div>
                          </div>
                          
                          {/* Content Section */}
                          <div className="p-4">
                            <div className="mb-2">
                              <h3 className="text-lg font-semibold">
                                <Link href={`/business/${business.slug}`} className="text-red-600 hover:text-red-700">
                                  {business.name}
                                </Link>
                              </h3>
                              <div className="flex items-center text-sm text-gray-600 mt-1">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>{business.location}</span>
                              </div>
                            </div>
                            
                            <p className="text-sm text-black mb-4 line-clamp-2">{business.description}</p>
                            
                            {/* Business Features */}
                            <div className="flex flex-wrap gap-1 mb-4">
                              <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">Free WiFi</span>
                              <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">Parking</span>
                              <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">Delivery</span>
                            </div>
                            
                            {/* Mini Shop Section */}
                            <div className="border-t border-gray-100 pt-3 mb-3">
                              <div className="flex justify-between items-center mb-2">
                                <h4 className="text-sm font-medium text-black">Mini Shop</h4>
                                <button 
                                  onClick={() => setExpandedBusiness(expandedBusiness === business.id ? null : business.id)}
                                  className="text-xs text-red-600 hover:text-red-700"
                                >
                                  {expandedBusiness === business.id ? 'Hide Products' : 'View Products'}
                                </button>
                              </div>
                              
                              {(expandedBusiness === business.id || expandedBusiness === business.slug) && business.products && (
                                <div className="space-y-3 mt-2">
                                  {business.products.map((product) => (
                                    <div key={product.id} className="flex items-start border border-gray-100 rounded-md p-2 hover:bg-gray-50">
                                      <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0 mr-3">
                                        <Image
                                          src={product.image}
                                          alt={product.name}
                                          fill
                                          className="object-cover"
                                          unoptimized
                                        />
                                      </div>
                                      <div className="flex-grow min-w-0">
                                        <div className="flex justify-between items-start">
                                          <h5 className="text-xs font-medium text-black truncate">{product.name}</h5>
                                          <span className="text-xs font-bold text-red-600 ml-1 whitespace-nowrap">${product.price.toFixed(2)}</span>
                                        </div>
                                        <p className="text-xs text-gray-600 line-clamp-1">{product.description}</p>
                                      </div>
                                    </div>
                                  ))}
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="w-full text-xs text-red-600 border-red-600 hover:bg-red-50 mt-2"
                                    onClick={() => setViewProducts(false)}
                                  >
                                    View All Products
                                  </Button>
                                </div>
                              )}
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex justify-between items-center border-t border-gray-100 pt-3 mt-1">
                              <div className="flex space-x-2">
                                <Button variant="outline" size="sm" className="text-black">
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                  </svg>
                                  Call
                                </Button>
                                <Button variant="outline" size="sm" className="text-black">
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  Hours
                                </Button>
                              </div>
                              <Button variant="primary" size="sm">
                                <Link href={`/business/${business.slug}`} className="text-white">
                                  View Details
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-black mb-4">You haven't saved any businesses yet.</p>
                      <Button href="/businesses" variant="primary">
                        Explore Businesses
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
            
            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-black">My Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  {recentReviews.length > 0 ? (
                    <div className="space-y-6">
                      {recentReviews.map((review) => (
                        <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                          <div className="flex justify-between mb-2">
                            <Link href={`/business/${review.businessSlug}`} className="font-medium text-red-600 hover:underline">
                              {review.businessName}
                            </Link>
                            <span className="text-sm text-black">{review.date}</span>
                          </div>
                          <div className="flex mb-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <svg
                                key={i}
                                className={`w-5 h-5 ${
                                  i < review.rating ? "text-yellow-400" : "text-gray-300"
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <p className="text-black mb-3">{review.comment}</p>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">Edit</Button>
                            <Button variant="outline" size="sm" className="text-red-500">Delete</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-black mb-4">You haven't written any reviews yet.</p>
                      <Button href="/businesses" variant="primary">
                        Explore Businesses to Review
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
            
            {/* AI Review Manager Tab */}
            {activeTab === 'ai-manager' && (
              <AIReviewManager reviews={recentReviews} />
            )}
            
            {/* Mini Shop Tab */}
            {activeTab === 'shop' && (
              <MiniShop />
            )}
            
            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-black">Account Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-black mb-4">Change Password</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-1">Current Password</label>
                          <input
                            type="password"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-1">New Password</label>
                          <input
                            type="password"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-1">Confirm New Password</label>
                          <input
                            type="password"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-black"
                          />
                        </div>
                        <Button variant="primary">Update Password</Button>
                      </div>
                    </div>
                    
                    <div className="pt-6 border-t border-gray-200">
                      <h3 className="text-lg font-medium text-black mb-4">Notification Preferences</h3>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="email-notifications"
                            className="h-4 w-4 text-red-600 border-gray-300 rounded"
                            defaultChecked
                          />
                          <label htmlFor="email-notifications" className="ml-2 text-gray-900">
                            Email Notifications
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="review-responses"
                            className="h-4 w-4 text-red-600 border-gray-300 rounded"
                            defaultChecked
                          />
                          <label htmlFor="review-responses" className="ml-2 text-gray-900">
                            Notify me when someone responds to my review
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="marketing-emails"
                            className="h-4 w-4 text-red-600 border-gray-300 rounded"
                          />
                          <label htmlFor="marketing-emails" className="ml-2 text-gray-900">
                            Marketing emails and newsletters
                          </label>
                        </div>
                      </div>
                      <div className="mt-4">
                        <Button variant="primary">Save Preferences</Button>
                      </div>
                    </div>
                    
                    <div className="pt-6 border-t border-gray-200">
                      <h3 className="text-lg font-medium text-red-600 mb-4">Danger Zone</h3>
                      <p className="text-black mb-4">
                        Once you delete your account, there is no going back. Please be certain.
                      </p>
                      <Button variant="destructive">Delete Account</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
