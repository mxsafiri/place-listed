'use client';
export const dynamic = "force-dynamic";

import React, { useEffect, useState, Suspense } from 'react';
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

// Client component that uses useSearchParams
function SearchContent() {
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
    }, 500); // Simulate network delay
    
    return () => clearTimeout(timer);
  }, [query, category, location]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Get values from form elements
    const form = e.target as HTMLFormElement;
    const searchInput = form.querySelector('input[type="text"]') as HTMLInputElement;
    const categorySelect = form.querySelector('select[name="category"]') as HTMLSelectElement;
    const locationInput = form.querySelector('input[name="location"]') as HTMLInputElement;
    
    updateSearchParams({
      q: searchInput?.value || '',
      category: categorySelect?.value || '',
      location: locationInput?.value || ''
    });
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero section with search */}
      <div className="bg-red-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
              Find the perfect place
            </h1>
            <p className="mt-3 max-w-md mx-auto text-white text-opacity-90 sm:text-lg">
              Discover and explore local businesses in your area
            </p>
          </div>
          
          <div className="mt-8">
            <SearchBar 
              placeholder="Search for businesses, restaurants, hotels..."
              showCategories={true}
              showLocation={true}
            />
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search results */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {query || category || location ? 'Search Results' : 'Featured Places'}
            </h2>
            {(query || category || location) && (
              <div className="flex space-x-2">
                {query && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                    {query}
                    <button 
                      onClick={() => updateSearchParams({ q: '' })}
                      className="ml-1 text-red-500 hover:text-red-700"
                    >
                      &times;
                    </button>
                  </span>
                )}
                {category && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {category}
                    <button 
                      onClick={() => updateSearchParams({ category: '' })}
                      className="ml-1 text-blue-500 hover:text-blue-700"
                    >
                      &times;
                    </button>
                  </span>
                )}
                {location && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    {location}
                    <button 
                      onClick={() => updateSearchParams({ location: '' })}
                      className="ml-1 text-green-500 hover:text-green-700"
                    >
                      &times;
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>
          
          <BusinessGrid businesses={results} />
          
          {results.length === 0 && !loading && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900">No results found</h3>
              <p className="mt-2 text-sm text-gray-500">
                Try adjusting your search criteria or browse categories below
              </p>
            </div>
          )}
        </div>
        
        {/* Categories section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Popular Categories
          </h2>
          <CategorySection 
            title="Browse by Category"
            categories={popularCategories}
          />
        </div>
      </div>
    </div>
  );
}

// Main page component with Suspense boundary
export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
