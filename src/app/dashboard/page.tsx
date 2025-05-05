"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { getUserProfile } from '@/lib/supabase/client-auth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// User types
const USER_TYPES = [
  { id: 'farmer', label: 'Farmer', icon: '🌾', description: 'Manage your farm, crops, and connect with buyers' },
  { id: 'store_owner', label: 'Store Owner', icon: '🏪', description: 'Manage your agricultural store and inventory' },
  { id: 'broker', label: 'Market Broker', icon: '🏢', description: 'Facilitate trades between farmers and buyers' },
  { id: 'expert', label: 'Agriculture Expert', icon: '👩‍🔬', description: 'Share your knowledge and provide guidance' },
  { id: 'student', label: 'Agriculture Student', icon: '👨‍🎓', description: 'Access learning resources and connect with experts' },
  { id: 'consumer', label: 'Consumer', icon: '👩‍🛒', description: 'Find and purchase agricultural products' },
];

// Define a proper type for user info
interface UserInfo {
  id: string;
  email: string | null;
}

export default function DashboardSelectionPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient();
      
      try {
        // Check if user is authenticated
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          // Not authenticated, redirect to sign in
          router.push('/auth/sign-in');
          return;
        }
        
        // Fix the TypeScript error by properly handling potential undefined email
        setUserInfo({ 
          id: user.id, 
          email: user.email || null // Use null when email is undefined
        });
        
        // Try to get user profile to see if they already have a type
        try {
          const { data: profile } = await getUserProfile();
          
          if (profile?.user_type) {
            // User already has a type, redirect to their dashboard
            router.push(`/dashboard/${profile.user_type}`);
            return;
          }
        } catch (profileError: any) {
          console.error('Error fetching user profile:', 
            profileError?.message || JSON.stringify(profileError));
          setError('Could not fetch your profile. This is likely a permissions issue. Please try again.');
        }
        
        setIsLoading(false);
      } catch (err: any) {
        console.error('Error checking user:', err?.message || JSON.stringify(err));
        setError('There was a problem loading your account information. Please try again.');
        setIsLoading(false);
      }
    };
    
    checkUser();
  }, [router]);
  
  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
  };
  
  const handleContinue = async () => {
    if (!selectedType || !userInfo) return;
    
    setIsLoading(true);
    
    try {
      const supabase = createClient();
      
      // Explicitly create a complete user profile object to avoid missing required fields
      const userProfile = {
        id: userInfo.id,
        email: userInfo.email || '', // Fallback for null email (shouldn't happen)
        user_type: selectedType,
        updated_at: new Date().toISOString()
      };
      
      // Use the service role client for admin operations in real applications
      // Here we're using RLS policies to allow the operation
      const { error } = await supabase
        .from('users')
        .upsert(userProfile);
      
      if (error) {
        console.error('Database error:', error);
        throw new Error(`Database error: ${error.message || error.code}`);
      }
      
      // Wait a moment for the operation to complete
      await new Promise(r => setTimeout(r, 500));
      
      // Redirect to the selected dashboard
      router.push(`/dashboard/${selectedType}`);
    } catch (err: any) {
      console.error('Error updating user type:', err?.message || JSON.stringify(err));
      setError(err?.message || 'Failed to update your profile. Please try again.');
      setIsLoading(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-24 pb-12 min-h-[calc(100vh-200px)] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-24 pb-12 min-h-[calc(100vh-200px)]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
            <h1 className="text-2xl font-bold text-center mb-8">Select Your Dashboard</h1>
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}
            
            <p className="text-center mb-8 text-gray-600">
              Choose which type of dashboard you'd like to access. This determines what features and tools you'll have access to.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {USER_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleTypeSelect(type.id)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    selectedType === type.id 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-2">{type.icon}</span>
                    <h3 className="font-semibold">{type.label}</h3>
                  </div>
                  <p className="text-sm text-gray-600">{type.description}</p>
                </button>
              ))}
            </div>
            
            <div className="text-center">
              <button
                onClick={handleContinue}
                disabled={!selectedType || isLoading}
                className={`px-6 py-2 rounded-md font-medium ${
                  !selectedType || isLoading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {isLoading ? 'Processing...' : 'Continue to Dashboard'}
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 