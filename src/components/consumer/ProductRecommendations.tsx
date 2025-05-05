"use client";

import React, { useState } from 'react';
import Image from 'next/image';

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  seller: {
    id: string;
    name: string;
    location: string;
    type: string;
  };
  category: string;
  isOrganic: boolean;
  rating?: number;
  discountPercent?: number;
};

interface ProductRecommendationsProps {
  products: Product[];
  title?: string;
  description?: string;
  onAddToCart?: (product: Product) => void;
  onViewDetails?: (product: Product) => void;
}

export default function ProductRecommendations({
  products,
  title = "Recommended For You",
  description = "Based on your preferences and previous purchases",
  onAddToCart,
  onViewDetails,
}: ProductRecommendationsProps) {
  const [activeFilter, setActiveFilter] = useState('all');
  
  // Filter products
  const filteredProducts = activeFilter === 'all' 
    ? products 
    : activeFilter === 'organic' 
      ? products.filter(p => p.isOrganic)
      : products.filter(p => p.category === activeFilter);
  
  // Get unique categories
  const categories = ['all', 'organic', ...new Set(products.map(p => p.category))];
  
  return (
    <div className="animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <p className="text-gray-600">{description}</p>
        </div>
        
        <div className="flex gap-2 mt-3 md:mt-0 overflow-x-auto pb-1 max-w-full">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`px-3 py-1.5 text-sm rounded-full whitespace-nowrap ${
                activeFilter === category
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              } transition-colors`}
            >
              {category === 'all' 
                ? 'All Products' 
                : category === 'organic'
                  ? '🌱 Organic'
                  : category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-medium text-gray-700 mb-2">No products found</h3>
          <p className="text-gray-500">Try selecting a different category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div 
              key={product.id} 
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow border border-gray-100"
            >
              <div className="relative h-48 bg-gray-200">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-4xl">
                    🌾
                  </div>
                )}
                {product.isOrganic && (
                  <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    Organic
                  </div>
                )}
                {product.discountPercent && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {product.discountPercent}% OFF
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-gray-800 line-clamp-1">{product.name}</h3>
                  {product.rating && (
                    <div className="flex items-center text-amber-500 text-sm">
                      <span>⭐</span>
                      <span className="ml-1">{product.rating}</span>
                    </div>
                  )}
                </div>
                
                <p className="text-gray-600 text-sm mt-1 line-clamp-2">{product.description}</p>
                
                <div className="mt-2 flex items-center">
                  <p className="font-bold text-gray-900">₹{product.price}</p>
                  {product.discountPercent && (
                    <p className="text-xs text-gray-500 line-through ml-2">
                      ₹{Math.round(product.price / (1 - product.discountPercent / 100))}
                    </p>
                  )}
                </div>
                
                <div className="mt-1 text-xs text-gray-500">
                  by {product.seller.name} • {product.seller.location}
                </div>
                
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => onAddToCart && onAddToCart(product)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm transition-colors"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => onViewDetails && onViewDetails(product)}
                    className="px-3 py-2 border border-gray-300 hover:bg-gray-100 text-gray-800 rounded-md text-sm transition-colors"
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 