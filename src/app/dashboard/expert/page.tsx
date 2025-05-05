"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, getUserProfile, getUserTypeProfile } from '@/lib/supabase/client';
import DashboardLayout from '@/components/DashboardLayout';

export default function ExpertDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [expertProfile, setExpertProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState<string | null>(null);

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
        
        if (userProfile?.user_type !== 'expert') {
          // If user is not an expert, redirect them to their appropriate dashboard
          router.push(`/dashboard/${userProfile?.user_type}`);
          return;
        }
        
        // Get expert specific profile
        const { data: expertData, error: expertError } = await getUserTypeProfile(user.id, 'expert');
        
        if (expertError) {
          console.error('Error fetching expert profile:', expertError);
          // Don't redirect, just display an error message
          setError('Failed to load expert profile details.');
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-purple-800 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const renderMainContent = () => (
    <div className="container mx-auto px-4 mt-6">
      {/* Display error message if any */}
      {error && (
        <div className="container mx-auto px-4 mt-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            <p className="flex items-center">
              <span className="mr-2">⚠️</span> {error}
            </p>
          </div>
        </div>
      )}

          {/* Dashboard Header */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-2xl mr-4">
                  👩‍🔬
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    {profile?.full_name || 'Agriculture Expert'}
                  </h1>
                  <p className="text-gray-600">{profile?.email}</p>
                  <p className="text-sm text-purple-600">
                    {expertProfile?.expertise || 'Agricultural Sciences'}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <button className="px-4 py-2 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors">
                  <span className="mr-2">💬</span> New Consultation
                </button>
                <button className="px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors">
                  <span className="mr-2">📹</span> Record Video
                </button>
                <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors">
                  <span className="mr-2">📝</span> Create Article
                </button>
              </div>
            </div>
          </div>

          {/* Consultation Alert Card */}
          <div className="bg-gradient-to-r from-purple-100 to-purple-200 rounded-xl shadow-sm p-4 mb-6 animate-fadeIn">
            <div className="flex items-center">
              <div className="mr-4 text-4xl">🔔</div>
              <div>
                <h3 className="font-medium text-purple-800">Pending Consultations</h3>
                <p className="text-purple-700">You have 3 pending farmer consultations to review.</p>
              </div>
            </div>
          </div>
          
          {/* Main Dashboard Navigation */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md overflow-hidden sticky top-24">
                <div className="bg-purple-700 text-white p-4">
                  <h2 className="font-bold">Expert Dashboard</h2>
                </div>
                <nav className="p-2">
                  <button 
                    onClick={() => setActiveTab('overview')}
                    className={`w-full text-left px-4 py-3 rounded-md flex items-center ${activeTab === 'overview' ? 'bg-purple-100 text-purple-800' : 'hover:bg-gray-100'} transition-colors mb-1`}
                  >
                    <span className="mr-3">📊</span> Overview
                  </button>
                  <button 
                    onClick={() => setActiveTab('consultations')}
                    className={`w-full text-left px-4 py-3 rounded-md flex items-center ${activeTab === 'consultations' ? 'bg-purple-100 text-purple-800' : 'hover:bg-gray-100'} transition-colors mb-1`}
                  >
                    <span className="mr-3">💬</span> Consultations
                  </button>
                  <button 
                    onClick={() => setActiveTab('content')}
                    className={`w-full text-left px-4 py-3 rounded-md flex items-center ${activeTab === 'content' ? 'bg-purple-100 text-purple-800' : 'hover:bg-gray-100'} transition-colors mb-1`}
                  >
                    <span className="mr-3">📹</span> Content Creation
                  </button>
                  <button 
                    onClick={() => setActiveTab('communities')}
                    className={`w-full text-left px-4 py-3 rounded-md flex items-center ${activeTab === 'communities' ? 'bg-purple-100 text-purple-800' : 'hover:bg-gray-100'} transition-colors mb-1`}
                  >
                    <span className="mr-3">👥</span> Knowledge Communities
                  </button>
                  <button 
                    onClick={() => setActiveTab('research')}
                    className={`w-full text-left px-4 py-3 rounded-md flex items-center ${activeTab === 'research' ? 'bg-purple-100 text-purple-800' : 'hover:bg-gray-100'} transition-colors mb-1`}
                  >
                    <span className="mr-3">🧪</span> Research Portal
                  </button>
                  <button 
                    onClick={() => setActiveTab('calendar')}
                    className={`w-full text-left px-4 py-3 rounded-md flex items-center ${activeTab === 'calendar' ? 'bg-purple-100 text-purple-800' : 'hover:bg-gray-100'} transition-colors mb-1`}
                  >
                    <span className="mr-3">📅</span> Availability Calendar
                  </button>
                  <button 
                    onClick={() => setActiveTab('settings')}
                    className={`w-full text-left px-4 py-3 rounded-md flex items-center ${activeTab === 'settings' ? 'bg-purple-100 text-purple-800' : 'hover:bg-gray-100'} transition-colors mb-1`}
                  >
                    <span className="mr-3">⚙️</span> Settings
                  </button>
                </nav>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="lg:col-span-3">
              {activeTab === 'overview' && (
                <div className="bg-white rounded-xl shadow-md p-6 animate-fadeIn">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Expert Dashboard Overview</h2>
                  
                  {/* Quick Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                      <h3 className="text-sm font-medium text-purple-800 uppercase">Pending Consultations</h3>
                      <p className="text-2xl font-bold text-purple-700">3</p>
                      <p className="text-xs text-purple-600">Waiting for your advice</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <h3 className="text-sm font-medium text-blue-800 uppercase">Content Published</h3>
                      <p className="text-2xl font-bold text-blue-700">24</p>
                      <p className="text-xs text-blue-600">Videos, articles & guides</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                      <h3 className="text-sm font-medium text-green-800 uppercase">Farmers Helped</h3>
                      <p className="text-2xl font-bold text-green-700">142</p>
                      <p className="text-xs text-green-600">Across various crops</p>
                    </div>
                  </div>
                  
                  {/* Recent Activity */}
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-3">Recent Activity</h3>
                    <div className="border border-gray-200 rounded-lg divide-y divide-gray-200">
                      <div className="p-4 flex items-start">
                        <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-3 flex-shrink-0">
                          💬
                        </div>
                        <div>
                          <p className="text-gray-800 font-medium">Consultation Request - Rice Crop Disease</p>
                          <p className="text-gray-500 text-sm">Ramesh Kumar has requested your advice on yellowing rice leaves</p>
                          <p className="text-gray-400 text-xs mt-1">30 minutes ago</p>
                        </div>
                      </div>
                      <div className="p-4 flex items-start">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3 flex-shrink-0">
                          📹
                        </div>
                        <div>
                          <p className="text-gray-800 font-medium">Video Published</p>
                          <p className="text-gray-500 text-sm">Your tutorial on "Natural Pest Control Methods" is now live</p>
                          <p className="text-gray-400 text-xs mt-1">Yesterday, 3:30 PM</p>
                        </div>
                      </div>
                      <div className="p-4 flex items-start">
                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3 flex-shrink-0">
                          👥
                        </div>
                        <div>
                          <p className="text-gray-800 font-medium">Community Interaction</p>
                          <p className="text-gray-500 text-sm">You answered 5 questions in the "Organic Farming" group</p>
                          <p className="text-gray-400 text-xs mt-1">2 days ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Trending Topics */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-3">Trending Agriculture Topics</h3>
                    <div className="border border-purple-200 bg-purple-50 rounded-lg p-4 mb-3">
                      <div className="flex items-start">
                        <div className="text-purple-500 mr-3">🔍</div>
                        <div>
                          <p className="font-medium text-purple-800">Disease Outbreak Alert</p>
                          <p className="text-purple-700 text-sm">Rice blast disease reported in multiple villages in eastern region. Consider creating content on prevention.</p>
                        </div>
                      </div>
                    </div>
                    <div className="border border-green-200 bg-green-50 rounded-lg p-4">
                      <div className="flex items-start">
                        <div className="text-green-500 mr-3">🌱</div>
                        <div>
                          <p className="font-medium text-green-800">Organic Farming Interest</p>
                          <p className="text-green-700 text-sm">Growing interest in organic pest control methods. Your expertise would be valuable for local farmers.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'consultations' && (
            <div className="bg-white rounded-xl shadow-md p-6 animate-fadeIn">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Consultations Dashboard</h2>
                  <p className="text-gray-600 mb-6">Review and respond to farmer consultation requests.</p>
                  
              {/* Replace placeholder with structured content */}
              <div className="space-y-6">
                {/* Incoming Queue Section */}
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-3">Incoming Requests (3)</h3>
                  <div className="border border-gray-200 rounded-lg divide-y divide-gray-200">
                    {/* Example Request 1 */}
                    <div className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-center mb-1">
                        <p className="font-medium text-purple-700">Rice Crop Issue</p>
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">High Priority</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">Farmer: Ramesh Kumar - Yellowing leaves observed.</p>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>Received: 3 hours ago</span>
                        <button className="text-blue-600 hover:text-blue-800">View Details</button>
                      </div>
                    </div>
                    {/* Example Request 2 */}
                    <div className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-center mb-1">
                        <p className="font-medium text-purple-700">Soil Health Query</p>
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">Medium Priority</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">Farmer: Sita Devi - Seeking advice on improving soil organic matter.</p>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>Received: 1 day ago</span>
                        <button className="text-blue-600 hover:text-blue-800">View Details</button>
                      </div>
                    </div>
                     {/* Add more requests or pagination */}
                  </div>
                </div>

                {/* Analysis Tools Section (Placeholder) */}
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-3">Analysis Tools</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button className="bg-blue-50 text-blue-700 p-4 rounded-lg text-center hover:bg-blue-100 transition-colors">
                      📷 Image Analysis
                    </button>
                    <button className="bg-green-50 text-green-700 p-4 rounded-lg text-center hover:bg-green-100 transition-colors">
                      🦠 Disease Database
                    </button>
                    <button className="bg-amber-50 text-amber-700 p-4 rounded-lg text-center hover:bg-amber-100 transition-colors">
                      🧪 Treatment Protocols
                    </button>
                     <button className="bg-indigo-50 text-indigo-700 p-4 rounded-lg text-center hover:bg-indigo-100 transition-colors">
                      🗺️ Regional Data
                    </button>
                  </div>
                </div>
                
                {/* History Section (Placeholder) */}
                 <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-3">Consultation History</h3>
                   <div className="bg-gray-100 p-4 rounded-lg text-center text-gray-500">
                     <p>Searchable history of past consultations will appear here.</p>
                  </div>
                </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'content' && (
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Content Creation</h2>
                  <p className="text-gray-600 mb-6">Create and manage your educational content.</p>
                  
                  {/* Placeholder for content creation interface */}
                  <div className="bg-gray-100 p-8 rounded-lg text-center text-gray-500">
                    <p>Content creation tools will be displayed here.</p>
                  </div>
                </div>
              )}
              
              {activeTab === 'communities' && (
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Knowledge Communities</h2>
                  <p className="text-gray-600 mb-6">Manage and participate in farmer communities.</p>
                  
                  {/* Placeholder for communities interface */}
                  <div className="bg-gray-100 p-8 rounded-lg text-center text-gray-500">
                    <p>Knowledge communities content will be displayed here.</p>
                  </div>
                </div>
              )}
              
              {activeTab === 'research' && (
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Research Portal</h2>
                  <p className="text-gray-600 mb-6">Access agricultural research data and statistics.</p>
                  
                  {/* Placeholder for research portal interface */}
                  <div className="bg-gray-100 p-8 rounded-lg text-center text-gray-500">
                    <p>Research portal content will be displayed here.</p>
                  </div>
                </div>
              )}
              
              {activeTab === 'calendar' && (
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Availability Calendar</h2>
                  <p className="text-gray-600 mb-6">Manage your consultation hours and availability.</p>
                  
                  {/* Placeholder for calendar interface */}
                  <div className="bg-gray-100 p-8 rounded-lg text-center text-gray-500">
                    <p>Calendar and scheduling tools will be displayed here.</p>
                  </div>
                </div>
              )}
              
              {activeTab === 'settings' && (
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Settings</h2>
                  <p className="text-gray-600 mb-6">Manage your expert profile and preferences.</p>
                  
                  {/* Placeholder for settings interface */}
                  <div className="bg-gray-100 p-8 rounded-lg text-center text-gray-500">
                    <p>Settings content will be displayed here.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
  );

  return (
    <DashboardLayout
      userType="expert"
      userName={profile?.full_name}
      loading={loading}
    >
      {renderMainContent()} 
    </DashboardLayout>
  );
} 