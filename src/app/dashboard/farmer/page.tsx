"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, getUserProfile, getUserTypeProfile } from '@/lib/supabase/client';
import DashboardLayout from '@/components/DashboardLayout';
import FinancialOverviewChart from '@/components/farmer/FinancialOverviewChart';
import CropYieldChart from '@/components/farmer/CropYieldChart';
import CropAnalysisComponent from '@/components/farmer/CropAnalysisComponent';
import WeatherComponent from '@/components/farmer/WeatherComponent';
import MarketplaceComponent from '@/components/marketplace/MarketplaceComponent';
import SoilHealthComponent from '@/components/farmer/SoilHealthComponent';
import CropRotationComponent from '@/components/farmer/CropRotationComponent';
import KrishiGramComponent from '@/components/farmer/KrishiGramComponent';
import PurchaseHistoryComponent from '@/components/farmer/PurchaseHistoryComponent';
import SalesHistoryComponent from '@/components/farmer/SalesHistoryComponent';

export default function FarmerDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [farmerProfile, setFarmerProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Keep sample data for other components
  const financialData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    revenue: [25000, 30000, 22000, 28000, 35000, 32000],
    expenses: [12000, 15000, 13000, 14000, 16000, 15000],
    profit: [13000, 15000, 9000, 14000, 19000, 17000],
  };
  
  const cropYieldData = [
    {
      name: 'Rice',
      currentYield: 3200,
      previousYield: 2800,
      targetYield: 3500,
      unit: 'kg/hectare'
    },
    {
      name: 'Wheat',
      currentYield: 2800,
      previousYield: 2600,
      targetYield: 3000,
      unit: 'kg/hectare'
    },
    {
      name: 'Vegetables',
      currentYield: 18000,
      previousYield: 16500,
      targetYield: 20000,
      unit: 'kg/hectare'
    }
  ];
  
  const marketplaceProducts = [
    {
      id: '1',
      name: 'Organic Fertilizer',
      price: 450,
      quantity: 50,
      unit: 'kg',
      image: '/images/farm/fertilizer.jpg',
      seller: {
        id: '101',
        name: 'Krishna Agri Store',
        location: 'Ahmedabad',
        type: 'store_owner'
      },
      category: 'fertilizers',
      isOrganic: true,
      rating: 4.8
    },
    {
      id: '2',
      name: 'Rice Seeds (IR-36)',
      price: 120,
      quantity: 25,
      unit: 'kg',
      seller: {
        id: '102',
        name: 'Gujarat Seeds Ltd',
        location: 'Surat',
        type: 'store_owner'
      },
      category: 'seeds',
      isOrganic: false,
      rating: 4.5
    },
    {
      id: '3',
      name: 'Neem Oil Pesticide',
      price: 350,
      quantity: 5,
      unit: 'liter',
      seller: {
        id: '103',
        name: 'Organic Solutions',
        location: 'Vadodara',
        type: 'store_owner'
      },
      category: 'pesticides',
      isOrganic: true,
      rating: 4.9
    },
    {
      id: '4',
      name: 'Irrigation Sprinklers',
      price: 1200,
      quantity: 10,
      unit: 'set',
      seller: {
        id: '104',
        name: 'Farm Tech Solutions',
        location: 'Rajkot',
        type: 'store_owner'
      },
      category: 'equipment',
      isOrganic: false,
      rating: 4.2
    },
  ];

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

  // Dashboard section components
  const OverviewTab = () => (
    <div className="bg-white rounded-xl shadow-lg p-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-100 pb-3">Dashboard Overview</h2>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="bg-green-50 p-5 rounded-lg border border-green-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-semibold text-green-800 uppercase tracking-wide mb-1">Active Crops</h3>
              <p className="text-3xl font-bold text-green-700">3</p>
              <p className="text-xs text-green-600 mt-1">Rice, Wheat, Vegetables</p>
            </div>
            <span className="text-3xl">🌱</span>
          </div>
        </div>
        <div className="bg-amber-50 p-5 rounded-lg border border-amber-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-semibold text-amber-800 uppercase tracking-wide mb-1">Upcoming Harvests</h3>
              <p className="text-3xl font-bold text-amber-700">1</p>
              <p className="text-xs text-amber-600 mt-1">Rice - 15 days left</p>
            </div>
            <span className="text-3xl">🌾</span>
          </div>
        </div>
        <div className="bg-blue-50 p-5 rounded-lg border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-semibold text-blue-800 uppercase tracking-wide mb-1">Health Analysis</h3>
              <p className="text-3xl font-bold text-blue-700">4</p>
              <p className="text-xs text-blue-600 mt-1">in the last 7 days</p>
            </div>
            <span className="text-3xl">🔬</span>
          </div>
        </div>
      </div>
      
      {/* Weather Widget */}
      <div className="mb-8">
        <WeatherComponent farmLocation={farmerProfile?.farm_location} />
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">💰</span> Financial Overview
          </h3>
          <FinancialOverviewChart 
            data={financialData} 
            title="Financial Overview"
            period="monthly"
            chartType="bar"
          />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">📊</span> Crop Yield
          </h3>
          <CropYieldChart 
            crops={cropYieldData}
            title="Crop Yield Comparison"
          />
        </div>
      </div>
      
      {/* Recent Activities */}
      <div className="pt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <span className="mr-2">🔔</span> Recent Activities
        </h3>
        <div className="border border-gray-200 rounded-lg divide-y divide-gray-200 shadow-sm">
          <div className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3 flex-shrink-0">
                📸
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-start">
                  <p className="text-gray-800 font-medium">Crop Health Analysis</p>
                  <p className="text-gray-500 text-sm">1 hour ago</p>
                </div>
                <p className="text-gray-600 text-sm">You uploaded 3 images of rice crop for analysis</p>
              </div>
            </div>
          </div>
          <div className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3 flex-shrink-0">
                💧
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-start">
                  <p className="text-gray-800 font-medium">Irrigation Completed</p>
                  <p className="text-gray-500 text-sm">Yesterday</p>
                </div>
                <p className="text-gray-600 text-sm">Irrigation cycle completed for Wheat field (North)</p>
              </div>
            </div>
          </div>
          <div className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start">
              <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 mr-3 flex-shrink-0">
                🧪
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-start">
                  <p className="text-gray-800 font-medium">Soil Test Results</p>
                  <p className="text-gray-500 text-sm">2 days ago</p>
                </div>
                <p className="text-gray-600 text-sm">You received soil test results for Vegetable field</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const CropManagementTab = () => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-100 pb-3">Crop Management</h2>
      <p className="text-gray-600 mb-6">Monitor and manage your crops throughout their lifecycle.</p>
      
      {/* Crop Management content will be implemented in a future update */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-green-200 rounded-lg p-4 bg-green-50">
          <h3 className="font-medium text-green-800 mb-2">Rice</h3>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Status:</span>
            <span className="font-medium text-green-700">Growing</span>
          </div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Planted:</span>
            <span className="font-medium">15 Jun 2023</span>
          </div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Expected Harvest:</span>
            <span className="font-medium">25 Oct 2023</span>
          </div>
          <div className="flex justify-between text-sm mb-3">
            <span className="text-gray-600">Health:</span>
            <span className="font-medium text-green-700">Good</span>
          </div>
          <div className="flex justify-end">
            <button className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors">
              View Details
            </button>
          </div>
        </div>
        
        <div className="border border-green-200 rounded-lg p-4 bg-green-50">
          <h3 className="font-medium text-green-800 mb-2">Wheat</h3>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Status:</span>
            <span className="font-medium text-yellow-700">Planted</span>
          </div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Planted:</span>
            <span className="font-medium">5 Aug 2023</span>
          </div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Expected Harvest:</span>
            <span className="font-medium">10 Dec 2023</span>
          </div>
          <div className="flex justify-between text-sm mb-3">
            <span className="text-gray-600">Health:</span>
            <span className="font-medium text-yellow-700">Monitoring</span>
          </div>
          <div className="flex justify-end">
            <button className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors">
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const MarketplaceTab = () => (
    <MarketplaceComponent />
  );

  const FinancesTab = () => (
    <div className="bg-white rounded-xl shadow-lg p-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-100 pb-3">Financial Management</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-green-50 p-5 rounded-lg border border-green-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-semibold text-green-800 uppercase tracking-wide mb-1">Monthly Income</h3>
              <p className="text-3xl font-bold text-green-700">₹35,000</p>
              <p className="text-xs text-green-600 mt-1">+8% from last month</p>
            </div>
            <span className="text-3xl">💰</span>
          </div>
        </div>
        
        <div className="bg-red-50 p-5 rounded-lg border border-red-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-semibold text-red-800 uppercase tracking-wide mb-1">Monthly Expenses</h3>
              <p className="text-3xl font-bold text-red-700">₹12,500</p>
              <p className="text-xs text-red-600 mt-1">-5% from last month</p>
            </div>
            <span className="text-3xl">💸</span>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <FinancialOverviewChart
          data={financialData}
          title="Financial Overview"
          period="monthly"
          chartType="bar"
        />
      </div>
      
      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-4">Purchases from Agro Stores</h3>
          <PurchaseHistoryComponent farmerId={user?.id} />
        </div>
        
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-4">Sales through Brokers</h3>
          <SalesHistoryComponent farmerId={user?.id} />
        </div>
      </div>
    </div>
  );
  
  // Add new CropAnalysisTab
  const CropAnalysisTab = () => (
    <CropAnalysisComponent />
  );

  const SoilHealthTab = () => (
    <div className="animate-fadeIn">
      <SoilHealthComponent />
    </div>
  );
  
  // Add CropRotationTab constant
  const CropRotationTab = () => (
    <div className="animate-fadeIn">
      <CropRotationComponent />
    </div>
  );
  
  // Main content to render inside the layout
  const renderMainContent = () => (
    <div className="container mx-auto px-4">
      {/* Dashboard Header Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center text-4xl mr-5 shadow-sm">
              🌾
            </div>
              <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {profile?.full_name || 'Farmer Dashboard'}
              </h1>
              <p className="text-gray-600">{user?.email}</p>
              <div className="flex items-center mt-1 text-green-700">
                <span className="text-sm">{farmerProfile?.farm_location || 'Farm Location'}</span>
                {farmerProfile?.crops_grown && farmerProfile.crops_grown.length > 0 && (
                  <span className="ml-3 px-2 py-1 bg-green-50 rounded-full text-xs">
                    {farmerProfile.crops_grown.join(', ')}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => setActiveTab('crop_analysis')}
              className="px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors flex items-center shadow-sm">
              <span className="mr-2">📷</span> Upload Crop Image
            </button>
            <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors flex items-center shadow-sm">
              <span className="mr-2">📊</span> View Reports
            </button>
            <button className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200 transition-colors flex items-center shadow-sm">
              <span className="mr-2">👨‍🌾</span> Ask Expert
            </button>
          </div>
        </div>
      </div>
      
      {/* Dashboard Navigation */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md overflow-hidden sticky top-24">
                <div className="bg-green-700 text-white p-4">
              <h2 className="font-bold text-lg">Farmer Dashboard</h2>
                </div>
            <nav className="p-3">
                  <button 
                    onClick={() => setActiveTab('overview')}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center ${activeTab === 'overview' 
                  ? 'bg-green-100 text-green-800 font-medium shadow-sm' 
                  : 'hover:bg-gray-100 text-gray-700'} transition-colors mb-2`}
                  >
                <span className="mr-3 text-xl">📊</span> Overview
                  </button>
                  <button 
                onClick={() => setActiveTab('crop_management')}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center ${activeTab === 'crop_management' 
                  ? 'bg-green-100 text-green-800 font-medium shadow-sm' 
                  : 'hover:bg-gray-100 text-gray-700'} transition-colors mb-2`}
              >
                <span className="mr-3 text-xl">🌱</span> Crop Management
                  </button>
                  <button 
                onClick={() => setActiveTab('crop_analysis')}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center ${activeTab === 'crop_analysis' 
                  ? 'bg-green-100 text-green-800 font-medium shadow-sm' 
                  : 'hover:bg-gray-100 text-gray-700'} transition-colors mb-2`}
              >
                <span className="mr-3 text-xl">🔬</span> Crop Analysis
                  </button>
                  <button 
                    onClick={() => setActiveTab('marketplace')}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center ${activeTab === 'marketplace' 
                  ? 'bg-green-100 text-green-800 font-medium shadow-sm' 
                  : 'hover:bg-gray-100 text-gray-700'} transition-colors mb-2`}
                  >
                <span className="mr-3 text-xl">🛒</span> Marketplace
                  </button>
                  <button 
                onClick={() => setActiveTab('finances')}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center ${activeTab === 'finances' 
                  ? 'bg-green-100 text-green-800 font-medium shadow-sm' 
                  : 'hover:bg-gray-100 text-gray-700'} transition-colors mb-2`}
              >
                <span className="mr-3 text-xl">💰</span> Finance Management
                  </button>
                  <button 
                onClick={() => setActiveTab('soil_health')}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center ${activeTab === 'soil_health' 
                  ? 'bg-green-100 text-green-800 font-medium shadow-sm' 
                  : 'hover:bg-gray-100 text-gray-700'} transition-colors mb-2`}
              >
                <span className="mr-3 text-xl">🌍</span> Soil Health
                  </button>
                  <button 
                onClick={() => setActiveTab('crop_rotation')}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center ${activeTab === 'crop_rotation' 
                  ? 'bg-green-100 text-green-800 font-medium shadow-sm' 
                  : 'hover:bg-gray-100 text-gray-700'} transition-colors mb-2`}
              >
                <span className="mr-3 text-xl">🔄</span> Crop Rotation
                  </button>
                  <button 
                    onClick={() => setActiveTab('krishigram')}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center ${activeTab === 'krishigram' 
                  ? 'bg-green-100 text-green-800 font-medium shadow-sm' 
                  : 'hover:bg-gray-100 text-gray-700'} transition-colors mb-2`}
                  >
                <span className="mr-3 text-xl">📱</span> KrishiGram
                  </button>
                  <button 
                    onClick={() => setActiveTab('settings')}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center ${activeTab === 'settings' 
                  ? 'bg-green-100 text-green-800 font-medium shadow-sm' 
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
          {activeTab === 'crop_management' && <CropManagementTab />}
          {activeTab === 'crop_analysis' && <CropAnalysisTab />}
          {activeTab === 'marketplace' && <MarketplaceTab />}
          {activeTab === 'finances' && <FinancesTab />}
          {activeTab === 'soil_health' && <SoilHealthTab />}
          {activeTab === 'crop_rotation' && <CropRotationTab />}
          {activeTab === 'krishigram' && <KrishiGramComponent />}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-100 pb-3">Settings</h2>
              <p className="text-gray-600 mb-6">Manage your account preferences.</p>
              
              {/* Settings content placeholder */}
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
      userType="farmer"
      userName={profile?.full_name}
      loading={loading}
    >
      {renderMainContent()}
    </DashboardLayout>
  );
} 