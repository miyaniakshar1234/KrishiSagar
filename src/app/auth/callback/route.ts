import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const userTypeParam = requestUrl.searchParams.get('user_type')
  
  // Add detailed logging
  console.log('Auth callback accessed with params:', {
    code: code ? '[REDACTED]' : 'null',
    user_type: userTypeParam || 'null'
  });
  
  if (code) {
    const cookieStore = cookies()
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )
    
    try {
      // Exchange the code for a session
      console.log('Exchanging code for session');
      const { data: sessionData, error: sessionError } = await supabase.auth.exchangeCodeForSession(code);
      
      if (sessionError) {
        console.error('Error exchanging code for session:', sessionError);
        return NextResponse.redirect(new URL('/auth/sign-in?error=auth_session_error', request.url));
      }
      
      // After successful authentication, get the user and their profile
      console.log('Getting authenticated user data');
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('Error getting user data:', userError.message);
        return NextResponse.redirect(new URL('/auth/sign-in?error=auth_user_error', request.url));
      }
      
      // If we have a user, try to get their profile to determine the dashboard
      if (userData?.user) {
        console.log('User authenticated successfully:', userData.user.id);
        
        try {
          console.log('Fetching user profile for user ID:', userData.user.id);
          
          // Get the user profile to determine user type
          const { data: userProfile, error: profileError } = await supabase
            .from('users')
            .select('user_type, email')
            .eq('id', userData.user.id)
            .single();
          
          if (profileError) {
            console.error('Error fetching user profile:', profileError);
            console.error('Error details:', {
              code: profileError.code,
              message: profileError.message,
              details: profileError.details,
              hint: profileError.hint
            });
          }
          
          // First check if we got a profile with user_type
          if (userProfile?.user_type) {
            console.log('Found user_type in profile:', userProfile.user_type);
            return NextResponse.redirect(new URL(`/dashboard/${userProfile.user_type}`, request.url));
          } else {
            console.log('No user_type found in profile:', userProfile);
          }
          
          // If we have a user_type as a URL parameter (from Google OAuth), use that
          if (userTypeParam) {
            console.log('Using user_type from URL parameter:', userTypeParam);
            
            // Create/update the user profile with the provided type
            try {
              const { error: updateError } = await supabase
                .from('users')
                .upsert({
                  id: userData.user.id,
                  email: userData.user.email || '',
                  user_type: userTypeParam,
                  updated_at: new Date().toISOString()
                });
                
              if (updateError) {
                console.error('Error updating user profile with user_type:', updateError);
              } else {
                console.log('Successfully updated user profile with user_type:', userTypeParam);
              }
            } catch (updateErr) {
              console.error('Exception updating user profile:', updateErr);
            }
            
            return NextResponse.redirect(new URL(`/dashboard/${userTypeParam}`, request.url));
          }
          
          // If we still don't have a user_type, check user metadata
          const userMetadata = userData.user.user_metadata;
          console.log('Checking user metadata:', userMetadata);
          
          if (userMetadata && userMetadata.user_type) {
            console.log('Using user_type from user metadata:', userMetadata.user_type);
            
            // Also update the profile for future use
            try {
              const { error: metadataUpdateError } = await supabase
                .from('users')
                .upsert({
                  id: userData.user.id,
                  email: userData.user.email || '',
                  user_type: userMetadata.user_type,
                  updated_at: new Date().toISOString()
                });
                
              if (metadataUpdateError) {
                console.error('Error updating user profile from metadata:', metadataUpdateError);
              }
            } catch (metadataErr) {
              console.error('Exception updating profile from metadata:', metadataErr);
            }
            
            return NextResponse.redirect(new URL(`/dashboard/${userMetadata.user_type}`, request.url));
          }
          
          // Last fallback - if we couldn't determine the user_type, redirect to a selection page
          console.log('No user_type found anywhere, redirecting to dashboard selection');
          return NextResponse.redirect(new URL('/dashboard', request.url));
        } catch (error) {
          console.error('Error in callback route:', error);
          return NextResponse.redirect(new URL('/auth/sign-in?error=profile_error', request.url));
        }
      } else {
        console.warn('Auth session established but no user found');
      }
      
      // Default fallback - redirect to the main page if we couldn't determine the dashboard
      console.log('Using default fallback redirect to home page');
      return NextResponse.redirect(new URL('/', request.url));
    } catch (callbackError) {
      console.error('Unexpected error in auth callback:', callbackError);
      return NextResponse.redirect(new URL('/auth/sign-in?error=unexpected_error', request.url));
    }
  }
  
  // If there's no code, redirect to sign in
  console.log('No auth code found, redirecting to sign-in');
  return NextResponse.redirect(new URL('/auth/sign-in', request.url));
} 