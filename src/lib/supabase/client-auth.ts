import { createBrowserClient } from '@supabase/ssr'

// Create a client for use in the browser
export const createClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce'
      }
    }
  )
}

/**
 * Enhanced sign-in function with better session handling
 */
export const signInUser = async (email: string, password: string) => {
  const supabase = createClient()
  
  // Sign in with email and password
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) {
    console.error('Error signing in:', error.message)
    return { data: null, error }
  }
  
  // Verify session was created
  if (!data.session) {
    return { 
      data: null, 
      error: new Error('Session could not be created. Please try again.') 
    }
  }
  
  return { data, error: null }
}

/**
 * Get current session with retry logic
 */
export const getCurrentSession = async () => {
  const supabase = createClient()
  const { data, error } = await supabase.auth.getSession()
  
  if (error) {
    console.error('Error getting session:', error.message)
    return { data: { session: null }, error }
  }
  
  return { data, error: null }
}

/**
 * Refreshes the session if exists
 */
export const refreshSession = async () => {
  const supabase = createClient()
  const { data, error } = await supabase.auth.refreshSession()
  
  if (error) {
    console.error('Error refreshing session:', error.message)
    return { data: { session: null }, error }
  }
  
  return { data, error: null }
}

/**
 * Gets the current user if it exists
 */
export const getCurrentUser = async () => {
  const supabase = createClient()
  
  try {
    // Try to get the session
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('Error getting session:', error.message)
      return null
    }
    
    if (!session) {
      return null
    }
    
    const user = session.user;
    
    // Return the user from the session
    if (user) {
      // If user has user_type set in metadata, ensure profile exists
      const userType = user.user_metadata?.user_type;
      if (userType) {
        // Fire-and-forget profile check/creation
        ensureUserTypeProfile(user.id, userType)
          .then(result => {
            if (!result.success) {
              console.warn(`Failed to ensure ${userType} profile: ${result.error}`);
            }
          })
          .catch(err => {
            console.error('Error in profile creation:', err);
          });
      }
      
      return user;
    }
    
    return null;
  } catch (err) {
    console.error('Error in getCurrentUser:', err);
    return null;
  }
}

/**
 * Sign out user with extra cleanup
 */
export const signOutUser = async () => {
  const supabase = createClient()
  
  try {
    // Clear session cookies and local storage globally
  const { error } = await supabase.auth.signOut({ scope: 'global' })
  
  if (error) {
    console.error('Error signing out:', error.message)
      return { error }
  }
  
    // Let the calling component handle navigation after successful sign out
    // // Clear any other local storage items that might be related to user state
    // localStorage.removeItem('supabase.auth.token')
    // localStorage.removeItem('dashboard_state')
  
    // // Force reload to ensure all auth state is cleared
    // window.location.href = '/auth/sign-in'
  
    return { error: null }
  } catch (err) {
    console.error('Unexpected error during sign out:', err)
    return { error: err instanceof Error ? err : new Error(String(err)) } // Ensure error is an Error object
  }
}

/**
 * Enhanced getUserProfile function that works with the improved auth client
 */
export const getUserProfile = async () => {
  const supabase = createClient()
  
  // First verify we have a valid session and user
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
  
  if (sessionError || !sessionData.session || !sessionData.session.user) {
    console.error('No valid session found when fetching user profile')
    return { data: null, error: sessionError || new Error('No authenticated user found') }
  }
  
  const userId = sessionData.session.user.id
  
  // Fetch user profile from the public.users table
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) {
    console.error('Error fetching user profile:', error)
    return { data: null, error }
  }
  
  return { data, error: null }
}

/**
 * Ensures that a user-type specific profile exists for the current user
 * This helps prevent redirect issues when a user has a user_type but no corresponding profile
 */
export const ensureUserTypeProfile = async (userId: string, userType: string) => {
  try {
    if (!userId || !userType) {
      console.error('ensureUserTypeProfile: userId and userType are required');
      return { success: false, error: 'User ID and type are required' };
    }

    const supabase = createClient();
    let table = '';
    let defaultData = {};

    // Determine the table and default data based on user type
    switch (userType) {
      case 'farmer':
        table = 'farmer_profiles';
        defaultData = { farm_location: 'Not specified', crops_grown: [], land_area: null };
        break;
      case 'store_owner':
        table = 'store_owner_profiles';
        defaultData = { store_name: 'My Store', store_location: 'Not specified' };
        break;
      case 'broker':
        table = 'broker_profiles';
        defaultData = { market_name: 'Not specified', market_location: 'Not specified' };
        break;
      case 'expert':
        table = 'expert_profiles';
        defaultData = { expertise_area: 'Not specified', qualification: 'Not specified' };
        break;
      case 'student':
        table = 'student_profiles';
        defaultData = { institution: 'Not specified', field_of_study: 'Not specified' };
        break;
      case 'consumer':
        table = 'consumer_profiles';
        defaultData = { preferred_location: 'Not specified' };
        break;
      default:
        console.error(`Invalid user type: ${userType}`);
        return { success: false, error: `Invalid user type: ${userType}` };
    }

    // Check if profile already exists
    const { data: existingProfile, error: countError } = await supabase
      .from(table)
      .select('*', { count: 'exact' })
      .eq('user_id', userId);
      
    if (countError) {
      // If the table doesn't exist, we can't create a profile
      console.error(`Error checking for existing profile: ${countError.message}`);
      return { success: false, error: countError.message };
    }

    // Only create a profile if one doesn't exist
    if (!existingProfile || existingProfile.length === 0) {
      // Insert a new profile
      const { error: insertError } = await supabase
        .from(table)
        .insert({
          user_id: userId,
          created_at: new Date().toISOString(),
          ...defaultData
        });
        
      if (insertError) {
        console.error(`Error creating ${userType} profile: ${insertError.message}`);
        return { success: false, error: insertError.message };
      }
      
      console.log(`Created new ${userType} profile for user ${userId}`);
      return { success: true, error: null };
    }
    
    console.log(`${userType} profile already exists for user ${userId}`);
    return { success: true, error: null };
    
  } catch (err) {
    console.error('Unexpected error in ensureUserTypeProfile:', err);
    return { success: false, error: String(err) };
  }
} 