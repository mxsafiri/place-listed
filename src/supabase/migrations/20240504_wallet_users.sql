-- Create the wallet_users table for thirdweb authentication
-- This table is separate from Supabase Auth and stores users authenticated via thirdweb

CREATE TABLE IF NOT EXISTS "public"."wallet_users" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "wallet_address" TEXT NOT NULL UNIQUE,
  "display_name" TEXT NOT NULL,
  "email" TEXT,
  "bio" TEXT,
  "avatar_url" TEXT,
  "role" TEXT NOT NULL DEFAULT 'business_owner',
  "verified" BOOLEAN NOT NULL DEFAULT FALSE,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_wallet_users_wallet_address ON "public"."wallet_users" ("wallet_address");

-- Create a trigger to automatically update the updated_at column
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON "public"."wallet_users"
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- Create Row Level Security (RLS) policy
-- By default, deny all operations
ALTER TABLE "public"."wallet_users" ENABLE ROW LEVEL SECURITY;

-- Policy to allow anyone to read wallet_users
CREATE POLICY "Anyone can read wallet_users" ON "public"."wallet_users"
FOR SELECT USING (true);

-- Policy to allow wallet owners to update their own data
CREATE POLICY "Wallet owners can update their own data" ON "public"."wallet_users"
FOR UPDATE USING (auth.uid()::text = (
  SELECT auth.uid()::text 
  FROM auth.users 
  WHERE raw_user_meta_data->>'wallet_address' = wallet_address
));

-- Policy to allow wallet owners to delete their own data
CREATE POLICY "Wallet owners can delete their own data" ON "public"."wallet_users"
FOR DELETE USING (auth.uid()::text = (
  SELECT auth.uid()::text 
  FROM auth.users 
  WHERE raw_user_meta_data->>'wallet_address' = wallet_address
));

-- Policy to allow service role to insert (for thirdweb authentication)
CREATE POLICY "Service role can insert" ON "public"."wallet_users"
FOR INSERT WITH CHECK (true);
