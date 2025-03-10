'use client';

import React from 'react';
import ProtectedRoute from '@/frontend/components/auth/ProtectedRoute';

export default function PlaceDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    </ProtectedRoute>
  );
}
