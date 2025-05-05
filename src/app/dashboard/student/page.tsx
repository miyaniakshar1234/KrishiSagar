"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, getUserProfile, getUserTypeProfile } from '@/lib/supabase/client';
import DashboardLayout from '@/components/DashboardLayout';

export default function StudentDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [studentProfile, setStudentProfile] = useState<any>(null);
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
        
        if (userProfile?.user_type !== 'student') {
          router.push(`/dashboard/${userProfile?.user_type}`);
          return;
        }
        
        // Get student specific profile
        const { data: studentData, error: studentError } = await getUserTypeProfile(user.id, 'student');
        
        if (studentError) {
          console.error('Error fetching student profile:', studentError);
          // Don't redirect, just show error message
          setError('Failed to load student profile details.');
        } else {
          setStudentProfile(studentData);
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
      <div className="min-h-screen flex items-center justify-center bg-indigo-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-indigo-800 font-medium">Loading your dashboard...</p>
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
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-2xl mr-4">
                  👨‍🎓
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">{profile?.full_name || 'Agriculture Student'}</h1>
                  <p className="text-gray-600">{profile?.email}</p>
                  <p className="text-sm text-indigo-600">
                    {studentProfile?.institution || 'Agricultural University'} • 
                    {studentProfile?.field_of_study || 'Agricultural Sciences'}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <button className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors">
                  <span className="mr-2">👨‍🌾</span> Find Internship
                </button>
                <button className="px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors">
                  <span className="mr-2">📊</span> Submit Research
                </button>
                <button className="px-4 py-2 bg-amber-100 text-amber-700 rounded-md hover:bg-amber-200 transition-colors">
                  <span className="mr-2">🧪</span> Start Project
                </button>
              </div>
            </div>
          </div>

          {/* Opportunity Alert Card */}
          <div className="bg-gradient-to-r from-indigo-100 to-indigo-200 rounded-xl shadow-sm p-4 mb-6 animate-fadeIn">
            <div className="flex items-center">
              <div className="mr-4 text-4xl">🔔</div>
              <div>
                <h3 className="font-medium text-indigo-800">New Internship Opportunities</h3>
                <p className="text-indigo-700">5 new virtual internships have been posted by organic farms. Check the opportunities section.</p>
              </div>
            </div>
          </div>
          
          {/* Main Dashboard Navigation */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md overflow-hidden sticky top-24">
                <div className="bg-indigo-700 text-white p-4">
                  <h2 className="font-bold">Student Dashboard</h2>
                </div>
                <nav className="p-2">
                  <button 
                    onClick={() => setActiveTab('overview')}
                    className={`w-full text-left px-4 py-3 rounded-md flex items-center ${activeTab === 'overview' ? 'bg-indigo-100 text-indigo-800' : 'hover:bg-gray-100'} transition-colors mb-1`}
                  >
                    <span className="mr-3">📊</span> Overview
                  </button>
                  <button 
                    onClick={() => setActiveTab('internships')}
                    className={`w-full text-left px-4 py-3 rounded-md flex items-center ${activeTab === 'internships' ? 'bg-indigo-100 text-indigo-800' : 'hover:bg-gray-100'} transition-colors mb-1`}
                  >
                    <span className="mr-3">👨‍🌾</span> Virtual Internships
                  </button>
                  <button 
                    onClick={() => setActiveTab('research')}
                    className={`w-full text-left px-4 py-3 rounded-md flex items-center ${activeTab === 'research' ? 'bg-indigo-100 text-indigo-800' : 'hover:bg-gray-100'} transition-colors mb-1`}
                  >
                    <span className="mr-3">🧪</span> Research Projects
                  </button>
                  <button 
                    onClick={() => setActiveTab('community')}
                    className={`w-full text-left px-4 py-3 rounded-md flex items-center ${activeTab === 'community' ? 'bg-indigo-100 text-indigo-800' : 'hover:bg-gray-100'} transition-colors mb-1`}
                  >
                    <span className="mr-3">👥</span> Community
                  </button>
                  <button 
                    onClick={() => setActiveTab('learning')}
                    className={`w-full text-left px-4 py-3 rounded-md flex items-center ${activeTab === 'learning' ? 'bg-indigo-100 text-indigo-800' : 'hover:bg-gray-100'} transition-colors mb-1`}
                  >
                    <span className="mr-3">📚</span> Learning Resources
                  </button>
                  <button 
                    onClick={() => setActiveTab('mentorship')}
                    className={`w-full text-left px-4 py-3 rounded-md flex items-center ${activeTab === 'mentorship' ? 'bg-indigo-100 text-indigo-800' : 'hover:bg-gray-100'} transition-colors mb-1`}
                  >
                    <span className="mr-3">🤝</span> Mentorship
                  </button>
                  <button 
                    onClick={() => setActiveTab('publications')}
                    className={`w-full text-left px-4 py-3 rounded-md flex items-center ${activeTab === 'publications' ? 'bg-indigo-100 text-indigo-800' : 'hover:bg-gray-100'} transition-colors mb-1`}
                  >
                    <span className="mr-3">📝</span> Publications
                  </button>
                  <button 
                    onClick={() => setActiveTab('settings')}
                    className={`w-full text-left px-4 py-3 rounded-md flex items-center ${activeTab === 'settings' ? 'bg-indigo-100 text-indigo-800' : 'hover:bg-gray-100'} transition-colors mb-1`}
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
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Student Dashboard Overview</h2>
                  
                  {/* Quick Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                      <h3 className="text-sm font-medium text-indigo-800 uppercase">Active Projects</h3>
                      <p className="text-2xl font-bold text-indigo-700">2</p>
                      <p className="text-xs text-indigo-600">Soil Analysis, Crop Improvement</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                      <h3 className="text-sm font-medium text-green-800 uppercase">Completed Internships</h3>
                      <p className="text-2xl font-bold text-green-700">3</p>
                      <p className="text-xs text-green-600">With local organic farms</p>
                    </div>
                    <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                      <h3 className="text-sm font-medium text-amber-800 uppercase">Learning Progress</h3>
                      <p className="text-2xl font-bold text-amber-700">75%</p>
                      <p className="text-xs text-amber-600">Organic Farming Certificate</p>
                    </div>
                  </div>
                  
                  {/* Recent Activity */}
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-3">Recent Activity</h3>
                    <div className="border border-gray-200 rounded-lg divide-y divide-gray-200">
                      <div className="p-4 flex items-start">
                        <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3 flex-shrink-0">
                          📊
                        </div>
                        <div>
                          <p className="text-gray-800 font-medium">Research Project Updated</p>
                          <p className="text-gray-500 text-sm">You uploaded new soil sample data for your organic farming project</p>
                          <p className="text-gray-400 text-xs mt-1">Today, 9:41 AM</p>
                        </div>
                      </div>
                      <div className="p-4 flex items-start">
                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3 flex-shrink-0">
                          👨‍🌾
                        </div>
                        <div>
                          <p className="text-gray-800 font-medium">Virtual Internship Application</p>
                          <p className="text-gray-500 text-sm">Applied for Organic Crop Management internship with Green Valley Farms</p>
                          <p className="text-gray-400 text-xs mt-1">Yesterday, 3:30 PM</p>
                        </div>
                      </div>
                      <div className="p-4 flex items-start">
                        <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mr-3 flex-shrink-0">
                          📚
                        </div>
                        <div>
                          <p className="text-gray-800 font-medium">Course Completed</p>
                          <p className="text-gray-500 text-sm">Finished "Introduction to Sustainable Farming Practices" course</p>
                          <p className="text-gray-400 text-xs mt-1">2 days ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Upcoming Deadlines */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-3">Upcoming Deadlines</h3>
                    <div className="border border-indigo-200 bg-indigo-50 rounded-lg p-4 mb-3">
                      <div className="flex items-start">
                        <div className="text-indigo-500 mr-3">📅</div>
                        <div>
                          <p className="font-medium text-indigo-800">Research Data Submission</p>
                          <p className="text-indigo-700 text-sm">Soil analysis data due for the Sustainable Farming project</p>
                          <p className="text-indigo-500 text-xs mt-1">Due in 3 days</p>
                        </div>
                      </div>
                    </div>
                    <div className="border border-amber-200 bg-amber-50 rounded-lg p-4">
                      <div className="flex items-start">
                        <div className="text-amber-500 mr-3">🎓</div>
                        <div>
                          <p className="font-medium text-amber-800">Certification Exam</p>
                          <p className="text-amber-700 text-sm">Organic Farming Certification exam registration deadline</p>
                          <p className="text-amber-500 text-xs mt-1">Due in 5 days</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'internships' && (
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Virtual Internships</h2>
                  <p className="text-gray-600 mb-6">Find and apply for virtual internships with farmers.</p>
                  
                  {/* Placeholder for internships interface */}
                  <div className="bg-gray-100 p-8 rounded-lg text-center text-gray-500">
                    <p>Internship opportunities will be displayed here.</p>
                  </div>
                </div>
              )}
              
              {activeTab === 'research' && (
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Research Projects</h2>
                  <p className="text-gray-600 mb-6">Manage your ongoing research and data collection projects.</p>
                  
                  {/* Placeholder for research projects interface */}
                  <div className="bg-gray-100 p-8 rounded-lg text-center text-gray-500">
                    <p>Research project management tools will be displayed here.</p>
                  </div>
                </div>
              )}
              
              {activeTab === 'community' && (
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Student-Farmer Community</h2>
                  <p className="text-gray-600 mb-6">Engage with farmers and fellow students in the community.</p>
                  
                  {/* Placeholder for community interface */}
                  <div className="bg-gray-100 p-8 rounded-lg text-center text-gray-500">
                    <p>Community discussion forums will be displayed here.</p>
                  </div>
                </div>
              )}
              
              {activeTab === 'learning' && (
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Learning Resources</h2>
                  <p className="text-gray-600 mb-6">Access educational materials and courses.</p>
                  
                  {/* Placeholder for learning resources interface */}
                  <div className="bg-gray-100 p-8 rounded-lg text-center text-gray-500">
                    <p>Learning resources will be displayed here.</p>
                  </div>
                </div>
              )}
              
              {activeTab === 'mentorship' && (
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Mentorship</h2>
                  <p className="text-gray-600 mb-6">Connect with mentors and mentees.</p>
                  
                  {/* Placeholder for mentorship interface */}
                  <div className="bg-gray-100 p-8 rounded-lg text-center text-gray-500">
                    <p>Mentorship connections will be displayed here.</p>
                  </div>
                </div>
              )}
              
              {activeTab === 'publications' && (
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Publications</h2>
                  <p className="text-gray-600 mb-6">Manage and publish your research findings.</p>
                  
                  {/* Placeholder for publications interface */}
                  <div className="bg-gray-100 p-8 rounded-lg text-center text-gray-500">
                    <p>Publications and research showcase tools will be displayed here.</p>
                  </div>
                </div>
              )}
              
              {activeTab === 'settings' && (
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Settings</h2>
                  <p className="text-gray-600 mb-6">Manage your student profile and preferences.</p>
                  
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
      userType="student" 
      userName={profile?.full_name}
      loading={loading}
    >
      {renderMainContent()} 
    </DashboardLayout>
  );
} 