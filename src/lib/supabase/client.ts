import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/supabase'
import { type UserProfile } from '@/types/user'

// Create a client for use in the browser
export const createClient = () => {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        flowType: 'pkce'
      }
    }
  )
}

/**
 * Signs up a user with email and password.
 * Profile creation is handled by a server-side Edge Function triggered by auth.users insertion.
 */
export async function signUpUser(
  email: string,
  password: string,
  profile: {
    name: string;
    userType: string;
    mobile?: string;
    address?: string;
    language?: string;
    // User type specific fields will be passed in metadata
    [key: string]: any; // Allow additional properties for specific types
  }
) {
  try {
    // Validate required client-side parameters
    if (!email) return { data: null, error: "Email is required" };
    if (!password) return { data: null, error: "Password is required" };
    if (!profile.name) return { data: null, error: "Name is required" };
    if (!profile.userType) return { data: null, error: "User type is required" };
    
    // Validate user type client-side (optional but good practice)
    const validUserTypes = ['farmer', 'store_owner', 'broker', 'expert', 'student', 'consumer'];
    if (!validUserTypes.includes(profile.userType)) {
      return { data: null, error: `Invalid user type: ${profile.userType}` };
    }

    const supabase = createClient();
    
    // Prepare metadata to pass to Supabase Auth
    // The Edge Function trigger will read this metadata
    const metadata = {
      full_name: profile.name,       // Consistent naming
      user_type: profile.userType,    // Consistent naming
      mobile: profile.mobile,
      address: profile.address,
      language: profile.language,
      // Add all other relevant fields from the profile object
      ...profile // Include all specific fields like shopName, landArea etc.
    };

    console.log("Calling supabase.auth.signUp with metadata:", metadata);

    // Register the user with Supabase Auth, passing profile data in options.data
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: metadata, // Pass the prepared metadata here
      }
    });

    if (authError) {
      console.error('Auth error during signup:', authError);
      // Handle specific errors like "User already registered"
      if (authError.message.includes('User already registered')) {
        return { data: null, error: 'This email is already registered. Please sign in instead.' };
      }
      return { data: null, error: `Authentication error: ${authError.message}` };
    }

    if (!authData.user && !authData.session) {
        // If email confirmation is required, user and session might be null
        // Check if email confirmation is needed (this is a common scenario)
        console.log("SignUp successful, email confirmation likely required.");
        // Return a success indication, letting the UI handle the confirmation message
        return { data: { requiresConfirmation: true }, error: null };
    }
    
    // If signup is immediate (e.g., email confirmation disabled or auto-confirmed)
    console.log("SignUp successful, user/session created:", authData);
    return { data: authData, error: null };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Unexpected error in signUpUser:', error);
    return { data: null, error: `Registration failed: ${errorMessage}` };
  }
}

export const signInUser = async (email: string, password: string) => {
  const supabase = createClient()
  return supabase.auth.signInWithPassword({
    email,
    password,
  })
}

export async function signInWithGoogle(userType: string | null = null) {
  const supabase = createClient()
  const redirectUrl = new URL(`${window.location.origin}/auth/callback`)
  
  // Add user_type as a parameter if provided
  if (userType) {
    redirectUrl.searchParams.append('user_type', userType)
  }
  
  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUrl.toString()
    }
  })
}

export const signOutUser = async () => {
  const supabase = createClient()
  return supabase.auth.signOut()
}

export const getCurrentSession = async () => {
  const supabase = createClient()
  return supabase.auth.getSession()
}

export const getCurrentUser = async () => {
  try {
    const supabase = createClient();
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error fetching current user session:', error);
      return null;
    }
    
    if (!session) {
      console.warn('No authenticated session found');
      return null;
    }
    
    const { user } = session;
    if (!user) {
      console.warn('No user found in session');
      return null;
    }
    
    console.log('Current user retrieved:', user.id);
    return user;
  } catch (err) {
    console.error('Unexpected error in getCurrentUser:', err);
    return null;
  }
}

export const getUserProfile = async (): Promise<UserProfile | null> => {
  const supabase = createClient();
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError) {
      console.error('Auth error getting user:', authError);
      throw new Error(`Authentication error: ${authError.message}`);
    }
    
    if (!user) {
      console.log('No authenticated user found.');
      return null;
    }
    
    console.log(`Fetching profile for user ${user.id}`);
    
    // Try to fetch the user's profile
  const { data, error } = await supabase
    .from('users')
    .select('*')
      .eq('id', user.id)
      .single();
  
  if (error) {
      // Log detailed error information
      console.error('Error fetching user profile:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      
      // Check for specific error types
      if (error.code === 'PGRST116') {
        throw new Error('User profile not found. It may still be creating.');
      } else if (error.code === '42501') {
        throw new Error('Permission denied. RLS policy might be blocking access.');
      } else {
        throw new Error(`Database error: ${error.message}`);
      }
    }
    
    if (!data) {
      console.warn('User profile data is null or undefined');
      return null;
    }
    
    console.log('Successfully fetched user profile');
    return data as UserProfile;

  } catch (err) {
    // Re-throw the error with improved error handling
    if (err instanceof Error) {
      console.error('Error in getUserProfile:', err.message);
      throw err;
    } else {
      console.error('Unexpected error type in getUserProfile:', err);
      throw new Error(`Unexpected error: ${String(err)}`);
    }
  }
};

