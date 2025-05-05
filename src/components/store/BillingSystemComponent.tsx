"use client";

import React, { useState, useEffect } from 'react';
import { createClient, searchFarmers, getFarmerProfile, createBill, getProductsForStoreOwner } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

// Types
interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  gst_rate: number;
  hsn_code: string;
  unit: string;
  stock: number;
}

interface Farmer {
  id: string;
  name: string;
  mobile: string;
  farm_location: string;
  address?: string;
}

interface BillItem {
  product_id: string;
  product_name: string;
  hsn_code: string;
  quantity: number;
  unit: string;
  price: number;
  gst_rate: number;
  gst_amount: number;
  total: number;
}

interface Bill {
  id?: string;
  bill_number: string;
  bill_date: string;
  farmer_id: string | null;
  farmer_name: string;
  farmer_mobile: string;
  items: BillItem[];
  subtotal: number;
  gst_total: number;
  grand_total: number;
  payment_method: string;
  notes: string;
  store_owner_id: string;
}

// Example products (to be replaced with database data)
const dummyProducts: Product[] = [
  { id: '1', name: 'Organic Fertilizer', category: 'fertilizers', price: 450, gst_rate: 5, hsn_code: '31010000', unit: 'kg', stock: 50 },
  { id: '2', name: 'NPK 10:26:26', category: 'fertilizers', price: 580, gst_rate: 5, hsn_code: '31052000', unit: 'kg', stock: 40 },
  { id: '3', name: 'Neem Oil', category: 'pesticides', price: 350, gst_rate: 12, hsn_code: '38089400', unit: 'liter', stock: 30 },
  { id: '4', name: 'Rice Seeds (IR-36)', category: 'seeds', price: 120, gst_rate: 5, hsn_code: '12079100', unit: 'kg', stock: 100 },
  { id: '5', name: 'Soil Testing Kit', category: 'equipment', price: 800, gst_rate: 18, hsn_code: '90278010', unit: 'piece', stock: 15 },
];

