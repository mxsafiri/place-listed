-- Add policy to allow users to create their own profile
CREATE POLICY "Users can create their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- No need for ALTER TABLE ENABLE INSERT as it's not valid syntax
-- Tables are already enabled for all operations by default
