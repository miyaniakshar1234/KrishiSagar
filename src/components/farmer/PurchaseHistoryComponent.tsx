"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

interface PurchaseItem {
  id: string;
  product_name: string;
  quantity: number;
  unit: string;
  price: number;
  subtotal: number;
  gst_amount: number;
  total: number;
}

interface Purchase {
  id: string;
  bill_number: string;
  bill_date: string;
  store_name: string;
  store_location: string;
  store_contact: string;
  items: PurchaseItem[];
  subtotal: number;
  gst_total: number;
  grand_total: number;
  payment_method: string;
}

export default function PurchaseHistoryComponent({ farmerId }: { farmerId: string }) {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activePurchaseId, setActivePurchaseId] = useState<string | null>(null);
  const [filterMonth, setFilterMonth] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [totalSpent, setTotalSpent] = useState(0);

  // Get purchase history for the farmer
  useEffect(() => {
    async function loadPurchases() {
      try {
        setLoading(true);
        const supabase = createClient();
        
        // Query the bills where the farmer is listed
        const { data, error } = await supabase
          .from('bills')
          .select(`
            id,
            bill_number,
            bill_date,
            subtotal,
            gst_total,
            grand_total,
            payment_method,
            notes,
            store_owner:store_owner_id(
              id,
              store_owners:store_owner_profiles(
                store_name,
                store_location,
                gst_number
              ),
              users(
                phone
              )
            ),
            bill_items(
              id,
              product_name,
              quantity,
              unit,
              price,
              gst_rate,
              gst_amount,
              total
            )
          `)
          .eq('farmer_id', farmerId)
          .order('bill_date', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        // Transform the data structure
        if (data) {
          const formattedPurchases: Purchase[] = data.map((bill: any) => ({
            id: bill.id,
            bill_number: bill.bill_number,
            bill_date: bill.bill_date,
            store_name: bill.store_owner?.store_owners?.store_name || 'Unknown Store',
            store_location: bill.store_owner?.store_owners?.store_location || 'Unknown Location',
            store_contact: bill.store_owner?.users?.phone || 'N/A',
            items: bill.bill_items || [],
            subtotal: bill.subtotal,
            gst_total: bill.gst_total,
            grand_total: bill.grand_total,
            payment_method: bill.payment_method
          }));
          
          setPurchases(formattedPurchases);
          
          // Calculate total spent
          const total = formattedPurchases.reduce((sum, purchase) => sum + purchase.grand_total, 0);
          setTotalSpent(total);
        }
      } catch (err) {
        console.error('Error loading purchase history:', err);
        setError('Failed to load purchase history. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    
    if (farmerId) {
      loadPurchases();
    }
  }, [farmerId]);

  // Filter purchases based on month and search term
  const filteredPurchases = purchases.filter(purchase => {
    // Filter by month if not "all"
    const matchesMonth = filterMonth === "all" || 
      (purchase.bill_date && new Date(purchase.bill_date).getMonth() === parseInt(filterMonth));
    
    // Filter by search term
    const matchesSearch = searchTerm === "" || 
      purchase.store_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.bill_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.items.some(item => item.product_name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesMonth && matchesSearch;
  });

  // Toggle purchase details view
  const togglePurchaseDetails = (purchaseId: string) => {
    if (activePurchaseId === purchaseId) {
      setActivePurchaseId(null);
    } else {
      setActivePurchaseId(purchaseId);
    }
  };

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
    return <div className="text-center py-10">Loading purchase history...</div>;
  }

  if (error) {
    return <div className="bg-red-50 text-red-700 p-4 rounded-lg">{error}</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Purchase History</h2>
          <p className="text-gray-600">Track your purchases from agro stores</p>
        </div>
        
        <div className="mt-4 sm:mt-0 bg-green-50 px-4 py-2 rounded-lg border border-green-100">
          <p className="text-sm text-green-800 font-medium">Total Spent</p>
          <p className="text-xl font-bold text-green-700">₹{totalSpent.toLocaleString('en-IN')}</p>
        </div>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search products or stores..."
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
      </div>
      
      {/* Purchase list */}
      {filteredPurchases.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <div className="text-5xl mb-4">📋</div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">No Purchase Records Found</h3>
          <p className="text-gray-600">
            {searchTerm || filterMonth !== "all"
              ? "Try changing your search filters"
              : "You don't have any purchases recorded yet"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPurchases.map(purchase => (
            <div key={purchase.id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              {/* Purchase header */}
              <div 
                className="bg-gray-50 p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => togglePurchaseDetails(purchase.id)}
              >
                <div className="flex flex-col sm:flex-row justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">{new Date(purchase.bill_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    <h3 className="font-medium text-gray-900">{purchase.store_name}</h3>
                    <p className="text-gray-700 text-sm">{purchase.bill_number}</p>
                  </div>
                  <div className="mt-2 sm:mt-0 flex flex-col items-start sm:items-end">
                    <p className="font-bold text-green-700 text-lg">₹{purchase.grand_total.toLocaleString('en-IN')}</p>
                    <p className="text-xs text-gray-600">{purchase.payment_method.toUpperCase()}</p>
                  </div>
                </div>
              </div>
              
              {/* Purchase details */}
              {activePurchaseId === purchase.id && (
                <div className="p-4 bg-white border-t border-gray-200">
                  <div className="mb-4">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Store:</span> {purchase.store_name}
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Location:</span> {purchase.store_location}
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Contact:</span> {purchase.store_contact}
                    </p>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                          <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                          <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                          <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">GST</th>
                          <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {purchase.items.map(item => (
                          <tr key={item.id} className="hover:bg-gray-50">
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{item.product_name}</td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 text-right">{item.quantity} {item.unit}</td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 text-right">₹{item.price}</td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 text-right">₹{item.gst_amount}</td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900 text-right">₹{item.total}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-gray-50">
                        <tr>
                          <th scope="row" colSpan={3} className="px-3 py-2 text-left text-xs font-medium text-gray-500">Subtotal</th>
                          <td colSpan={2} className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900 text-right">₹{purchase.subtotal.toLocaleString('en-IN')}</td>
                        </tr>
                        <tr>
                          <th scope="row" colSpan={3} className="px-3 py-2 text-left text-xs font-medium text-gray-500">GST</th>
                          <td colSpan={2} className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900 text-right">₹{purchase.gst_total.toLocaleString('en-IN')}</td>
                        </tr>
                        <tr className="bg-green-50">
                          <th scope="row" colSpan={3} className="px-3 py-2 text-left text-xs font-medium text-green-700">Grand Total</th>
                          <td colSpan={2} className="px-3 py-2 whitespace-nowrap text-sm font-bold text-green-700 text-right">₹{purchase.grand_total.toLocaleString('en-IN')}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                  
                  <div className="mt-4 flex justify-end">
                    <button 
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      onClick={() => window.print()}
                    >
                      Print Receipt
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 