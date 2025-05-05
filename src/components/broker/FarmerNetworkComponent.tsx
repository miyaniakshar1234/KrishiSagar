"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Farmer {
  id: string;
  name: string;
  phone: string;
  location: string;
  crops: string[];
  total_sales: number;
  last_sale_date: string | null;
}

export default function FarmerNetworkComponent({ brokerId }: { brokerId: string }) {
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCrop, setFilterCrop] = useState<string>("all");
  const [uniqueCrops, setUniqueCrops] = useState<string[]>([]);

  // Handle clicking "New Sale" button 
  const handleNewSale = (farmerId: string) => {
    // Store the selected farmer ID in localStorage for the SalesRecordComponent to use
    localStorage.setItem('selectedFarmerId', farmerId);
    
    // Find the tab element and click it
    const transactionsTabButton = document.querySelector('button[data-tab="transactions"]');
    if (transactionsTabButton) {
      (transactionsTabButton as HTMLButtonElement).click();
    }
  };

  // Load farmers connected to this broker
  useEffect(() => {
    async function loadFarmers() {
      try {
        setLoading(true);
        const supabase = createClient();
        
        // First get list of farmer IDs from market sales for this broker
        const { data: salesData, error: salesError } = await supabase
          .from('market_sales')
          .select('farmer_id, transaction_date, net_amount')
          .eq('broker_id', brokerId)
          .order('transaction_date', { ascending: false });
        
        if (salesError) {
          console.error("Supabase sales query error:", salesError);
          throw salesError;
        }
        
        if (!salesData || salesData.length === 0) {
          setFarmers([]);
          setLoading(false);
          return;
        }
        
        // Extract unique farmer IDs
        const farmerIds = [...new Set(salesData.map(sale => sale.farmer_id))];
        
        // Get farmer details in a separate query
        const { data: farmersData, error: farmersError } = await supabase
          .from('users')
          .select(`
            id,
            full_name,
            phone,
            farmer_profiles(
              farm_location,
              crops_grown
            )
          `)
          .in('id', farmerIds);
        
        if (farmersError) {
          console.error("Supabase farmers query error:", farmersError);
          throw farmersError;
        }
        
        console.log('Farmers data:', farmersData);
        
        if (farmersData) {
          // Process and aggregate farmer data
          const farmerMap = new Map<string, Farmer>();
          const cropSet = new Set<string>();
          
          // First create farmer objects
          farmersData.forEach(farmer => {
            const farmerProfile = farmer.farmer_profiles?.[0];
            
            // Extract crop types from the farmer's crops_grown array
            if (farmerProfile?.crops_grown && Array.isArray(farmerProfile.crops_grown)) {
              farmerProfile.crops_grown.forEach((crop: string) => {
                cropSet.add(crop);
              });
            }
            
            farmerMap.set(farmer.id, {
              id: farmer.id,
              name: farmer.full_name || 'Unknown Farmer',
              phone: farmer.phone || 'N/A',
              location: farmerProfile?.farm_location || 'Unknown',
              crops: farmerProfile?.crops_grown || [],
              total_sales: 0,
              last_sale_date: null
            });
          });
          
          // Then add sales data
          salesData.forEach(sale => {
            const farmer = farmerMap.get(sale.farmer_id);
            if (!farmer) return;
            
            // Update total sales
            farmer.total_sales += sale.net_amount || 0;
            
            // Update last sale date if newer
            if (!farmer.last_sale_date || 
                (sale.transaction_date && new Date(sale.transaction_date) > new Date(farmer.last_sale_date))) {
              farmer.last_sale_date = sale.transaction_date;
            }
          });
          
          setFarmers(Array.from(farmerMap.values()));
          setUniqueCrops(Array.from(cropSet).sort());
        }
      } catch (err) {
        console.error('Error loading farmer network data:', err);
        if (err instanceof Error) {
          setError(`Failed to load farmer network: ${err.message}`);
        } else {
          setError('Failed to load farmer network. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    }
    
    if (brokerId) {
      loadFarmers();
    }
  }, [brokerId]);
  
  // Filter farmers based on search term and crop filter
  const filteredFarmers = farmers.filter(farmer => {
    const matchesSearch = searchTerm === "" || 
      farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.phone.includes(searchTerm);
    
    const matchesCrop = filterCrop === "all" || 
      farmer.crops.includes(filterCrop);
    
    return matchesSearch && matchesCrop;
  });
  
  if (loading) {
    return <div className="text-center py-10">Loading farmer network data...</div>;
  }
  
  if (error) {
    return <div className="bg-red-50 text-red-700 p-4 rounded-lg">{error}</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Farmer Network</h2>
          <p className="text-gray-600">Manage your connections with farmers</p>
        </div>
        
        <div className="mt-4 sm:mt-0 bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">
          <p className="text-sm text-blue-800 font-medium">Total Farmers</p>
          <p className="text-xl font-bold text-blue-700">{farmers.length}</p>
        </div>
      </div>
      
      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search farmers by name or location..."
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
      
      {/* Farmers list */}
      {filteredFarmers.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <div className="text-5xl mb-4">👨‍🌾</div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">No Farmers Found</h3>
          <p className="text-gray-600">
            {searchTerm || filterCrop !== "all"
              ? "Try changing your search filters"
              : "You haven't recorded any sales with farmers yet"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFarmers.map(farmer => (
            <div key={farmer.id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="p-4">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold mr-3">
                    {farmer.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{farmer.name}</h3>
                    <p className="text-sm text-gray-600">{farmer.phone}</p>
                  </div>
                </div>
                
                <div className="text-sm">
                  <p className="flex justify-between mb-1">
                    <span className="text-gray-600">Location:</span>
                    <span className="text-gray-900">{farmer.location}</span>
                  </p>
                  <p className="flex justify-between mb-1">
                    <span className="text-gray-600">Crops:</span>
                    <span className="text-gray-900">{farmer.crops.join(', ')}</span>
                  </p>
                  <p className="flex justify-between mb-1">
                    <span className="text-gray-600">Total Sales:</span>
                    <span className="font-medium text-green-700">₹{farmer.total_sales.toLocaleString('en-IN')}</span>
                  </p>
                  {farmer.last_sale_date && (
                    <p className="flex justify-between">
                      <span className="text-gray-600">Last Sale:</span>
                      <span className="text-gray-900">
                        {new Date(farmer.last_sale_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </p>
                  )}
                </div>
                
                <div className="mt-4 flex space-x-2">
                  <button className="flex-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors">
                    Contact
                  </button>
                  <button 
                    onClick={() => handleNewSale(farmer.id)}
                    className="flex-1 px-3 py-1.5 bg-green-100 text-green-700 text-sm rounded hover:bg-green-200 transition-colors"
                  >
                    New Sale
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