export const getUserTypeProfile = async (userId: string, userType: string) => {
  const supabase = createClient()
  
  if (!userId) {
    console.error('getUserTypeProfile: userId is required');
    return { data: null, error: 'User ID is required' };
  }

  let table = '';
  switch (userType) {
    case 'farmer':
      table = 'farmer_profiles'
      break
    case 'store_owner':
      table = 'store_owner_profiles'
      break
    case 'broker':
      table = 'broker_profiles'
      break
    case 'expert':
      table = 'expert_profiles'
      break
    case 'student':
      table = 'student_profiles'
      break
    case 'consumer':
      table = 'consumer_profiles'
      break
    default:
      console.error(`getUserTypeProfile: Invalid user type: ${userType}`);
      return { data: null, error: `Invalid user type: ${userType}` }
  }
  
  try {
    // First check how many records exist for this user
    const countQuery = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);
      
    if (countQuery.error) {
      // Check if it's a "relation does not exist" error, which means the table doesn't exist
      if (countQuery.error.code === '42P01' || countQuery.error.message.includes('relation') && countQuery.error.message.includes('does not exist')) {
        console.error(`Table ${table} does not exist:`, countQuery.error);
        // Return an empty profile object instead of null to prevent redirect
        return { 
          data: { 
            user_id: userId,
            created_at: new Date().toISOString(),
            // Add minimal default fields based on user type
            ...(userType === 'farmer' && { farm_location: 'Not set', crops_grown: [] }),
            ...(userType === 'store_owner' && { store_name: 'My Store', store_location: 'Not set' }),
            ...(userType === 'broker' && { market_name: 'Not set', market_location: 'Not set' }),
            ...(userType === 'expert' && { expertise_area: 'Not set', qualification: 'Not set' }),
            ...(userType === 'student' && { institution: 'Not set', field_of_study: 'Not set' }),
            ...(userType === 'consumer' && { preferred_location: 'Not set' })
          }, 
          error: null 
        };
      }
      
      console.error(`Error checking ${userType} profile count:`, countQuery.error);
      // Return an empty profile object instead of an error
      return { 
        data: { user_id: userId, created_at: new Date().toISOString() }, 
        error: null 
      };
    }
    
    // Log the count for debugging
    console.log(`Found ${countQuery.count} ${userType} profiles for user ${userId}`);
    
    if (countQuery.count === 0) {
      console.log(`No ${userType} profile found for user ${userId}, returning empty profile`);
      // Return an empty profile object instead of null
      return { 
        data: { 
          user_id: userId,
          created_at: new Date().toISOString(),
          // Add minimal default fields based on user type
          ...(userType === 'farmer' && { farm_location: 'Not set', crops_grown: [] }),
          ...(userType === 'store_owner' && { store_name: 'My Store', store_location: 'Not set' }),
          ...(userType === 'broker' && { market_name: 'Not set', market_location: 'Not set' }),
          ...(userType === 'expert' && { expertise_area: 'Not set', qualification: 'Not set' }),
          ...(userType === 'student' && { institution: 'Not set', field_of_study: 'Not set' }),
          ...(userType === 'consumer' && { preferred_location: 'Not set' })
        }, 
        error: null 
      };
    }
    
    // If multiple rows exist, get all of them and select the most recent one
    if (countQuery.count && countQuery.count > 1) {
      console.warn(`Multiple ${userType} profiles found for user ${userId}, using most recent`);
  
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq('user_id', userId)
        .order('created_at', { ascending: false });
  
  if (error) {
        console.error(`Error fetching ${userType} profiles:`, error);
        // Return an empty profile object instead of an error
        return { 
          data: { user_id: userId, created_at: new Date().toISOString() }, 
          error: null 
        };
      }
      
      if (!data || data.length === 0) {
        // Return an empty profile object
        return { 
          data: { user_id: userId, created_at: new Date().toISOString() }, 
          error: null 
        };
      }
      
      // Return the most recent profile (first in the array after sorting)
      return { data: data[0], error: null };
    }
    
    // If we have exactly one row, use single() to fetch it
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      console.error(`Error fetching ${userType} profile:`, error);
      // Return an empty profile object instead of an error
      return { 
        data: { 
          user_id: userId,
          created_at: new Date().toISOString(),
          // Add minimal default fields based on user type
          ...(userType === 'farmer' && { farm_location: 'Not set', crops_grown: [] }),
          ...(userType === 'store_owner' && { store_name: 'My Store', store_location: 'Not set' }),
          ...(userType === 'broker' && { market_name: 'Not set', market_location: 'Not set' }),
          ...(userType === 'expert' && { expertise_area: 'Not set', qualification: 'Not set' }),
          ...(userType === 'student' && { institution: 'Not set', field_of_study: 'Not set' }),
          ...(userType === 'consumer' && { preferred_location: 'Not set' })
        }, 
        error: null 
      };
    }
    
    return { data, error: null };
  } catch (err) {
    console.error(`Unexpected error in getUserTypeProfile:`, err);
    // Return an empty profile object instead of an error
    return { 
      data: { 
        user_id: userId,
        created_at: new Date().toISOString(),
        // Add minimal default fields based on user type
        ...(userType === 'farmer' && { farm_location: 'Not set', crops_grown: [] }),
        ...(userType === 'store_owner' && { store_name: 'My Store', store_location: 'Not set' }),
        ...(userType === 'broker' && { market_name: 'Not set', market_location: 'Not set' }),
        ...(userType === 'expert' && { expertise_area: 'Not set', qualification: 'Not set' }),
        ...(userType === 'student' && { institution: 'Not set', field_of_study: 'Not set' }),
        ...(userType === 'consumer' && { preferred_location: 'Not set' })
      }, 
      error: null 
    };
  }
}

