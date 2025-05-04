'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { z } from 'zod';
import { Button } from '@/frontend/components/ui/Button';
import { Input } from '@/frontend/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/frontend/components/ui/Card';
import { ConnectWallet, useAddress, useUser, embeddedWallet } from "@thirdweb-dev/react";
import { supabase } from '@/lib/supabase';

/**
 * Zod schema for business owner registration form validation after wallet connection.
 */
const ProfileSchema = z.object({
  businessName: z.string().min(1, 'Business name is required'),
  displayName: z.string().min(1, 'Your name is required'),
});

/**
 * Business owner registration page using thirdweb wallet authentication.
 */
export default function RegisterPage() {
  const router = useRouter();
  const address = useAddress();
  const { isLoggedIn, isLoading } = useUser();
  
  const [formData, setFormData] = useState({
    businessName: '',
    displayName: '',
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);

  // Check if wallet is connected
  useEffect(() => {
    if (address) {
      setWalletConnected(true);
      
      // Set a display name derived from the wallet address
      setFormData(prev => ({
        ...prev,
        displayName: `Owner ${address.slice(0, 6)}...${address.slice(-4)}`
      }));
    } else {
      setWalletConnected(false);
    }
  }, [address]);

  // Redirect to dashboard if already registered
  useEffect(() => {
    const checkExistingUser = async () => {
      if (!address) return;
      
      try {
        const { data, error } = await supabase
          .from('wallet_users')
          .select('*')
          .eq('wallet_address', address.toLowerCase())
          .maybeSingle();
          
        if (data && !error) {
          // User already exists, redirect to dashboard
          localStorage.setItem('placeListed_wallet', address.toLowerCase());
          localStorage.setItem('placeListed_wallet_authenticated', 'true');
          router.replace('/dashboard');
        }
      } catch (error) {
        console.error('Error checking existing user:', error);
      }
    };
    
    checkExistingUser();
  }, [address, router]);

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
   * Handles form submission, creates a wallet_user record after wallet connection.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address) {
      setFormError('Please connect your wallet first');
      return;
    }
    
    setFormError(null);
    setFormSuccess(null);
    setFieldErrors({});

    const result = ProfileSchema.safeParse(formData);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) errors[err.path[0] as string] = err.message;
      });
      setFieldErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      // Create a new wallet_user record 
      const { data, error } = await supabase
        .from('wallet_users')
        .insert({
          wallet_address: address.toLowerCase(),
          display_name: formData.displayName,
          business_name: formData.businessName,
          role: 'business_owner',
          verified: true
        })
        .select()
        .single();
        
      if (error) throw error;
      
      // Set wallet auth in localStorage
      localStorage.setItem('placeListed_wallet', address.toLowerCase());
      localStorage.setItem('placeListed_wallet_authenticated', 'true');
      
      setFormSuccess('Registration successful! Redirecting to dashboard...');
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
      
    } catch (err: any) {
      console.error('Registration error:', err);
      setFormError(err?.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-black">
          Register as a Business Owner
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in with email or connect your wallet to manage your business listing
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
            
            {!walletConnected ? (
              <div className="space-y-6">
                <p className="text-center text-sm text-gray-600 mb-4">
                  First, sign in with your email or connect your wallet to continue registration
                </p>
                <div className="flex justify-center">
                  <ConnectWallet 
                    theme="light"
                    btnTitle="Sign In"
                    modalSize="wide"
                    className="w-full"
                    supportedWallets={[
                      embeddedWallet({
                        auth: {
                          options: ["email", "google", "apple", "facebook"],
                        },
                      }),
                    ]}
                    modalTitleIconUrl=""
                    welcomeScreen={{
                      title: "Sign up for PlaceListed",
                      subtitle: "Connect with your email or wallet",
                    }}
                    termsOfServiceUrl="/"
                    privacyPolicyUrl="/"
                    displayEmail={{
                      configuration: {
                        hideVerifyPrompt: false,
                        hideThirdwebBranding: false,
                        emailOptInCode: true,
                      },
                    }}
                    auth={{
                      loginOptional: false,
                      onLogin: () => {
                        console.log("User logged in");
                      },
                      loginWithEmail: {
                        name: "Continue with Email",
                      },
                    }}
                  />
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="p-3 bg-gray-50 rounded-md mb-4">
                  <p className="text-sm text-gray-700">
                    Connected with: <span className="font-mono">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
                  </p>
                </div>
                
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
                
                <div className="mt-6">
                  <Button 
                    type="submit" 
                    className="w-full" 
                    loading={isSubmitting} 
                    disabled={isSubmitting}
                  >
                    Complete Registration
                  </Button>
                </div>
              </form>
            )}
            
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
                <Link href="/" className="font-medium text-red-600 hover:text-red-500">
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
