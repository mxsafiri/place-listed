'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/frontend/components/ui/Button';
import { Input } from '@/frontend/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/frontend/components/ui/Card';
import { useAuth } from '@/contexts/SupabaseAuthContext';

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Email is required');
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email is invalid');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (error: unknown) {
      console.error('Password reset error:', error);
      setError(error instanceof Error ? error.message : 'Failed to send password reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-black">
          Reset your password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link href="/auth/login" className="font-medium text-red-600 hover:text-red-700">
            return to sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-black">Forgot Password</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-500 text-sm rounded-md">
                {error}
              </div>
            )}
            
            {success ? (
              <div className="text-center">
                <div className="mb-4 p-3 bg-green-50 text-green-600 text-sm rounded-md">
                  Password reset email sent! Check your inbox for instructions.
                </div>
                <Link href="/auth/login" className="text-red-600 hover:text-red-700">
                  Return to sign in
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Input
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    error={error ? 'Please enter a valid email address' : ''}
                    fullWidth
                    required
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Enter your email address and we&apos;ll send you a link to reset your password.
                  </p>
                </div>

                <div>
                  <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    disabled={isLoading}
                  >
                    {isLoading ? 'Sending...' : 'Send reset link'}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