export const resetPassword = async (email: string) => {
  const supabase = createClient()
  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  })
}

export const updateUserPassword = async (password: string) => {
  const supabase = createClient()
  return supabase.auth.updateUser({
    password,
  })
}

export const signInWithOtp = async (phone: string) => {
  const supabase = createClient()
  return supabase.auth.signInWithOtp({
    phone
  })
}

export const verifyOtp = async (phone: string, token: string) => {
  const supabase = createClient()
  return supabase.auth.verifyOtp({
    phone,
    token,
    type: 'sms'
  })
}

export async function getUserRoles(email: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('user_roles')
    .select('role_type, is_primary')
    .eq('email', email)
  
  if (error) {
    console.error('Error fetching user roles:', error)
    return []
  }
  
  return data
}

export async function addUserRole(email: string, roleType: string) {
  const supabase = createClient()
  const { data: userData } = await supabase.auth.getUser()
  
  if (!userData.user) return { error: 'No authenticated user found' }
  
  // First, check if user already has this role
  const { data: existingRole } = await supabase
    .from('user_roles')
    .select('*')
    .eq('email', email)
    .eq('role_type', roleType)
    .single()
    
  if (existingRole) {
    return { error: 'User already has this role' }
  }
  
  // Insert into user_roles table
  const { error: roleError } = await supabase.from('user_roles').insert({
    email: email,
    user_id: userData.user.id,
    role_type: roleType,
    is_primary: false // By default, new roles are not primary
  })

  if (roleError) {
    console.error('Error adding user role:', roleError)
    return { error: roleError }
  }
  
  return { success: true }
} 

export async function signUpWithEmail(email: string, password: string, metadata: any = {}) {
  const supabase = createClient()
  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
      emailRedirectTo: `${window.location.origin}/auth/callback`
    }
  })
}

export async function signOut() {
  const supabase = createClient()
  return supabase.auth.signOut()
}

// Soil Health Functions

/**
 * Get all soil tests for the current user
 */
export const getSoilTests = async () => {
  try {
    const supabase = createClient();
    const user = await getCurrentUser();
    
    if (!user) {
      return { data: null, error: 'Authentication required' };
    }
    
    const { data, error } = await supabase
      .from('soil_tests')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });
      
    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error('Error fetching soil tests:', err);
    return { 
      data: null, 
      error: err instanceof Error ? err.message : 'Failed to load soil tests' 
    };
  }
};

/**
 * Get a specific soil test by ID
 */
export const getSoilTestById = async (testId: string) => {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('soil_tests')
      .select('*')
      .eq('id', testId)
      .single();
      
    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error('Error fetching soil test:', err);
    return { 
      data: null, 
      error: err instanceof Error ? err.message : 'Failed to load soil test' 
    };
  }
};

/**
 * Add a new soil test
 */
export const addSoilTest = async (testData: {
  date: string;
  location: string;
  ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  organic_matter: number;
  moisture: number;
  notes?: string;
}) => {
  try {
    const supabase = createClient();
    const user = await getCurrentUser();
    
    if (!user) {
      return { data: null, error: 'Authentication required' };
    }
    
    const { data, error } = await supabase
      .from('soil_tests')
      .insert({
        user_id: user.id,
        ...testData
      })
      .select()
      .single();
      
    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error('Error adding soil test:', err);
    return { 
      data: null, 
      error: err instanceof Error ? err.message : 'Failed to add soil test' 
    };
  }
};

/**
 * Update an existing soil test
 */
