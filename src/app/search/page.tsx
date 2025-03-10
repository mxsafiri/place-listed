'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { BusinessGrid } from '@/frontend/components/business/BusinessGrid';
import { SearchBar } from '@/frontend/components/common/SearchBar';
import { CategorySection } from '@/frontend/components/common/CategorySection';

// Mock data for search results (in a real app, this would come from Algolia/Firestore)
const mockBusinesses = [
  {
    id: "1",
    slug: "mediterraneo",
    name: "Mediterraneo",
    description: "Hotel and Restaurant with beautiful ocean views",
    category: "Hotel",
    location: "Kinondoni TZ",
    rating: 4.8,
    imageUrl: "/images/placeholders/category.jpg",
    isVerified: true,
    tags: ["Hotel", "Restaurant", "Bar"],
  },
  {
    id: "2",
    slug: "zanzibar-hotel",
    name: "The Zanzibari Hotel",
    description: "Luxury accommodations with stunning views",
    category: "Hotel",
    location: "Zanzibar",
    rating: 4.7,
    imageUrl: "/images/placeholders/category.jpg",
    tags: ["Hotel", "Restaurant"],
  },
  {
    id: "3",
    slug: "mojjo-restaurant",
    name: "Mojjo Restaurant & Gastropub",
    description: "MUYENGA's Freshest Culinary Experience",
    category: "Restaurant",
    location: "Kampala",
    rating: 4.5,
    imageUrl: "/images/placeholders/category.jpg",
    isVerified: true,
    tags: ["Restaurant", "Bar"],
  },
  {
    id: "4",
    slug: "taste-me-desserts",
    name: "Taste Me Desserts and Café",
    description: "Delicious desserts and coffee in a beachside setting",
    category: "Cafe",
    location: "Coco Beach",
    rating: 4.6,
    imageUrl: "/images/placeholders/category.jpg",
    tags: ["Cafe", "Desserts"],
  },
  {
    id: "5",
    slug: "ali-barbour-cave",
    name: "Ali Barbour's Cave",
    description: "Seafood Restaurant in a natural cave setting",
    category: "Restaurant",
    location: "Diani Beach, Kenya",
    rating: 4.9,
    imageUrl: "/images/placeholders/category.jpg",
    tags: ["Seafood", "Restaurant"],
  },
  {
    id: "6",
    slug: "club-africando",
    name: "Club Africando",
    description: "From Master Chef Fred Uisso",
    category: "Restaurant",
    location: "Dar es Salaam",
    rating: 4.7,
    imageUrl: "/images/placeholders/category.jpg",
    isVerified: true,
    tags: ["Restaurant", "Bar"],
  },
];

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
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const location = searchParams.get('location') || '';
  
  const [results, setResults] = useState(mockBusinesses);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate API call with a delay
    setLoading(true);
    
    setTimeout(() => {
      // Filter results based on search params
      let filteredResults = [...mockBusinesses];
      
      if (query) {
        filteredResults = filteredResults.filter(business => 
          business.name.toLowerCase().includes(query.toLowerCase()) || 
          business.description.toLowerCase().includes(query.toLowerCase())
        );
      }
      
      if (category) {
        filteredResults = filteredResults.filter(business => 
          business.category.toLowerCase() === category.toLowerCase() ||
          business.tags?.some(tag => tag.toLowerCase() === category.toLowerCase())
        );
      }
      
      if (location) {
        filteredResults = filteredResults.filter(business => 
          business.location.toLowerCase().includes(location.toLowerCase())
        );
      }
      
      setResults(filteredResults);
      setLoading(false);
    }, 500);
  }, [query, category, location]);
  
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
                {query && <span> for "{query}"</span>}
                {category && <span> in {category}</span>}
                {location && <span> near {location}</span>}
              </>
            ) : (
              <>
                No results found
                {query && <span> for "{query}"</span>}
                {category && <span> in {category}</span>}
                {location && <span> near {location}</span>}
              </>
            )}
          </h1>
          <p className="text-gray-600">
            Discover great local businesses that match your search
          </p>
        </div>
        
        {/* Results Grid */}
        <div className="mb-12">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : results.length > 0 ? (
            <BusinessGrid businesses={results} columns={3} />
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <h3 className="text-xl font-semibold mb-2">No matching businesses found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search criteria or browse popular categories below</p>
              
              <div className="flex justify-center">
                <button 
                  onClick={() => {
                    // Reset search
                    window.location.href = '/search';
                  }}
                  className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
                >
                  Clear Search
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Popular Categories */}
        {results.length === 0 && (
          <CategorySection 
            title="Browse Popular Categories"
            subtitle="Find businesses by category"
            categories={popularCategories}
          />
        )}
      </div>
    </main>
  );
}
