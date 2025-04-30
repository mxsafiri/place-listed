-- Add policy to allow users to create their own profile
CREATE POLICY "Users can create their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Ensure profiles can be created during signup
ALTER TABLE public.profiles ENABLE INSERT;