export const updateSoilTest = async (testId: string, testData: {
  date?: string;
  location?: string;
  ph?: number;
  nitrogen?: number;
  phosphorus?: number;
  potassium?: number;
  organic_matter?: number;
  moisture?: number;
  notes?: string;
}) => {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('soil_tests')
      .update({
        ...testData,
        updated_at: new Date().toISOString()
      })
      .eq('id', testId)
      .select()
      .single();
      
    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error('Error updating soil test:', err);
    return { 
      data: null, 
      error: err instanceof Error ? err.message : 'Failed to update soil test' 
    };
  }
};

/**
 * Delete a soil test
 */
export const deleteSoilTest = async (testId: string) => {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from('soil_tests')
      .delete()
      .eq('id', testId);
      
    if (error) throw error;
    return { success: true, error: null };
  } catch (err) {
    console.error('Error deleting soil test:', err);
    return { 
      success: false, 
      error: err instanceof Error ? err.message : 'Failed to delete soil test' 
    };
  }
};

/**
 * Get all soil recommendations
 */
export const getSoilRecommendations = async () => {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('soil_recommendations')
      .select('*');
      
    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error('Error fetching soil recommendations:', err);
    return { 
      data: null, 
      error: err instanceof Error ? err.message : 'Failed to load recommendations' 
    };
  }
};

/**
 * Get farm locations for the current user
 */
export const getFarmLocations = async () => {
  try {
    const supabase = createClient();
    const user = await getCurrentUser();
    
    if (!user) {
      return { data: null, error: 'Authentication required' };
    }
    
    const { data, error } = await supabase
      .from('farm_locations')
      .select('*')
      .eq('user_id', user.id)
      .order('name', { ascending: true });
      
    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error('Error fetching farm locations:', err);
    return { 
      data: null, 
      error: err instanceof Error ? err.message : 'Failed to load farm locations' 
    };
  }
};

/**
 * Add a new farm location
 */
export const addFarmLocation = async (location: {
  name: string;
  coordinates?: string;
  area?: number;
}) => {
  try {
    const supabase = createClient();
    const user = await getCurrentUser();
    
    if (!user) {
      return { data: null, error: 'Authentication required' };
    }
    
    // Log for debugging
    console.log('Adding farm location for user:', user.id, 'with data:', location);
    
    const { data, error } = await supabase
      .from('farm_locations')
      .insert({
        user_id: user.id,
        ...location
      })
      .select()
      .single();
      
    if (error) {
      console.error('Supabase error adding farm location:', error);
      throw error;
    }
    
    return { data, error: null };
  } catch (err) {
    console.error('Error adding farm location:', err);
    return { 
      data: null, 
      error: err instanceof Error ? err.message : 'Failed to add farm location' 
    };
  }
};

// Crop Rotation Functions

/**
 * Get all crop rotation plans for the current user
 */
export const getCropRotationPlans = async () => {
  try {
    const supabase = createClient();
    const user = await getCurrentUser();
    
    if (!user) {
      return { data: null, error: 'Authentication required' };
    }
    
    const { data, error } = await supabase
      .from('crop_rotation_plans')
      .select('*, crop_cycles(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error('Error fetching crop rotation plans:', err);
    return { 
      data: null, 
      error: err instanceof Error ? err.message : 'Failed to load crop rotation plans' 
    };
  }
};

/**
 * Get a specific crop rotation plan by ID with all associated crop cycles
 */
export const getCropRotationPlanById = async (planId: string) => {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('crop_rotation_plans')
      .select('*, crop_cycles(*)')
      .eq('id', planId)
      .single();
      
    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error('Error fetching crop rotation plan:', err);
    return { 
      data: null, 
      error: err instanceof Error ? err.message : 'Failed to load crop rotation plan' 
    };
  }
};

/**
 * Add a new crop rotation plan
 */
export const addCropRotationPlan = async (planData: {
  name: string;
  location: string;
  start_date: string;
}) => {
  try {
    const supabase = createClient();
    const user = await getCurrentUser();
    
    if (!user) {
      return { data: null, error: 'Authentication required' };
    }
    
    const { data, error } = await supabase
      .from('crop_rotation_plans')
      .insert({
        user_id: user.id,
        ...planData
      })
      .select()
      .single();
      
    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error('Error adding crop rotation plan:', err);
    return { 
      data: null, 
      error: err instanceof Error ? err.message : 'Failed to add crop rotation plan' 
    };
  }
};

/**
 * Update an existing crop rotation plan
 */
export const updateCropRotationPlan = async (planId: string, planData: {
  name?: string;
  location?: string;
  start_date?: string;
}) => {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('crop_rotation_plans')
      .update({
        ...planData,
        updated_at: new Date().toISOString()
      })
      .eq('id', planId)
      .select()
      .single();
      
    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error('Error updating crop rotation plan:', err);
    return { 
      data: null, 
      error: err instanceof Error ? err.message : 'Failed to update crop rotation plan' 
    };
  }
};

/**
 * Delete a crop rotation plan and all associated crop cycles
 */
