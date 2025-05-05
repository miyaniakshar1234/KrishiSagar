"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOutUser } from '@/lib/supabase/client-auth';
import { getUserProfile, getUserTypeProfile } from '@/lib/supabase/client';

type ProfileSettingsProps = {
  user: any;
  profile: any;
  userTypeProfile: any;
  userType: string;
};

export default function ProfileSettings({ 
  user,
  profile,
  userTypeProfile,
  userType
}: ProfileSettingsProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'profile' | 'settings'>('profile');
  
  const handleSignOut = async () => {
    try {
      await signOutUser();
      // Force reload to ensure all auth state is cleared
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // User type color mapping for UI elements
  const colors = {
    farmer: {
      primary: 'bg-green-600',
      light: 'bg-green-100',
      text: 'text-green-700',
      border: 'border-green-200',
      button: 'bg-green-600 hover:bg-green-700'
    },
    store_owner: {
      primary: 'bg-amber-600',
      light: 'bg-amber-100',
      text: 'text-amber-700',
      border: 'border-amber-200',
      button: 'bg-amber-600 hover:bg-amber-700'
    },
    broker: {
      primary: 'bg-blue-600',
      light: 'bg-blue-100',
      text: 'text-blue-700',
      border: 'border-blue-200',
      button: 'bg-blue-600 hover:bg-blue-700'
    },
    expert: {
      primary: 'bg-purple-600',
      light: 'bg-purple-100',
      text: 'text-purple-700',
      border: 'border-purple-200',
      button: 'bg-purple-600 hover:bg-purple-700'
    },
    student: {
      primary: 'bg-indigo-600',
      light: 'bg-indigo-100',
      text: 'text-indigo-700',
      border: 'border-indigo-200',
      button: 'bg-indigo-600 hover:bg-indigo-700'
    },
    consumer: {
      primary: 'bg-rose-600',
      light: 'bg-rose-100',
      text: 'text-rose-700',
      border: 'border-rose-200',
      button: 'bg-rose-600 hover:bg-rose-700'
    }
  };

  const colorScheme = colors[userType as keyof typeof colors] || colors.farmer;

  // Get dynamic profile fields based on user type
  const getUserTypeFields = () => {
    switch(userType) {
      case 'farmer':
        return [
          { label: 'Farm Location', value: userTypeProfile?.farm_location },
          { label: 'Land Area', value: userTypeProfile?.land_area ? `${userTypeProfile.land_area} acres` : 'Not specified' },
          { label: 'Crops Grown', value: userTypeProfile?.crops_grown?.join(', ') || 'None specified' },
          { label: 'Farming Type', value: userTypeProfile?.farming_type || 'Not specified' }
        ];
      case 'store_owner':
        return [
          { label: 'Store Name', value: userTypeProfile?.store_name },
          { label: 'Store Location', value: userTypeProfile?.store_location },
          { label: 'Business Type', value: userTypeProfile?.business_type || 'Not specified' },
          { label: 'Registration Number', value: userTypeProfile?.registration_number || 'Not specified' }
        ];
      case 'broker':
        return [
          { label: 'Market Name', value: userTypeProfile?.market_name },
          { label: 'Market Location', value: userTypeProfile?.market_location },
          { label: 'Registration Number', value: userTypeProfile?.registration_number || 'Not specified' },
          { label: 'Specialization', value: userTypeProfile?.specialization || 'Not specified' }
        ];
      case 'expert':
        return [
          { label: 'Expertise Area', value: userTypeProfile?.expertise_area },
          { label: 'Qualification', value: userTypeProfile?.qualification },
          { label: 'Experience', value: userTypeProfile?.experience_years ? `${userTypeProfile.experience_years} years` : 'Not specified' },
          { label: 'Organization', value: userTypeProfile?.organization || 'Not specified' }
        ];
      case 'student':
        return [
          { label: 'Institution', value: userTypeProfile?.institution },
          { label: 'Field of Study', value: userTypeProfile?.field_of_study },
          { label: 'Education Level', value: userTypeProfile?.education_level || 'Not specified' },
          { label: 'Year of Study', value: userTypeProfile?.year_of_study || 'Not specified' }
        ];
      case 'consumer':
        return [
          { label: 'Preferred Location', value: userTypeProfile?.preferred_location },
          { label: 'Delivery Address', value: userTypeProfile?.address || 'Not specified' },
          { label: 'Preferred Payment Method', value: userTypeProfile?.preferred_payment_method || 'Not specified' },
          { label: 'Diet Preferences', value: userTypeProfile?.diet_preferences?.join(', ') || 'None specified' }
        ];
      default:
        return [];
    }
  };

  // Common user info fields
  const userInfoFields = [
    { label: 'Name', value: profile?.full_name },
    { label: 'Email', value: user?.email },
    { label: 'Phone', value: profile?.phone || 'Not provided' },
    { label: 'Preferred Language', value: profile?.language || 'English' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Tabs for Profile and Settings */}
      <div className="flex border-b mb-6">
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-2 px-4 text-sm font-medium ${
            activeTab === 'profile'
              ? `${colorScheme.text} border-b-2 ${colorScheme.border.replace('border', 'border-b')}`
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Profile
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`pb-2 px-4 text-sm font-medium ${
            activeTab === 'settings'
              ? `${colorScheme.text} border-b-2 ${colorScheme.border.replace('border', 'border-b')}`
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Settings
        </button>
      </div>

      {activeTab === 'profile' && (
        <div className="animate-fadeIn">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Profile</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1">
              <div className={`aspect-square ${colorScheme.light} rounded-xl flex items-center justify-center text-6xl shadow-sm`}>
                {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : '👤'}
              </div>
            </div>
            
            <div className="md:col-span-2">
              <div className="space-y-4">
                {userInfoFields.map((field, index) => (
                  <div key={index}>
                    <label className="block text-sm text-gray-500 mb-1">{field.label}</label>
                    <p className="text-lg font-medium text-gray-800">{field.value || 'Not provided'}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">{userType.charAt(0).toUpperCase() + userType.slice(1).replace('_', ' ')} Details</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {getUserTypeFields().map((field, index) => (
                <div key={index} className={`p-4 rounded-lg ${colorScheme.light} ${colorScheme.border}`}>
                  <label className="block text-sm text-gray-500 mb-1">{field.label}</label>
                  <p className={`text-lg font-medium ${colorScheme.text}`}>{field.value || 'Not provided'}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-6">
              <button className={`px-4 py-2 rounded-md text-white text-sm ${colorScheme.button}`}>
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="animate-fadeIn">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Account Settings</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Notification Preferences</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="email_notifications" 
                    className="mr-2 rounded text-blue-600" 
                    defaultChecked 
                  />
                  <label htmlFor="email_notifications" className="text-gray-700">Email Notifications</label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="sms_notifications" 
                    className="mr-2 rounded text-blue-600" 
                  />
                  <label htmlFor="sms_notifications" className="text-gray-700">SMS Notifications</label>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Language Preference</h3>
              <select className="w-full max-w-xs rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                <option value="en">English</option>
                <option value="hi">हिन्दी (Hindi)</option>
                <option value="gu">ગુજરાતી (Gujarati)</option>
              </select>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Privacy Settings</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="profile_visibility" 
                    className="mr-2 rounded text-blue-600" 
                    defaultChecked 
                  />
                  <label htmlFor="profile_visibility" className="text-gray-700">Make profile visible to other users</label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="location_sharing" 
                    className="mr-2 rounded text-blue-600" 
                  />
                  <label htmlFor="location_sharing" className="text-gray-700">Share my location</label>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-red-600 mb-2">Account Actions</h3>
              <div className="space-y-3">
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
                  Change Password
                </button>
                <button 
                  onClick={handleSignOut}
                  className="block px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 