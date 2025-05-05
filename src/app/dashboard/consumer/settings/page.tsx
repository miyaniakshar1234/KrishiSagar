"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, getUserProfile, getUserTypeProfile } from '@/lib/supabase/client';
import ProfileSettings from '@/components/ProfileSettings';
import DashboardLayout from '@/components/DashboardLayout';

export default function ConsumerSettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [consumerProfile, setConsumerProfile] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadUserData() {
      try {
        setError(null);
        const user = await getCurrentUser();
        
        if (!user) {
          router.push('/auth/sign-in');
          return;
        }
        
        setUser(user);
        
        // Get user profile from users table
        const userProfile = await getUserProfile();
        setProfile(userProfile);
        
        if (userProfile?.user_type !== 'consumer') {
          // If user is not a consumer, redirect them to their appropriate dashboard
          router.push(`/dashboard/${userProfile?.user_type}`);
          return;
        }
        
        // Get consumer specific profile
        const { data: consumerData, error: consumerError } = await getUserTypeProfile(user.id, 'consumer');
        
        if (consumerError) {
          console.error('Error fetching consumer profile:', consumerError);
          setError('Failed to load your consumer profile details.');
        } else {
          setConsumerProfile(consumerData);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading user data:', error);
        setError('Something went wrong. Please try again later.');
        setLoading(false);
      }
    }
    
    loadUserData();
  }, [router]);

  return (
    <DashboardLayout 
      userType="consumer"
      userName={profile?.full_name}
      loading={loading}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto mt-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Profile & Settings</h1>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}
          
          {!loading && (
            <ProfileSettings 
              user={user}
              profile={profile}
              userTypeProfile={consumerProfile}
              userType="consumer"
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
} 