export const deleteCropRotationPlan = async (planId: string) => {
  try {
    const supabase = createClient();
    
    // First delete all associated crop cycles
    const { error: cyclesError } = await supabase
      .from('crop_cycles')
      .delete()
      .eq('plan_id', planId);
      
    if (cyclesError) throw cyclesError;
    
    // Then delete the plan itself
    const { error } = await supabase
      .from('crop_rotation_plans')
      .delete()
      .eq('id', planId);
      
    if (error) throw error;
    return { success: true, error: null };
  } catch (err) {
    console.error('Error deleting crop rotation plan:', err);
    return { 
      success: false, 
      error: err instanceof Error ? err.message : 'Failed to delete crop rotation plan' 
    };
  }
};

/**
 * Add a new crop cycle to an existing rotation plan
 */
export const addCropCycle = async (cycleData: {
  plan_id: string;
  season_name: string;
  crop_family: string;
  crop_name: string;
  start_date: string;
  end_date: string;
  notes?: string;
}) => {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('crop_cycles')
      .insert(cycleData)
      .select()
      .single();
      
    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error('Error adding crop cycle:', err);
    return { 
      data: null, 
      error: err instanceof Error ? err.message : 'Failed to add crop cycle' 
    };
  }
};

/**
 * Update an existing crop cycle
 */
export const updateCropCycle = async (cycleId: string, cycleData: {
  season_name?: string;
  crop_family?: string;
  crop_name?: string;
  start_date?: string;
  end_date?: string;
  notes?: string;
}) => {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('crop_cycles')
      .update({
        ...cycleData,
        updated_at: new Date().toISOString()
      })
      .eq('id', cycleId)
      .select()
      .single();
      
    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    console.error('Error updating crop cycle:', err);
    return { 
      data: null, 
      error: err instanceof Error ? err.message : 'Failed to update crop cycle' 
    };
  }
};

/**
 * Delete a crop cycle
 */
export const deleteCropCycle = async (cycleId: string) => {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from('crop_cycles')
      .delete()
      .eq('id', cycleId);
      
    if (error) throw error;
    return { success: true, error: null };
  } catch (err) {
    console.error('Error deleting crop cycle:', err);
    return { 
      success: false, 
      error: err instanceof Error ? err.message : 'Failed to delete crop cycle' 
    };
  }
};

// STORE OWNER - BILLING FUNCTIONS
export async function getBillsForStoreOwner() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('store_bills')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching bills:', error);
    return [];
  }

  return data || [];
}

export async function getBillById(billId: string) {
  const supabase = createClient();
  const { data: bill, error: billError } = await supabase
    .from('store_bills')
    .select('*')
    .eq('id', billId)
    .single();

  if (billError) {
    console.error('Error fetching bill:', billError);
    return null;
  }

  // Get bill items
  const { data: items, error: itemsError } = await supabase
    .from('store_bill_items')
    .select('*')
    .eq('bill_id', billId);

  if (itemsError) {
    console.error('Error fetching bill items:', itemsError);
    return { ...bill, items: [] };
  }

  return { ...bill, items: items || [] };
}

export async function createBill(billData: any) {
  const supabase = createClient();
  
  // First create the bill
  const { data: bill, error: billError } = await supabase
    .from('store_bills')
    .insert({
      bill_number: billData.bill_number,
      bill_date: billData.bill_date,
      farmer_id: billData.farmer_id,
      farmer_name: billData.farmer_name,
      farmer_mobile: billData.farmer_mobile,
      subtotal: billData.subtotal,
      gst_total: billData.gst_total,
      grand_total: billData.grand_total,
      payment_method: billData.payment_method,
      notes: billData.notes,
      store_owner_id: billData.store_owner_id
    })
    .select()
    .single();

  if (billError) {
    console.error('Error creating bill:', billError);
    throw billError;
  }

  // Then create the bill items
  if (billData.items && billData.items.length > 0) {
    const billItems = billData.items.map((item: any) => ({
      bill_id: bill.id,
      product_id: item.product_id,
      product_name: item.product_name,
      hsn_code: item.hsn_code,
      quantity: item.quantity,
      unit: item.unit,
      price: item.price,
      gst_rate: item.gst_rate,
      gst_amount: item.gst_amount,
      total: item.total
    }));

    const { error: itemsError } = await supabase
      .from('store_bill_items')
      .insert(billItems);

    if (itemsError) {
      console.error('Error creating bill items:', itemsError);
      throw itemsError;
    }
  }

  return bill;
}

