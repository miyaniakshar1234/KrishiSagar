-- Create tables for all user types if they don't exist already

-- Create farmer_profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.farmer_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  farm_location TEXT,
  land_area NUMERIC,
  crops_grown TEXT[],
  farming_type TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create store_owner_profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.store_owner_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  store_name TEXT,
  store_location TEXT,
  business_type TEXT,
  registration_number TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create broker_profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.broker_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  market_name TEXT,
  market_location TEXT,
  registration_number TEXT,
  specialization TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create expert_profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.expert_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  expertise_area TEXT,
  qualification TEXT,
  experience_years INTEGER,
  organization TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create student_profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.student_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  institution TEXT,
  field_of_study TEXT,
  education_level TEXT,
  year_of_study TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create consumer_profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.consumer_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  preferred_location TEXT,
  address TEXT,
  preferred_payment_method TEXT,
  diet_preferences TEXT[],
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_farmer_profiles_user_id ON public.farmer_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_store_owner_profiles_user_id ON public.store_owner_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_broker_profiles_user_id ON public.broker_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_expert_profiles_user_id ON public.expert_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_student_profiles_user_id ON public.student_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_consumer_profiles_user_id ON public.consumer_profiles(user_id);

-- Add RLS policies to allow authenticated users to view and update their own profiles only

-- Farmer profiles RLS
ALTER TABLE public.farmer_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own farmer profile" ON public.farmer_profiles;
CREATE POLICY "Users can view their own farmer profile" ON public.farmer_profiles
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own farmer profile" ON public.farmer_profiles;
CREATE POLICY "Users can update their own farmer profile" ON public.farmer_profiles
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own farmer profile" ON public.farmer_profiles;
CREATE POLICY "Users can insert their own farmer profile" ON public.farmer_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Store owner profiles RLS
ALTER TABLE public.store_owner_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own store_owner profile" ON public.store_owner_profiles;
CREATE POLICY "Users can view their own store_owner profile" ON public.store_owner_profiles
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own store_owner profile" ON public.store_owner_profiles;
CREATE POLICY "Users can update their own store_owner profile" ON public.store_owner_profiles
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own store_owner profile" ON public.store_owner_profiles;
CREATE POLICY "Users can insert their own store_owner profile" ON public.store_owner_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Broker profiles RLS
ALTER TABLE public.broker_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own broker profile" ON public.broker_profiles;
CREATE POLICY "Users can view their own broker profile" ON public.broker_profiles
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own broker profile" ON public.broker_profiles;
CREATE POLICY "Users can update their own broker profile" ON public.broker_profiles
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own broker profile" ON public.broker_profiles;
CREATE POLICY "Users can insert their own broker profile" ON public.broker_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Expert profiles RLS
ALTER TABLE public.expert_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own expert profile" ON public.expert_profiles;
CREATE POLICY "Users can view their own expert profile" ON public.expert_profiles
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own expert profile" ON public.expert_profiles;
CREATE POLICY "Users can update their own expert profile" ON public.expert_profiles
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own expert profile" ON public.expert_profiles;
CREATE POLICY "Users can insert their own expert profile" ON public.expert_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Student profiles RLS
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own student profile" ON public.student_profiles;
CREATE POLICY "Users can view their own student profile" ON public.student_profiles
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own student profile" ON public.student_profiles;
CREATE POLICY "Users can update their own student profile" ON public.student_profiles
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own student profile" ON public.student_profiles;
CREATE POLICY "Users can insert their own student profile" ON public.student_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Consumer profiles RLS
ALTER TABLE public.consumer_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own consumer profile" ON public.consumer_profiles;
CREATE POLICY "Users can view their own consumer profile" ON public.consumer_profiles
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own consumer profile" ON public.consumer_profiles;
CREATE POLICY "Users can update their own consumer profile" ON public.consumer_profiles
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own consumer profile" ON public.consumer_profiles;
CREATE POLICY "Users can insert their own consumer profile" ON public.consumer_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id); 