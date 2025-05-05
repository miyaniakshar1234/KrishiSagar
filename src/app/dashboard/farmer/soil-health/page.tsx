"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, getUserProfile, getUserTypeProfile } from '@/lib/supabase/client';
import DashboardLayout from '@/components/DashboardLayout';
import SoilHealthComponent from '@/components/farmer/SoilHealthComponent';

export default function SoilHealthPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [farmerProfile, setFarmerProfile] = useState<any>(null);
  
  useEffect(() => {
    async function loadUserData() {
      try {
        const user = await getCurrentUser();
        
        if (!user) {
          router.push('/auth/sign-in');
          return;
        }
        
        setUser(user);
        
        // Get user profile from users table
        const userProfile = await getUserProfile();
        setProfile(userProfile);
        
        if (userProfile?.user_type !== 'farmer') {
          // If user is not a farmer, redirect them to their appropriate dashboard
          router.push(`/dashboard/${userProfile?.user_type}`);
          return;
        }
        
        // Get farmer specific profile
        const { data: farmerData, error: farmerError } = await getUserTypeProfile(user.id, 'farmer');
        setFarmerProfile(farmerData);
        
        if (farmerError) {
          console.error('Error fetching farmer profile:', farmerError);
          router.push('/');
          return;
        }
        
        if (!farmerData) {
          // If user doesn't have a farmer profile, redirect to home
          router.push('/');
          return;
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading user data:', error);
        router.push('/');
      }
    }
    
    loadUserData();
  }, [router]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Soil Health Monitoring</h1>
          <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            Farm: {farmerProfile?.farm_name || farmerProfile?.farm_location || 'Primary Location'}
          </div>
        </div>
        
        <p className="text-gray-600 mb-8">
          Track soil health metrics, receive recommendations, and optimize your farm's productivity with detailed soil analysis.
        </p>
        
        <SoilHealthComponent farmerId={user?.id} farmerProfile={farmerProfile} />
      </div>
    </DashboardLayout>
  );
} 