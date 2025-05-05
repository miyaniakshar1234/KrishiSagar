"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';

interface Seller {
  id: string;
  name: string;
  location: string;
  type: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  unit: string;
  image?: string;
  seller: Seller;
  category: string;
  isOrganic?: boolean;
  rating?: number;
}

const MarketplaceComponent = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [cartItems, setCartItems] = useState<(Product & { cartQuantity: number })[]>([]);
  
  // Dummy data for development
  const dummyProducts: Product[] = [
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
    {
      id: '5',
      name: 'Wheat Seeds (Premium)',
      price: 160,
      quantity: 30,
      unit: 'kg',
      seller: {
        id: '105',
        name: 'Seed Express',
        location: 'Jamnagar',
        type: 'store_owner'
      },
      category: 'seeds',
      isOrganic: true,
      rating: 4.7
    },
    {
      id: '6',
      name: 'Soil Testing Kit',
      price: 850,
      quantity: 1,
      unit: 'kit',
      seller: {
        id: '106',
        name: 'AgriTech Solutions',
        location: 'Gandhinagar',
        type: 'store_owner'
      },
      category: 'equipment',
      isOrganic: false,
      rating: 4.6
    }
  ];
  
  useEffect(() => {
    // Simulate fetching products from API
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // In a real app, we would fetch products from Supabase
        // const supabase = createClient();
        // const { data, error } = await supabase.from('products').select('*');
        
        // For now, use dummy data
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
        
        setProducts(dummyProducts);
        setFilteredProducts(dummyProducts);
        
        // Extract unique categories
        const uniqueCategories = Array.from(new Set(dummyProducts.map(product => product.category)));
        setCategories(uniqueCategories);
        
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, []);
  
  // Filter products based on category and search term
  useEffect(() => {
    let filtered = [...products];
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    
    // Apply search filter
    if (searchTerm.trim() !== '') {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        product => 
          product.name.toLowerCase().includes(search) || 
          product.seller.name.toLowerCase().includes(search) ||
          product.category.toLowerCase().includes(search)
      );
    }
    
    setFilteredProducts(filtered);
  }, [selectedCategory, searchTerm, products]);
  
  // Add to cart
  const addToCart = (product: Product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        return prevItems.map(item => 
          item.id === product.id 
            ? { ...item, cartQuantity: item.cartQuantity + 1 } 
            : item
        );
      } else {
        return [...prevItems, { ...product, cartQuantity: 1 }];
      }
    });
  };
  
  // Remove from cart
  const removeFromCart = (productId: string) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === productId);
      
      if (existingItem && existingItem.cartQuantity > 1) {
        return prevItems.map(item => 
          item.id === productId 
            ? { ...item, cartQuantity: item.cartQuantity - 1 } 
            : item
        );
      } else {
        return prevItems.filter(item => item.id !== productId);
      }
    });
  };
  
  // Calculate total cart value
  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.cartQuantity), 0);
  
  // Render star ratings
  const renderRating = (rating: number = 0) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    return (
      <div className="flex">
        {[...Array(fullStars)].map((_, i) => (
          <span key={`full-${i}`} className="text-yellow-400">★</span>
        ))}
        {halfStar && <span className="text-yellow-400">★</span>}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={`empty-${i}`} className="text-gray-300">★</span>
        ))}
      </div>
    );
  };
  
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-4">
              <div className="w-full h-40 bg-gray-200 rounded-lg mb-3"></div>
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center p-8 text-red-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-medium mb-2">Error Loading Marketplace</h3>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-100 pb-3">
        Marketplace
      </h2>
      
      {/* Search and Filter Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-grow">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products, sellers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
          
          <button className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            Filters
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Product Listings */}
        <div className="md:col-span-2">
          {filteredProducts.length === 0 ? (
            <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17l-5-5 5-5m10 10l-5-5 5-5" />
              </svg>
              <h3 className="text-lg font-medium text-gray-600 mb-2">No Products Found</h3>
              <p className="text-gray-500">Try changing your filters or search terms</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredProducts.map(product => (
                <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-40 bg-gray-100 relative">
                    {product.image ? (
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    
                    {product.isOrganic && (
                      <div className="absolute top-2 left-2 bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
                        Organic
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-1">{product.name}</h3>
                    <div className="flex justify-between items-baseline mb-2">
                      <p className="text-green-700 font-bold">₹{product.price} <span className="text-xs text-gray-500 font-normal">per {product.unit}</span></p>
                      <div className="text-xs text-gray-500">Stock: {product.quantity}</div>
                    </div>
                    
                    <div className="flex justify-between items-center mb-3">
                      <div className="text-xs text-gray-600">{product.seller.name}, {product.seller.location}</div>
                      <div className="flex items-center">
                        {product.rating && <div className="text-xs">{renderRating(product.rating)}</div>}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => addToCart(product)}
                      className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Shopping Cart */}
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 h-fit">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Shopping Cart
          </h3>
          
          {cartItems.length === 0 ? (
            <div className="text-center py-6">
              <div className="text-gray-400 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <p className="text-gray-500 text-sm">Your cart is empty</p>
              <p className="text-gray-500 text-xs mt-1">Add items to get started</p>
            </div>
          ) : (
            <>
              <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
                {cartItems.map(item => (
                  <div key={item.id} className="flex items-center justify-between bg-white p-2 rounded border border-gray-200">
                    <div className="flex items-center">
                      <div className="ml-2">
                        <p className="text-sm font-medium text-gray-800">{item.name}</p>
                        <p className="text-xs text-gray-500">₹{item.price} × {item.cartQuantity}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium mr-2">₹{item.price * item.cartQuantity}</span>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">₹{cartTotal}</span>
                </div>
                <div className="flex justify-between mb-4">
                  <span className="text-gray-600">Estimated Tax:</span>
                  <span className="font-medium">₹{Math.round(cartTotal * 0.05)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg mb-4">
                  <span>Total:</span>
                  <span className="text-green-700">₹{cartTotal + Math.round(cartTotal * 0.05)}</span>
                </div>
                <button className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  Proceed to Checkout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketplaceComponent; 