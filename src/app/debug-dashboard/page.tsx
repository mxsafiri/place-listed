'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/frontend/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/frontend/components/ui/Card';

// Debug dashboard that doesn't require authentication
export default function DebugDashboardPage() {
  // Mock data for debugging
  const mockUser = {
    id: 'debug-user-id',
    email: 'debug@example.com'
  };
  
  const mockProfile = {
    id: 'debug-user-id',
    display_name: 'Debug Business Owner',
    business_name: 'Debug Business',
    role: 'business_owner',
    email: 'debug@example.com'
  };
  
  const mockBusinesses = [
    {
      id: 'business-1',
      name: 'Debug Restaurant',
      description: 'A restaurant for debugging purposes',
      category: 'Restaurant',
      status: 'Active'
    },
    {
      id: 'business-2',
      name: 'Debug Shop',
      description: 'A shop for debugging purposes',
      category: 'Retail',
      status: 'Active'
    }
  ];

  return (
    <div className="min-h-screen p-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Debug Dashboard (No Auth Required)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Welcome, {mockProfile.display_name}</h2>
            <p>Email: {mockUser.email}</p>
            <p>Role: {mockProfile.role}</p>
            <p>Business Name: {mockProfile.business_name}</p>
          </div>
          
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Your Businesses</h3>
            <ul className="list-disc pl-5">
              {mockBusinesses.map((business) => (
                <li key={business.id}>
                  {business.name} - {business.status}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="flex space-x-4 mt-6">
            <Button>
              Add Business
            </Button>
            <Link href="/">
              <Button variant="outline">
                Back to Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Environment Variables</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Supabase Configuration</h3>
            <p>NEXT_PUBLIC_SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not set'}</p>
            <p>NEXT_PUBLIC_SUPABASE_ANON_KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '******' : 'Not set'}</p>
          </div>
          
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Application Settings</h3>
            <p>NEXT_PUBLIC_APP_URL: {process.env.NEXT_PUBLIC_APP_URL || 'Not set'}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
