"use client";

import React, { useState } from 'react';
import Image from 'next/image';

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  seller: {
    id: string;
    name: string;
    location: string;
    type: string;
  };
  discountPercent?: number;
};

interface ShoppingCartProps {
  items: CartItem[];
  onUpdateQuantity: (itemId: string, newQuantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onCheckout: () => void;
  onContinueShopping: () => void;
  deliveryFee?: number;
  tax?: number;
}

export default function ShoppingCart({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  onContinueShopping,
  deliveryFee = 45,
  tax = 5,
}: ShoppingCartProps) {
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  
  // Calculate subtotal
  const subtotal = items.reduce((sum, item) => {
    const itemPrice = item.discountPercent
      ? item.price * (1 - item.discountPercent / 100)
      : item.price;
    return sum + itemPrice * item.quantity;
  }, 0);
  
  // Calculate discount total
  const itemDiscountTotal = items.reduce((sum, item) => {
    if (!item.discountPercent) return sum;
    const discount = item.price * (item.discountPercent / 100) * item.quantity;
    return sum + discount;
  }, 0);
  
  // Apply coupon
  const handleApplyCoupon = () => {
    // In a real app, you would validate the coupon code
    // This is just a demo implementation
    if (couponCode.toUpperCase() === 'KRISHI10' && !couponApplied) {
      setCouponDiscount(Math.round(subtotal * 0.1)); // 10% discount
      setCouponApplied(true);
    }
  };
  
  // Calculate final amounts
  const taxAmount = Math.round(subtotal * (tax / 100));
  const totalAmount = subtotal + deliveryFee + taxAmount - couponDiscount;
  
  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Shopping Cart</h2>
        <span className="text-gray-600">{items.length} item{items.length !== 1 ? 's' : ''}</span>
      </div>
      
      {items.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="text-gray-400 text-6xl mb-4">🛒</div>
          <h3 className="text-xl font-medium text-gray-700 mb-2">Your cart is empty</h3>
          <p className="text-gray-500 mb-5">Add some items to your cart and they will appear here</p>
          <button
            onClick={onContinueShopping}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors inline-flex items-center"
          >
            <span className="mr-2">🛍️</span> Browse Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {items.map((item) => {
                  const itemPrice = item.discountPercent
                    ? item.price * (1 - item.discountPercent / 100)
                    : item.price;
                  const itemTotal = itemPrice * item.quantity;
                  
                  return (
                    <li key={item.id} className="p-4">
                      <div className="flex items-start space-x-4">
                        <div className="relative h-20 w-20 flex-shrink-0 rounded-md bg-gray-200 overflow-hidden">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              style={{ objectFit: 'cover' }}
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-2xl">
                              🌾
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-grow">
                          <h3 className="font-medium text-gray-800">{item.name}</h3>
                          <p className="text-sm text-gray-500">Sold by: {item.seller.name}</p>
                          
                          <div className="mt-1 flex items-center">
                            {item.discountPercent ? (
                              <>
                                <span className="font-bold text-gray-900">₹{itemPrice.toFixed(2)}</span>
                                <span className="text-xs text-gray-500 line-through ml-2">
                                  ₹{item.price.toFixed(2)}
                                </span>
                                <span className="text-xs bg-red-100 text-red-800 px-1.5 py-0.5 rounded ml-2">
                                  {item.discountPercent}% OFF
                                </span>
                              </>
                            ) : (
                              <span className="font-bold text-gray-900">₹{item.price.toFixed(2)}</span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex-shrink-0 flex flex-col items-end">
                          <div className="flex items-center border rounded-md mb-3">
                            <button
                              onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                            >
                              −
                            </button>
                            <span className="px-3 py-1 text-gray-800">{item.quantity}</span>
                            <button
                              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                              className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                            >
                              +
                            </button>
                          </div>
                          
                          <div className="flex items-center">
                            <span className="font-semibold text-gray-900 mr-3">
                              ₹{itemTotal.toFixed(2)}
                            </span>
                            <button
                              onClick={() => onRemoveItem(item.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
              
              <div className="p-4 bg-gray-50 flex items-center justify-between">
                <button
                  onClick={onContinueShopping}
                  className="text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <span className="mr-1">←</span> Continue Shopping
                </button>
                <span className="text-gray-600">
                  Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items): 
                  <span className="font-bold text-gray-800 ml-2">₹{subtotal.toFixed(2)}</span>
                </span>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-5">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h3>
              
              <div className="space-y-3 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-800">₹{subtotal.toFixed(2)}</span>
                </div>
                
                {itemDiscountTotal > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Product Discount</span>
                    <span className="text-green-600">-₹{itemDiscountTotal.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="text-gray-800">₹{deliveryFee.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax ({tax}%)</span>
                  <span className="text-gray-800">₹{taxAmount.toFixed(2)}</span>
                </div>
                
                {couponApplied && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Coupon Discount</span>
                    <span className="text-green-600">-₹{couponDiscount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex justify-between font-semibold">
                    <span className="text-gray-800">Total</span>
                    <span className="text-gray-800">₹{totalAmount.toFixed(2)}</span>
                  </div>
                  {(itemDiscountTotal > 0 || couponDiscount > 0) && (
                    <p className="text-xs text-green-600 mt-1 text-right">
                      You saved: ₹{(itemDiscountTotal + couponDiscount).toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Coupon Code */}
              <div className="mt-4 mb-5">
                <label htmlFor="coupon" className="block text-sm text-gray-600 mb-1">
                  Apply Coupon Code
                </label>
                <div className="flex">
                  <input
                    type="text"
                    id="coupon"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={couponApplied}
                    className="flex-grow px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={couponApplied || !couponCode}
                    className={`px-3 py-2 text-white rounded-r-md ${
                      couponApplied
                        ? 'bg-gray-500'
                        : !couponCode
                          ? 'bg-gray-400'
                          : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    Apply
                  </button>
                </div>
                {couponApplied && (
                  <p className="text-xs text-green-600 mt-1">
                    Coupon "KRISHI10" applied: 10% off
                  </p>
                )}
              </div>
              
              <button
                onClick={onCheckout}
                className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-md transition-colors flex items-center justify-center font-medium"
              >
                Proceed to Checkout
              </button>
              
              <div className="mt-4 text-xs text-gray-500 flex items-center justify-center">
                <span className="mr-1">🔒</span> Secure checkout with end-to-end encryption
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mt-4">
              <h4 className="text-blue-800 font-medium mb-2 flex items-center">
                <span className="mr-2">ℹ️</span> Direct from Farmers
              </h4>
              <p className="text-sm text-blue-700">
                Most products in your cart come directly from local farmers. By purchasing, you're supporting sustainable agriculture and local communities.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 