export async function searchFarmers(searchTerm: string) {
  const supabase = createClient();
  
  if (!searchTerm || searchTerm.length < 3) {
    return [];
  }
  
  // Search in users table by name and email
  const { data, error } = await supabase
    .from('users')
    .select('id, name, email, mobile')
    .eq('user_type', 'farmer')
    .or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,mobile.ilike.%${searchTerm}%`)
    .limit(5);
  
  if (error) {
    console.error('Error searching farmers:', error);
    return [];
  }
  
  return data || [];
}

export async function getFarmerProfile(farmerId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('farmer_profiles')
    .select('*')
    .eq('user_id', farmerId)
    .single();
  
  if (error) {
    console.error('Error fetching farmer profile:', error);
    return null;
  }
  
  return data;
}

// STORE OWNER - INVENTORY FUNCTIONS
export async function getProductCategories() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('product_categories')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching product categories:', error);
    return [];
  }

  return data || [];
}

export async function getProductsForStoreOwner() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('store_products')
    .select(`
      *,
      product_categories(id, name)
    `)
    .order('name');

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return data || [];
}

export async function getProductById(productId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('store_products')
    .select(`
      *,
      product_categories(id, name)
    `)
    .eq('id', productId)
    .single();

  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }

  return data;
}

export async function createProduct(productData: any) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('store_products')
    .insert(productData)
    .select()
    .single();

  if (error) {
    console.error('Error creating product:', error);
    throw error;
  }

  return data;
}

export async function updateProduct(productId: string, productData: any) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('store_products')
    .update(productData)
    .eq('id', productId)
    .select()
    .single();

  if (error) {
    console.error('Error updating product:', error);
    throw error;
  }

  return data;
}

export async function deleteProduct(productId: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from('store_products')
    .delete()
    .eq('id', productId);

  if (error) {
    console.error('Error deleting product:', error);
    throw error;
  }

  return true;
}

export async function getInventoryForStoreOwner() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('store_inventory')
    .select(`
      *,
      store_products(id, name, unit, price, gst_rate, min_stock_level)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching inventory:', error);
    return [];
  }

  return data || [];
}

export async function updateInventoryQuantity(inventoryId: string, quantity: number, notes: string = '') {
  const supabase = createClient();
  
  // First get current quantity
  const { data: currentInventory, error: fetchError } = await supabase
    .from('store_inventory')
    .select('quantity, product_id, store_owner_id')
    .eq('id', inventoryId)
    .single();
  
  if (fetchError) {
    console.error('Error fetching inventory record:', fetchError);
    throw fetchError;
  }
  
  // Update inventory
  const { data, error } = await supabase
    .from('store_inventory')
    .update({
      quantity: quantity,
      updated_at: new Date().toISOString()
    })
    .eq('id', inventoryId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating inventory quantity:', error);
    throw error;
  }
  
  // Record the transaction
  const { error: txError } = await supabase
    .from('inventory_transactions')
    .insert({
      store_owner_id: currentInventory.store_owner_id,
      product_id: currentInventory.product_id,
      transaction_type: 'adjustment',
      quantity: Math.abs(quantity - currentInventory.quantity),
      previous_quantity: currentInventory.quantity,
      new_quantity: quantity,
      notes: notes || 'Manual inventory adjustment'
    });
  
  if (txError) {
    console.error('Error recording inventory transaction:', txError);
    // Continue anyway as the main update was successful
  }
  
  return data;
}

