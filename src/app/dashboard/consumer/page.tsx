"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, getUserProfile, getUserTypeProfile } from '@/lib/supabase/client';
import DashboardLayout from '@/components/DashboardLayout';
import ProductRecommendations from '@/components/consumer/ProductRecommendations';
import ShoppingCart from '@/components/consumer/ShoppingCart';
import { recommendedProducts, seasonalProducts, cartItems, orderHistory } from './data';

export default function ConsumerDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [consumerProfile, setConsumerProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('shop');
  const [cart, setCart] = useState(cartItems);
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
        
        if (userProfile?.user_type !== 'consumer') {
          // If user is not a consumer, redirect them to their appropriate dashboard
          router.push(`/dashboard/${userProfile?.user_type}`);
          return;
        }
        
        // Get consumer specific profile
        const { data: consumerData, error: consumerError } = await getUserTypeProfile(user.id, 'consumer');
        
        if (consumerError) {
          console.error('Error fetching consumer profile:', consumerError);
          // Don't redirect, just show error message
          setError('Failed to load consumer profile details.');
        } else {
          setConsumerProfile(consumerData);
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

  // Shopping cart handlers
  const handleAddToCart = (product: any) => {
    // Check if product is already in cart
    const existingProduct = cart.find(item => item.id === product.id);
    
    if (existingProduct) {
      // Update quantity
      handleUpdateQuantity(product.id, existingProduct.quantity + 1);
    } else {
      // Add new product to cart
      setCart([...cart, {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image,
        seller: product.seller,
        discountPercent: product.discountPercent
      }]);
    }
  };
  
  const handleRemoveFromCart = (productId: string) => {
    setCart(cart.filter(item => item.id !== productId));
  };
  
  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    setCart(cart.map(item => 
      item.id === productId ? { ...item, quantity: newQuantity } : item
    ));
  };
  
  const handleViewProductDetails = (product: any) => {
    console.log('View product details:', product);
    // Implementation would open product details view
  };
  
  const handleCheckout = () => {
    console.log('Proceeding to checkout');
    // Implementation would redirect to checkout flow
  };

  // Shop tab with product recommendations
  const ShopTab = () => (
    <div className="animate-fadeIn">
      {/* Seasonal Products */}
      <div className="bg-gradient-to-r from-amber-50 to-yellow-100 rounded-xl shadow-md p-5 mb-6">
        <div className="flex items-center mb-3">
          <span className="text-3xl mr-3">🌞</span>
          <div>
            <h3 className="text-xl font-semibold text-amber-800">Summer Special</h3>
            <p className="text-amber-700">Limited time seasonal products available now!</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {seasonalProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="h-24 bg-amber-200 relative flex items-center justify-center text-5xl">
                🥭
              </div>
              <div className="p-3">
                <h4 className="font-medium text-gray-800">{product.name}</h4>
                <div className="flex justify-between items-center mt-2">
                  <span className="font-bold text-amber-700">₹{product.price}</span>
                  <button 
                    onClick={() => handleAddToCart(product)}
                    className="bg-amber-600 hover:bg-amber-500 text-white text-sm px-2 py-1 rounded"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Product Recommendations */}
      <ProductRecommendations
        products={recommendedProducts}
        onAddToCart={handleAddToCart}
        onViewDetails={handleViewProductDetails}
      />
    </div>
  );

  // Cart tab
  const CartTab = () => (
    <ShoppingCart
      items={cart}
      onUpdateQuantity={handleUpdateQuantity}
      onRemoveItem={handleRemoveFromCart}
      onCheckout={handleCheckout}
      onContinueShopping={() => setActiveTab('shop')}
    />
  );

  // Order History tab
  const OrderHistoryTab = () => (
    <div className="animate-fadeIn">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Order History</h2>
      
      {orderHistory.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="text-gray-400 text-6xl mb-4">📋</div>
          <h3 className="text-xl font-medium text-gray-700 mb-2">No orders yet</h3>
          <p className="text-gray-500 mb-5">Your order history will appear here once you place an order</p>
          <button
            onClick={() => setActiveTab('shop')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors inline-flex items-center"
          >
            <span className="mr-2">🛍️</span> Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orderHistory.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex items-center">
                    <h3 className="font-medium text-gray-800 mr-3">Order #{order.id}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Placed on {order.date}</p>
                </div>
                <div className="mt-3 md:mt-0">
                  <span className="font-semibold text-gray-800">Total: ₹{order.total}</span>
                </div>
              </div>
              
              <div className="p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Items</h4>
                <ul className="divide-y divide-gray-200">
                  {order.items.map((item) => (
                    <li key={item.id} className="py-3 flex justify-between">
                      <div>
                        <span className="text-gray-800">{item.name}</span>
                        <span className="text-gray-500 text-sm ml-2">x{item.quantity}</span>
                      </div>
                      <div className="text-gray-800">₹{item.price * item.quantity}</div>
                    </li>
                  ))}
                </ul>
                
                <div className="flex justify-end mt-4 gap-3">
                  <button className="text-blue-600 hover:text-blue-800 text-sm">
                    View Details
                  </button>
                  <button className="text-green-600 hover:text-green-800 text-sm">
                    Reorder
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Profile tab
  const ProfileTab = () => (
    <div className="animate-fadeIn">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Profile</h2>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1">
            <div className="aspect-square bg-blue-100 rounded-xl flex items-center justify-center text-6xl">
              👤
            </div>
          </div>
          
          <div className="md:col-span-2">
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-500 mb-1">Full Name</label>
                <p className="text-lg font-medium text-gray-800">{profile?.full_name || 'Not provided'}</p>
              </div>
              
              <div>
                <label className="block text-sm text-gray-500 mb-1">Email Address</label>
                <p className="text-lg font-medium text-gray-800">{profile?.email || 'Not provided'}</p>
              </div>
              
              <div>
                <label className="block text-sm text-gray-500 mb-1">Phone Number</label>
                <p className="text-lg font-medium text-gray-800">{consumerProfile?.phone || 'Not provided'}</p>
              </div>
              
              <div>
                <label className="block text-sm text-gray-500 mb-1">Default Address</label>
                <p className="text-lg font-medium text-gray-800">{consumerProfile?.address || 'Not provided'}</p>
              </div>
              
              <div>
                <label className="block text-sm text-gray-500 mb-1">Preferences</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">Organic</span>
                  <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">Local</span>
                  <span className="bg-amber-100 text-amber-800 text-sm px-3 py-1 rounded-full">Seasonal</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors flex items-center">
                <span className="mr-2">✏️</span> Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
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
              👤
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{profile?.full_name || 'Consumer'}</h1>
              <p className="text-gray-600">{profile?.email}</p>
              <div className="flex items-center mt-1 text-blue-700">
                <span className="text-sm">Welcome to KrishiSagar Marketplace</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => setActiveTab('cart')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center shadow-sm relative"
            >
              <span className="mr-2">🛒</span> Your Cart
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cart.length}
                </span>
              )}
            </button>
            <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors flex items-center shadow-sm">
              <span className="mr-2">❤️</span> Saved Items
            </button>
            <button 
              onClick={() => setActiveTab('orders')}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors flex items-center shadow-sm"
            >
              <span className="mr-2">📦</span> Your Orders
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
      
      {/* Main Dashboard Navigation */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md overflow-hidden sticky top-24">
            <div className="bg-blue-700 text-white p-4">
              <h2 className="font-bold text-lg">Marketplace</h2>
            </div>
            <nav className="p-3">
              <button 
                onClick={() => setActiveTab('shop')}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center ${activeTab === 'shop' 
                  ? 'bg-blue-100 text-blue-800 font-medium shadow-sm' 
                  : 'hover:bg-gray-100 text-gray-700'} transition-colors mb-2`}
              >
                <span className="mr-3 text-xl">🛍️</span> Shop Products
              </button>
              <button 
                onClick={() => setActiveTab('cart')}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center ${activeTab === 'cart' 
                  ? 'bg-blue-100 text-blue-800 font-medium shadow-sm' 
                  : 'hover:bg-gray-100 text-gray-700'} transition-colors mb-2`}
              >
                <span className="mr-3 text-xl">🛒</span> Shopping Cart
                {cart.length > 0 && (
                  <span className="ml-auto text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full">
                    {cart.length}
                  </span>
                )}
              </button>
              <button 
                onClick={() => setActiveTab('orders')}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center ${activeTab === 'orders' 
                  ? 'bg-blue-100 text-blue-800 font-medium shadow-sm' 
                  : 'hover:bg-gray-100 text-gray-700'} transition-colors mb-2`}
              >
                <span className="mr-3 text-xl">📦</span> Order History
              </button>
              <button 
                onClick={() => setActiveTab('saved')}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center ${activeTab === 'saved' 
                  ? 'bg-blue-100 text-blue-800 font-medium shadow-sm' 
                  : 'hover:bg-gray-100 text-gray-700'} transition-colors mb-2`}
              >
                <span className="mr-3 text-xl">❤️</span> Saved Items
              </button>
              <button 
                onClick={() => setActiveTab('farmers')}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center ${activeTab === 'farmers' 
                  ? 'bg-blue-100 text-blue-800 font-medium shadow-sm' 
                  : 'hover:bg-gray-100 text-gray-700'} transition-colors mb-2`}
              >
                <span className="mr-3 text-xl">🧑‍🌾</span> Farmers Near You
              </button>
              <button 
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center ${activeTab === 'profile' 
                  ? 'bg-blue-100 text-blue-800 font-medium shadow-sm' 
                  : 'hover:bg-gray-100 text-gray-700'} transition-colors mb-2`}
              >
                <span className="mr-3 text-xl">👤</span> Your Profile
              </button>
            </nav>
          </div>
          
          {/* Farmer Support Banner */}
          <div className="bg-green-50 rounded-xl shadow-sm p-4 mt-4 border border-green-100">
            <h3 className="font-medium text-green-800 flex items-center">
              <span className="mr-2">💚</span> Support Local Farmers
            </h3>
            <p className="text-sm text-green-700 mt-2">
              Your direct purchases help local farmers earn a fair income and maintain sustainable farming practices.
            </p>
            <button className="mt-3 text-sm text-green-700 flex items-center">
              Learn more about our impact
              <svg className="h-4 w-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-lg p-6">
            {activeTab === 'shop' && <ShopTab />}
            {activeTab === 'cart' && <CartTab />}
            {activeTab === 'orders' && <OrderHistoryTab />}
            {activeTab === 'profile' && <ProfileTab />}
            
            {activeTab === 'saved' && (
              <div className="bg-white rounded-xl p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Saved Items</h2>
                <div className="p-8 rounded-lg text-center text-gray-500 bg-gray-50 border border-gray-200">
                  <p>Saved items will be displayed here.</p>
                </div>
              </div>
            )}
            
            {activeTab === 'farmers' && (
              <div className="bg-white rounded-xl p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Farmers Near You</h2>
                <div className="p-8 rounded-lg text-center text-gray-500 bg-gray-50 border border-gray-200">
                  <p>Nearby farmers will be displayed here.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <DashboardLayout
      userType="consumer"
      userName={profile?.full_name}
      loading={loading}
    >
      {renderMainContent()}
    </DashboardLayout>
  );
} 