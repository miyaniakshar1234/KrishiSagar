"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Farmer {
  id: string;
  name: string;
  mobile: string;
}

interface SaleItem {
  id?: string;
  crop_name: string;
  quantity: number;
  unit: string;
  price_per_unit: number;
  total_amount: number;
  grade?: string;
}

interface Sale {
  id?: string;
  transaction_number: string;
  transaction_date: string;
  farmer_id: string;
  farmer_name: string;
  items: SaleItem[];
  subtotal: number;
  commission_percentage: number;
  commission_amount: number;
  tax_amount: number;
  net_amount: number;
  payment_status: 'paid' | 'pending' | 'partial';
  payment_method?: string;
  notes?: string;
}

export default function SalesRecordComponent({ brokerId }: { brokerId: string }) {
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Farmer[]>([]);
  const [showFarmerSearch, setShowFarmerSearch] = useState(false);
  const [recentSales, setRecentSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingFarmers, setLoadingFarmers] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Sale form state
  const [currentSale, setCurrentSale] = useState<Sale>({
    transaction_number: generateTransactionNumber(),
    transaction_date: new Date().toISOString().split('T')[0],
    farmer_id: '',
    farmer_name: '',
    items: [],
    subtotal: 0,
    commission_percentage: 2.5, // Default commission
    commission_amount: 0,
    tax_amount: 0,
    net_amount: 0,
    payment_status: 'paid',
    payment_method: 'cash',
    notes: ''
  });
  
  // Current item being added
  const [currentItem, setCurrentItem] = useState<SaleItem>({
    crop_name: '',
    quantity: 0,
    unit: 'kg',
    price_per_unit: 0,
    total_amount: 0,
    grade: 'A'
  });
  
  // Load recent sales on component mount
  useEffect(() => {
    if (brokerId) {
      loadRecentSales();
      
      // Check if there's a selected farmer ID in localStorage
      const selectedFarmerId = typeof window !== 'undefined' ? localStorage.getItem('selectedFarmerId') : null;
      
      if (selectedFarmerId) {
        // Load the farmer details
        loadSelectedFarmer(selectedFarmerId);
        
        // Clear the localStorage item to prevent it from being used again
        localStorage.removeItem('selectedFarmerId');
      }
    }
  }, [brokerId]);
  
  // Load selected farmer details
  const loadSelectedFarmer = async (farmerId: string) => {
    try {
      setLoadingFarmers(true);
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from('users')
        .select('id, full_name, phone')
        .eq('id', farmerId)
        .single();
      
      if (error) throw error;
      
      if (data) {
        // Set the selected farmer
        selectFarmer({
          id: data.id,
          name: data.full_name || 'Unknown',
          mobile: data.phone || 'N/A'
        });
      }
    } catch (err) {
      console.error('Error loading selected farmer:', err);
    } finally {
      setLoadingFarmers(false);
    }
  };
  
  // Generate a transaction number (could be more sophisticated in production)
  function generateTransactionNumber() {
    const date = new Date();
    const year = date.getFullYear().toString().slice(2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `SALE-${year}${month}${day}-${random}`;
  }
  
  // Load recent sales for this broker
  const loadRecentSales = async () => {
    try {
      setLoading(true);
      const supabase = createClient();
      
      // Query sales with related items
      const { data, error } = await supabase
        .from('market_sales')
        .select(`
          id,
          transaction_number,
          transaction_date,
          farmer_id,
          subtotal,
          commission_percentage,
          commission_amount,
          tax_amount,
          net_amount,
          payment_status,
          payment_method,
          notes,
          users!farmer_id(full_name),
          sale_items(
            id,
            crop_name,
            quantity,
            unit,
            price_per_unit,
            total_amount,
            grade
          )
        `)
        .eq('broker_id', brokerId)
        .order('transaction_date', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      
      console.log('Recent sales data:', data); // Debug log
      
      if (data) {
        const formattedSales: Sale[] = data.map((sale: any) => ({
          id: sale.id,
          transaction_number: sale.transaction_number,
          transaction_date: sale.transaction_date,
          farmer_id: sale.farmer_id,
          farmer_name: sale.users?.full_name || 'Unknown Farmer',
          items: sale.sale_items || [],
          subtotal: sale.subtotal,
          commission_percentage: sale.commission_percentage,
          commission_amount: sale.commission_amount,
          tax_amount: sale.tax_amount,
          net_amount: sale.net_amount,
          payment_status: sale.payment_status,
          payment_method: sale.payment_method,
          notes: sale.notes
        }));
        
        setRecentSales(formattedSales);
      }
    } catch (err) {
      console.error('Error loading recent sales:', err);
      setError('Failed to load recent sales');
    } finally {
      setLoading(false);
    }
  };
  
  // Search farmers in the database
  const handleFarmerSearch = async () => {
    if (searchTerm.length < 3) return;
    
    try {
      setLoadingFarmers(true);
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from('users')
        .select(`
          id,
          full_name,
          phone
        `)
        .eq('user_type', 'farmer')
        .or(`full_name.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`)
        .limit(10);
      
      if (error) throw error;
      
      if (data) {
        const formattedFarmers: Farmer[] = data.map((farmer: any) => ({
          id: farmer.id,
          name: farmer.full_name || 'Unknown',
          mobile: farmer.phone || 'N/A'
        }));
        
        setSearchResults(formattedFarmers);
        setShowFarmerSearch(true);
      }
    } catch (err) {
      console.error('Error searching farmers:', err);
    } finally {
      setLoadingFarmers(false);
    }
  };
  
  // Select a farmer for the sale
  const selectFarmer = (farmer: Farmer) => {
    setCurrentSale({
      ...currentSale,
      farmer_id: farmer.id,
      farmer_name: farmer.name
    });
    setShowFarmerSearch(false);
  };
  
  // Update current item when quantity or price changes
  const updateCurrentItemTotal = () => {
    const total = currentItem.quantity * currentItem.price_per_unit;
    setCurrentItem({
      ...currentItem,
      total_amount: total
    });
  };
  
  // Add item to the sale
  const addItemToSale = () => {
    if (!currentItem.crop_name || currentItem.quantity <= 0 || currentItem.price_per_unit <= 0) {
      setError('Please fill all required fields for the item');
      return;
    }
    
    const newItems = [...currentSale.items, { ...currentItem }];
    
    // Calculate subtotal
    const subtotal = newItems.reduce((sum, item) => sum + item.total_amount, 0);
    
    // Calculate commission
    const commission = (subtotal * currentSale.commission_percentage) / 100;
    
    // Calculate net amount (subtotal - commission - tax)
    const net = subtotal - commission - currentSale.tax_amount;
    
    setCurrentSale({
      ...currentSale,
      items: newItems,
      subtotal,
      commission_amount: commission,
      net_amount: net
    });
    
    // Reset current item
    setCurrentItem({
      crop_name: '',
      quantity: 0,
      unit: 'kg',
      price_per_unit: 0,
      total_amount: 0,
      grade: 'A'
    });
    
    // Clear any error
    setError(null);
  };
  
  // Remove item from sale
  const removeItem = (index: number) => {
    const newItems = [...currentSale.items];
    newItems.splice(index, 1);
    
    // Recalculate financials
    const subtotal = newItems.reduce((sum, item) => sum + item.total_amount, 0);
    const commission = (subtotal * currentSale.commission_percentage) / 100;
    const net = subtotal - commission - currentSale.tax_amount;
    
    setCurrentSale({
      ...currentSale,
      items: newItems,
      subtotal,
      commission_amount: commission,
      net_amount: net
    });
  };
  
  // Update commission percentage
  const updateCommission = (percentage: number) => {
    const commission = (currentSale.subtotal * percentage) / 100;
    const net = currentSale.subtotal - commission - currentSale.tax_amount;
    
    setCurrentSale({
      ...currentSale,
      commission_percentage: percentage,
      commission_amount: commission,
      net_amount: net
    });
  };
  
  // Update tax amount
  const updateTax = (taxAmount: number) => {
    const net = currentSale.subtotal - currentSale.commission_amount - taxAmount;
    
    setCurrentSale({
      ...currentSale,
      tax_amount: taxAmount,
      net_amount: net
    });
  };
  
  // Save sale to database
  const saveSale = async () => {
    // Validate form
    if (!currentSale.farmer_id) {
      setError('Please select a farmer');
      return;
    }
    
    if (currentSale.items.length === 0) {
      setError('Please add at least one item');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      const supabase = createClient();
      
      // Insert sale
      const { data: saleData, error: saleError } = await supabase
        .from('market_sales')
        .insert({
          transaction_number: currentSale.transaction_number,
          transaction_date: currentSale.transaction_date,
          broker_id: brokerId,
          farmer_id: currentSale.farmer_id,
          subtotal: currentSale.subtotal,
          commission_percentage: currentSale.commission_percentage,
          commission_amount: currentSale.commission_amount,
          tax_amount: currentSale.tax_amount,
          net_amount: currentSale.net_amount,
          payment_status: currentSale.payment_status,
          payment_method: currentSale.payment_method,
          notes: currentSale.notes
        })
        .select('id')
        .single();
      
      if (saleError) throw saleError;
      
      if (saleData) {
        // Insert sale items
        const saleItems = currentSale.items.map(item => ({
          sale_id: saleData.id,
          crop_name: item.crop_name,
          quantity: item.quantity,
          unit: item.unit,
          price_per_unit: item.price_per_unit,
          total_amount: item.total_amount,
          grade: item.grade
        }));
        
        const { error: itemsError } = await supabase
          .from('sale_items')
          .insert(saleItems);
        
        if (itemsError) throw itemsError;
        
        // Success! Reset form and reload recent sales
        setSuccess('Sale recorded successfully');
        
        // Reset form
        setCurrentSale({
          transaction_number: generateTransactionNumber(),
          transaction_date: new Date().toISOString().split('T')[0],
          farmer_id: '',
          farmer_name: '',
          items: [],
          subtotal: 0,
          commission_percentage: 2.5,
          commission_amount: 0,
          tax_amount: 0,
          net_amount: 0,
          payment_status: 'paid',
          payment_method: 'cash',
          notes: ''
        });
        
        // Reload recent sales
        await loadRecentSales();
      }
    } catch (err) {
      console.error('Error saving sale:', err);
      setError('Failed to save sale. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Sale Form */}
      <div className="lg:w-7/12 bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Record New Sale</h2>
        
        {error && (
          <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-lg">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-6 bg-green-50 text-green-700 p-4 rounded-lg">
            {success}
          </div>
        )}
        
        {/* Basic Sale Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Transaction #
            </label>
            <input
              type="text"
              value={currentSale.transaction_number}
              onChange={(e) => setCurrentSale({...currentSale, transaction_number: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg"
              readOnly
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={currentSale.transaction_date}
              onChange={(e) => setCurrentSale({...currentSale, transaction_date: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
        </div>
        
        {/* Farmer Selection */}
        <div className="mb-6 relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Farmer
          </label>
          <div className="flex gap-2">
            <div className="flex-grow relative">
              <input
                type="text"
                value={currentSale.farmer_id ? currentSale.farmer_name : searchTerm}
                onChange={(e) => {
                  if (!currentSale.farmer_id) {
                    setSearchTerm(e.target.value);
                  }
                }}
                onFocus={() => {
                  if (!currentSale.farmer_id) {
                    setShowFarmerSearch(true);
                  }
                }}
                placeholder="Search farmer by name or phone"
                className="w-full px-4 py-2 border rounded-lg"
              />
              {currentSale.farmer_id && (
                <button
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => {
                    setCurrentSale({...currentSale, farmer_id: '', farmer_name: ''});
                    setSearchTerm('');
                  }}
                >
                  ✕
                </button>
              )}
            </div>
            
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              onClick={handleFarmerSearch}
              disabled={currentSale.farmer_id !== '' || loadingFarmers}
            >
              {loadingFarmers ? 'Searching...' : 'Search'}
            </button>
          </div>
          
          {/* Farmer search results dropdown */}
          {showFarmerSearch && searchResults.length > 0 && (
            <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-48 overflow-auto">
              {searchResults.map(farmer => (
                <div
                  key={farmer.id}
                  className="p-2 hover:bg-gray-100 cursor-pointer border-b last:border-0"
                  onClick={() => selectFarmer(farmer)}
                >
                  <div className="font-medium">{farmer.name}</div>
                  <div className="text-sm text-gray-600">{farmer.mobile}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Add Items */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Items</h3>
          
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Crop Name *
                </label>
                <input
                  type="text"
                  value={currentItem.crop_name}
                  onChange={(e) => setCurrentItem({...currentItem, crop_name: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Enter crop name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Grade
                </label>
                <select
                  value={currentItem.grade}
                  onChange={(e) => setCurrentItem({...currentItem, grade: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="A">Grade A</option>
                  <option value="B">Grade B</option>
                  <option value="C">Grade C</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity *
                </label>
                <div className="flex">
                  <input
                    type="number"
                    value={currentItem.quantity || ''}
                    onChange={(e) => {
                      setCurrentItem({...currentItem, quantity: parseFloat(e.target.value) || 0});
                      setTimeout(updateCurrentItemTotal, 0);
                    }}
                    min="0"
                    step="0.01"
                    className="flex-grow px-4 py-2 border rounded-l-lg"
                    placeholder="0.00"
                  />
                  <select
                    value={currentItem.unit}
                    onChange={(e) => setCurrentItem({...currentItem, unit: e.target.value})}
                    className="px-4 py-2 border border-l-0 rounded-r-lg"
                  >
                    <option value="kg">kg</option>
                    <option value="quintal">quintal</option>
                    <option value="ton">ton</option>
                    <option value="piece">piece</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price Per Unit (₹) *
                </label>
                <input
                  type="number"
                  value={currentItem.price_per_unit || ''}
                  onChange={(e) => {
                    setCurrentItem({...currentItem, price_per_unit: parseFloat(e.target.value) || 0});
                    setTimeout(updateCurrentItemTotal, 0);
                  }}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="0.00"
                />
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-700">
                <strong>Item Total:</strong> ₹{currentItem.total_amount.toLocaleString('en-IN')}
              </div>
              
              <button
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                onClick={addItemToSale}
              >
                Add Item
              </button>
            </div>
          </div>
          
          {/* Items Table */}
          {currentSale.items.length > 0 ? (
            <div className="overflow-x-auto border rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Crop</th>
                    <th scope="col" className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">Grade</th>
                    <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Qty</th>
                    <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Price/Unit</th>
                    <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                    <th scope="col" className="px-3 py-2 text-xs font-medium text-gray-500 uppercase"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentSale.items.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{item.crop_name}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 text-center">{item.grade || '-'}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 text-right">{item.quantity} {item.unit}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 text-right">₹{item.price_per_unit}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900 text-right">₹{item.total_amount.toLocaleString('en-IN')}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-right">
                        <button
                          className="text-red-600 hover:text-red-800"
                          onClick={() => removeItem(index)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200 text-gray-500">
              No items added yet
            </div>
          )}
        </div>
        
        {/* Sale Summary */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Sale Summary</h3>
          
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Commission (%)
                </label>
                <input
                  type="number"
                  value={currentSale.commission_percentage}
                  onChange={(e) => updateCommission(parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.1"
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Tax/Charges (₹)
                </label>
                <input
                  type="number"
                  value={currentSale.tax_amount}
                  onChange={(e) => updateTax(parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Status
                </label>
                <select
                  value={currentSale.payment_status}
                  onChange={(e) => setCurrentSale({...currentSale, payment_status: e.target.value as any})}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="partial">Partial Payment</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method
                </label>
                <select
                  value={currentSale.payment_method}
                  onChange={(e) => setCurrentSale({...currentSale, payment_method: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="cash">Cash</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="upi">UPI</option>
                  <option value="check">Check</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes (Optional)
              </label>
              <textarea
                value={currentSale.notes}
                onChange={(e) => setCurrentSale({...currentSale, notes: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg"
                rows={2}
                placeholder="Add any additional notes here..."
              />
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="text-right text-sm">
                <p>Subtotal:</p>
                <p>Commission ({currentSale.commission_percentage}%):</p>
                <p>Additional Tax/Charges:</p>
                <p className="font-bold text-base mt-1">Net Amount:</p>
              </div>
              <div className="text-right font-medium text-sm">
                <p>₹{currentSale.subtotal.toLocaleString('en-IN')}</p>
                <p>₹{currentSale.commission_amount.toLocaleString('en-IN')}</p>
                <p>₹{currentSale.tax_amount.toLocaleString('en-IN')}</p>
                <p className="font-bold text-base text-green-700 mt-1">₹{currentSale.net_amount.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            onClick={saveSale}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Record Sale'}
          </button>
        </div>
      </div>
      
      {/* Recent Sales List */}
      <div className="lg:w-5/12 bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Transactions</h2>
        
        {loading ? (
          <div className="text-center py-10">Loading recent sales...</div>
        ) : recentSales.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <div className="text-5xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No Sales Recorded Yet</h3>
            <p className="text-gray-600">
              Start recording farmer sales to see them listed here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentSales.map(sale => (
              <div key={sale.id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                <div className="bg-gray-50 p-4">
                  <div className="flex flex-col sm:flex-row justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">{new Date(sale.transaction_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                      <h3 className="font-medium text-gray-900">{sale.farmer_name}</h3>
                      <p className="text-gray-700 text-sm">{sale.transaction_number}</p>
                    </div>
                    <div className="mt-2 sm:mt-0 flex flex-col items-start sm:items-end">
                      <p className="font-bold text-green-700 text-lg">₹{sale.net_amount.toLocaleString('en-IN')}</p>
                      <div className="mt-1">
                        {sale.payment_status === 'paid' && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Paid</span>
                        )}
                        {sale.payment_status === 'pending' && (
                          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">Pending</span>
                        )}
                        {sale.payment_status === 'partial' && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">Partial</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-2 text-sm">
                    <span className="text-gray-600">{sale.items.length} items:</span>{' '}
                    <span className="text-gray-800">
                      {sale.items.map(item => item.crop_name).join(', ')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="text-center mt-4">
              <button
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                onClick={loadRecentSales}
              >
                Refresh List
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 