'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import LoadingSpinner from '@/frontend/components/ui/LoadingSpinner';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAuthenticated, refreshProfile } = useAuth();
  const router = useRouter();
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        // If already loading, wait for that to complete
        if (isLoading) return;

        // If authenticated, refresh the profile to ensure we have the latest data
        if (isAuthenticated && user) {
          await refreshProfile();
          setIsCheckingSession(false);
          return;
        }

        // If not authenticated and not loading, redirect to login
        if (!isAuthenticated && !isLoading) {
          // Include the current path as a redirect parameter
          const currentPath = window.location.pathname;
          router.push(`/auth/login?redirect=${encodeURIComponent(currentPath)}`);
          return;
        }
      } catch (error) {
        console.error('Error checking session:', error);
        // On error, redirect to login
        router.push('/auth/login');
      } finally {
        setIsCheckingSession(false);
      }
    };

    checkSession();
  }, [isLoading, isAuthenticated, user, router, refreshProfile]);

  // Show loading state while checking session or while auth is loading
  if (isLoading || isCheckingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // If not authenticated, render nothing (redirect will happen in useEffect)
  if (!user) {
    return null;
  }

  // User is authenticated, render children
  return <>{children}</>;
}
