'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import UserProfileMenu from '@/frontend/components/layout/UserProfileMenu';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/businesses" className="text-white hover:text-primary-400 transition duration-300">
              #Discover
            </Link>
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/help" className="text-white hover:text-primary-400 transition duration-300">
              Help
            </Link>
            <Link 
              href="/add-place" 
              className="bg-gray-800/80 backdrop-blur-sm hover:bg-gray-700 text-white px-5 py-2 rounded-md transition duration-300 flex items-center text-sm border border-gray-700 shadow-md"
            >
              <span className="mr-1">Add a Place</span>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </Link>
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
            <Link 
              href="/businesses"
              className="block py-2 px-4 text-white hover:bg-gray-800 rounded transition duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              #Discover
            </Link>
            <Link 
              href="/help"
              className="block py-2 px-4 text-white hover:bg-gray-800 rounded transition duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Help
            </Link>
            <div className="pt-2 border-t border-gray-800">
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
