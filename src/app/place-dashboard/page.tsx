'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/frontend/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/frontend/components/ui/Card';
import AIReviewManager from '@/components/AIReviewManager';
import MiniShop from '@/components/MiniShop';

// Mock data for business owner's places
const myPlaces = [
  {
    id: "1",
    slug: "savory-bites",
    name: "Savory Bites Restaurant",
    description: "Fine dining with a modern twist",
    category: "Restaurant",
    location: "Nairobi, Kenya",
    views: 1245,
    rating: 4.8,
  },
  {
    id: "2",
    slug: "tech-solutions",
    name: "Tech Solutions Hub",
    description: "IT services and computer repairs",
    category: "Services",
    location: "Lagos, Nigeria",
    views: 876,
    rating: 4.5,
  },
];

// Mock data for recent reviews
const recentReviews = [
  {
    id: "r1",
    placeId: "1",
    placeName: "Savory Bites Restaurant",
    rating: 5,
    comment: "Amazing food and excellent service! Will definitely come back.",
    author: "John Doe",
    date: "2023-12-15",
  },
  {
    id: "r2",
    placeId: "1",
    placeName: "Savory Bites Restaurant",
    rating: 4,
    comment: "Great food but the wait was a bit long. Otherwise excellent!",
    author: "Jane Smith",
    date: "2023-11-28",
  },
];

// Mock user data
const userData = {
  name: "Sarah Johnson",
  email: "sarah@example.com",
  phone: "+254 123 456 789",
  businessName: "Sarah's Enterprises",
  joinDate: "January 2023",
};

export default function PlaceDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-black mb-8">Business Dashboard</h1>
        
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
                  <p className="text-black">{userData.businessName}</p>
                  <p className="text-black">Member since {userData.joinDate}</p>
                </div>
                
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`w-full text-left px-4 py-2 rounded-lg transition ${
                      activeTab === 'overview' 
                        ? 'bg-red-100 text-red-700' 
                        : 'hover:bg-gray-100 text-black'
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab('places')}
                    className={`w-full text-left px-4 py-2 rounded-lg transition ${
                      activeTab === 'places' 
                        ? 'bg-red-100 text-red-700' 
                        : 'hover:bg-gray-100 text-black'
                    }`}
                  >
                    My Places
                  </button>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className={`w-full text-left px-4 py-2 rounded-lg transition ${
                      activeTab === 'reviews' 
                        ? 'bg-red-100 text-red-700' 
                        : 'hover:bg-gray-100 text-black'
                    }`}
                  >
                    Reviews
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
                    onClick={() => setActiveTab('analytics')}
                    className={`w-full text-left px-4 py-2 rounded-lg transition ${
                      activeTab === 'analytics' 
                        ? 'bg-red-100 text-red-700' 
                        : 'hover:bg-gray-100 text-black'
                    }`}
                  >
                    Analytics
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
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center">
                        <h3 className="text-xl font-semibold text-black">Total Places</h3>
                        <p className="text-3xl font-bold text-red-600 mt-2">{myPlaces.length}</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center">
                        <h3 className="text-xl font-semibold text-black">Total Views</h3>
                        <p className="text-3xl font-bold text-red-600 mt-2">
                          {myPlaces.reduce((total, place) => total + place.views, 0)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center">
                        <h3 className="text-xl font-semibold text-black">Avg. Rating</h3>
                        <p className="text-3xl font-bold text-red-600 mt-2">
                          {(myPlaces.reduce((total, place) => total + place.rating, 0) / myPlaces.length).toFixed(1)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-black">Recent Reviews</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentReviews.map(review => (
                        <div key={review.id} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-black">{review.author}</p>
                              <p className="text-sm text-black">{review.date}</p>
                            </div>
                            <div className="flex items-center bg-yellow-100 px-2 py-1 rounded">
                              <span className="text-yellow-700 font-medium">{review.rating}/5</span>
                            </div>
                          </div>
                          <p className="mt-2 text-black">{review.comment}</p>
                          <p className="mt-1 text-sm text-black">For: {review.placeName}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <div className="flex justify-center">
                  <Button variant="primary" className="mt-4 text-white">
                    <Link href="/add-place">Add New Place</Link>
                  </Button>
                </div>
              </div>
            )}
            
            {activeTab === 'places' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-black">My Places</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {myPlaces.map(place => (
                        <div key={place.id} className="border rounded-lg p-4 hover:shadow-md transition">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="text-lg font-semibold text-black">{place.name}</h3>
                              <p className="text-black">{place.category} • {place.location}</p>
                              <p className="text-sm text-black mt-1">{place.description}</p>
                            </div>
                            <div className="flex flex-col items-end">
                              <div className="flex items-center bg-yellow-100 px-2 py-1 rounded mb-2">
                                <span className="text-yellow-700 font-medium">{place.rating}/5</span>
                              </div>
                              <p className="text-sm text-black">{place.views} views</p>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-4">
                            <Button variant="outline" size="sm" className="text-black">
                              <Link href={`/business/${place.slug}`}>View</Link>
                            </Button>
                            <Button variant="outline" size="sm" className="text-black">Edit</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <div className="flex justify-center">
                  <Button variant="primary" className="mt-4 text-white">
                    <Link href="/add-place">Add New Place</Link>
                  </Button>
                </div>
              </div>
            )}
            
            {/* AI Review Manager Tab */}
            {activeTab === 'ai-manager' && (
              <AIReviewManager reviews={recentReviews} />
            )}
            
            {/* Mini Shop Tab */}
            {activeTab === 'shop' && (
              <MiniShop />
            )}
            
            {activeTab === 'reviews' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-black">All Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-black">Expanded reviews section would go here</p>
                </CardContent>
              </Card>
            )}
            
            {activeTab === 'analytics' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-black">Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-black">Detailed analytics would go here</p>
                </CardContent>
              </Card>
            )}
            
            {activeTab === 'settings' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-black">Account Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-black">Account settings would go here</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