export default function BillingSystemComponent({ storeOwnerId, storeName }: { storeOwnerId: string, storeName: string }) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  
  const [farmerSearch, setFarmerSearch] = useState('');
  const [farmerSearchResults, setFarmerSearchResults] = useState<Farmer[]>([]);
  const [showFarmerSearch, setShowFarmerSearch] = useState(false);
  
  const [currentBill, setCurrentBill] = useState<Bill>({
    bill_number: generateBillNumber(),
    bill_date: new Date().toISOString().split('T')[0],
    farmer_id: null,
    farmer_name: '',
    farmer_mobile: '',
    items: [],
    subtotal: 0,
    gst_total: 0,
    grand_total: 0,
    payment_method: 'cash',
    notes: '',
    store_owner_id: storeOwnerId
  });
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [billSaved, setBillSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Load products from database
  useEffect(() => {
    async function loadProducts() {
      try {
        const productData = await getProductsForStoreOwner();
        if (productData && productData.length > 0) {
          // Transform the data to match our Product interface
          const formattedProducts = productData.map((p: any) => ({
            id: p.id,
            name: p.name,
            category: p.product_categories?.name || 'Uncategorized',
            price: p.price,
            gst_rate: p.gst_rate,
            hsn_code: p.hsn_code || '',
            unit: p.unit,
            stock: 0 // Will be updated from inventory if available
          }));
          setProducts(formattedProducts);
        } else {
          // If no products, use dummy data for testing
          setProducts(dummyProducts);
        }
      } catch (error) {
        console.error('Error loading products:', error);
        // Fallback to dummy data
        setProducts(dummyProducts);
      }
    }
    
    loadProducts();
  }, []);
  
  // Filter products based on search term
  useEffect(() => {
    const filtered = products.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);
  
  // Generate a bill number (could be more sophisticated in production)
  function generateBillNumber() {
    const date = new Date();
    const year = date.getFullYear().toString().slice(2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `INV-${year}${month}${day}-${random}`;
  }
  
  // Search for farmers in the database using the client function
  const handleFarmerSearch = async (searchQuery: string) => {
    if (searchQuery.length < 3) {
      setFarmerSearchResults([]);
      return;
    }
    
    try {
      const farmers = await searchFarmers(searchQuery);
      
      if (farmers && farmers.length > 0) {
        // Transform and enrich with profile data
        const farmerProfiles = await Promise.all(
          farmers.map(async (user: any) => {
            const profile = await getFarmerProfile(user.id);
            
            return {
              id: user.id,
              name: user.name || 'Unknown',
              mobile: user.mobile || 'N/A',
              farm_location: profile?.farm_location || 'Not specified',
              address: profile?.address
            };
          })
        );
        
        setFarmerSearchResults(farmerProfiles);
      } else {
        setFarmerSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching farmers:', error);
      setFarmerSearchResults([]);
    }
  };
  
  // Select a farmer for the bill
  const selectFarmer = (farmer: Farmer) => {
    setCurrentBill({
      ...currentBill,
      farmer_id: farmer.id,
      farmer_name: farmer.name,
      farmer_mobile: farmer.mobile || ''
    });
    setShowFarmerSearch(false);
  };
  
  // Add item to bill
  const addItemToBill = () => {
    if (!selectedProduct) return;
    
    if (quantity <= 0) {
      setError('Quantity must be greater than zero');
      return;
    }
    
    const price = selectedProduct.price;
    const gstRate = selectedProduct.gst_rate;
    const gstAmount = (price * quantity * gstRate) / 100;
    const totalPrice = price * quantity + gstAmount;
    
    const newItem: BillItem = {
      product_id: selectedProduct.id,
      product_name: selectedProduct.name,
      hsn_code: selectedProduct.hsn_code,
      quantity: quantity,
      unit: selectedProduct.unit,
      price: price,
      gst_rate: gstRate,
      gst_amount: gstAmount,
      total: totalPrice
    };
    
    const updatedItems = [...currentBill.items, newItem];
    
    // Calculate new totals
    const newSubtotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const newGstTotal = updatedItems.reduce((sum, item) => sum + item.gst_amount, 0);
    const newGrandTotal = newSubtotal + newGstTotal;
    
    setCurrentBill({
      ...currentBill,
      items: updatedItems,
      subtotal: newSubtotal,
      gst_total: newGstTotal,
      grand_total: newGrandTotal
    });
    
    // Reset selection
    setSelectedProduct(null);
    setQuantity(1);
    setSearchTerm('');
  };
  
  // Remove item from bill
  const removeItem = (index: number) => {
    const updatedItems = [...currentBill.items];
    updatedItems.splice(index, 1);
    
    // Recalculate totals
    const newSubtotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const newGstTotal = updatedItems.reduce((sum, item) => sum + item.gst_amount, 0);
    const newGrandTotal = newSubtotal + newGstTotal;
    
    setCurrentBill({
      ...currentBill,
      items: updatedItems,
      subtotal: newSubtotal,
      gst_total: newGstTotal,
      grand_total: newGrandTotal
    });
  };
  
  // Save bill to database using the client function
  const saveBill = async () => {
    if (currentBill.items.length === 0) {
      setError('Cannot save an empty bill. Please add at least one product.');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const billData = {
        bill_number: currentBill.bill_number,
        bill_date: currentBill.bill_date,
        farmer_id: currentBill.farmer_id,
        farmer_name: currentBill.farmer_name,
        farmer_mobile: currentBill.farmer_mobile,
        subtotal: currentBill.subtotal,
        gst_total: currentBill.gst_total,
        grand_total: currentBill.grand_total,
        payment_method: currentBill.payment_method,
        notes: currentBill.notes,
        store_owner_id: storeOwnerId,
        items: currentBill.items
      };
      
      const savedBill = await createBill(billData);
      
      // Success!
      setBillSaved(true);
      setSuccess('Bill saved successfully! Bill Number: ' + currentBill.bill_number);
      
      // Reset form for new bill
      setTimeout(() => {
        setCurrentBill({
          bill_number: generateBillNumber(),
          bill_date: new Date().toISOString().split('T')[0],
          farmer_id: null,
          farmer_name: '',
          farmer_mobile: '',
          items: [],
          subtotal: 0,
          gst_total: 0,
          grand_total: 0,
          payment_method: 'cash',
          notes: '',
          store_owner_id: storeOwnerId
        });
        setBillSaved(false);
        setSuccess(null);
      }, 3000);
    } catch (error: any) {
      console.error('Error saving bill:', error);
      setError(error.message || 'Failed to save bill. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Print bill
  const printBill = () => {
    window.print();
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md animate-fadeIn">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800">Billing System</h2>
        <p className="text-gray-600">Create GST-compliant invoices for your customers</p>
      </div>
      
      {/* Error/Success Messages */}
      {error && (
        <div className="mx-6 mt-4 p-3 bg-red-100 text-red-700 rounded-md flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}
      
      {success && (
        <div className="mx-6 mt-4 p-3 bg-green-100 text-green-700 rounded-md flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {success}
        </div>
      )}
      
      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bill Information */}
        <div className="lg:col-span-2">
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1">
                <label htmlFor="bill_number" className="block text-sm font-medium text-gray-700 mb-1">Bill Number</label>
                <input
                  type="text"
                  id="bill_number"
                  value={currentBill.bill_number}
                  onChange={(e) => setCurrentBill({...currentBill, bill_number: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  readOnly
                />
              </div>
              <div className="flex-1">
                <label htmlFor="bill_date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  id="bill_date"
                  value={currentBill.bill_date}
                  onChange={(e) => setCurrentBill({...currentBill, bill_date: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            
            <div className="relative mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer (Farmer)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={currentBill.farmer_name ? `${currentBill.farmer_name} (${currentBill.farmer_mobile})` : ''}
                  placeholder="Search for a farmer..."
                  onClick={() => setShowFarmerSearch(true)}
                  className="w-full p-2 border border-gray-300 rounded-md cursor-pointer"
                  readOnly
                />
                <button 
                  onClick={() => setShowFarmerSearch(true)}
                  className="bg-amber-600 text-white p-2 rounded-md"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              
              {showFarmerSearch && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                  <div className="p-2 border-b border-gray-200">
                    <input
                      type="text"
                      value={farmerSearch}
                      onChange={(e) => {
                        setFarmerSearch(e.target.value);
                        handleFarmerSearch(e.target.value);
                      }}
                      placeholder="Search by name, email or mobile"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      autoFocus
                    />
                  </div>
                  
                  <div className="max-h-60 overflow-y-auto">
                    {farmerSearchResults.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        {farmerSearch.length < 3 ? 'Type at least 3 characters to search' : 'No farmers found'}
                      </div>
                    ) : (
                      <div>
                        {farmerSearchResults.map(farmer => (
                          <div 
                            key={farmer.id} 
                            className="p-2 hover:bg-gray-100 cursor-pointer flex justify-between"
                            onClick={() => selectFarmer(farmer)}
                          >
                            <div>
                              <div className="font-medium">{farmer.name}</div>
                              <div className="text-sm text-gray-600">{farmer.mobile}</div>
                            </div>
                            <div className="text-sm text-gray-600">{farmer.farm_location}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="p-2 border-t border-gray-200 flex justify-between">
                    <button 
                      onClick={() => {
                        setCurrentBill({
                          ...currentBill,
                          farmer_id: null,
                          farmer_name: '',
                          farmer_mobile: ''
                        });
                        setShowFarmerSearch(false);
                      }}
                      className="text-gray-600 text-sm hover:underline"
                    >
                      Clear Selection
                    </button>
                    <button 
                      onClick={() => setShowFarmerSearch(false)}
                      className="text-amber-600 text-sm hover:underline"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Product Search & Add */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-medium text-gray-800 mb-3">Add Products</h3>
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-grow relative">
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                {searchTerm && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                    {filteredProducts.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">No products found</div>
                    ) : (
                      filteredProducts.map(product => (
                        <div 
                          key={product.id} 
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            setSelectedProduct(product);
                            setSearchTerm('');
                          }}
                        >
                          <div className="font-medium">{product.name}</div>
                          <div className="flex justify-between text-sm">
                            <span>₹{product.price}/{product.unit}</span>
                            <span>GST: {product.gst_rate}%</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
              
              {selectedProduct && (
                <>
                  <div className="flex-shrink-0 w-20">
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                    <input
                      type="number"
                      id="quantity"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div className="flex items-end">
                    <button
                      onClick={addItemToBill}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </>
              )}
            </div>
            
            {selectedProduct && (
              <div className="bg-blue-50 p-3 rounded-md text-sm">
                <p className="font-medium">{selectedProduct.name}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-1">
                  <div>Price: ₹{selectedProduct.price}/{selectedProduct.unit}</div>
                  <div>GST: {selectedProduct.gst_rate}%</div>
                  <div>HSN: {selectedProduct.hsn_code}</div>
                  <div>Stock: {selectedProduct.stock} {selectedProduct.unit}</div>
                </div>
              </div>
            )}
          </div>
          
          {/* Bill Items */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-800 mb-3">Bill Items</h3>
            
            {currentBill.items.length === 0 ? (
              <div className="bg-gray-50 p-6 rounded-lg text-center text-gray-500">
                No items added yet. Search for products above to add them to the bill.
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                        <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                        <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">GST</th>
                        <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentBill.items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            <div className="font-medium">{item.product_name}</div>
                            <div className="text-xs text-gray-500">HSN: {item.hsn_code}</div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 text-right">{item.quantity} {item.unit}</td>
                          <td className="px-4 py-3 text-sm text-gray-900 text-right">₹{item.price.toFixed(2)}</td>
                          <td className="px-4 py-3 text-sm text-gray-900 text-right">
                            <div>₹{item.gst_amount.toFixed(2)}</div>
                            <div className="text-xs text-gray-500">({item.gst_rate}%)</div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 text-right font-medium">₹{item.total.toFixed(2)}</td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => removeItem(index)}
                              className="text-red-600 hover:text-red-900"
                              title="Remove item"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Bill Summary & Actions */}
        <div>
          <div className="bg-gray-50 p-4 rounded-lg mb-6 sticky top-4">
            <h3 className="font-medium text-gray-800 mb-4">Bill Summary</h3>
            
            <div className="space-y-3 border-b border-gray-200 pb-4 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">₹{currentBill.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">GST Total:</span>
                <span className="font-medium">₹{currentBill.gst_total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg">
                <span className="font-medium text-gray-700">Grand Total:</span>
                <span className="font-bold text-amber-700">₹{currentBill.grand_total.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="payment_method" className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                <select
                  id="payment_method"
                  value={currentBill.payment_method}
                  onChange={(e) => setCurrentBill({...currentBill, payment_method: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="cash">Cash</option>
                  <option value="upi">UPI</option>
                  <option value="card">Card</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="credit">Credit (Pay Later)</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  id="notes"
                  value={currentBill.notes}
                  onChange={(e) => setCurrentBill({...currentBill, notes: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows={3}
                  placeholder="Add any notes or special instructions"
                ></textarea>
              </div>
            </div>
            
            <div className="mt-6 space-y-3">
              <button
                onClick={saveBill}
                disabled={isSubmitting || billSaved || currentBill.items.length === 0}
                className={`w-full py-3 rounded-md shadow-sm font-medium ${
                  isSubmitting || billSaved || currentBill.items.length === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-amber-600 hover:bg-amber-700 text-white'
                }`}
              >
                {isSubmitting ? 'Saving...' : billSaved ? 'Saved!' : 'Save Bill'}
              </button>
              
              <button
                onClick={printBill}
                disabled={currentBill.items.length === 0}
                className={`w-full py-3 rounded-md shadow-sm font-medium ${
                  currentBill.items.length === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-white border border-amber-600 text-amber-600 hover:bg-amber-50'
                }`}
              >
                Print Bill
              </button>
              
              <button
                onClick={() => {
                  setCurrentBill({
                    bill_number: generateBillNumber(),
                    bill_date: new Date().toISOString().split('T')[0],
                    farmer_id: null,
                    farmer_name: '',
                    farmer_mobile: '',
                    items: [],
                    subtotal: 0,
                    gst_total: 0,
                    grand_total: 0,
                    payment_method: 'cash',
                    notes: '',
                    store_owner_id: storeOwnerId
                  });
                  setSelectedProduct(null);
                  setQuantity(1);
                  setSearchTerm('');
                  setBillSaved(false);
                  setError(null);
                  setSuccess(null);
                }}
                className="w-full py-3 rounded-md shadow-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200"
              >
                Reset Bill
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 