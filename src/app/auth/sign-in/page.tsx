"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { signInWithGoogle, signInWithOtp, verifyOtp, createClient } from '@/lib/supabase/client';
import { signInUser, getCurrentSession, getUserProfile } from '@/lib/supabase/client-auth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// User types same as in sign-up
const USER_TYPES = [
  { id: 'farmer', label: 'Farmer', icon: '🌾' },
  { id: 'store_owner', label: 'Agro Store Owner', icon: '🏪' },
  { id: 'broker', label: 'Yard Market Broker', icon: '🏢' },
  { id: 'expert', label: 'Agriculture Expert', icon: '👩‍🔬' },
  { id: 'student', label: 'Agriculture Student', icon: '👨‍🎓' },
  { id: 'consumer', label: 'Consumer', icon: '👩‍🛒' },
];

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackError = searchParams.get('error') === 'auth_callback_error';
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(callbackError ? 'Authentication failed. Please try again.' : null);
  const [success, setSuccess] = useState<string | null>(null);
  const [authMethod, setAuthMethod] = useState<'email' | 'phone' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOTP] = useState('');
  const [selectedUserType, setSelectedUserType] = useState<string | null>(null);

  // Listen for auth state changes to handle redirects
  useEffect(() => {
    let isMounted = true;
    
    const checkUser = async () => {
      try {
        // Get current session
        const { data } = await getCurrentSession();
        const session = data?.session;
        
        // Only proceed with redirection if we have a valid session with a user
        if (session && session.user && isMounted) {
          try {
            // Get user profile only if we have a confirmed valid session
            const { data: userProfile } = await getUserProfile();
            
            // Only redirect if we got a valid profile with user_type
            if (userProfile && userProfile.user_type && isMounted) {
              console.log('Redirecting authenticated user to dashboard');
              router.push(`/dashboard/${userProfile.user_type}`);
            }
          } catch (profileError) {
            console.error('Error fetching user profile:', profileError);
            // Don't redirect on profile errors
          }
        }
      } catch (error) {
        console.error('Error checking user session:', error);
      }
    };

    // Run the check once on component mount
    checkUser();
    
    // Cleanup function to prevent state updates after unmounting
    return () => {
      isMounted = false;
    };
  }, [router]); // Only run on router change

  const handleEmailSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!selectedUserType) {
        setError("Please select your user type");
        setIsLoading(false);
        return;
      }

      // Use the enhanced signInUser function from client-auth
      const { data, error } = await signInUser(email, password);

      if (error) {
        throw error;
      }

      if (data?.session) {
        console.log("Login successful, fetching user profile and redirecting...");
        
        try {
          // Wait a moment for the session to be properly established
          await new Promise(resolve => setTimeout(resolve, 300));
          
          // Get user profile to verify the user type
          const { data: userProfile } = await getUserProfile();
          
          if (userProfile && userProfile.user_type) {
            // Redirect to the appropriate dashboard based on the user's type
            console.log(`Redirecting to dashboard/${userProfile.user_type}`);
            router.push(`/dashboard/${userProfile.user_type}`);
          } else {
            // If we couldn't get the user profile or user_type, redirect to the selected type
            console.log(`No profile found, redirecting to dashboard/${selectedUserType}`);
            router.push(`/dashboard/${selectedUserType}`);
          }
        } catch (profileError) {
          console.error("Error fetching user profile after login:", profileError);
          // If there's an error getting the profile, redirect to the selected type
          router.push(`/dashboard/${selectedUserType}`);
        }
      } else {
        setError("Login failed. Please check your credentials.");
      }
      
    } catch (err: any) {
      console.error("Sign-in error:", err);
      setError(err.message || 'An error occurred during sign in');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!selectedUserType) {
      setError("Please select a user type");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      // Store the selected user type in local storage to retrieve after OAuth
      localStorage.setItem('selectedUserType', selectedUserType);
      
      // Pass the selectedUserType to signInWithGoogle
      const { data, error } = await signInWithGoogle(selectedUserType);
      
      if (error) {
        console.error("Google sign-in error:", error);
        setError(error.message || "Failed to sign in with Google");
      }
    } catch (err) {
      console.error("Error signing in with Google:", err);
      setError("An unexpected error occurred during Google sign-in");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!selectedUserType) {
      setError("Please select your user type");
      setIsLoading(false);
      return;
    }

    if (!otpSent) {
      try {
        const { error } = await signInWithOtp(phone);
        if (error) throw error;
        setOtpSent(true);
        setSuccess("OTP sent to your phone number. Please verify.");
      } catch (err: any) {
        setError(err.message || "Failed to send OTP");
      } finally {
        setIsLoading(false);
      }
    } else {
      try {
        const { data, error } = await verifyOtp(phone, otp);
        if (error) throw error;
        
        if (data?.session) {
          console.log("Phone verification successful, redirecting...");
          
          try {
            // Wait a moment for the session to be properly established
            await new Promise(resolve => setTimeout(resolve, 300));
            
            // Get user profile to verify the user type
            const { data: userProfile } = await getUserProfile();
            
            if (userProfile && userProfile.user_type) {
              // Redirect to the appropriate dashboard based on the user's type
              router.push(`/dashboard/${userProfile.user_type}`);
            } else {
              // If we couldn't get the user profile or user_type, redirect to the selected type
              router.push(`/dashboard/${selectedUserType}`);
            }
          } catch (profileError) {
            console.error("Error fetching user profile after login:", profileError);
            // If there's an error getting the profile, redirect to the selected type
            router.push(`/dashboard/${selectedUserType}`);
          }
        } else {
          setError("Verification failed. Please try again.");
        }
      } catch (err: any) {
        setError(err.message || "Failed to verify OTP");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleUserTypeSelect = (type: string) => {
    setSelectedUserType(type);
  };

  const switchToPhone = () => {
    setAuthMethod('phone');
    setError(null);
  };

  return (
    <>
      <div className="min-h-screen bg-cover bg-center bg-no-repeat" style={{ 
        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), url(/images/farm/crops/rice.jpg)',
      }}>
        <Header />
        <div className="pt-24 pb-12 min-h-[calc(100vh-200px)]">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto backdrop-blur-sm bg-white/80 rounded-2xl shadow-xl overflow-hidden border border-green-100">
              <div className="md:flex">
                <div className="md:w-1/3 bg-gradient-to-br from-green-700 to-green-900 text-white p-8 hidden md:block relative overflow-hidden">
                  {/* Decorative elements */}
                  <div className="absolute -bottom-16 -left-16 w-40 h-40 rounded-full bg-green-600/20"></div>
                  <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-green-600/20"></div>
                  
                  <div className="relative h-full flex flex-col justify-between z-10">
                    <div>
                      <h2 className="text-2xl font-bold mb-6 text-white">Welcome Back</h2>
                      <p className="mb-6 text-green-50">Sign in to continue your agricultural journey with Krishi Sagar.</p>
                      
                      <div className="mt-8">
                        <h3 className="font-semibold mb-3 text-green-100">What you can do:</h3>
                        <ul className="space-y-3">
                          <li className="flex items-center text-green-50">
                            <div className="h-6 w-6 rounded-full bg-green-500/20 flex items-center justify-center mr-2">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            Track your farming activities
                          </li>
                          <li className="flex items-center text-green-50">
                            <div className="h-6 w-6 rounded-full bg-green-500/20 flex items-center justify-center mr-2">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            Connect with other farmers
                          </li>
                          <li className="flex items-center text-green-50">
                            <div className="h-6 w-6 rounded-full bg-green-500/20 flex items-center justify-center mr-2">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            Access market insights
                          </li>
                          <li className="flex items-center text-green-50">
                            <div className="h-6 w-6 rounded-full bg-green-500/20 flex items-center justify-center mr-2">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            Get expert advice
                          </li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="mt-auto">
                      <p className="text-sm text-green-100">
                        New to Krishi Sagar?{' '}
                        <Link href="/auth/sign-up" className="text-white underline font-medium">
                          Create an account
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="md:w-2/3 p-8">
                  <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-green-800 mb-2">Welcome Back</h1>
                    <p className="text-gray-600">Sign in to your Krishi Sagar account</p>
                  </div>

                  {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r-md" role="alert">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm">{error}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">I am a:</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {USER_TYPES.map((type) => (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => handleUserTypeSelect(type.id)}
                          className={`flex flex-col items-center justify-center p-3 border rounded-lg transition-all ${
                            selectedUserType === type.id
                              ? 'bg-green-50 border-green-500 shadow-md'
                              : 'border-gray-200 hover:border-green-400 hover:bg-green-50/50'
                          }`}
                        >
                          <span className="text-2xl mb-1">{type.icon}</span>
                          <span className="text-sm font-medium text-gray-800">{type.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6 flex border-b border-gray-200">
                    <button
                      type="button"
                      onClick={() => setAuthMethod('email')}
                      className={`flex-1 py-2 text-center font-medium transition-colors ${
                        authMethod === 'email'
                          ? 'text-green-700 border-b-2 border-green-700'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Email
                    </button>
                    <button
                      type="button"
                      onClick={() => setAuthMethod('phone')}
                      className={`flex-1 py-2 text-center font-medium transition-colors ${
                        authMethod === 'phone'
                          ? 'text-green-700 border-b-2 border-green-700'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Phone
                    </button>
                  </div>

                  {authMethod === 'email' ? (
                    <form onSubmit={handleEmailSignIn} className="space-y-5">
                      <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 placeholder-gray-400 bg-white"
                          placeholder="your.email@example.com"
                          required
                        />
                      </div>
                      <div className="mb-6">
                        <div className="flex items-center justify-between">
                          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                          </label>
                          <button
                            type="button"
                            className="text-sm text-green-600 hover:text-green-800"
                            onClick={switchToPhone}
                          >
                            Use phone instead
                          </button>
                        </div>
                        <input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 placeholder-gray-400 bg-white"
                          placeholder="••••••••"
                          required
                        />
                      </div>
                      <div className="flex items-center">
                        <input
                          id="remember-me"
                          name="remember-me"
                          type="checkbox"
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                          Remember me
                        </label>
                      </div>
                      <div>
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-md text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-colors"
                        >
                          {isLoading ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Signing in...
                            </>
                          ) : 'Sign in'}
                        </button>
                      </div>
                    </form>
                  ) : (
                    <form onSubmit={handlePhoneSignIn} className="space-y-5">
                      <div className="mb-4">
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <input
                          id="phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 placeholder-gray-400 bg-white"
                          placeholder="+91 9876543210"
                          required
                        />
                      </div>
                      {otpSent ? (
                        <div className="mb-6">
                          <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                            OTP Code
                          </label>
                          <input
                            id="otp"
                            type="text"
                            value={otp}
                            onChange={(e) => setOTP(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 placeholder-gray-400 bg-white"
                            placeholder="Enter the 6-digit code"
                            required
                          />
                        </div>
                      ) : null}
                      <div>
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-md text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-colors"
                        >
                          {isLoading ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Processing...
                            </>
                          ) : otpSent ? 'Verify OTP' : 'Send OTP'}
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="mt-8">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Or continue with</span>
                      </div>
                    </div>

                    <div className="mt-6">
                      <button
                        onClick={handleGoogleSignIn}
                        disabled={isLoading}
                        className="w-full flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                      >
                        <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" width="24" height="24">
                          <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                            <path
                              fill="#4285F4"
                              d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
                            />
                            <path
                              fill="#34A853"
                              d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
                            />
                            <path
                              fill="#FBBC05"
                              d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
                            />
                            <path
                              fill="#EA4335"
                              d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
                            />
                          </g>
                        </svg>
                        Continue with Google
                      </button>
                    </div>
                  </div>

                  <div className="mt-8 text-center text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link href="/auth/sign-up" className="font-medium text-green-600 hover:text-green-700">
                      Sign up
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}