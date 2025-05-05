"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, getUserProfile, getUserTypeProfile } from '@/lib/supabase/client';
import DashboardLayout from '@/components/DashboardLayout';
import SalesRecordComponent from '@/components/broker/SalesRecordComponent';
import FarmerNetworkComponent from '@/components/broker/FarmerNetworkComponent';

export default function BrokerDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [brokerProfile, setBrokerProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [recentTransactions, setRecentTransactions] = useState([
    { id: 1, farmer: 'Ramesh Patel', crop: 'Rice', quantity: '500 kg', price: '₹32/kg', total: '₹16,000', date: 'Today, 11:30 AM' },
    { id: 2, farmer: 'Suresh Kumar', crop: 'Wheat', quantity: '300 kg', price: '₹28/kg', total: '₹8,400', date: 'Yesterday, 3:15 PM' },
    { id: 3, farmer: 'Anjali Singh', crop: 'Vegetables', quantity: '200 kg', price: '₹45/kg', total: '₹9,000', date: '2 days ago' },
  ]);
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
        
        if (userProfile?.user_type !== 'broker') {
          // If user is not a broker, redirect them to their appropriate dashboard
          router.push(`/dashboard/${userProfile?.user_type}`);
          return;
        }
        
        // Get broker specific profile
        const { data: brokerData, error: brokerError } = await getUserTypeProfile(user.id, 'broker');
        
        if (brokerError) {
          console.error('Error fetching broker profile:', brokerError);
          // Don't redirect, just show a message
          setError('Failed to load broker profile details.');
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

  // Dashboard section components
  const OverviewTab = () => (
    <div className="bg-white rounded-xl shadow-lg p-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-100 pb-3">Broker Dashboard</h2>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="bg-blue-50 p-5 rounded-lg border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-semibold text-blue-800 uppercase tracking-wide mb-1">Today's Transactions</h3>
              <p className="text-3xl font-bold text-blue-700">5</p>
              <p className="text-xs text-blue-600 mt-1">Total value: ₹35,000</p>
            </div>
            <span className="text-3xl">🧾</span>
          </div>
        </div>
        <div className="bg-green-50 p-5 rounded-lg border border-green-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-semibold text-green-800 uppercase tracking-wide mb-1">Active Farmers</h3>
              <p className="text-3xl font-bold text-green-700">28</p>
              <p className="text-xs text-green-600 mt-1">+3 from last month</p>
            </div>
            <span className="text-3xl">👨‍🌾</span>
          </div>
        </div>
        <div className="bg-amber-50 p-5 rounded-lg border border-amber-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-semibold text-amber-800 uppercase tracking-wide mb-1">Monthly Commission</h3>
              <p className="text-3xl font-bold text-amber-700">₹12,500</p>
              <p className="text-xs text-amber-600 mt-1">+8% from last month</p>
            </div>
            <span className="text-3xl">💰</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">📋</span> Recent Transactions
          </h3>
          <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Farmer</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Crop</th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                          👨‍🌾
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{transaction.farmer}</div>
                          <div className="text-xs text-gray-500">{transaction.date}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{transaction.crop}</div>
                      <div className="text-xs text-gray-500">{transaction.quantity}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                      {transaction.total}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 text-center">
            <button 
              onClick={() => setActiveTab('transactions')}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View All Transactions →
            </button>
          </div>
        </div>
        
        {/* Market Analysis */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">📊</span> Market Analysis
          </h3>
          <div className="space-y-4">
            <div className="border border-blue-200 bg-blue-50 rounded-lg p-4 shadow-sm">
              <div className="flex items-start">
                <div className="text-blue-500 mr-3 text-xl">📈</div>
                <div>
                  <p className="font-medium text-blue-800">Price Trends</p>
                  <p className="text-blue-700 text-sm">Rice prices are trending upward by 5% this week due to reduced supply from southern regions.</p>
                  <div className="mt-2">
                    <button className="text-xs bg-white text-blue-600 px-3 py-1 rounded border border-blue-300 hover:bg-blue-100 transition-colors">
                      View Price Charts
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="border border-amber-200 bg-amber-50 rounded-lg p-4 shadow-sm">
              <div className="flex items-start">
                <div className="text-amber-500 mr-3 text-xl">⚠️</div>
                <div>
                  <p className="font-medium text-amber-800">Supply Alert</p>
                  <p className="text-amber-700 text-sm">Expected wheat shortage in the coming weeks due to delayed harvests. Advise farmers to hold stocks if possible.</p>
                  <div className="mt-2">
                    <button className="text-xs bg-white text-amber-600 px-3 py-1 rounded border border-amber-300 hover:bg-amber-100 transition-colors">
                      Send Notifications
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const TransactionsTab = () => (
    <div className="bg-white rounded-xl shadow-lg p-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-100 pb-3">Transaction Management</h2>
      
      <SalesRecordComponent brokerId={user?.id} />
    </div>
  );
  
  // Main content to render inside the layout
  const renderMainContent = () => (
    <div className="container mx-auto px-4">
      {/* Dashboard Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center text-4xl mr-5 shadow-sm">
              🏢
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{profile?.full_name || 'Broker'}</h1>
              <p className="text-gray-600">{profile?.email}</p>
              <div className="flex items-center mt-1 text-blue-700">
                <span className="text-sm">{brokerProfile?.market_name || 'Market Location'}</span>
                {brokerProfile?.registration_number && (
                  <span className="ml-3 px-2 py-1 bg-blue-50 rounded-full text-xs">
                    Reg No: {brokerProfile.registration_number}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => setActiveTab('transactions')}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors flex items-center shadow-sm">
              <span className="mr-2">📝</span> New Transaction
            </button>
            <button 
              onClick={() => setActiveTab('analytics')}
              className="px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors flex items-center shadow-sm">
              <span className="mr-2">📊</span> Market Analysis
            </button>
            <button 
              onClick={() => setActiveTab('farmers')}
              className="px-4 py-2 bg-amber-100 text-amber-700 rounded-md hover:bg-amber-200 transition-colors flex items-center shadow-sm">
              <span className="mr-2">👨‍🌾</span> Farmer Directory
            </button>
          </div>
        </div>
      </div>
      
      {/* Display error message if any */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          <p className="flex items-center">
            <span className="mr-2">⚠️</span> {error}
          </p>
        </div>
      )}

      {/* Market Alert Card */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-100 rounded-xl shadow-md p-5 mb-6 animate-fadeIn">
        <div className="flex flex-col md:flex-row items-center md:items-start">
          <div className="mr-6 text-6xl mb-4 md:mb-0">📊</div>
          <div className="flex-1">
            <h3 className="font-medium text-blue-800 text-lg">Market Price Alert</h3>
            <p className="text-blue-700 mb-2">Rice prices have increased by 8% in the last week. Wheat prices remain stable.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
              <div className="bg-white/50 rounded p-2 text-center">
                <p className="text-xs text-blue-600">Rice</p>
                <p className="text-sm font-medium text-blue-800">₹32/kg <span className="text-green-600">↑8%</span></p>
              </div>
              <div className="bg-white/50 rounded p-2 text-center">
                <p className="text-xs text-blue-600">Wheat</p>
                <p className="text-sm font-medium text-blue-800">₹28/kg <span className="text-gray-500">→0%</span></p>
              </div>
              <div className="bg-white/50 rounded p-2 text-center">
                <p className="text-xs text-blue-600">Vegetables</p>
                <p className="text-sm font-medium text-blue-800">₹45/kg <span className="text-red-600">↓3%</span></p>
              </div>
              <div className="bg-white/50 rounded p-2 text-center">
                <p className="text-xs text-blue-600">Fruits</p>
                <p className="text-sm font-medium text-blue-800">₹60/kg <span className="text-green-600">↑5%</span></p>
              </div>
            </div>
          </div>
          <div className="mt-4 md:mt-0">
            <button className="text-blue-700 hover:text-blue-900 text-sm flex items-center">
              Full Price List
              <svg className="h-4 w-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
              </div>
            </div>
          </div>
          
          {/* Main Dashboard Navigation */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md overflow-hidden sticky top-24">
                <div className="bg-blue-700 text-white p-4">
              <h2 className="font-bold text-lg">Broker Dashboard</h2>
                </div>
            <nav className="p-3">
                  <button 
                    onClick={() => setActiveTab('overview')}
                    data-tab="overview" 
                    className={`w-full text-left px-4 py-3 rounded-lg flex items-center ${activeTab === 'overview' 
                      ? 'bg-blue-100 text-blue-800 font-medium shadow-sm' 
                      : 'hover:bg-gray-100 text-gray-700'} transition-colors mb-2`}
                  >
                    <span className="mr-3 text-xl">🏠</span> Overview
                  </button>
                  <button 
                    onClick={() => setActiveTab('transactions')}
                    data-tab="transactions"
                    className={`w-full text-left px-4 py-3 rounded-lg flex items-center ${activeTab === 'transactions' 
                      ? 'bg-blue-100 text-blue-800 font-medium shadow-sm' 
                      : 'hover:bg-gray-100 text-gray-700'} transition-colors mb-2`}
                  >
                    <span className="mr-3 text-xl">📝</span> Transactions
                  </button>
                  <button 
                    onClick={() => setActiveTab('analytics')}
                    data-tab="analytics"
                    className={`w-full text-left px-4 py-3 rounded-lg flex items-center ${activeTab === 'analytics' 
                      ? 'bg-blue-100 text-blue-800 font-medium shadow-sm' 
                      : 'hover:bg-gray-100 text-gray-700'} transition-colors mb-2`}
                  >
                    <span className="mr-3 text-xl">📊</span> Market Analytics
                  </button>
                  <button 
                    onClick={() => setActiveTab('verification')}
                    data-tab="verification"
                    className={`w-full text-left px-4 py-3 rounded-lg flex items-center ${activeTab === 'verification' 
                      ? 'bg-blue-100 text-blue-800 font-medium shadow-sm' 
                      : 'hover:bg-gray-100 text-gray-700'} transition-colors mb-2`}
                  >
                    <span className="mr-3 text-xl">✅</span> Verification
                  </button>
                  <button 
                    onClick={() => setActiveTab('farmers')}
                    data-tab="farmers"
                    className={`w-full text-left px-4 py-3 rounded-lg flex items-center ${activeTab === 'farmers' 
                      ? 'bg-blue-100 text-blue-800 font-medium shadow-sm' 
                      : 'hover:bg-gray-100 text-gray-700'} transition-colors mb-2`}
                  >
                    <span className="mr-3 text-xl">👨‍🌾</span> Farmers Network
                  </button>
                  <button 
                    onClick={() => setActiveTab('settings')}
                    data-tab="settings"
                    className={`w-full text-left px-4 py-3 rounded-lg flex items-center ${activeTab === 'settings' 
                      ? 'bg-blue-100 text-blue-800 font-medium shadow-sm' 
                      : 'hover:bg-gray-100 text-gray-700'} transition-colors mb-2`}
                  >
                    <span className="mr-3 text-xl">⚙️</span> Settings
                  </button>
                </nav>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="lg:col-span-3">
          {activeTab === 'overview' && <OverviewTab />}
          
          {activeTab === 'transactions' && <TransactionsTab />}
          
          {activeTab === 'analytics' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-100 pb-3">Market Analytics</h2>
              <p className="text-gray-600 mb-6">Track market trends, prices, and volumes over time.</p>
              
              {/* Analytics interface would go here */}
              <div className="p-8 rounded-lg text-center text-gray-500 bg-gray-50 border border-gray-200">
                    <p>Market analytics content will be displayed here.</p>
                  </div>
                </div>
              )}
              
              {activeTab === 'verification' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-100 pb-3">Verification System</h2>
              <p className="text-gray-600 mb-6">Verify and authenticate transactions using blockchain.</p>
                  
              {/* Verification interface would go here */}
              <div className="p-8 rounded-lg text-center text-gray-500 bg-gray-50 border border-gray-200">
                    <p>Verification system content will be displayed here.</p>
                  </div>
                </div>
              )}
              
              {activeTab === 'farmers' && (
            <div className="animate-fadeIn">
              <FarmerNetworkComponent brokerId={user?.id} />
            </div>
              )}
              
              {activeTab === 'settings' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-100 pb-3">Settings</h2>
                  <p className="text-gray-600 mb-6">Manage your broker profile and preferences.</p>
                  
              {/* Settings interface would go here */}
              <div className="p-8 rounded-lg text-center text-gray-500 bg-gray-50 border border-gray-200">
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
      userType="broker"
      userName={profile?.full_name}
      loading={loading}
    >
      {renderMainContent()}
    </DashboardLayout>
  );
} 