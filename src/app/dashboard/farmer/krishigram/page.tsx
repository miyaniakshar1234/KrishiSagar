"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, getUserProfile } from '@/lib/supabase/client';
import DashboardLayout from '@/components/DashboardLayout';
import KrishiGramComponent from '@/components/farmer/KrishiGramComponent';
import { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function KrishiGramPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  
  useEffect(() => {
    async function loadUserData() {
      try {
        const user = await getCurrentUser();
        
        if (!user) {
          router.push('/auth/sign-in');
          return;
        }
        
        // Get user profile from users table
        const userProfile = await getUserProfile();
        setProfile(userProfile);
        
        if (userProfile?.user_type !== 'farmer') {
          // If user is not a farmer, redirect them to their appropriate dashboard
          router.push(`/dashboard/${userProfile?.user_type}`);
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
  
  return (
    <DashboardLayout
      userType="farmer"
      userName={profile?.full_name}
      loading={loading}
    >
      <div className="container mx-auto px-4 py-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2">KrishiGram</h1>
          <p className="text-gray-600">Connect with other farmers, share knowledge, and learn from the community.</p>
        </motion.div>
        
        <KrishiGramComponent />
        <Toaster position="bottom-right" />
      </div>
    </DashboardLayout>
  );
}