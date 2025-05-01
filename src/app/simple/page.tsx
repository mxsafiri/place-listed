'use client';

import Link from 'next/link';
import React from 'react';

export default function SimplePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">PlaceListed - Simple Page</h1>
      
      <p className="mb-4">
        This is a simplified page to test basic rendering without complex components.
      </p>
      
      <div className="flex flex-col space-y-4 mt-8">
        <h2 className="text-xl font-semibold">Navigation Links:</h2>
        <Link 
          href="/test" 
          className="text-blue-600 hover:underline"
        >
          Test Page (No Auth)
        </Link>
        <Link 
          href="/debug" 
          className="text-blue-600 hover:underline"
        >
          Debug Page
        </Link>
        <Link 
          href="/minimal" 
          className="text-blue-600 hover:underline"
        >
          Minimal Page
        </Link>
        <Link 
          href="/" 
          className="text-blue-600 hover:underline"
        >
          Main Home Page
        </Link>
      </div>
    </div>
  );
}
