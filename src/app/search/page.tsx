'use client';
export const dynamic = "force-dynamic";

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { BusinessGrid } from '@/frontend/components/business/BusinessGrid';
import { SearchBar } from '@/frontend/components/common/SearchBar';
import { CategorySection } from '@/frontend/components/common/CategorySection';
import { mockBusinesses } from '@/backend/services/algolia/config';

// Mock data for popular categories
const popularCategories = [
  {
    name: "Food",
    slug: "food",
    count: 299,
    icon: "/icons/food.svg",
    imageUrl: "/images/placeholders/food.jpg",
  },
  {
    name: "Hotel",
    slug: "hotel",
    count: 254,
    icon: "/icons/hotel.svg",
    imageUrl: "/images/placeholders/hotel.jpg",
  },
  {
    name: "Restaurant",
    slug: "restaurant",
    count: 187,
    icon: "/icons/restaurant.svg",
    imageUrl: "/images/placeholders/category.jpg",
  },
  {
    name: "Free WiFi",
    slug: "wifi",
    count: 44,
    icon: "/icons/wifi.svg",
    imageUrl: "/images/placeholders/category.jpg",
  },
];

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const location = searchParams.get('location') || '';
  
  const [results, setResults] = useState(mockBusinesses);
  const [loading, setLoading] = useState(true);
  
  // Function to update URL with search parameters
  const updateSearchParams = (newParams: { q?: string; category?: string; location?: string }) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Update or remove parameters
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    
    router.push(`/search?${params.toString()}`);
  };
  
  useEffect(() => {
    // Simulate API call with a delay
    setLoading(true);
    
    const timer = setTimeout(() => {
      // Filter results based on search params
      let filteredResults = [...mockBusinesses];
      
      if (query) {
        filteredResults = filteredResults.filter(business => 
          business.name.toLowerCase().includes(query.toLowerCase()) || 
          business.description.toLowerCase().includes(query.toLowerCase()) ||
          (business.tags && business.tags.some(tag => 
            tag.toLowerCase().includes(query.toLowerCase())
          ))
        );
      }
      
      if (category) {
        filteredResults = filteredResults.filter(business => 
          business.category.toLowerCase() === category.toLowerCase() ||
          (business.tags && business.tags.some(tag => 
            tag.toLowerCase() === category.toLowerCase()
          ))
        );
      }
      
      if (location) {
        filteredResults = filteredResults.filter(business => 
          (business.location && business.location.toLowerCase().includes(location.toLowerCase())) ||
          business.address.toLowerCase().includes(location.toLowerCase())
        );
      }
      
      setResults(filteredResults);
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [query, category, location]);
  
  // Handle category click
  const handleCategoryClick = (categorySlug: string) => {
    updateSearchParams({ category: categorySlug });
  };
  
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-primary-700 py-6">
        <div className="container mx-auto px-4">
          <SearchBar 
            showCategories={true} 
            showLocation={true} 
            variant="default"
            className="max-w-4xl mx-auto"
          />
        </div>
      </div>
      
      {/* Search Results */}
      <div className="container mx-auto px-4 py-8">
        {/* Search Summary */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {results.length > 0 ? (
              <>
                {results.length} {results.length === 1 ? 'result' : 'results'} found
                {query && <span> for &quot;{query}&quot;</span>}
                {category && <span> in {category}</span>}
                {location && <span> near {location}</span>}
              </>
            ) : (
              <>
                No results found
                {query && <span> for &quot;{query}&quot;</span>}
                {category && <span> in {category}</span>}
                {location && <span> near {location}</span>}
              </>
            )}
          </h1>
          
          {/* Active Filters */}
          {(query || category || location) && (
            <div className="flex flex-wrap gap-2 mt-4">
              {query && (
                <button
                  onClick={() => updateSearchParams({ q: '' })}
                  className="inline-flex items-center px-3 py-1.5 rounded-full bg-red-100 text-red-800 text-sm"
                >
                  Search: {query}
                  <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              {category && (
                <button
                  onClick={() => updateSearchParams({ category: '' })}
                  className="inline-flex items-center px-3 py-1.5 rounded-full bg-blue-100 text-blue-800 text-sm"
                >
                  Category: {category}
                  <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              {location && (
                <button
                  onClick={() => updateSearchParams({ location: '' })}
                  className="inline-flex items-center px-3 py-1.5 rounded-full bg-green-100 text-green-800 text-sm"
                >
                  Location: {location}
                  <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              {(query || category || location) && (
                <button
                  onClick={() => router.push('/search')}
                  className="inline-flex items-center px-3 py-1.5 rounded-full bg-gray-100 text-gray-800 text-sm"
                >
                  Clear All Filters
                  <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Categories */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Categories</h2>
              <ul className="space-y-2">
                {popularCategories.map((cat) => (
                  <li key={cat.slug}>
                    <button
                      onClick={() => handleCategoryClick(cat.slug)}
                      className={`flex items-center w-full text-left px-2 py-1.5 rounded hover:bg-gray-100 transition-colors ${
                        category === cat.slug ? 'bg-red-50 text-red-700' : 'text-gray-700'
                      }`}
                    >
                      <span className="flex-1">{cat.name}</span>
                      <span className="text-sm text-gray-500">{cat.count}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Main Content - Results */}
          <div className="lg:col-span-3">
            {loading ? (
              // Loading state
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
              </div>
            ) : results.length > 0 ? (
              // Results
              <BusinessGrid businesses={results} />
            ) : (
              // No results
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-600 mb-6">
                  We couldn&apos;t find any businesses matching your search criteria.
                </p>
                <button
                  onClick={() => router.push('/search')}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
