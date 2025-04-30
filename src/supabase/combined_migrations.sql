-- Combined migrations for PlaceListed project
-- This file combines the initial schema and row-level security policies

-- ==========================================
-- 01_initial_schema.sql
-- ==========================================

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  display_name TEXT,
  business_name TEXT,
  role TEXT NOT NULL CHECK (role IN ('customer', 'business_owner', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  subscription TEXT DEFAULT 'free',
  verified BOOLEAN DEFAULT FALSE NOT NULL
);

-- Create businesses table
CREATE TABLE IF NOT EXISTS public.businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  category TEXT NOT NULL,
  subcategory TEXT,
  address JSONB NOT NULL,
  contact JSONB,
  business_hours JSONB,
  photos JSONB,
  amenities TEXT[],
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'active', 'rejected', 'inactive')) DEFAULT 'pending',
  views INTEGER DEFAULT 0,
  average_rating NUMERIC(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create saved_businesses table (for users to save/favorite businesses)
CREATE TABLE IF NOT EXISTS public.saved_businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, business_id)
);

-- Create business_claims table (for users to claim ownership of businesses)
CREATE TABLE IF NOT EXISTS public.business_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  evidence TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(business_id, user_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_businesses_owner_id ON public.businesses(owner_id);
CREATE INDEX IF NOT EXISTS idx_businesses_category ON public.businesses(category);
CREATE INDEX IF NOT EXISTS idx_businesses_status ON public.businesses(status);
CREATE INDEX IF NOT EXISTS idx_reviews_business_id ON public.reviews(business_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_businesses_user_id ON public.saved_businesses(user_id);
CREATE INDEX IF NOT EXISTS idx_business_claims_business_id ON public.business_claims(business_id);

-- Enable full-text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;
ALTER TABLE public.businesses ADD COLUMN IF NOT EXISTS search_vector tsvector;
CREATE INDEX IF NOT EXISTS idx_businesses_search ON public.businesses USING GIN(search_vector);

-- Create function to update search vector
CREATE OR REPLACE FUNCTION update_business_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector = 
    setweight(to_tsvector('english', COALESCE(NEW.name, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.category, '')), 'C') ||
    setweight(to_tsvector('english', COALESCE(NEW.subcategory, '')), 'C') ||
    setweight(to_tsvector('english', COALESCE(array_to_string(NEW.tags, ' '), '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update search vector on insert or update
CREATE TRIGGER trigger_update_business_search_vector
BEFORE INSERT OR UPDATE ON public.businesses
FOR EACH ROW
EXECUTE FUNCTION update_business_search_vector();

-- ==========================================
-- 02_row_level_security.sql
-- ==========================================

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_claims ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
-- Users can read any profile
CREATE POLICY "Anyone can read profiles"
  ON public.profiles FOR SELECT
  USING (true);

-- Users can only update their own profile
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Businesses Policies
-- Anyone can read active businesses
CREATE POLICY "Anyone can read active businesses"
  ON public.businesses FOR SELECT
  USING (status = 'active' OR owner_id = auth.uid());

-- Business owners can create businesses
CREATE POLICY "Business owners can create businesses"
  ON public.businesses FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM public.profiles WHERE role = 'business_owner' OR role = 'admin'
    )
  );

-- Business owners can update their own businesses
CREATE POLICY "Business owners can update their own businesses"
  ON public.businesses FOR UPDATE
  USING (owner_id = auth.uid() OR 
    auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
  );

-- Business owners can delete their own businesses
CREATE POLICY "Business owners can delete their own businesses"
  ON public.businesses FOR DELETE
  USING (owner_id = auth.uid() OR 
    auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
  );

-- Reviews Policies
-- Anyone can read reviews
CREATE POLICY "Anyone can read reviews"
  ON public.reviews FOR SELECT
  USING (true);

-- Authenticated users can create reviews
CREATE POLICY "Authenticated users can create reviews"
  ON public.reviews FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Users can update their own reviews
CREATE POLICY "Users can update their own reviews"
  ON public.reviews FOR UPDATE
  USING (user_id = auth.uid() OR 
    auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
  );

-- Users can delete their own reviews
CREATE POLICY "Users can delete their own reviews"
  ON public.reviews FOR DELETE
  USING (user_id = auth.uid() OR 
    auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
  );

-- Saved Businesses Policies
-- Users can read their own saved businesses
CREATE POLICY "Users can read their own saved businesses"
  ON public.saved_businesses FOR SELECT
  USING (user_id = auth.uid() OR 
    auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
  );

-- Users can save businesses
CREATE POLICY "Users can save businesses"
  ON public.saved_businesses FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Users can unsave businesses
CREATE POLICY "Users can unsave businesses"
  ON public.saved_businesses FOR DELETE
  USING (user_id = auth.uid() OR 
    auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
  );

-- Business Claims Policies
-- Business owners can read their own claims
CREATE POLICY "Business owners can read their own claims"
  ON public.business_claims FOR SELECT
  USING (user_id = auth.uid() OR 
    auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
  );

-- Business owners can create claims
CREATE POLICY "Business owners can create claims"
  ON public.business_claims FOR INSERT
  WITH CHECK (
    user_id = auth.uid() AND
    auth.uid() IN (
      SELECT id FROM public.profiles WHERE role = 'business_owner' OR role = 'admin'
    )
  );

-- Only admins can update claims
CREATE POLICY "Only admins can update claims"
  ON public.business_claims FOR UPDATE
  USING (
    auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
  );

-- Business owners can delete their own pending claims
CREATE POLICY "Business owners can delete their own pending claims"
  ON public.business_claims FOR DELETE
  USING (
    user_id = auth.uid() AND status = 'pending'
  );

-- Admins can read all claims
CREATE POLICY "Admins can read all claims"
  ON public.business_claims FOR SELECT
  USING (
    auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
  );
