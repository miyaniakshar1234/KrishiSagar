"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, getUserProfile, getUserTypeProfile } from '@/lib/supabase/client';
import ProfileSettings from '@/components/ProfileSettings';
import DashboardLayout from '@/components/DashboardLayout';

export default function ExpertSettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [expertProfile, setExpertProfile] = useState<any>(null);
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
        
        if (userProfile?.user_type !== 'expert') {
          // If user is not an expert, redirect them to their appropriate dashboard
          router.push(`/dashboard/${userProfile?.user_type}`);
          return;
        }
        
        // Get expert specific profile
        const { data: expertData, error: expertError } = await getUserTypeProfile(user.id, 'expert');
        
        if (expertError) {
          console.error('Error fetching expert profile:', expertError);
          setError('Failed to load your expert profile details.');
        } else {
          setExpertProfile(expertData);
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
      userType="expert"
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
              userTypeProfile={expertProfile}
              userType="expert"
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
} 