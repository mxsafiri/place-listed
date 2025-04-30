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
