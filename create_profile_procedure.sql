-- Create a function to insert a profile with admin privileges
-- This function runs with SECURITY DEFINER to bypass RLS policies
CREATE OR REPLACE FUNCTION create_profile_for_user(
  user_id UUID,
  user_email TEXT,
  user_display_name TEXT,
  user_business_name TEXT
) RETURNS VOID AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    display_name,
    business_name,
    role,
    created_at,
    updated_at,
    subscription,
    verified
  ) VALUES (
    user_id,
    user_email,
    user_display_name,
    user_business_name,
    'business_owner',
    NOW(),
    NOW(),
    'free',
    false
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
