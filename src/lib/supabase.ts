import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/supabase'

// Create a single supabase client for interacting with your database
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabaseClient = createBrowserClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
);

export function createClient() {
  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  return supabase;
}

// Function to sign up a user
export const signUpUser = async (email: string, password: string) => {
  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password,
  });
  
  return { data, error };
};

// Function to sign in a user
export const signInUser = async (email: string, password: string) => {
  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password,
  });
  
  return { data, error };
};

// Function to sign in with Google OAuth
export const signInWithGoogle = async () => {
  const { data, error } = await supabaseClient.auth.signInWithOAuth({
    provider: 'google',
  });
  
  return { data, error };
};

// Function to sign out
export const signOutUser = async () => {
  const { error } = await supabaseClient.auth.signOut();
  return { error };
};

// Function to get the current session
export const getCurrentSession = async () => {
  const { data, error } = await supabaseClient.auth.getSession();
  return { data, error };
};

// Function to get the current user
export const getCurrentUser = async () => {
  const { data, error } = await supabaseClient.auth.getUser();
  return { data, error };
};

// Function to reset a password
export const resetPassword = async (email: string) => {
  const { data, error } = await supabaseClient.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/update-password`,
  });
  return { data, error };
};

// Function to update a user's password
export const updateUserPassword = async (password: string) => {
  const { data, error } = await supabaseClient.auth.updateUser({
    password,
  });
  return { data, error };
};

// Function to authenticate with a one-time password (OTP) sent via SMS
export const signInWithOtp = async (phone: string) => {
  const { data, error } = await supabaseClient.auth.signInWithOtp({
    phone,
  });
  return { data, error };
};

// Function to verify the OTP
export const verifyOtp = async (phone: string, token: string) => {
  const { data, error } = await supabaseClient.auth.verifyOtp({
    phone,
    token,
    type: 'sms',
  });
  return { data, error };
}; 