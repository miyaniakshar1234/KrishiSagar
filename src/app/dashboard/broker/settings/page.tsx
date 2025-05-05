"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, getUserProfile, getUserTypeProfile } from '@/lib/supabase/client';
import ProfileSettings from '@/components/ProfileSettings';
import DashboardLayout from '@/components/DashboardLayout';

export default function BrokerSettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [brokerProfile, setBrokerProfile] = useState<any>(null);
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
        
        if (userProfile?.user_type !== 'broker') {
          // If user is not a broker, redirect them to their appropriate dashboard
          router.push(`/dashboard/${userProfile?.user_type}`);
          return;
        }
        
        // Get broker specific profile
        const { data: brokerData, error: brokerError } = await getUserTypeProfile(user.id, 'broker');
        
        if (brokerError) {
          console.error('Error fetching broker profile:', brokerError);
          setError('Failed to load your broker profile details.');
        } else {
          setBrokerProfile(brokerData);
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
      userType="broker"
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
              userTypeProfile={brokerProfile}
              userType="broker"
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
} 