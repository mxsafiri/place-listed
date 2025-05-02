'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { z } from 'zod';
import { Button } from '@/frontend/components/ui/Button';
import { Input } from '@/frontend/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/frontend/components/ui/Card';
import { useAuth } from '@/contexts/SupabaseAuthContext';

/**
 * Zod schema for business owner registration form validation.
 */
const RegisterSchema = z.object({
  businessName: z.string().min(1, 'Business name is required'),
  displayName: z.string().min(1, 'Your name is required'),
  email: z.string().email('Email is invalid'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

/**
 * Business owner registration page. Handles registration and email verification flow.
 */
export default function RegisterPage() {
  const router = useRouter();
  const { user, signUp } = useAuth();
  const [formData, setFormData] = useState({
    businessName: '',
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (user) router.replace('/dashboard');
  }, [user, router]);

  /**
   * Handles input change and clears field errors.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    setFormError(null);
  };

  /**
   * Handles form submission, validates input, and registers user with Supabase.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);
    setFieldErrors({});

    const result = RegisterSchema.safeParse(formData);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) errors[err.path[0] as string] = err.message;
      });
      setFieldErrors(errors);
      return;
    }

    setIsLoading(true);
    try {
      // Register user using Supabase Auth
      const { error } = await signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            display_name: formData.displayName,
            business_name: formData.businessName,
          },
        },
      });
      if (error) throw error;
      setFormSuccess('Registration successful! Please check your email to verify your account.');
      setFormData({ businessName: '', displayName: '', email: '', password: '', confirmPassword: '' });
    } catch (err: any) {
      setFormError(err?.message || 'Registration failed. Please try again.');
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
            {formError && (
              <div className="mb-4 p-3 bg-red-50 text-red-500 text-sm rounded-md">{formError}</div>
            )}
            {formSuccess && (
              <div className="mb-4 p-3 bg-green-50 text-green-600 text-sm rounded-md">{formSuccess}</div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Business Name"
                id="businessName"
                name="businessName"
                type="text"
                autoComplete="organization"
                required
                value={formData.businessName}
                onChange={handleChange}
                error={fieldErrors.businessName}
              />
              <Input
                label="Your Name"
                id="displayName"
                name="displayName"
                type="text"
                autoComplete="name"
                required
                value={formData.displayName}
                onChange={handleChange}
                error={fieldErrors.displayName}
              />
              <Input
                label="Email Address"
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                error={fieldErrors.email}
              />
              <Input
                label="Password"
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                error={fieldErrors.password}
              />
              <Input
                label="Confirm Password"
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                error={fieldErrors.confirmPassword}
              />
              <div className="mt-6">
                <Button type="submit" className="w-full" loading={isLoading} disabled={isLoading}>
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
                  <span className="px-2 bg-white text-gray-500">Already have an account?</span>
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
