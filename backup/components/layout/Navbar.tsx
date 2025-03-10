'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import UserProfileMenu from './UserProfileMenu';

// Define category types for the dropdown
const categories = [
  {
    name: "All Listings",
    slug: "/businesses",
    subcategories: []
  },
  {
    name: "Food",
    slug: "/businesses/food",
    subcategories: [
      { name: "Café", slug: "/businesses/food/cafe" },
      { name: "Pizza Place", slug: "/businesses/food/pizza" },
      { name: "Restaurant", slug: "/businesses/food/restaurant" },
      { name: "Winery", slug: "/businesses/food/winery" }
    ]
  },
  {
    name: "Entertainment",
    slug: "/businesses/entertainment",
    subcategories: []
  },
  {
    name: "Lodging",
    slug: "/businesses/lodging",
    subcategories: []
  },
  {
    name: "Nightlife",
    slug: "/businesses/nightlife",
    subcategories: []
  },
  {
    name: "Outdoors",
    slug: "/businesses/outdoors",
    subcategories: []
  },
  {
    name: "Shops",
    slug: "/businesses/shops",
    subcategories: []
  }
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showDiscoverDropdown, setShowDiscoverDropdown] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("Food");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDiscoverDropdown(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-black/40 backdrop-blur-md text-white sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="w-8 h-8 relative mr-2">
              <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-primary-500">
                <path 
                  d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" 
                  fill="currentColor"
                />
              </svg>
            </div>
            <span className="text-xl font-bold text-white">PlaceListed</span>
          </Link>

          {/* Desktop Navigation - Center */}
          <div className="hidden md:flex items-center space-x-8 relative">
            <div ref={dropdownRef}>
              <button 
                className="text-white hover:text-primary-400 transition duration-300 flex items-center"
                onClick={() => setShowDiscoverDropdown(!showDiscoverDropdown)}
                onMouseEnter={() => setShowDiscoverDropdown(true)}
              >
                <span className="mr-1">#Discover</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Dropdown Menu */}
              {showDiscoverDropdown && (
                <div 
                  className="absolute left-0 mt-2 bg-white text-gray-800 rounded-md shadow-lg z-50 w-[425px] flex animate-fade-in"
                  onMouseLeave={() => setShowDiscoverDropdown(false)}
                >
                  {/* Categories Column */}
                  <div className="w-[40%] border-r border-gray-200">
                    <ul>
                      {categories.map((category) => (
                        <li 
                          key={category.name}
                          className={`px-4 py-3 hover:bg-gray-100 cursor-pointer transition duration-200 ${
                            activeCategory === category.name 
                              ? 'border-l-4 border-red-500 pl-3 font-medium' 
                              : ''
                          }`}
                          onMouseEnter={() => setActiveCategory(category.name)}
                        >
                          <div className="flex items-center justify-between">
                            <span>{category.name}</span>
                            {category.subcategories.length > 0 && (
                              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Subcategories Column */}
                  <div className="w-[60%] bg-gray-50">
                    {activeCategory && (
                      <ul className="py-2">
                        {categories.find(cat => cat.name === activeCategory)?.subcategories.map((subcat) => (
                          <li key={subcat.name}>
                            <Link 
                              href={subcat.slug}
                              className="block px-6 py-2 hover:bg-gray-100 transition duration-200"
                              onClick={() => setShowDiscoverDropdown(false)}
                            >
                              {subcat.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/help" className="text-white hover:text-primary-400 transition duration-300 flex items-center">
              <span className="mr-1">Help</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </Link>
            <div className="relative" 
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <Link 
                href="/add-place" 
                className="bg-gray-800/80 backdrop-blur-sm hover:bg-gray-700 text-white px-5 py-2 rounded-md transition duration-300 flex items-center text-sm border border-gray-700 shadow-md"
              >
                <span className="mr-1">Add a Place</span>
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </Link>
              {showTooltip && (
                <div className="absolute right-0 mt-2 w-64 bg-gray-900 text-white text-xs rounded-md shadow-lg p-3 z-50 animate-fade-in">
                  <p>For business owners: List your business on PlaceListed to become digitally discoverable.</p>
                </div>
              )}
            </div>
            <UserProfileMenu />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-primary-400 focus:outline-none"
            >
              <svg 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M6 18L18 6M6 6l12 12" 
                  />
                ) : (
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4 6h16M4 12h16M4 18h16" 
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-900/90 backdrop-blur-md border-t border-gray-800 py-2">
          <div className="container mx-auto px-4 space-y-1">
            <div className="block py-2 px-4 text-white">
              <button 
                onClick={() => setActiveCategory(activeCategory === "Mobile Categories" ? "Food" : "Mobile Categories")}
                className="flex items-center justify-between w-full"
              >
                <span className="mr-1">#Discover</span>
                <svg className={`w-4 h-4 transition-transform ${activeCategory === "Mobile Categories" ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {activeCategory === "Mobile Categories" && (
                <div className="mt-2 pl-4 border-l border-gray-700 space-y-2">
                  {categories.map((category) => (
                    <div key={category.name} className="py-1">
                      <Link 
                        href={category.slug}
                        className="block text-gray-300 hover:text-white"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {category.name}
                      </Link>
                      {category.subcategories.length > 0 && (
                        <div className="pl-4 mt-1 space-y-1">
                          {category.subcategories.map((subcat) => (
                            <Link 
                              key={subcat.name}
                              href={subcat.slug}
                              className="block text-gray-400 hover:text-white text-sm py-1"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              {subcat.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <Link 
              href="/help"
              className="block py-2 px-4 text-white hover:bg-gray-800 rounded transition duration-300 flex items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="mr-1">Help</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </Link>
            <div className="pt-2 border-t border-gray-800">
              <div className="block py-2 px-4 text-xs text-gray-400">
                For business owners:
              </div>
              <Link 
                href="/add-place"
                className="block mx-4 py-2 px-4 bg-gray-800/80 backdrop-blur-sm hover:bg-gray-700 text-white rounded transition duration-300 flex items-center border border-gray-700 shadow-md"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="mr-1">Add a Place</span>
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </Link>
              <div className="mt-4 px-4">
                <UserProfileMenu />
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
