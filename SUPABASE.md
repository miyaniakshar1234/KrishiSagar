# Supabase Setup Guide for Krishi Sagar

This document provides instructions for setting up your Supabase project for the Krishi Sagar application.

## Create a Supabase Project

1. Sign up at [Supabase](https://supabase.com/) and create a new project
2. Take note of your project URL and anon key for the `.env.local` file

## Configure Authentication

1. In Supabase dashboard, go to Authentication → Settings
2. Enable the following providers:
   - Email (enable "Confirm email")
   - Phone (for OTP verification)
   - Google OAuth (set up credentials in Google Cloud Console)
3. Set up email templates for verification and password reset

## Database Schema Setup

Run the following SQL in the SQL Editor to set up your database schema:

```sql
-- Create users table extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table for different user types
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  email TEXT UNIQUE,
  phone TEXT UNIQUE,
  full_name TEXT,
  user_type TEXT NOT NULL CHECK (user_type IN ('farmer', 'agro_store', 'broker', 'expert', 'student', 'consumer')),
  profile_image TEXT,
  language_preference TEXT DEFAULT 'en' CHECK (language_preference IN ('en', 'hi', 'gu'))
);

-- Create RLS policies for users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
ON users
FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON users
FOR UPDATE
USING (auth.uid() = id);

-- Create trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO users (id, email, user_type)
  VALUES (new.id, new.email, 'farmer'); -- Default to farmer, can be updated later
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create farmer profiles table
CREATE TABLE farmer_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  farm_location TEXT,
  crops_grown TEXT[],
  farming_practices TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies for farmer_profiles
ALTER TABLE farmer_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Farmers can view their own profile"
ON farmer_profiles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Farmers can update their own profile"
ON farmer_profiles
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Public can view farmer profiles"
ON farmer_profiles
FOR SELECT
USING (true);

-- Create agro store profiles table
CREATE TABLE agro_store_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  store_name TEXT NOT NULL,
  store_location TEXT NOT NULL,
  specializations TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies for agro_store_profiles
ALTER TABLE agro_store_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Store owners can view and update their own profile"
ON agro_store_profiles
FOR ALL
USING (auth.uid() = user_id);

CREATE POLICY "Public can view store profiles"
ON agro_store_profiles
FOR SELECT
USING (true);

-- Additional tables will be created as development progresses
```

## Storage Buckets

Create the following storage buckets in Supabase:

1. **profile-images** - For user profile pictures
2. **crop-images** - For images of crops uploaded by farmers
3. **documents** - For various document uploads

Configure RLS policies for each bucket to ensure proper access control.

## Environment Variables

Add the following to your `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Next Steps

1. Run the SQL scripts to set up your database
2. Configure authentication providers
3. Set up storage buckets with appropriate permissions
4. Add the environment variables to your project
5. Test the connection and authentication flow 