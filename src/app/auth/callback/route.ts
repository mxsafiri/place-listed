import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/dashboard';
  
  if (code) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    await supabase.auth.exchangeCodeForSession(code);
    
    // Get user data to determine role-based redirect
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // Get the user's profile to determine their role
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      
      // Redirect based on user role
      if (profile?.role === 'business_owner') {
        // Use the existing dashboard page for business owners
        return NextResponse.redirect(new URL('/dashboard', requestUrl.origin));
      } else if (profile?.role === 'admin') {
        // Admin users go to admin page (if it exists) or dashboard
        return NextResponse.redirect(new URL('/admin', requestUrl.origin));
      }
    }
  }

  // Default redirect to home page if no specific redirect is determined
  // Or use the next parameter if provided
  return NextResponse.redirect(new URL(next || '/', requestUrl.origin));
}
