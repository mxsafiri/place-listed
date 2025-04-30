'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/frontend/components/ui/Button';
import { Input } from '@/frontend/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/frontend/components/ui/Card';
import { useAuth } from '@/contexts/SupabaseAuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const { registerBusinessOwner } = useAuth();
  const [formData, setFormData] = useState({
    businessName: '',
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.businessName) {
      newErrors.businessName = 'Business name is required';
    }
    
    if (!formData.displayName) {
      newErrors.displayName = 'Your name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Use Supabase authentication to register a business owner
      await registerBusinessOwner(
        formData.email, 
        formData.password, 
        formData.displayName,
        formData.businessName
      );
      
      router.push('/dashboard');
    } catch (error: unknown) {
      console.error('Registration error:', error);
      setErrors({
        form: error instanceof Error ? error.message : 'Failed to register. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-black">
          Register as a Business Owner
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Create an account to manage your business listing
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-black">Sign Up</CardTitle>
          </CardHeader>
          <CardContent>
            {errors.form && (
              <div className="mb-4 p-3 bg-red-50 text-red-500 text-sm rounded-md">
                {errors.form}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  label="Business Name"
                  id="businessName"
                  name="businessName"
                  type="text"
                  autoComplete="organization"
                  required
                  value={formData.businessName}
                  onChange={handleChange}
                  error={errors.businessName}
                />
              </div>

              <div>
                <Input
                  label="Your Name"
                  id="displayName"
                  name="displayName"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.displayName}
                  onChange={handleChange}
                  error={errors.displayName}
                />
              </div>

              <div>
                <Input
                  label="Email Address"
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                />
              </div>

              <div>
                <Input
                  label="Password"
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                />
              </div>

              <div>
                <Input
                  label="Confirm Password"
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                />
              </div>

              <div className="mt-6">
                <Button
                  type="submit"
                  className="w-full"
                  loading={isLoading}
                  disabled={isLoading}
                >
                  Create Account
                </Button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Already have an account?
                  </span>
                </div>
              </div>

              <div className="mt-6 text-center">
                <Link href="/auth/login" className="font-medium text-red-600 hover:text-red-500">
                  Sign in
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
