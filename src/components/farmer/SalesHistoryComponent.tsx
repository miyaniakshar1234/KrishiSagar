"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

interface SaleItem {
  id: string;
  crop_name: string;
  quantity: number;
  unit: string;
  price_per_unit: number;
  total_amount: number;
  grade?: string;
}

interface Sale {
  id: string;
  transaction_number: string;
  transaction_date: string;
  broker_name: string;
  broker_market: string;
  broker_phone: string;
  items: SaleItem[];
  subtotal: number;
  commission_amount: number;
  commission_percentage: number;
  tax_amount: number;
  net_amount: number;
  payment_status: 'paid' | 'pending' | 'partial';
  payment_method?: string;
  notes?: string;
}

export default function SalesHistoryComponent({ farmerId }: { farmerId: string }) {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSaleId, setActiveSaleId] = useState<string | null>(null);
  const [filterMonth, setFilterMonth] = useState<string>("all");
  const [filterCrop, setFilterCrop] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [totalEarned, setTotalEarned] = useState(0);
  const [uniqueCrops, setUniqueCrops] = useState<string[]>([]);

  // Get sales history for the farmer
  useEffect(() => {
    async function loadSales() {
      try {
        setLoading(true);
        const supabase = createClient();
        
        // Query the market sales where the farmer is listed
        const { data, error } = await supabase
          .from('market_sales')
          .select(`
            id,
            transaction_number,
            transaction_date,
            subtotal,
            commission_percentage,
            commission_amount,
            tax_amount,
            net_amount,
            payment_status,
            payment_method,
            notes,
            broker:broker_id(
              id,
              brokers:broker_profiles(
                market_name,
                license_number
              ),
              users(
                full_name,
                phone
              )
            ),
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
          .eq('farmer_id', farmerId)
          .order('transaction_date', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        // Transform the data structure
        if (data) {
          const formattedSales: Sale[] = data.map((sale: any) => ({
            id: sale.id,
            transaction_number: sale.transaction_number,
            transaction_date: sale.transaction_date,
            broker_name: sale.broker?.users?.full_name || 'Unknown Broker',
            broker_market: sale.broker?.brokers?.market_name || 'Unknown Market',
            broker_phone: sale.broker?.users?.phone || 'N/A',
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
          
          setSales(formattedSales);
          
          // Calculate total earned
          const total = formattedSales.reduce((sum, sale) => sum + sale.net_amount, 0);
          setTotalEarned(total);
          
          // Extract unique crops for filtering
          const crops = new Set<string>();
          formattedSales.forEach(sale => {
            sale.items.forEach(item => {
              if (item.crop_name) {
                crops.add(item.crop_name);
              }
            });
          });
          setUniqueCrops(Array.from(crops).sort());
        }
      } catch (err) {
        console.error('Error loading sales history:', err);
        setError('Failed to load sales history. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    
    if (farmerId) {
      loadSales();
    }
  }, [farmerId]);

  // Filter sales based on month, crop, and search term
  const filteredSales = sales.filter(sale => {
    // Filter by month if not "all"
    const matchesMonth = filterMonth === "all" || 
      (sale.transaction_date && new Date(sale.transaction_date).getMonth() === parseInt(filterMonth));
    
    // Filter by crop if not "all"
    const matchesCrop = filterCrop === "all" || 
      sale.items.some(item => item.crop_name === filterCrop);
    
    // Filter by search term
    const matchesSearch = searchTerm === "" || 
      sale.broker_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.transaction_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.broker_market.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.items.some(item => item.crop_name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesMonth && matchesCrop && matchesSearch;
  });

  // Toggle sale details view
  const toggleSaleDetails = (saleId: string) => {
    if (activeSaleId === saleId) {
      setActiveSaleId(null);
    } else {
      setActiveSaleId(saleId);
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

  // Payment status badge
  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Paid</span>;
      case 'pending':
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">Pending</span>;
      case 'partial':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">Partial</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">{status}</span>;
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading sales history...</div>;
  }

  if (error) {
    return <div className="bg-red-50 text-red-700 p-4 rounded-lg">{error}</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Market Sales History</h2>
          <p className="text-gray-600">Track your crop sales through market brokers</p>
        </div>
        
        <div className="mt-4 sm:mt-0 bg-green-50 px-4 py-2 rounded-lg border border-green-100">
          <p className="text-sm text-green-800 font-medium">Total Earned</p>
          <p className="text-xl font-bold text-green-700">₹{totalEarned.toLocaleString('en-IN')}</p>
        </div>
      </div>
      
      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search markets or crops..."
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
      
      {/* Sales list */}
      {filteredSales.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <div className="text-5xl mb-4">📋</div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">No Sales Records Found</h3>
          <p className="text-gray-600">
            {searchTerm || filterMonth !== "all" || filterCrop !== "all"
              ? "Try changing your search filters"
              : "You don't have any sales recorded yet"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSales.map(sale => (
            <div key={sale.id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              {/* Sale header */}
              <div 
                className="bg-gray-50 p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => toggleSaleDetails(sale.id)}
              >
                <div className="flex flex-col sm:flex-row justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">{new Date(sale.transaction_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    <h3 className="font-medium text-gray-900">{sale.broker_market}</h3>
                    <p className="text-gray-700 text-sm">{sale.transaction_number}</p>
                  </div>
                  <div className="mt-2 sm:mt-0 flex flex-col items-start sm:items-end">
                    <p className="font-bold text-green-700 text-lg">₹{sale.net_amount.toLocaleString('en-IN')}</p>
                    <div className="mt-1">
                      {getPaymentStatusBadge(sale.payment_status)}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Sale details */}
              {activeSaleId === sale.id && (
                <div className="p-4 bg-white border-t border-gray-200">
                  <div className="mb-4">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Broker:</span> {sale.broker_name}
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Market:</span> {sale.broker_market}
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Contact:</span> {sale.broker_phone}
                    </p>
                    {sale.notes && (
                      <p className="text-sm text-gray-700 mt-2">
                        <span className="font-medium">Notes:</span> {sale.notes}
                      </p>
                    )}
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Crop</th>
                          <th scope="col" className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                          <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                          <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price/Unit</th>
                          <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {sale.items.map(item => (
                          <tr key={item.id} className="hover:bg-gray-50">
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{item.crop_name}</td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 text-center">{item.grade || '-'}</td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 text-right">{item.quantity} {item.unit}</td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 text-right">₹{item.price_per_unit}</td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900 text-right">₹{item.total_amount}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-gray-50">
                        <tr>
                          <th scope="row" colSpan={4} className="px-3 py-2 text-left text-xs font-medium text-gray-500">Subtotal</th>
                          <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900 text-right">₹{sale.subtotal.toLocaleString('en-IN')}</td>
                        </tr>
                        <tr>
                          <th scope="row" colSpan={4} className="px-3 py-2 text-left text-xs font-medium text-gray-500">
                            Commission ({sale.commission_percentage}%)
                          </th>
                          <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900 text-right">₹{sale.commission_amount.toLocaleString('en-IN')}</td>
                        </tr>
                        {sale.tax_amount > 0 && (
                          <tr>
                            <th scope="row" colSpan={4} className="px-3 py-2 text-left text-xs font-medium text-gray-500">Tax</th>
                            <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900 text-right">₹{sale.tax_amount.toLocaleString('en-IN')}</td>
                          </tr>
                        )}
                        <tr className="bg-green-50">
                          <th scope="row" colSpan={4} className="px-3 py-2 text-left text-xs font-medium text-green-700">Net Amount</th>
                          <td className="px-3 py-2 whitespace-nowrap text-sm font-bold text-green-700 text-right">₹{sale.net_amount.toLocaleString('en-IN')}</td>
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