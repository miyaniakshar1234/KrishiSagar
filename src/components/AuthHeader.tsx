"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signOutUser } from '@/lib/supabase/client-auth';

type AuthHeaderProps = {
  userType: string;
  userName?: string;
}

export default function AuthHeader({ userType, userName }: AuthHeaderProps) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Color schemes per user type
  const colorSchemes = {
    farmer: {
      bg: 'bg-green-700',
      text: 'text-green-50',
      hover: 'hover:bg-green-600',
      button: 'bg-green-600 hover:bg-green-500',
      icon: '🌾'
    },
    store_owner: {
      bg: 'bg-amber-700',
      text: 'text-amber-50',
      hover: 'hover:bg-amber-600',
      button: 'bg-amber-600 hover:bg-amber-500',
      icon: '🏪'
    },
    broker: {
      bg: 'bg-blue-700',
      text: 'text-blue-50',
      hover: 'hover:bg-blue-600',
      button: 'bg-blue-600 hover:bg-blue-500',
      icon: '🏢'
    },
    expert: {
      bg: 'bg-purple-700',
      text: 'text-purple-50',
      hover: 'hover:bg-purple-600',
      button: 'bg-purple-600 hover:bg-purple-500',
      icon: '👩‍🔬'
    },
    student: {
      bg: 'bg-indigo-700',
      text: 'text-indigo-50',
      hover: 'hover:bg-indigo-600',
      button: 'bg-indigo-600 hover:bg-indigo-500',
      icon: '👨‍🎓'
    },
    consumer: {
      bg: 'bg-rose-700',
      text: 'text-rose-50',
      hover: 'hover:bg-rose-600',
      button: 'bg-rose-600 hover:bg-rose-500',
      icon: '👩‍🛒'
    }
  };

  // Default to farmer colors if userType isn't found
  const colors = colorSchemes[userType as keyof typeof colorSchemes] || colorSchemes.farmer;

  const handleSignOut = async () => {
    try {
      const { error } = await signOutUser();
      if (!error) {
        // Redirect to sign-in page after successful sign out
        router.push('/auth/sign-in');
      } else {
        // Handle potential sign-out errors (e.g., show a notification)
        console.error('Sign out failed:', error);
        // Optionally, inform the user about the error
      }
    } catch (error) {
      console.error('Unexpected error during sign out attempt:', error);
    }
  };

  // Navigation links based on user type
  const getNavLinks = () => {
    const commonLinks = [
      { name: 'Dashboard', href: `/dashboard/${userType}` },
      { name: 'Profile', href: `/dashboard/${userType}/profile` },
      { name: 'Community', href: `/dashboard/${userType}/community` },
    ];

    const specificLinks = {
      farmer: [
        { name: 'Crop Management', href: `/dashboard/${userType}/crops` },
        { name: 'Marketplace', href: `/dashboard/${userType}/marketplace` },
        { name: 'Financial Tracking', href: `/dashboard/${userType}/finances` },
        { name: 'KrishiGram', href: `/dashboard/${userType}/krishigram` },
      ],
      store_owner: [
        { name: 'Inventory', href: `/dashboard/${userType}/inventory` },
        { name: 'Billing', href: `/dashboard/${userType}/billing` },
        { name: 'Customer Management', href: `/dashboard/${userType}/customers` },
        { name: 'Market Trends', href: `/dashboard/${userType}/market-trends` },
      ],
      broker: [
        { name: 'Transactions', href: `/dashboard/${userType}/transactions` },
        { name: 'Market Analytics', href: `/dashboard/${userType}/analytics` },
        { name: 'Verification', href: `/dashboard/${userType}/verification` },
        { name: 'Farmers Network', href: `/dashboard/${userType}/farmers` },
      ],
      expert: [
        { name: 'Consultations', href: `/dashboard/${userType}/consultations` },
        { name: 'Content Creation', href: `/dashboard/${userType}/content` },
        { name: 'Research Portal', href: `/dashboard/${userType}/research` },
        { name: 'Knowledge Hub', href: `/dashboard/${userType}/knowledge` },
      ],
      student: [
        { name: 'Virtual Internships', href: `/dashboard/${userType}/internships` },
        { name: 'Research Projects', href: `/dashboard/${userType}/research` },
        { name: 'Learning Resources', href: `/dashboard/${userType}/learning` },
        { name: 'Mentorship', href: `/dashboard/${userType}/mentorship` },
      ],
      consumer: [
        { name: 'Shop Products', href: `/dashboard/${userType}/shop` },
        { name: 'My Orders', href: `/dashboard/${userType}/orders` },
        { name: 'Saved Farmers', href: `/dashboard/${userType}/saved` },
        { name: 'Traceability', href: `/dashboard/${userType}/traceability` },
      ],
    };

    return [...commonLinks, ...(specificLinks[userType as keyof typeof specificLinks] || [])];
  };

  return (
    <header className={`fixed w-full ${colors.bg} shadow-md z-50`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          {/* Logo Section */}
          <Link href={`/dashboard/${userType}`} className="flex items-center">
            <span className="text-2xl mr-2">{colors.icon}</span>
            <span className={`font-bold text-xl ${colors.text}`}>कृषि सागर</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            {getNavLinks().map((link, index) => (
              <Link 
                key={index} 
                href={link.href}
                className={`${colors.text} ${colors.hover} px-3 py-2 rounded-md text-sm font-medium transition-colors`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Profile & Mobile Menu */}
          <div className="flex items-center">
            {/* Language Selector */}
            <div className="mr-4">
              <select className={`${colors.bg} ${colors.text} border border-gray-200 rounded-md text-sm py-1`}>
                <option value="en">English</option>
                <option value="hi">हिन्दी</option>
                <option value="gu">ગુજરાતી</option>
              </select>
            </div>

            {/* Profile Dropdown */}
            <div className="relative ml-3">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center"
              >
                <div className={`w-8 h-8 rounded-full ${colors.button} flex items-center justify-center text-white font-medium`}>
                  {userName ? userName.charAt(0).toUpperCase() : 'U'}
                </div>
              </button>
              
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <Link 
                    href={`/dashboard/${userType}/profile`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Your Profile
                  </Link>
                  <Link 
                    href={`/dashboard/${userType}/settings`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Settings
                  </Link>
                  <button 
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="ml-4 md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg
                className={`w-6 h-6 ${colors.text}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                ></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMenuOpen && (
          <div className="md:hidden py-3 border-t border-gray-700">
            <div className="space-y-1 px-2">
              {getNavLinks().map((link, index) => (
                <Link 
                  key={index} 
                  href={link.href}
                  className={`block ${colors.text} ${colors.hover} px-3 py-2 rounded-md text-base font-medium`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <button 
                onClick={handleSignOut}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-gray-700 hover:text-red-300"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
} 