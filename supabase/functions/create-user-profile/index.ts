import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

console.log("Create User Profile function booting up!")

// Define interfaces for expected data
interface UserMetadata {
  full_name?: string;
  user_type?: string;
  // Add other potential metadata fields if needed
}

interface ProfileData {
  name?: string;
  userType?: string;
  mobile?: string;
  address?: string;
  language?: string;
  // Farmer specific
  cropTypes?: string;
  landArea?: string;
  // Store owner specific
  shopName?: string;
  shopAddress?: string;
  gstNumber?: string;
  // Broker specific
  marketName?: string;
  brokerLicense?: string;
  // Expert specific
  expertise?: string;
  qualification?: string;
  // Student specific
  institution?: string;
  fieldOfStudy?: string;
  // Consumer specific
  interests?: string;
  dietaryPreferences?: string;
}

interface AuthUser {
  id: string;
  email?: string;
  phone?: string;
  user_metadata?: UserMetadata & ProfileData; // Combine both possibilities
  // Add other relevant fields from auth.users if needed
}

interface WebhookPayload {
  type: "INSERT";
  table: "users";
  schema: "auth";
  record: AuthUser;
  old_record: null;
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Ensure the request is a POST request
    if (req.method !== 'POST') {
      throw new Error('Method Not Allowed: Only POST requests are accepted.');
    }

    // Extract the payload (the new user record from auth.users)
    const payload: WebhookPayload = await req.json();
    console.log("Received payload:", JSON.stringify(payload, null, 2));

    // Ensure it's an INSERT event on auth.users
    if (payload.type !== 'INSERT' || payload.table !== 'users' || payload.schema !== 'auth') {
      console.warn("Received non-matching payload type:", payload.type, payload.table, payload.schema);
      return new Response(JSON.stringify({ message: 'Ignoring non-auth.users insert event' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    const user = payload.record;
    const userId = user.id;
    const email = user.email;
    const phone = user.phone; // Might be useful
    const metadata = user.user_metadata || {}; // Use provided metadata

    // Extract profile data from metadata
    const fullName = metadata.full_name || metadata.name || 'Unnamed User'; // Fallback needed
    const userType = metadata.user_type || metadata.userType || 'consumer'; // Default to consumer if not set
    const mobile = metadata.mobile || '';
    const address = metadata.address || '';
    const language = metadata.language || 'en';

    // Log extracted data
    console.log(`Processing user: ${userId}, Email: ${email}, Type: ${userType}, Name: ${fullName}`);


    // Validate essential data
    if (!userId || !email) {
      throw new Error('User ID and Email are required from the auth record.');
    }
     if (!userType) {
      console.warn(`User type missing for user ${userId}. Defaulting to 'consumer'.`);
      // Consider throwing error if userType is strictly required
      // throw new Error('User type is required in metadata.');
    }


    // Initialize Supabase client with SERVICE_ROLE key for elevated privileges
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // 1. Upsert into public.users table
    console.log(`Upserting into public.users for user ${userId}`);
    const { error: userProfileError } = await supabaseAdmin
      .from('users')
      .upsert(
        {
          id: userId,
          email: email,
          full_name: fullName,
          phone: mobile,
          user_type: userType,
          language_preference: language,
        },
        { onConflict: 'id' }
      );

    if (userProfileError) {
      console.error('Error upserting public.users profile:', userProfileError);
      throw new Error(`Failed to create user profile: ${userProfileError.message}`);
    }
    console.log(`Successfully upserted into public.users for user ${userId}`);


    // 2. Upsert into user_roles table (optional but good practice)
     try {
      console.log(`Upserting into user_roles for user ${userId}`);
        const { error: roleError } = await supabaseAdmin.from('user_roles').upsert({
          email: email,
          user_id: userId,
          role_type: userType,
          is_primary: true // Assume first role added via signup is primary
        }, {
          onConflict: 'user_id,role_type' // Use composite key if appropriate
        });

        if (roleError) {
          console.error('Error creating user role (non-critical):', roleError);
          // Log but don't throw - profile creation might still succeed
        } else {
          console.log(`Successfully upserted user_roles for ${userId}`);
        }
      } catch (roleCatchError) {
        console.error('Failed to add user_roles entry (non-critical catch):', roleCatchError);
      }


    // 3. Upsert into the type-specific profile table
    let specificProfileError: Error | null = null;
    console.log(`Preparing to upsert specific profile for type: ${userType}`);

    try {
        switch (userType) {
          case 'farmer':
            const { error: farmerError } = await supabaseAdmin.from('farmer_profiles').upsert({
              user_id: userId,
              farm_location: address || metadata.address || '', // Use address from basic info if available
              land_area: metadata.landArea ? parseFloat(metadata.landArea) : null,
              crops_grown: metadata.cropTypes ? [metadata.cropTypes] : [], // Assuming single string input for now
              farming_practices: [],
            }, { onConflict: 'user_id' });
            if (farmerError) specificProfileError = farmerError;
            break;

          case 'store_owner':
            const { error: storeError } = await supabaseAdmin.from('store_owner_profiles').upsert({
              user_id: userId,
              store_name: metadata.shopName || 'Unnamed Store', // Required field validation client-side
              store_location: metadata.shopAddress || '',
              gst_number: metadata.gstNumber || '',
              specializations: [],
            }, { onConflict: 'user_id' });
             if (storeError) specificProfileError = storeError;
            break;

          case 'broker':
             const { error: brokerError } = await supabaseAdmin.from('broker_profiles').upsert({
               user_id: userId,
               market_name: metadata.marketName || '',
               license_number: metadata.brokerLicense || '',
               specializations: [],
             }, { onConflict: 'user_id' });
             if (brokerError) specificProfileError = brokerError;
            break;

          case 'expert':
            const { error: expertError } = await supabaseAdmin.from('expert_profiles').upsert({
              user_id: userId,
              expertise: metadata.expertise || '',
              qualification: metadata.qualification || '',
              years_experience: 0, // Default value
            }, { onConflict: 'user_id' });
            if (expertError) specificProfileError = expertError;
            break;

          case 'student':
            const { error: studentError } = await supabaseAdmin.from('student_profiles').upsert({
              user_id: userId,
              institution: metadata.institution || '',
              field_of_study: metadata.fieldOfStudy || '',
              graduation_year: 0, // Default value
            }, { onConflict: 'user_id' });
            if (studentError) specificProfileError = studentError;
            break;

          case 'consumer':
             const { error: consumerError } = await supabaseAdmin.from('consumer_profiles').upsert({
               user_id: userId,
               preferences: metadata.dietaryPreferences || '',
               interests: metadata.interests ? [metadata.interests] : [], // Assuming single string input
             }, { onConflict: 'user_id' });
             if (consumerError) specificProfileError = consumerError;
            break;
          default:
            console.warn(`No specific profile table defined for user type: ${userType}`);
        } // end switch

        if (specificProfileError) {
          console.error(`Error upserting specific profile for ${userType}:`, specificProfileError);
          throw new Error(`Failed to create specific ${userType} profile: ${specificProfileError.message}`);
        } else {
           console.log(`Successfully upserted specific profile for type ${userType} for user ${userId}`);
        }

    } catch (specificProfileCatchError) {
       console.error(`Caught error during specific profile upsert (${userType}):`, specificProfileCatchError);
       // Decide if this should be a fatal error or just logged
       // For now, we log it but let the function return success as the main user profile was created.
       // Consider returning a different status or error message if specific profile is critical.
    }


    // Return success response
    return new Response(JSON.stringify({ message: 'User profile created successfully' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500, // Use 400 for client errors, 500 for server errors
    })
  }
}) 