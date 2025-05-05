"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

interface MarketTransaction {
  id: string;
  transaction_number: string;
  transaction_date: string;
  farmer_name: string;
  broker_name: string;
  market_name: string;
  crop_type: string;
  quantity: number;
  unit: string;
  amount: number;
  payment_status: string;
}

export default function MarketTransactionsComponent({ storeOwnerId }: { storeOwnerId: string }) {
  const [transactions, setTransactions] = useState<MarketTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterMonth, setFilterMonth] = useState<string>("all");
  const [filterCrop, setFilterCrop] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [uniqueCrops, setUniqueCrops] = useState<string[]>([]);
  const [marketVolume, setMarketVolume] = useState(0);

  // Get market transactions for crops that this store owner sells
  useEffect(() => {
    async function loadMarketTransactions() {
      try {
        setLoading(true);
        const supabase = createClient();
        
        // First, get the product categories the store owner sells
        const { data: storeProducts, error: storeError } = await supabase
          .from('store_products')
          .select('category')
          .eq('store_owner_id', storeOwnerId)
          .order('category');
        
        if (storeError) throw storeError;
        
        // Extract unique product categories
        const categories = storeProducts ? [...new Set(storeProducts.map(p => p.category))] : [];
        
        if (categories.length === 0) {
          setTransactions([]);
          setLoading(false);
          return;
        }
        
        // Query market sales with similar crop types
        const { data, error } = await supabase
          .from('market_sales')
          .select(`
            id,
            transaction_number,
            transaction_date,
            farmer_id,
            subtotal,
            quantity,
            unit,
            net_amount,
            payment_status,
            users!farmer_id(full_name),
            users!broker_id(full_name),
            sale_items(
              crop_name,
              quantity,
              unit,
              price_per_unit,
              total_amount,
              grade
            )
          `)
          // We'll check for relevant crop types later in JS
          .order('transaction_date', { ascending: false })
          .limit(100);
        
        if (error) throw error;
        
        console.log('Market transactions data:', data); // Debug log
        
        if (data) {
          // Filter for crops relevant to this store
          const relevantTransactions = data.filter(sale => {
            // Get crop names from sale items
            const cropTypes = sale.sale_items?.map(item => item.crop_name.toLowerCase()) || [];
            if (cropTypes.length === 0) return false;
            
            // Check if any crop type matches any product category this store sells
            return cropTypes.some(cropType => 
              categories.some(category => 
                cropType.includes(category.toLowerCase()) || 
                category.toLowerCase().includes(cropType)
              )
            );
          });
          
          const cropTypes = new Set<string>();
          let totalVolume = 0;
          
          // Format transactions
          const formattedTransactions: MarketTransaction[] = relevantTransactions.map(sale => {
            // Get the first crop from the sale items for display
            const mainCrop = sale.sale_items?.[0]?.crop_name || 'Unknown';
            const totalQuantity = sale.sale_items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
            const firstUnit = sale.sale_items?.[0]?.unit || 'kg';
            
            // Add crop types to unique set
            sale.sale_items?.forEach(item => {
              if (item.crop_name) {
                cropTypes.add(item.crop_name);
              }
            });
            
            // Add to total volume
            totalVolume += sale.subtotal || 0;
            
            return {
              id: sale.id,
              transaction_number: sale.transaction_number || 'Unknown',
              transaction_date: sale.transaction_date || new Date().toISOString(),
              farmer_name: sale.users?.full_name || 'Unknown Farmer',
              broker_name: sale.users_2?.full_name || 'Unknown Broker',
              market_name: 'Local Market', // This might need to be stored elsewhere
              crop_type: mainCrop,
              quantity: totalQuantity,
              unit: firstUnit,
              amount: sale.subtotal || 0,
              payment_status: sale.payment_status || 'unknown'
            };
          });
          
          setTransactions(formattedTransactions);
          setUniqueCrops(Array.from(cropTypes).sort());
          setMarketVolume(totalVolume);
        }
      } catch (err) {
        console.error('Error loading market transactions:', err);
        setError('Failed to load market transactions. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    
    if (storeOwnerId) {
      loadMarketTransactions();
    }
  }, [storeOwnerId]);

  // Filter transactions based on month, crop, and search term
  const filteredTransactions = transactions.filter(transaction => {
    // Filter by month if not "all"
    const matchesMonth = filterMonth === "all" || 
      (transaction.transaction_date && new Date(transaction.transaction_date).getMonth() === parseInt(filterMonth));
    
    // Filter by crop if not "all"
    const matchesCrop = filterCrop === "all" || 
      transaction.crop_type === filterCrop;
    
    // Filter by search term
    const matchesSearch = searchTerm === "" || 
      transaction.farmer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.broker_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.market_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.transaction_number.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesMonth && matchesCrop && matchesSearch;
  });

  // Generate month options
  const months = [
    { value: "all", label: "All Time" },
    { value: "0", label: "January" },
    { value: "1", label: "February" },
    { value: "2", label: "March" },
    { value: "3", label: "April" },
    { value: "4", label: "May" },
    { value: "5", label: "June" },
    { value: "6", label: "July" },
    { value: "7", label: "August" },
    { value: "8", label: "September" },
    { value: "9", label: "October" },
    { value: "10", label: "November" },
    { value: "11", label: "December" },
  ];

  if (loading) {
    return <div className="text-center py-10">Loading market transactions...</div>;
  }

  if (error) {
    return <div className="bg-red-50 text-red-700 p-4 rounded-lg">{error}</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Market Transactions</h2>
          <p className="text-gray-600">Analyze market transactions for crops you sell</p>
        </div>
        
        <div className="mt-4 sm:mt-0 bg-green-50 px-4 py-2 rounded-lg border border-green-100">
          <p className="text-sm text-green-800 font-medium">Market Volume</p>
          <p className="text-xl font-bold text-green-700">₹{marketVolume.toLocaleString('en-IN')}</p>
        </div>
      </div>
      
      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by farmer or broker..."
            className="w-full px-4 py-2 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        
        <select
          className="px-3 py-2 border rounded-lg"
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
        >
          {months.map((month) => (
            <option key={month.value} value={month.value}>
              {month.label}
            </option>
          ))}
        </select>
        
        <select
          className="px-3 py-2 border rounded-lg"
          value={filterCrop}
          onChange={(e) => setFilterCrop(e.target.value)}
        >
          <option value="all">All Crops</option>
          {uniqueCrops.map((crop) => (
            <option key={crop} value={crop}>
              {crop}
            </option>
          ))}
        </select>
      </div>
      
      {/* Transactions list */}
      {filteredTransactions.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <div className="text-5xl mb-4">📊</div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">No Market Transactions Found</h3>
          <p className="text-gray-600">
            {searchTerm || filterMonth !== "all" || filterCrop !== "all"
              ? "Try changing your search filters"
              : "There are no market transactions related to your products"}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto border rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Farmer</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Broker/Market</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Crop</th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{transaction.transaction_number}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(transaction.transaction_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{transaction.farmer_name}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{transaction.broker_name}</div>
                    <div className="text-xs text-gray-500">{transaction.market_name}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{transaction.crop_type}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                    {transaction.quantity} {transaction.unit}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                    ₹{transaction.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    {transaction.payment_status === 'paid' && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Paid</span>
                    )}
                    {transaction.payment_status === 'pending' && (
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">Pending</span>
                    )}
                    {transaction.payment_status === 'partial' && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">Partial</span>
                    )}
                    {!['paid', 'pending', 'partial'].includes(transaction.payment_status) && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                        {transaction.payment_status || 'Unknown'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Market insights section */}
      {filteredTransactions.length > 0 && (
        <div className="mt-8 bg-blue-50 p-4 rounded-lg border border-blue-100">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Market Insights</h3>
          <p className="text-sm text-blue-700 mb-3">
            Based on these market transactions, you can optimize your inventory for upcoming demand.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-3 rounded border border-blue-100">
              <h4 className="text-sm font-medium text-blue-700 mb-2">Popular Crops</h4>
              <div className="text-sm text-gray-700">
                {Object.entries(
                  filteredTransactions.reduce((acc: Record<string, number>, transaction) => {
                    acc[transaction.crop_type] = (acc[transaction.crop_type] || 0) + transaction.amount;
                    return acc;
                  }, {})
                )
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 3)
                  .map(([crop, amount], index) => (
                    <div key={crop} className="flex justify-between mb-1">
                      <span>#{index + 1} {crop}</span>
                      <span className="font-medium">₹{amount.toLocaleString('en-IN')}</span>
                    </div>
                  ))
                }
              </div>
            </div>
            <div className="bg-white p-3 rounded border border-blue-100">
              <h4 className="text-sm font-medium text-blue-700 mb-2">Business Opportunity</h4>
              <p className="text-sm text-gray-700">
                Consider stocking up on agricultural supplies for these crops to meet potential
                farmer demand in the coming weeks.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 