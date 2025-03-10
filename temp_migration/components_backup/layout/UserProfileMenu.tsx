'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/frontend/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function UserProfileMenu() {
  const { currentUser, logout } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!currentUser) {
    return (
      <div className="flex items-center">
        <Link 
          href="/auth/login" 
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="flex items-center space-x-2 focus:outline-none"
        aria-expanded={isMenuOpen}
        aria-haspopup="true"
      >
        <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white">
          {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'U'}
        </div>
        <span className="hidden md:block text-black font-medium">
          {currentUser.displayName || 'User'}
        </span>
      </button>

      {isMenuOpen && (
        <div 
          className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200"
          onBlur={() => setIsMenuOpen(false)}
        >
          <Link 
            href="/place-dashboard" 
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => setIsMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link 
            href="/place-dashboard/settings" 
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => setIsMenuOpen(false)}
          >
            Settings
          </Link>
          <button
            onClick={() => {
              setIsMenuOpen(false);
              handleLogout();
            }}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
