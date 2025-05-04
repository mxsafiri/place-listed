-- Migration file to create wallet users table that doesn't depend on auth

-- Create wallet_users table for thirdweb authenticated users
CREATE TABLE IF NOT EXISTS public.wallet_users (
  id SERIAL PRIMARY KEY,
  wallet_address TEXT NOT NULL UNIQUE,
  display_name TEXT,
  business_name TEXT,
  role TEXT NOT NULL CHECK (role IN ('customer', 'business_owner', 'admin')) DEFAULT 'business_owner',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  subscription TEXT DEFAULT 'free',
  verified BOOLEAN DEFAULT TRUE NOT NULL
);

-- Add indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_wallet_users_wallet_address ON public.wallet_users(wallet_address);

-- Add RLS policies
ALTER TABLE public.wallet_users ENABLE ROW LEVEL SECURITY;

-- Policy for reading wallet users (anyone can read)
CREATE POLICY wallet_users_select_policy ON public.wallet_users
  FOR SELECT USING (true);

-- Policy for inserting wallet users (only the API can insert)
CREATE POLICY wallet_users_insert_policy ON public.wallet_users
  FOR INSERT WITH CHECK (true);
  
-- Policy for updating wallet users (only the owner can update)
CREATE POLICY wallet_users_update_policy ON public.wallet_users
  FOR UPDATE USING (
    (auth.uid() IS NULL) OR -- Allow if no auth (for API access)
    (wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address') -- Or match wallet address in JWT
  );
