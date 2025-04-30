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
