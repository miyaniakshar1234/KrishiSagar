"use client";

import React, { ReactNode } from 'react';
import AuthHeader from '@/components/AuthHeader';
import AuthFooter from '@/components/AuthFooter';

type DashboardLayoutProps = {
  children: ReactNode;
  userType: string;
  userName?: string;
  loading: boolean;
  loadingColor?: string;
};

export default function DashboardLayout({ 
  children, 
  userType, 
  userName, 
  loading,
  loadingColor
}: DashboardLayoutProps) {
  // Color mappings for loading screens
  const loadingColors = {
    farmer: {
      bg: 'bg-green-50',
      border: 'border-green-500',
      text: 'text-green-800'
    },
    store_owner: {
      bg: 'bg-amber-50',
      border: 'border-amber-500',
      text: 'text-amber-800'
    },
    broker: {
      bg: 'bg-blue-50',
      border: 'border-blue-500',
      text: 'text-blue-800'
    },
    expert: {
      bg: 'bg-purple-50',
      border: 'border-purple-500',
      text: 'text-purple-800'
    },
    student: {
      bg: 'bg-indigo-50',
      border: 'border-indigo-500',
      text: 'text-indigo-800'
    },
    consumer: {
      bg: 'bg-rose-50',
      border: 'border-rose-500',
      text: 'text-rose-800'
    }
  };

  const colors = loadingColors[userType as keyof typeof loadingColors] || loadingColors.farmer;

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${colors.bg}`}>
        <div className="text-center">
          <div className={`w-16 h-16 border-4 ${colors.border} border-t-transparent rounded-full animate-spin mx-auto mb-4`}></div>
          <p className={`${colors.text} font-medium text-lg`}>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <AuthHeader userType={userType} userName={userName} />
      
      <div className="pt-20 pb-10 flex-grow">
        {children}
      </div>
      
      <AuthFooter userType={userType} />
    </div>
  );
} 