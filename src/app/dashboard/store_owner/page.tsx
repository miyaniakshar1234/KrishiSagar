"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getCurrentUser, getUserProfile, getUserTypeProfile, createClient } from '@/lib/supabase/client';
import DashboardLayout from '@/components/DashboardLayout';
import InventoryManagementComponent from '@/components/store/InventoryManagementComponent';
import BillingSystemComponent from '@/components/store/BillingSystemComponent';
import MarketTransactionsComponent from '@/components/store/MarketTransactionsComponent';
import { inventoryProducts } from './data';

export default function StoreOwnerDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [storeProfile, setStoreProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState(searchParams?.get('tab') || 'overview');
  const [inventoryAlerts, setInventoryAlerts] = useState(
    inventoryProducts.filter(item => item.stock <= item.minStock).slice(0, 5)
  );

  useEffect(() => {
    async function loadUserData() {
      try {
        setLoading(true);
        setError(null);
        const user = await getCurrentUser();
        
        if (!user) {
          console.log('No authenticated user found, redirecting to sign-in');
          router.push('/auth/sign-in');
          return;
        }
        
        setUser(user);
        console.log('User authenticated:', user.id);
        
        // Get user profile from users table
        try {
        const userProfile = await getUserProfile();
        setProfile(userProfile);
          console.log('User profile loaded:', userProfile?.user_type);
        
          if (!userProfile) {
            console.warn('No user profile found');
            // Show dashboard anyway, but with limited data
          } else if (userProfile.user_type !== 'store_owner') {
          // If user is not a store owner, redirect them to their appropriate dashboard
            console.log(`User is not a store owner, redirecting to ${userProfile.user_type} dashboard`);
            router.push(`/dashboard/${userProfile.user_type}`);
          return;
          }
        } catch (profileError) {
          console.error('Error fetching user profile:', profileError);
          // Continue to load the dashboard with limited info
        }
        
        // Get store owner specific profile
        try {
          console.log('Fetching store owner profile for user:', user.id);
          const { data: storeData, error: storeError } = await getUserTypeProfile(user.id, 'store_owner');
          
          if (storeError) {
            console.error('Error fetching store owner profile:', storeError);
            // We'll still show the dashboard, just without store-specific data
          } else if (!storeData) {
            console.warn('No store profile found for user, creating default profile');
            
            // Create a default store profile if none exists
            try {
              const { data: newStoreData, error: insertError } = await createStoreProfile(user.id, user.email);
              if (insertError) {
                console.error('Error creating default store profile:', insertError);
                // Show a more user-friendly error message in the UI
                setError(`Could not create store profile: ${insertError}`);
              } else if (newStoreData) {
                setStoreProfile(newStoreData);
                console.log('Created and loaded new store profile');
              } else {
                console.warn('Store profile creation returned no data and no error');
                // Try one more time to fetch the profile
                setTimeout(async () => {
                  try {
                    const { data: retryData } = await getUserTypeProfile(user.id, 'store_owner');
                    if (retryData) {
                      setStoreProfile(retryData);
                      console.log('Successfully retrieved profile on retry');
                    } else {
                      setError('Could not retrieve your store profile after creation. Please refresh the page.');
                    }
                  } catch (retryError) {
                    console.error('Failed to retrieve profile on retry:', retryError);
                  }
                }, 1000);
              }
            } catch (createError) {
              console.error('Exception creating store profile:', createError);
              setError(`Failed to set up your store profile: ${createError}`);
            }
          } else {
        setStoreProfile(storeData);
            console.log('Store profile loaded successfully');
          }
        } catch (storeProfileError) {
          console.error('Exception in store profile section:', storeProfileError);
          setError(`Error loading store profile: ${storeProfileError instanceof Error ? storeProfileError.message : 'Unknown error'}`);
          // Continue with the dashboard without the store profile data
        }
        
        setLoading(false);
      } catch (error: any) {
        console.error('Error loading user data:', error);
        setError(error?.message || 'Failed to load dashboard data');
        setLoading(false);
        // Don't redirect, show an error message in the UI instead
      }
    }
    
    loadUserData();
  }, [router]);

  // Helper function to create a default store profile
  async function createStoreProfile(userId: string, email: string | null | undefined) {
    if (!userId) {
      console.error('Cannot create store profile without a user ID');
      return { error: 'User ID is required' };
    }
    
    // Create a default store name even if email is null/undefined
    let storeName = 'My Agricultural Store';
    if (email) {
      const username = email.split('@')[0];
      if (username) {
        storeName = `${username}'s Store`;
      }
    }
    
    console.log('Creating default store profile with:', { 
      userId, 
      storeName, 
      email: email || 'not provided' 
    });
    
    try {
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from('store_owner_profiles')
        .insert({
          user_id: userId,
          store_name: storeName, // This field is required, ensure it has a value
          store_location: 'Not specified',
          gst_number: 'PENDING', // Adding a default value
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select();
      
      if (error) {
        console.error('Database error creating store profile:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        return { error };
      }
      
      console.log('Successfully created store profile:', data);
      return { data, error: null };
    } catch (err) {
      console.error('Exception in createStoreProfile:', err);
      return { error: err instanceof Error ? err.message : 'Unknown error' };
    }
  }

  // Update URL when tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    
    // Update URL query parameter
    const params = new URLSearchParams(window.location.search);
    params.set('tab', tab);
    
    // Replace current URL with new one containing updated query parameter
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  };

  // Handle inventory actions
  const handleAddProduct = () => {
    console.log('Add product');
    // Implementation would open a modal form
  };

  const handleEditProduct = (product: any) => {
    console.log('Edit product:', product);
    // Implementation would open a modal form with product data
  };

  const handleDeleteProduct = (productId: string) => {
    console.log('Delete product:', productId);
    // Implementation would confirm and delete product
  };

  const handleReorderProduct = (product: any) => {
    console.log('Reorder product:', product);
    // Implementation would create a reorder transaction
  };

  // Dashboard section components
  const OverviewTab = () => (
    <div className="bg-white rounded-xl shadow-lg p-6 animate-fadeIn">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-100 pb-3">Store Dashboard Overview</h2>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="bg-blue-50 p-5 rounded-lg border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
                <div>
              <h3 className="text-sm font-semibold text-blue-800 uppercase tracking-wide mb-1">Today's Sales</h3>
              <p className="text-3xl font-bold text-blue-700">₹12,850</p>
              <p className="text-xs text-blue-600 mt-1">15 transactions</p>
            </div>
            <span className="text-3xl">💰</span>
          </div>
        </div>
        <div className="bg-amber-50 p-5 rounded-lg border border-amber-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
              <div>
              <h3 className="text-sm font-semibold text-amber-800 uppercase tracking-wide mb-1">Total Inventory</h3>
              <p className="text-3xl font-bold text-amber-700">{inventoryProducts.length}</p>
              <p className="text-xs text-amber-600 mt-1">products in stock</p>
            </div>
            <span className="text-3xl">📦</span>
          </div>
                </div>
        <div className="bg-red-50 p-5 rounded-lg border border-red-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-semibold text-red-800 uppercase tracking-wide mb-1">Low Stock Items</h3>
              <p className="text-3xl font-bold text-red-700">{inventoryAlerts.length}</p>
              <p className="text-xs text-red-600 mt-1">require reordering</p>
            </div>
            <span className="text-3xl">⚠️</span>
                    </div>
                    </div>
                  </div>
                  
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Sales */}
                  <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">🧾</span> Recent Sales
          </h3>
          <div className="border border-gray-200 rounded-lg divide-y divide-gray-200 shadow-sm">
            <div className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3 flex-shrink-0">
                          🧾
                        </div>
                        <div className="flex-grow">
                          <div className="flex justify-between items-start">
                            <p className="text-gray-800 font-medium">Ramesh Kumar</p>
                            <p className="text-gray-700 font-medium">₹2,450</p>
                          </div>
                          <p className="text-gray-500 text-sm">Fertilizers, Seeds, Pesticides</p>
                          <p className="text-gray-400 text-xs mt-1">Today, 11:23 AM</p>
                        </div>
                      </div>
            </div>
            <div className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3 flex-shrink-0">
                          🧾
                        </div>
                        <div className="flex-grow">
                          <div className="flex justify-between items-start">
                            <p className="text-gray-800 font-medium">Suresh Patel</p>
                            <p className="text-gray-700 font-medium">₹1,785</p>
                          </div>
                          <p className="text-gray-500 text-sm">Irrigation Equipment, Organic Fertilizers</p>
                          <p className="text-gray-400 text-xs mt-1">Today, 10:05 AM</p>
                        </div>
                      </div>
            </div>
            <div className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3 flex-shrink-0">
                          🧾
                        </div>
                        <div className="flex-grow">
                          <div className="flex justify-between items-start">
                            <p className="text-gray-800 font-medium">Anjali Singh</p>
                            <p className="text-gray-700 font-medium">₹3,200</p>
                          </div>
                          <p className="text-gray-500 text-sm">Seed Packages, Tools, Pesticides</p>
                          <p className="text-gray-400 text-xs mt-1">Yesterday, 4:30 PM</p>
                </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Market Intelligence */}
                  <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">📊</span> Market Intelligence
          </h3>
          <div className="space-y-4">
            <div className="border border-blue-200 bg-blue-50 rounded-lg p-4 shadow-sm">
                      <div className="flex items-start">
                <div className="text-blue-500 mr-3 text-xl">📈</div>
                        <div>
                          <p className="font-medium text-blue-800">Demand Forecast</p>
                          <p className="text-blue-700 text-sm">Predicted increase in demand for rice seeds next week based on local planting schedules.</p>
                  <div className="mt-2">
                    <button className="text-xs bg-white text-blue-600 px-3 py-1 rounded border border-blue-300 hover:bg-blue-100 transition-colors">
                      View Details
                    </button>
                  </div>
                        </div>
                      </div>
                    </div>
            <div className="border border-green-200 bg-green-50 rounded-lg p-4 shadow-sm">
                      <div className="flex items-start">
                <div className="text-green-500 mr-3 text-xl">🧪</div>
                        <div>
                          <p className="font-medium text-green-800">Disease Alert</p>
                          <p className="text-green-700 text-sm">Local farmers reporting leaf spot disease in tomato crops. Consider stocking relevant treatments.</p>
                  <div className="mt-2">
                    <button className="text-xs bg-white text-green-600 px-3 py-1 rounded border border-green-300 hover:bg-green-100 transition-colors">
                      Order Products
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

  const InventoryTab = () => (
    <InventoryManagementComponent
      products={inventoryProducts}
      onAddProduct={handleAddProduct}
      onEditProduct={handleEditProduct}
      onDeleteProduct={handleDeleteProduct}
      onReorderProduct={handleReorderProduct}
    />
  );
  
  // Main content to render inside the layout
  const renderMainContent = () => {
    // Show error message if there was a problem
    if (error) {
      return (
        <div className="container mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 my-6">
            <h2 className="text-lg font-semibold text-red-700 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              There was a problem loading your dashboard
            </h2>
            <p className="text-red-600 mt-2">{error}</p>
            <div className="mt-4">
              <button 
                onClick={() => window.location.reload()}
                className="bg-red-100 text-red-700 hover:bg-red-200 font-medium py-2 px-4 rounded transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
          
          {/* Show a limited dashboard if we have at least some data */}
          {user && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h1 className="text-2xl font-bold text-gray-800">
                {profile?.full_name || user.email || 'Store Owner'}
              </h1>
              <p className="text-gray-600">{user.email}</p>
              <p className="mt-4 text-gray-700">
                Some dashboard features are currently unavailable.
                Please try refreshing the page or contact support if the problem persists.
              </p>
            </div>
          )}
        </div>
      );
    }
    
    return (
      <div className="container mx-auto px-4">
        {/* Dashboard Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-20 h-20 bg-amber-100 rounded-2xl flex items-center justify-center text-4xl mr-5 shadow-sm">
                🏪
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  {storeProfile?.store_name || profile?.full_name || 'Store Owner'}
                </h1>
                <p className="text-gray-600">{profile?.email}</p>
                <div className="flex items-center mt-1 text-amber-700">
                  <span className="text-sm">{storeProfile?.store_location || 'Store Location'}</span>
                  {storeProfile?.gst_number && (
                    <span className="ml-3 px-2 py-1 bg-amber-50 rounded-full text-xs">
                      GST: {storeProfile.gst_number}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 bg-amber-100 text-amber-700 rounded-md hover:bg-amber-200 transition-colors flex items-center shadow-sm">
                <span className="mr-2">🧾</span> New Bill
              </button>
              <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors flex items-center shadow-sm">
                <span className="mr-2">📦</span> Add Inventory
              </button>
              <button className="px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors flex items-center shadow-sm">
                <span className="mr-2">📢</span> Make Announcement
              </button>
            </div>
          </div>
        </div>

        {/* Low Stock Alert Card */}
        <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl shadow-md p-5 mb-6 animate-fadeIn">
          <div className="flex flex-col md:flex-row items-center md:items-start">
            <div className="mr-6 text-6xl mb-4 md:mb-0">⚠️</div>
            <div className="flex-1">
              <h3 className="font-medium text-red-800 text-lg">Low Stock Alert</h3>
              <p className="text-red-700 mb-2">{inventoryAlerts.length} products are running low on stock. Check inventory management.</p>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mt-3">
                {inventoryAlerts.map((item) => (
                  <div key={item.id} className="bg-white/50 rounded p-2 text-center">
                    <p className="text-xs text-red-600 truncate">{item.name}</p>
                    <p className="text-sm font-medium text-red-800">{item.stock} units</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <button 
                onClick={() => handleTabChange('inventory')}
                className="text-red-700 hover:text-red-900 text-sm flex items-center"
              >
                View All
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
              <div className="bg-amber-700 text-white p-4">
                <h2 className="font-bold text-lg">Store Dashboard</h2>
              </div>
              <nav className="p-3">
                <button 
                  onClick={() => handleTabChange('overview')}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center ${activeTab === 'overview' 
                    ? 'bg-amber-100 text-amber-800 font-medium shadow-sm' 
                    : 'hover:bg-gray-100 text-gray-700'} transition-colors mb-2`}
                >
                  <span className="mr-3 text-xl">📊</span> Overview
                </button>
                <button 
                  onClick={() => handleTabChange('inventory')}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center ${activeTab === 'inventory' 
                    ? 'bg-amber-100 text-amber-800 font-medium shadow-sm' 
                    : 'hover:bg-gray-100 text-gray-700'} transition-colors mb-2`}
                >
                  <span className="mr-3 text-xl">📦</span> Inventory Management
                </button>
                <button 
                  onClick={() => handleTabChange('billing')}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center ${activeTab === 'billing' 
                    ? 'bg-amber-100 text-amber-800 font-medium shadow-sm' 
                    : 'hover:bg-gray-100 text-gray-700'} transition-colors mb-2`}
                >
                  <span className="mr-3 text-xl">🧾</span> Billing System
                </button>
                <button 
                  onClick={() => handleTabChange('finances')}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center ${activeTab === 'finances' 
                    ? 'bg-amber-100 text-amber-800 font-medium shadow-sm' 
                    : 'hover:bg-gray-100 text-gray-700'} transition-colors mb-2`}
                >
                  <span className="mr-3 text-xl">💰</span> Financial Management
                </button>
                <button 
                  onClick={() => handleTabChange('market')}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center ${activeTab === 'market' 
                    ? 'bg-amber-100 text-amber-800 font-medium shadow-sm' 
                    : 'hover:bg-gray-100 text-gray-700'} transition-colors mb-2`}
                >
                  <span className="mr-3 text-xl">🌾</span> Market Transactions
                </button>
                <button 
                  onClick={() => handleTabChange('customers')}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center ${activeTab === 'customers' 
                    ? 'bg-amber-100 text-amber-800 font-medium shadow-sm' 
                    : 'hover:bg-gray-100 text-gray-700'} transition-colors mb-2`}
                >
                  <span className="mr-3 text-xl">👨‍🌾</span> Farmers & Customers
                </button>
                <button 
                  onClick={() => handleTabChange('community')}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center ${activeTab === 'community' 
                    ? 'bg-amber-100 text-amber-800 font-medium shadow-sm' 
                    : 'hover:bg-gray-100 text-gray-700'} transition-colors mb-2`}
                >
                  <span className="mr-3 text-xl">📢</span> Community Engagement
                </button>
                <button 
                  onClick={() => handleTabChange('settings')}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center ${activeTab === 'settings' 
                    ? 'bg-amber-100 text-amber-800 font-medium shadow-sm' 
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
            
            {activeTab === 'inventory' && <InventoryTab />}
              
              {activeTab === 'billing' && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-100 pb-3">Billing System</h2>
                <p className="text-gray-600 mb-6">Create GST-compliant invoices for customers.</p>
                
                {/* Integrate the actual billing system component */}
                <BillingSystemComponent 
                  storeOwnerId={user?.id || ''} 
                  storeName={profile?.store_name || profile?.full_name || 'My Store'} 
                />
              </div>
              )}
              
              {activeTab === 'finances' && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-100 pb-3">Financial Management</h2>
                  <p className="text-gray-600 mb-6">Track sales, expenses, and financial performance.</p>
                  
                {/* Financial management interface placeholder */}
                <div className="p-8 rounded-lg text-center text-gray-500 bg-gray-50 border border-gray-200">
                    <p>Financial management content will be displayed here.</p>
                  </div>
                </div>
              )}
              
              {activeTab === 'market' && (
                <div className="animate-fadeIn">
                  <MarketTransactionsComponent storeOwnerId={user?.id || ''} />
                </div>
              )}
              
              {activeTab === 'customers' && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-100 pb-3">Farmers & Customers</h2>
                  <p className="text-gray-600 mb-6">Manage relationships with your farming customers.</p>
                  
                {/* Customer management interface placeholder */}
                <div className="p-8 rounded-lg text-center text-gray-500 bg-gray-50 border border-gray-200">
                    <p>Customer management content will be displayed here.</p>
                  </div>
                </div>
              )}
              
              {activeTab === 'community' && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-100 pb-3">Community Engagement</h2>
                  <p className="text-gray-600 mb-6">Make announcements and engage with local farmers.</p>
                  
                {/* Community engagement interface placeholder */}
                <div className="p-8 rounded-lg text-center text-gray-500 bg-gray-50 border border-gray-200">
                    <p>Community engagement content will be displayed here.</p>
                  </div>
                </div>
              )}
              
              {activeTab === 'settings' && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-100 pb-3">Settings</h2>
                  <p className="text-gray-600 mb-6">Manage your store profile and preferences.</p>
                  
                {/* Settings interface placeholder */}
                <div className="p-8 rounded-lg text-center text-gray-500 bg-gray-50 border border-gray-200">
                    <p>Settings content will be displayed here.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
    );
  };

  return (
    <DashboardLayout
      userType="store_owner"
      userName={profile?.full_name}
      loading={loading}
    >
      {renderMainContent()}
    </DashboardLayout>
  );
} 