// KrishiGram Functions
export async function getKrishiGramPosts(page = 1, limit = 10) {
  try {
    const supabase = createClient();
    const offset = (page - 1) * limit;
    
    // First, get posts with likes and comments counts
    const { data: postsData, error: postsError } = await supabase
      .from('krishigram_posts')
      .select(`
        *,
        likes_count:krishigram_likes(count),
        comments_count:krishigram_comments(count)
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (postsError) {
      throw postsError;
    }
    
    if (!postsData || postsData.length === 0) {
      return { data: [], error: null };
    }
    
    // Get user data in a separate query
    const userIds = postsData.map(post => post.user_id);
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('id, full_name')
      .in('id', userIds);
    
    if (usersError) {
      console.error('Error fetching users:', usersError);
      // Continue without user information
    }
    
    // Create a map of user IDs to names for quick lookup
    const userMap = new Map();
    usersData?.forEach(user => {
      userMap.set(user.id, user.full_name);
    });
    
    // Get current user to check if they've liked each post
    const { data: { user } } = await supabase.auth.getUser();
    
    let likedPostIds = new Set();
    if (user) {
      // Check which posts the current user has liked
      const { data: userLikes, error: likesError } = await supabase
        .from('krishigram_likes')
        .select('post_id')
        .eq('user_id', user.id);
      
      if (likesError) {
        console.error('Error fetching user likes:', likesError);
        // Continue without likes information
      } else {
        likedPostIds = new Set(userLikes?.map(like => like.post_id) || []);
      }
    }
    
    // Format the posts with all required information
    const formattedPosts = postsData.map(post => ({
      id: post.id,
      user_id: post.user_id,
      content: post.content,
      media_url: post.media_url,
      media_type: post.media_type,
      location: post.location,
      created_at: post.created_at,
      type: post.type,
      tags: post.tags,
      user_full_name: userMap.get(post.user_id) || 'Unknown User',
      likes: post.likes_count[0]?.count || 0,
      comments_count: post.comments_count[0]?.count || 0,
      isLiked: likedPostIds.has(post.id)
    }));
    
    return { data: formattedPosts, error: null };
  } catch (error) {
    console.error('Error getting KrishiGram posts:', error);
    return { data: [], error };
  }
}

export async function getKrishiGramPostById(postId: string) {
  try {
    const supabase = createClient();
    
    // Get post data
    const { data: post, error: postError } = await supabase
      .from('krishigram_posts')
      .select(`
        *,
        likes_count:krishigram_likes(count),
        comments_count:krishigram_comments(count)
      `)
      .eq('id', postId)
      .single();
    
    if (postError) {
      throw postError;
    }
    
    // Get user data
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, full_name')
      .eq('id', post.user_id)
      .single();
    
    if (userError) {
      console.error('Error fetching user:', userError);
      // Continue without user information
    }
    
    return { 
      data: {
        id: post.id,
        user_id: post.user_id,
        content: post.content,
        media_url: post.media_url,
        media_type: post.media_type,
        location: post.location,
        created_at: post.created_at,
        type: post.type,
        tags: post.tags,
        user_full_name: userData?.full_name || 'Unknown User',
        likes: post.likes_count[0]?.count || 0,
        comments_count: post.comments_count[0]?.count || 0
      }, 
      error: null 
    };
  } catch (error) {
    console.error('Error getting KrishiGram post by ID:', error);
    return { data: null, error };
  }
}

export async function createKrishiGramPost(content: string, mediaUrl?: string, mediaType?: string, location?: string, type: 'post' | 'reel' | 'story' = 'post', tags: string[] = []) {
  try {
    const supabase = createClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('Auth error:', authError);
      throw new Error('Authentication error');
    }
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Create post
    const { data, error } = await supabase
      .from('krishigram_posts')
      .insert({
        user_id: user.id,
        content,
        media_url: mediaUrl,
        media_type: mediaType,
        location,
        type,
        tags
      })
      .select()
      .single();
    
    if (error) {
      console.error('Database error when creating post:', error);
      throw error;
    }
    
    if (!data) {
      throw new Error('No data returned from post creation');
    }
    
    return { data, error: null };
  } catch (error: any) {
    console.error('Error creating KrishiGram post:', error);
    return { data: null, error: error.message || 'Failed to create post' };
  }
}

export async function likeKrishiGramPost(postId: string) {
  try {
    const supabase = createClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('Auth error:', authError);
      throw new Error('Authentication error');
    }
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Check if user already liked this post
    const { data: existingLike, error: checkError } = await supabase
      .from('krishigram_likes')
      .select()
      .eq('post_id', postId)
      .eq('user_id', user.id)
      .maybeSingle();
    
    if (checkError) {
      console.error('Error checking existing like:', checkError);
      throw checkError;
    }
    
    // If already liked, return early
    if (existingLike) {
      return { data: existingLike, error: null };
    }
    
    // Add new like
    const { data, error } = await supabase
      .from('krishigram_likes')
      .insert({
        post_id: postId,
        user_id: user.id
      })
      .select()
      .single();
    
    if (error) {
      console.error('Database error when liking post:', error);
      throw error;
    }
    
    return { data, error: null };
  } catch (error: any) {
    console.error('Error liking KrishiGram post:', error);
    return { data: null, error: error.message || 'Failed to like post' };
  }
}

export async function unlikeKrishiGramPost(postId: string) {
  try {
    const supabase = createClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('Auth error:', authError);
      throw new Error('Authentication error');
    }
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Delete the like
    const { data, error } = await supabase
      .from('krishigram_likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', user.id)
      .select()
      .single();
    
    if (error) {
      // If the error is that no rows were affected, it might just mean there was no like to delete
      if (error.code === 'PGRST116') {
        console.warn('No like found to delete');
        return { data: null, error: null };
      }
      
      console.error('Database error when unliking post:', error);
      throw error;
    }
    
    return { data, error: null };
  } catch (error: any) {
    console.error('Error unliking KrishiGram post:', error);
    return { data: null, error: error.message || 'Failed to unlike post' };
  }
}

export async function commentOnKrishiGramPost(postId: string, content: string) {
  try {
    const supabase = createClient();
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Create comment
    const { data: commentData, error: commentError } = await supabase
      .from('krishigram_comments')
      .insert({
        post_id: postId,
        user_id: user.id,
        content
      })
      .select()
      .single();
    
    if (commentError) {
      throw commentError;
    }
    
    // Get user data
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('full_name')
      .eq('id', user.id)
      .single();
    
    if (userError) {
      console.error('Error fetching user:', userError);
      // Continue without user information
    }
    
    // Format the comment for frontend
    const formattedComment = {
      id: commentData.id,
      post_id: postId,
      user_id: commentData.user_id,
      content: commentData.content,
      created_at: commentData.created_at,
      user_full_name: userData?.full_name || 'Unknown User'
    };
    
    return { data: formattedComment, error: null };
  } catch (error) {
    console.error('Error commenting on KrishiGram post:', error);
    return { data: null, error };
  }
}

export async function getKrishiGramComments(postId: string) {
  try {
    const supabase = createClient();
    
    // Get comments
    const { data: comments, error: commentsError } = await supabase
      .from('krishigram_comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });
    
    if (commentsError) {
      throw commentsError;
    }
    
    if (!comments || comments.length === 0) {
      return { data: [], error: null };
    }
    
    // Get user data in a separate query
    const userIds = comments.map(comment => comment.user_id);
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('id, full_name')
      .in('id', userIds);
    
    if (usersError) {
      console.error('Error fetching users:', usersError);
      // Continue without user information
    }
    
    // Create a map of user IDs to names for quick lookup
    const userMap = new Map();
    usersData?.forEach(user => {
      userMap.set(user.id, user.full_name);
    });
    
    // Format comments for frontend
    const formattedComments = comments.map(comment => ({
      id: comment.id,
      post_id: postId,
      user_id: comment.user_id,
      content: comment.content,
      created_at: comment.created_at,
      user_full_name: userMap.get(comment.user_id) || 'Unknown User'
    }));
    
    return { data: formattedComments, error: null };
  } catch (error) {
    console.error('Error getting KrishiGram comments:', error);
    return { data: [], error };
  }
}

export async function getKrishiGramGroups() {
  try {
    const supabase = createClient();
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    // Fetch all groups
    const { data, error } = await supabase
      .from('krishigram_groups')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    if (!user) {
      // Return groups without membership info if no user is logged in
      return { data, error: null };
    }
    
    // Get groups the user is a member of
    const { data: membershipData, error: membershipError } = await supabase
      .from('krishigram_group_members')
      .select('group_id')
      .eq('user_id', user.id);
    
    if (membershipError) {
      console.error('Error fetching group memberships:', membershipError);
      // Continue without membership information
    }
    
    // Create a set of groups the user is a member of
    const memberGroupIds = new Set(membershipData?.map(membership => membership.group_id) || []);
    
    // Mark groups as joined if the user is a member
    const groupsWithMembership = data.map(group => ({
      ...group,
      isMember: memberGroupIds.has(group.id)
    }));
    
    return { data: groupsWithMembership, error: null };
  } catch (error) {
    console.error('Error getting KrishiGram groups:', error);
    return { data: [], error };
  }
}

export async function joinKrishiGramGroup(groupId: string) {
  try {
    const supabase = createClient();
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Check if user is already a member
    const { data: existingMembership, error: checkError } = await supabase
      .from('krishigram_group_members')
      .select()
      .eq('group_id', groupId)
      .eq('user_id', user.id)
      .maybeSingle();
    
    if (checkError) {
      throw checkError;
    }
    
    // If already a member, return early
    if (existingMembership) {
      return { data: existingMembership, error: null };
    }
    
    // Add new membership
    const { data, error } = await supabase
      .from('krishigram_group_members')
      .insert({
        group_id: groupId,
        user_id: user.id,
        role: 'member'
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    // Update group members count
    const { error: updateError } = await supabase.rpc('increment_group_members', {
      group_id: groupId
    });
    
    if (updateError) {
      console.error('Error updating group members count:', updateError);
      // Continue without updating count
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Error joining KrishiGram group:', error);
    return { data: null, error };
  }
}

export async function leaveKrishiGramGroup(groupId: string) {
  try {
    const supabase = createClient();
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Delete membership
    const { error } = await supabase
      .from('krishigram_group_members')
      .delete()
      .eq('group_id', groupId)
      .eq('user_id', user.id);
    
    if (error) {
      throw error;
    }
    
    // Update group members count
    const { error: updateError } = await supabase.rpc('decrement_group_members', {
      group_id: groupId
    });
    
    if (updateError) {
      console.error('Error updating group members count:', updateError);
      // Continue without updating count
    }
    
    return { data: null, error: null };
  } catch (error) {
    console.error('Error leaving KrishiGram group:', error);
    return { data: null, error };
  }
}

export async function followUser(userId: string) {
  try {
    const supabase = createClient();
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Check if user already follows this user
    const { data: existingFollow, error: checkError } = await supabase
      .from('krishigram_followers')
      .select()
      .eq('follower_id', user.id)
      .eq('following_id', userId)
      .maybeSingle();
    
    if (checkError) {
      throw checkError;
    }
    
    // If already following, return early
    if (existingFollow) {
      return { data: existingFollow, error: null };
    }
    
    // Add new follow
    const { data, error } = await supabase
      .from('krishigram_followers')
      .insert({
        follower_id: user.id,
        following_id: userId
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Error following user:', error);
    return { data: null, error };
  }
}

export async function unfollowUser(userId: string) {
  try {
    const supabase = createClient();
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Delete follow
    const { error } = await supabase
      .from('krishigram_followers')
      .delete()
      .eq('follower_id', user.id)
      .eq('following_id', userId);
    
    if (error) {
      throw error;
    }
    
    return { data: null, error: null };
  } catch (error) {
    console.error('Error unfollowing user:', error);
    return { data: null, error };
  }
} 