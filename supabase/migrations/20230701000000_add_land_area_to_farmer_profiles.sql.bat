-- Add land_area column to farmer_profiles table
ALTER TABLE public.farmer_profiles ADD COLUMN IF NOT EXISTS land_area FLOAT; 