import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// Define protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/business/create',
  '/business/edit',
  '/business/manage',
];

// Define routes that require business owner role
const businessOwnerRoutes = [
  '/business/create',
  '/business/edit',
  '/business/manage',
];

// Use environment variables with fallback for Edge runtime
// This is safe since the anon key is meant to be public
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vqbacnkbnskuawchhdwt.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxYmFjbmtibnNrdWF3Y2hoZHd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4NDI2MzgsImV4cCI6MjA2MTQxODYzOH0.H-_yCZZpm4espAacCzQxWwqh2twayZCgCotdWVqMGqQ';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  // Create a Supabase client using the new SSR package with hardcoded values for Edge runtime
  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get: (name) => req.cookies.get(name)?.value,
        set: (name, value, options) => {
          res.cookies.set({ name, value, ...options });
        },
        remove: (name, options) => {
          res.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );
  
  // Check if the path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  );
  
  // Check if the path is a business owner route
  const isBusinessOwnerRoute = businessOwnerRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  );
  
  if (isProtectedRoute) {
    // Get the user's session
    const { data: { session } } = await supabase.auth.getSession();
    
    // If no session, redirect to login
    if (!session) {
      const redirectUrl = new URL('/auth/login', req.url);
      redirectUrl.searchParams.set('redirect', req.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }
    
    // For business owner routes, check the user's role
    if (isBusinessOwnerRoute) {
      // Get the user's profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();
      
      // If not a business owner, redirect to dashboard
      if (!profile || profile.role !== 'business_owner') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }
  }
  
  return res;
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes (except protected ones)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api/public).*)',
  ],
};
