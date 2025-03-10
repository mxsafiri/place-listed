'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  showCategories?: boolean;
  showLocation?: boolean;
  variant?: 'default' | 'compact';
}

export function SearchBar({
  className = '',
  placeholder = 'What are you looking for?',
  showCategories = true,
  showLocation = true,
  variant = 'default',
}: SearchBarProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Build query params
    const params = new URLSearchParams();
    if (searchQuery) params.append('q', searchQuery);
    if (category) params.append('category', category);
    if (location) params.append('location', location);
    
    // Navigate to search results page
    router.push(`/search?${params.toString()}`);
  };

  // Predefined categories
  const categories = [
    { value: '', label: 'Any category' },
    { value: 'food', label: 'Food' },
    { value: 'hotel', label: 'Hotel' },
    { value: 'restaurant', label: 'Restaurant' },
    { value: 'service', label: 'Service' },
    { value: 'retail', label: 'Retail' },
    { value: 'entertainment', label: 'Entertainment' },
  ];

  if (variant === 'compact') {
    return (
      <form onSubmit={handleSearch} className={`flex w-full ${className}`}>
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-l-md focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <button 
          type="submit" 
          className="bg-secondary-500 hover:bg-secondary-600 text-white font-medium py-2 px-4 rounded-r-md transition-colors"
        >
          Search
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSearch} className={`w-full ${className}`}>
      <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row">
        {/* Search Query Input */}
        <div className="flex-grow flex items-center px-4 py-3 border-b md:border-b-0 md:border-r border-gray-200">
          <svg className="w-5 h-5 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder={placeholder}
            className="flex-grow py-2 text-black focus:outline-none focus:ring-0"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Location Input */}
        {showLocation && (
          <div className="flex items-center px-4 py-3 border-b md:border-b-0 md:border-r border-gray-200">
            <svg className="w-5 h-5 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <input
              type="text"
              placeholder="Location"
              className="flex-grow py-2 text-black focus:outline-none focus:ring-0"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        )}
        
        {/* Category Select */}
        {showCategories && (
          <div className="flex items-center px-4 py-3 border-b md:border-b-0 md:border-r border-gray-200">
            <svg className="w-5 h-5 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
            </svg>
            <select
              className="flex-grow py-2 bg-transparent text-black focus:outline-none focus:ring-0 appearance-none cursor-pointer"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        )}
        
        {/* Search Button */}
        <button 
          type="submit" 
          className="bg-secondary-500 hover:bg-secondary-600 text-white font-medium py-3 px-6 transition-colors md:whitespace-nowrap"
        >
          <span className="flex items-center justify-center">
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Search
          </span>
        </button>
      </div>
    </form>
  );
}
