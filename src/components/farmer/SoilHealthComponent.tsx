"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  getCurrentUser, 
  getSoilTests, 
  getSoilRecommendations, 
  getFarmLocations,
  addSoilTest,
  addFarmLocation 
} from '@/lib/supabase/client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface SoilTest {
  id: string;
  date: string;
  location: string;
  ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  organic_matter: number;
  moisture: number;
  notes?: string;
}

interface Recommendation {
  id: string;
  title: string;
  description: string;
  crop_types: string[];
  soil_condition: string;
}

interface FarmLocation {
  id: string;
  name: string;
  coordinates?: string;
  area?: number;
}

const SoilHealthComponent = () => {
  const [soilTests, setSoilTests] = useState<SoilTest[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [farmLocations, setFarmLocations] = useState<FarmLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loadingLocations, setLoadingLocations] = useState(true);
  const [showAddLocationForm, setShowAddLocationForm] = useState(false);
  const [locationName, setLocationName] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [showTrendChart, setShowTrendChart] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<string>('ph');
  
  // Form state
  const [formData, setFormData] = useState<Omit<SoilTest, 'id'>>({
    date: new Date().toISOString().split('T')[0],
    location: '',
    ph: 7.0,
    nitrogen: 0,
    phosphorus: 0,
    potassium: 0,
    organic_matter: 0,
    moisture: 0,
    notes: ''
  });
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const user = await getCurrentUser();
        if (!user) {
          throw new Error('You must be logged in to view soil health data');
        }
        
        // Fetch farm locations
        setLoadingLocations(true);
        const { data: locationData, error: locationError } = await getFarmLocations();
          
        if (locationError) throw new Error(locationError);
        
        // If no locations exist, create default ones
        if (!locationData || locationData.length === 0) {
          const defaultLocations = ['North Field', 'South Field', 'East Field', 'West Field'];
          
          try {
            const locationPromises = defaultLocations.map(name => addFarmLocation({ name }));
            const results = await Promise.all(locationPromises);
            
            // Check if any of the farm location creations failed
            const errors = results.filter(result => result.error).map(result => result.error);
            if (errors.length > 0) {
              console.error('Errors adding default farm locations:', errors);
              throw new Error(`Error adding default farm locations: ${errors.join(', ')}`);
            }
            
            // Fetch the newly created locations
            const { data: newLocations, error: newLocError } = await getFarmLocations();
            
            if (newLocError) throw new Error(newLocError);
            setFarmLocations(newLocations || []);
          } catch (locErr) {
            console.error('Failed to create default farm locations:', locErr);
            throw new Error(`Failed to create default farm locations: ${locErr instanceof Error ? locErr.message : String(locErr)}`);
          }
        } else {
          setFarmLocations(locationData);
        }
        
        setLoadingLocations(false);
        
        // Fetch soil tests
        const { data: testData, error: testError } = await getSoilTests();
          
        if (testError) throw new Error(testError);
        setSoilTests(testData || []);
        
        // Fetch recommendations
        const { data: recData, error: recError } = await getSoilRecommendations();
          
        if (recError) throw new Error(recError);
        setRecommendations(recData || []);
        
      } catch (err) {
        console.error('Error fetching soil data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load soil health data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Calculate relevant soil health recommendations based on latest test
  const getRelevantRecommendations = () => {
    if (soilTests.length === 0) return [];
    
    // Sort by date to get the most recent test
    const sortedTests = [...soilTests].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const latestTest = sortedTests[0];
    
    const relevantRecs = [];
    
    // Check various soil conditions and match with recommendations
    if (latestTest.ph < 6.5) {
      const rec = recommendations.find(r => r.soil_condition === 'acidic');
      if (rec) relevantRecs.push(rec);
    } else if (latestTest.ph > 7.5) {
      const rec = recommendations.find(r => r.soil_condition === 'alkaline');
      if (rec) relevantRecs.push(rec);
    }
    
    if (latestTest.nitrogen < 40) {
      const rec = recommendations.find(r => r.soil_condition === 'low_nitrogen');
      if (rec) relevantRecs.push(rec);
    }
    
    if (latestTest.phosphorus < 30) {
      const rec = recommendations.find(r => r.soil_condition === 'low_phosphorus');
      if (rec) relevantRecs.push(rec);
    }
    
    if (latestTest.potassium < 110) {
      const rec = recommendations.find(r => r.soil_condition === 'low_potassium');
      if (rec) relevantRecs.push(rec);
    }
    
    if (latestTest.organic_matter < 3.0) {
      const rec = recommendations.find(r => r.soil_condition === 'low_organic_matter');
      if (rec) relevantRecs.push(rec);
    }
    
    if (latestTest.moisture < 25) {
      const rec = recommendations.find(r => r.soil_condition === 'low_moisture');
      if (rec) relevantRecs.push(rec);
    }
    
    return relevantRecs;
  };
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'notes' || name === 'location' ? value : parseFloat(value)
    }));
  };
  
  // Add new farm location
  const handleAddLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!locationName.trim()) return;
    
    try {
      // Check if we're logged in first
      const user = await getCurrentUser();
      if (!user) {
        throw new Error('Authentication required. Please log in again.');
      }
      
      console.log('Adding location:', locationName.trim());
      const { data, error } = await addFarmLocation({ name: locationName.trim() });
        
      if (error) {
        console.error('Error details:', error);
        throw new Error(error);
      }
      
      if (data) {
        console.log('Successfully added location:', data);
        setFarmLocations(prev => [...prev, data]);
        setLocationName('');
        setShowAddLocationForm(false);
      } else {
        throw new Error('No data returned when adding farm location');
      }
      
    } catch (err) {
      console.error('Error adding location:', err);
      setError(err instanceof Error ? err.message : 'Failed to add location');
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data, error } = await addSoilTest(formData);
        
      if (error) throw new Error(error);
      
      if (data) {
        setSoilTests(prev => [data, ...prev]);
      }
      
      setShowAddForm(false);
      
      // Reset form
      setFormData({
        date: new Date().toISOString().split('T')[0],
        location: '',
        ph: 7.0,
        nitrogen: 0,
        phosphorus: 0,
        potassium: 0,
        organic_matter: 0,
        moisture: 0,
        notes: ''
      });
      
    } catch (err) {
      console.error('Error saving soil test:', err);
      setError(err instanceof Error ? err.message : 'Failed to save soil test');
    }
  };
  
  // Get status color class based on value and optimal range
  const getStatusColor = (value: number, type: string) => {
    const ranges = {
      ph: { low: 6.0, high: 7.5 },
      nitrogen: { low: 40, high: 80 },
      phosphorus: { low: 30, high: 60 },
      potassium: { low: 110, high: 200 },
      organic_matter: { low: 3.0, high: 5.0 },
      moisture: { low: 25, high: 45 }
    };
    
    const range = ranges[type as keyof typeof ranges];
    
    if (value < range.low) return 'text-orange-600';
    if (value > range.high) return 'text-purple-600';
    return 'text-green-600';
  };
  
  // Get background color class based on status
  const getStatusBgColor = (value: number, type: string) => {
    const ranges = {
      ph: { low: 6.0, high: 7.5 },
      nitrogen: { low: 40, high: 80 },
      phosphorus: { low: 30, high: 60 },
      potassium: { low: 110, high: 200 },
      organic_matter: { low: 3.0, high: 5.0 },
      moisture: { low: 25, high: 45 }
    };
    
    const range = ranges[type as keyof typeof ranges];
    
    if (value < range.low) return 'bg-orange-100';
    if (value > range.high) return 'bg-purple-100';
    return 'bg-green-100';
  };
  
  // Filter soil tests by location
  const filteredSoilTests = selectedLocation === 'all' 
    ? soilTests 
    : soilTests.filter(test => test.location === selectedLocation);
  
  // Prepare data for trend chart
  const prepareTrendData = () => {
    if (soilTests.length === 0) return [];
    
    // Filter by location if one is selected
    const filteredData = selectedLocation === 'all' 
      ? soilTests 
      : soilTests.filter(test => test.location === selectedLocation);
    
    // Sort by date (oldest to newest)
    const sortedData = [...filteredData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    // Format for chart
    return sortedData.map(test => ({
      date: new Date(test.date).toLocaleDateString(),
      ph: test.ph,
      nitrogen: test.nitrogen,
      phosphorus: test.phosphorus,
      potassium: test.potassium,
      organic_matter: test.organic_matter,
      moisture: test.moisture
    }));
  };
  
  // Render loading skeleton
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
        <div className="h-8 bg-green-100 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border rounded-lg p-4">
              <div className="h-6 bg-green-50 rounded w-1/4 mb-2"></div>
              <div className="grid grid-cols-3 gap-4">
                {[...Array(6)].map((_, j) => (
                  <div key={j} className="h-4 bg-green-50 rounded"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center p-4">
          <div className="text-red-500 text-lg mb-3">⚠️ {error}</div>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  const relevantRecommendations = getRelevantRecommendations();
  const trendData = prepareTrendData();
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-3">
        <h2 className="text-2xl font-bold text-gray-800">Soil Health Monitor</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
        >
          {showAddForm ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancel
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Soil Test
            </>
          )}
        </button>
      </div>
      
      {/* Add New Soil Test Form */}
      {showAddForm && (
        <div className="mb-6 bg-green-50 p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold text-green-800 mb-4">Add New Soil Test</h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-base font-medium text-green-700 mb-2">Test Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
                  required
                />
              </div>
              <div>
                <label className="block text-base font-medium text-green-700 mb-2">Location</label>
                <div className="flex gap-2">
                  <select
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-base bg-white"
                    required
                  >
                    <option value="">Select Field Location</option>
                    {farmLocations.map(loc => (
                      <option key={loc.id} value={loc.name}>{loc.name}</option>
                    ))}
                  </select>
                  <button 
                    type="button"
                    onClick={() => setShowAddLocationForm(!showAddLocationForm)}
                    className="px-4 py-3 bg-green-100 text-green-800 rounded-md hover:bg-green-200 flex-shrink-0 font-medium"
                    title="Add new location"
                  >
                    +
                  </button>
                </div>
                
                {showAddLocationForm && (
                  <div className="mt-3 p-3 border-2 border-green-200 rounded-md bg-green-50">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={locationName}
                        onChange={(e) => setLocationName(e.target.value)}
                        placeholder="New location name"
                        className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
                      />
                      <button
                        type="button"
                        onClick={handleAddLocation}
                        className="px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-base font-medium text-green-700 mb-2">pH Value</label>
                <input
                  type="number"
                  name="ph"
                  value={formData.ph}
                  onChange={handleInputChange}
                  step="0.1"
                  min="0"
                  max="14"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
                  required
                />
              </div>
              <div>
                <label className="block text-base font-medium text-green-700 mb-2">Nitrogen (kg/ha)</label>
                <input
                  type="number"
                  name="nitrogen"
                  value={formData.nitrogen}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
                  required
                />
              </div>
              <div>
                <label className="block text-base font-medium text-green-700 mb-2">Phosphorus (kg/ha)</label>
                <input
                  type="number"
                  name="phosphorus"
                  value={formData.phosphorus}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
                  required
                />
              </div>
              <div>
                <label className="block text-base font-medium text-green-700 mb-2">Potassium (kg/ha)</label>
                <input
                  type="number"
                  name="potassium"
                  value={formData.potassium}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
                  required
                />
              </div>
              <div>
                <label className="block text-base font-medium text-green-700 mb-2">Organic Matter (%)</label>
                <input
                  type="number"
                  name="organic_matter"
                  value={formData.organic_matter}
                  onChange={handleInputChange}
                  step="0.1"
                  min="0"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
                  required
                />
              </div>
              <div>
                <label className="block text-base font-medium text-green-700 mb-2">Moisture (%)</label>
                <input
                  type="number"
                  name="moisture"
                  value={formData.moisture}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-base font-medium text-green-700 mb-2">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
              />
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-lg font-medium"
              >
                Save Test Results
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Soil Health Recommendations */}
      {relevantRecommendations.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
            <span className="mr-2">💡</span> Recommended Actions
          </h3>
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-5 space-y-4 shadow-sm">
            {relevantRecommendations.map(rec => (
              <div key={rec.id} className="border-b border-yellow-200 pb-4 last:border-b-0 last:pb-0">
                <h4 className="font-semibold text-yellow-800 text-lg">{rec.title}</h4>
                <p className="text-base text-yellow-700 mt-2">{rec.description}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {rec.crop_types.map(crop => (
                    <span key={crop} className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full font-medium">
                      {crop}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Filter and Trend Controls */}
      <div className="flex flex-wrap justify-between items-center mb-5">
        <div className="flex items-center space-x-3 mb-2 sm:mb-0">
          <label className="text-base font-medium text-gray-700">Filter by Location:</label>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-base bg-white"
          >
            <option value="all">All Locations</option>
            {farmLocations.map(loc => (
              <option key={loc.id} value={loc.name}>{loc.name}</option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setShowTrendChart(!showTrendChart)}
            className={`px-4 py-2 rounded-md text-base flex items-center font-medium ${showTrendChart ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
            {showTrendChart ? 'Hide Trends' : 'Show Trends'}
          </button>
        </div>
      </div>
      
      {/* Trend Chart */}
      {showTrendChart && trendData.length > 1 && (
        <div className="mb-6 p-5 bg-gray-50 rounded-lg border-2 border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Soil Health Trends</h3>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-base bg-white"
            >
              <option value="ph">pH</option>
              <option value="nitrogen">Nitrogen</option>
              <option value="phosphorus">Phosphorus</option>
              <option value="potassium">Potassium</option>
              <option value="organic_matter">Organic Matter</option>
              <option value="moisture">Moisture</option>
            </select>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 14 }} />
                <YAxis tick={{ fontSize: 14 }} />
                <Tooltip contentStyle={{ fontSize: 14 }} />
                <Legend wrapperStyle={{ fontSize: 14 }} />
                <Line 
                  type="monotone" 
                  dataKey={selectedMetric} 
                  stroke="#059669" 
                  strokeWidth={3} 
                  dot={{ r: 5 }} 
                  activeDot={{ r: 7 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 text-base text-gray-600 text-center">
            <div className="inline-flex items-center">
              <span className="h-4 w-4 rounded-full bg-green-500 mr-2"></span>
              <span className="font-medium">Optimal Range</span>
            </div>
            <div className="inline-flex items-center ml-6">
              <span className="h-4 w-4 rounded-full bg-orange-500 mr-2"></span>
              <span className="font-medium">Below Optimal</span>
            </div>
            <div className="inline-flex items-center ml-6">
              <span className="h-4 w-4 rounded-full bg-purple-500 mr-2"></span>
              <span className="font-medium">Above Optimal</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Soil Test History */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <span className="mr-2">📊</span> Soil Test History
        </h3>
        
        {filteredSoilTests.length === 0 ? (
          <div className="bg-gray-50 p-5 rounded-lg text-center border-2 border-gray-200">
            <p className="text-gray-600 text-lg">
              {soilTests.length === 0 
                ? 'No soil test records found. Add your first soil test above.'
                : 'No soil tests match the selected filter.'}
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredSoilTests.map(test => (
              <div key={test.id} className="border-2 border-gray-200 rounded-lg p-5 hover:bg-gray-50 transition-colors shadow-sm">
                <div className="flex justify-between flex-wrap gap-3 mb-3">
                  <div>
                    <span className="font-semibold text-gray-800 text-lg">{test.location}</span>
                    <span className="text-gray-600 text-base ml-3">
                      {new Date(test.date).toLocaleDateString()}
                    </span>
                  </div>
                  {test.notes && (
                    <span className="text-base text-gray-600 italic">"{test.notes}"</span>
                  )}
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-3">
                  <div className={`p-3 rounded-lg shadow-sm ${getStatusBgColor(test.ph, 'ph')}`}>
                    <p className="text-sm text-green-800 font-medium">pH</p>
                    <p className={`text-lg font-bold ${getStatusColor(test.ph, 'ph')}`}>
                      {test.ph.toFixed(1)}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg shadow-sm ${getStatusBgColor(test.nitrogen, 'nitrogen')}`}>
                    <p className="text-sm text-green-800 font-medium">Nitrogen</p>
                    <p className={`text-lg font-bold ${getStatusColor(test.nitrogen, 'nitrogen')}`}>
                      {test.nitrogen} kg/ha
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg shadow-sm ${getStatusBgColor(test.phosphorus, 'phosphorus')}`}>
                    <p className="text-sm text-green-800 font-medium">Phosphorus</p>
                    <p className={`text-lg font-bold ${getStatusColor(test.phosphorus, 'phosphorus')}`}>
                      {test.phosphorus} kg/ha
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg shadow-sm ${getStatusBgColor(test.potassium, 'potassium')}`}>
                    <p className="text-sm text-green-800 font-medium">Potassium</p>
                    <p className={`text-lg font-bold ${getStatusColor(test.potassium, 'potassium')}`}>
                      {test.potassium} kg/ha
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg shadow-sm ${getStatusBgColor(test.organic_matter, 'organic_matter')}`}>
                    <p className="text-sm text-green-800 font-medium">Organic Matter</p>
                    <p className={`text-lg font-bold ${getStatusColor(test.organic_matter, 'organic_matter')}`}>
                      {test.organic_matter.toFixed(1)}%
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg shadow-sm ${getStatusBgColor(test.moisture, 'moisture')}`}>
                    <p className="text-sm text-green-800 font-medium">Moisture</p>
                    <p className={`text-lg font-bold ${getStatusColor(test.moisture, 'moisture')}`}>
                      {test.moisture}%
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Legend */}
      <div className="mt-6 p-5 bg-gray-50 rounded-lg border-2 border-gray-200 shadow-sm">
        <h4 className="text-lg font-semibold text-gray-800 mb-3">Understanding Your Soil Health Indicators</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-base">
          <div>
            <div className="flex items-center mb-2">
              <span className="h-4 w-4 rounded-full bg-green-500 mr-2"></span>
              <span className="font-semibold">Optimal Range</span>
            </div>
            <p className="text-gray-700">Values within the recommended range for optimal crop growth</p>
          </div>
          <div>
            <div className="flex items-center mb-2">
              <span className="h-4 w-4 rounded-full bg-orange-500 mr-2"></span>
              <span className="font-semibold">Below Optimal</span>
            </div>
            <p className="text-gray-700">Values below recommended levels, may require supplements</p>
          </div>
          <div>
            <div className="flex items-center mb-2">
              <span className="h-4 w-4 rounded-full bg-purple-500 mr-2"></span>
              <span className="font-semibold">Above Optimal</span>
            </div>
            <p className="text-gray-700">Values above recommended levels, may require remediation</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SoilHealthComponent; 