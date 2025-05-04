'use client';
export const dynamic = "force-dynamic";

import React, { useState, Suspense, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/frontend/components/ui/Button';
import { Input } from '@/frontend/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/frontend/components/ui/Card';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { 
  ConnectWallet, 
  useAddress, 
  useUser, 
  useLogin, 
  useSDK, 
  useLogout,
  embeddedWallet
} from "@thirdweb-dev/react";
import { supabase } from '@/lib/supabase';

// Client component that uses useSearchParams
function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/dashboard';
  const { login, demoMode, setDemoMode } = useAuth();
  
  // Thirdweb hooks
  const address = useAddress();
  const thirdwebLogin = useLogin();
  const thirdwebLogout = useLogout();
  const { isLoggedIn, isLoading: isWalletLoading } = useUser();
  const sdk = useSDK();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'email' | 'wallet' | 'embedded'>('embedded');
  const [debugInfo, setDebugInfo] = useState<any>(null);

  // Redirect to dashboard if already logged in via thirdweb
  useEffect(() => {
    if (!isWalletLoading && isLoggedIn && address) {
      console.log("Already logged in with wallet, redirecting to dashboard");
      router.replace(redirectPath);
    }
  }, [isLoggedIn, isWalletLoading, address, router, redirectPath]);

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
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
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
      const user = await login(formData.email, formData.password);
      if (user) {
        router.push(redirectPath);
      } else {
        setErrors({
          form: 'Invalid credentials. Please check your email and password and try again.'
        });
        setIsLoading(false);
      }
    } catch (error: unknown) {
      console.error('Login error:', error);
      setErrors({
        form: error instanceof Error ? error.message : 'Failed to log in. Please check your credentials and try again.',
      });
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    
    try {
      // Enable demo mode and login with demo credentials
      setDemoMode(true);
      const user = await login('demo@example.com', 'demopassword');
      
      if (user) {
        router.push(redirectPath);
      } else {
        setErrors({
          form: 'Failed to log in with demo account. Please try again.'
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Demo login error:', error);
      setErrors({
        form: 'Failed to log in with demo account. Please try again.',
      });
      setIsLoading(false);
    }
  };

  // Pure thirdweb wallet login - no Supabase Auth
  const handleWalletLogin = async () => {
    if (!address) {
      setErrors({
        form: 'Please connect your wallet first'
      });
      return;
    }

    try {
      setIsLoading(true);
      setErrors({});
      setDebugInfo(null);

      console.log("Starting thirdweb-only wallet login for address:", address);
      
      // Step 1: Complete thirdweb authentication (no Supabase Auth)
      if (!isLoggedIn) {
        console.log("Getting wallet authentication via thirdweb");
        try {
          // Generate a message to sign
          const message = `Login to PlaceListed as wallet: ${address}`;
          
          // Get the user to sign it
          const signature = await sdk?.wallet.sign(message);
          console.log("Obtained signature:", signature);
          
          // Note: In a real implementation, you would verify this signature
          // on your backend, but for this demo we'll skip verification
          
        } catch (error: any) {
          console.error("Error during wallet signature:", error);
          setErrors({
            form: `Failed to sign authentication message: ${error.message || 'Unknown error'}`
          });
          setIsLoading(false);
          return;
        }
      }
      
      // Step 2: Get or create user record in database
      // We'll use a direct SQL approach to create the user if needed
      const lowercaseAddress = address.toLowerCase();
      
      try {
        // Check if user exists in our custom table
        const { data: existingUser, error: lookupError } = await supabase
          .from('wallet_users')
          .select('*')
          .eq('wallet_address', lowercaseAddress)
          .maybeSingle();
          
        if (lookupError) {
          console.error("Error looking up wallet user:", lookupError);
          throw lookupError;
        }
        
        if (!existingUser) {
          console.log("Creating new wallet user record");
          
          // Create wallet user record in our custom table
          const { data: newUser, error: insertError } = await supabase
            .from('wallet_users')
            .insert({
              wallet_address: lowercaseAddress,
              display_name: `Wallet ${address.slice(0, 6)}...${address.slice(-4)}`,
              role: 'business_owner',
              verified: true
            })
            .select()
            .single();
            
          if (insertError) {
            console.error("Error creating wallet user:", insertError);
            throw insertError;
          }
          
          console.log("Successfully created wallet user:", newUser);
        } else {
          console.log("Found existing wallet user:", existingUser);
        }
        
        // Store wallet info in localStorage for persistence
        localStorage.setItem('placeListed_wallet', lowercaseAddress);
        localStorage.setItem('placeListed_wallet_authenticated', 'true');
        
        // All done! Redirect to dashboard
        console.log("Wallet authentication complete, redirecting to dashboard");
        router.push(redirectPath);
        
      } catch (error: any) {
        console.error("Database error:", error);
        setErrors({
          form: `Database error: ${error.message || 'Unknown error'}`
        });
        setDebugInfo({
          error,
          message: error.message,
          details: error.details
        });
        setIsLoading(false);
      }
    } catch (error: any) {
      console.error("Wallet login process failed:", error);
      setErrors({
        form: 'Failed to complete login process. Please try again or contact support.'
      });
      setDebugInfo(error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-black">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Manage your business listings and profile
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-black">Login</CardTitle>
            <div className="mt-2 flex justify-center space-x-4">
              <button 
                onClick={() => setLoginMethod('embedded')}
                className={`px-4 py-2 text-sm font-medium rounded-md ${loginMethod === 'embedded' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-800'}`}
              >
                Email/Social
              </button>
              <button 
                onClick={() => setLoginMethod('wallet')}
                className={`px-4 py-2 text-sm font-medium rounded-md ${loginMethod === 'wallet' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-800'}`}
              >
                Wallet
              </button>
              <button 
                onClick={() => setLoginMethod('email')}
                className={`px-4 py-2 text-sm font-medium rounded-md ${loginMethod === 'email' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-800'}`}
              >
                Legacy
              </button>
            </div>
          </CardHeader>
          <CardContent>
            {errors.form && (
              <div className="mb-4 p-3 bg-red-50 text-red-500 text-sm rounded-md">
                {errors.form}
              </div>
            )}

            {loginMethod === 'embedded' ? (
              <div className="space-y-6">
                <div className="flex justify-center">
                  <ConnectWallet
                    theme="light"
                    modalSize="wide"
                    // Specifically show the embedded wallet options
                    supportedWallets={[
                      embeddedWallet({
                        auth: {
                          options: [
                            "email",
                            "google",
                            "apple", 
                            "facebook"
                          ],
                        },
                      }),
                    ]}
                    btnTitle="Sign in with Email or Social"
                  />
                </div>
                {address && (
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600 mb-2">Connected: {address.slice(0, 6)}...{address.slice(-4)}</p>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={handleWalletLogin}
                      loading={isLoading}
                      disabled={isLoading}
                    >
                      Continue to Dashboard
                    </Button>
                  </div>
                )}
              </div>
            ) : loginMethod === 'wallet' ? (
              <div className="space-y-6">
                <div className="flex justify-center">
                  <ConnectWallet 
                    theme="light"
                    modalSize="wide"
                  />
                </div>
                {address && (
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600 mb-2">Connected: {address.slice(0, 6)}...{address.slice(-4)}</p>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={handleWalletLogin}
                      loading={isLoading}
                      disabled={isLoading}
                    >
                      Continue with Connected Wallet
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
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
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    error={errors.password}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <Link href="/auth/forgot-password" className="font-medium text-red-600 hover:text-red-500">
                      Forgot your password?
                    </Link>
                  </div>
                </div>

                <div>
                  <Button
                    type="submit"
                    className="w-full"
                    loading={isLoading}
                    disabled={isLoading}
                  >
                    Sign in
                  </Button>
                </div>
                
                <div>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleDemoLogin}
                    disabled={isLoading}
                  >
                    Try Demo Account
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
                  <span className="px-2 bg-white text-gray-500">
                    Or
                  </span>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Don&apos;t have an account?{' '}
                  <Link href="/auth/register" className="font-medium text-red-600 hover:text-red-500">
                    Register as a business owner
                  </Link>
                </p>
              </div>
            </div>
            
            {debugInfo && (
              <div className="mt-4 p-3 bg-gray-50 text-xs font-mono text-gray-700 rounded overflow-auto max-h-40">
                <p className="font-bold">Debug Info:</p>
                <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Main page component with Suspense boundary
export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
