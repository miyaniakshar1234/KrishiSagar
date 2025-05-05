"use client";

import React, { useState, useEffect } from 'react';
import { 
  getCurrentUser, 
  getCropRotationPlans,
  getCropRotationPlanById,
  addCropRotationPlan,
  updateCropRotationPlan,
  deleteCropRotationPlan,
  addCropCycle,
  updateCropCycle,
  deleteCropCycle,
  getFarmLocations
} from '@/lib/supabase/client';

interface CropRotationPlan {
  id: string;
  user_id: string;
  name: string;
  location: string;
  start_date: string;
  created_at: string;
  updated_at: string;
  crop_cycles: CropCycle[];
}

interface CropCycle {
  id: string;
  plan_id: string;
  season_name: string;
  crop_family: string;
  crop_name: string;
  start_date: string;
  end_date: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

interface FarmLocation {
  id: string;
  name: string;
  coordinates?: string;
  area?: number;
}

const CropRotationComponent = () => {
  // State for plans and UI control
  const [plans, setPlans] = useState<CropRotationPlan[]>([]);
  const [farmLocations, setFarmLocations] = useState<FarmLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for active plan and editing
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [activePlan, setActivePlan] = useState<CropRotationPlan | null>(null);
  const [showAddPlanForm, setShowAddPlanForm] = useState(false);
  const [showAddCycleForm, setShowAddCycleForm] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [editingCycleId, setEditingCycleId] = useState<string | null>(null);
  
  // Form state for plan
  const [planFormData, setPlanFormData] = useState({
    name: '',
    location: '',
    start_date: new Date().toISOString().split('T')[0]
  });
  
  // Form state for crop cycle
  const [cycleFormData, setCycleFormData] = useState({
    season_name: '',
    crop_family: '',
    crop_name: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split('T')[0],
    notes: ''
  });
  
  // Common crop families for dropdown
  const cropFamilies = [
    'Legumes', 
    'Brassicas', 
    'Nightshades', 
    'Cucurbits', 
    'Alliums', 
    'Cereals',
    'Root Vegetables',
    'Leafy Greens'
  ];
  
  // Sample crops for each family
  const cropsByFamily: {[key: string]: string[]} = {
    'Legumes': ['Beans', 'Peas', 'Lentils', 'Chickpeas', 'Soybeans'],
    'Brassicas': ['Cabbage', 'Cauliflower', 'Broccoli', 'Radish', 'Mustard'],
    'Nightshades': ['Tomato', 'Potato', 'Eggplant', 'Peppers'],
    'Cucurbits': ['Cucumber', 'Melons', 'Squash', 'Pumpkin', 'Gourd'],
    'Alliums': ['Onion', 'Garlic', 'Leeks', 'Shallots'],
    'Cereals': ['Rice', 'Wheat', 'Corn', 'Barley', 'Millet'],
    'Root Vegetables': ['Carrot', 'Beetroot', 'Turnip', 'Sweet Potato'],
    'Leafy Greens': ['Spinach', 'Lettuce', 'Kale', 'Chard']
  };
  
  // Common seasons
  const seasons = ['Kharif (Monsoon)', 'Rabi (Winter)', 'Zaid (Summer)', 'Year-round'];
  
  // Fetch plans and farm locations on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const user = await getCurrentUser();
        if (!user) {
          throw new Error('You must be logged in to view crop rotation plans');
        }
        
        // Fetch farm locations
        const { data: locationData, error: locationError } = await getFarmLocations();
        if (locationError) throw new Error(locationError);
        setFarmLocations(locationData || []);
        
        // Fetch crop rotation plans
        const { data: plansData, error: plansError } = await getCropRotationPlans();
        if (plansError) throw new Error(plansError);
        setPlans(plansData || []);
        
        // Select the first plan if available
        if (plansData && plansData.length > 0) {
          setSelectedPlanId(plansData[0].id);
          setActivePlan(plansData[0]);
        }
        
      } catch (err) {
        console.error('Error fetching crop rotation data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load crop rotation data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Load selected plan details when selectedPlanId changes
  useEffect(() => {
    if (!selectedPlanId) {
      setActivePlan(null);
      return;
    }
    
    const fetchPlanDetails = async () => {
      try {
        const { data, error } = await getCropRotationPlanById(selectedPlanId);
        if (error) throw new Error(error);
        
        setActivePlan(data);
      } catch (err) {
        console.error('Error fetching plan details:', err);
        setError(err instanceof Error ? err.message : 'Failed to load plan details');
      }
    };
    
    fetchPlanDetails();
  }, [selectedPlanId]);
  
  // Handle plan form input changes
  const handlePlanInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPlanFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle cycle form input changes
  const handleCycleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCycleFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Reset plan form
  const resetPlanForm = () => {
    setPlanFormData({
      name: '',
      location: '',
      start_date: new Date().toISOString().split('T')[0]
    });
    setEditingPlanId(null);
  };
  
  // Reset cycle form
  const resetCycleForm = () => {
    setCycleFormData({
      season_name: '',
      crop_family: '',
      crop_name: '',
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split('T')[0],
      notes: ''
    });
    setEditingCycleId(null);
  };
  
  // Handle plan form submission
  const handlePlanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingPlanId) {
        // Update existing plan
        const { data, error } = await updateCropRotationPlan(editingPlanId, planFormData);
        if (error) throw new Error(error);
        
        // Update local state
        setPlans(prev => prev.map(plan => plan.id === editingPlanId ? { ...plan, ...data } : plan));
        if (selectedPlanId === editingPlanId) {
          setActivePlan(prev => prev ? { ...prev, ...data } : null);
        }
      } else {
        // Add new plan
        const { data, error } = await addCropRotationPlan(planFormData);
        if (error) throw new Error(error);
        
        // Update local state
        const newPlan = { ...data, crop_cycles: [] };
        setPlans(prev => [newPlan, ...prev]);
        setSelectedPlanId(newPlan.id);
        setActivePlan(newPlan);
      }
      
      // Reset form and close
      resetPlanForm();
      setShowAddPlanForm(false);
      
    } catch (err) {
      console.error('Error saving plan:', err);
      setError(err instanceof Error ? err.message : 'Failed to save crop rotation plan');
    }
  };
  
  // Handle cycle form submission
  const handleCycleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!activePlan) return;
    
    try {
      if (editingCycleId) {
        // Update existing cycle
        const { data, error } = await updateCropCycle(editingCycleId, cycleFormData);
        if (error) throw new Error(error);
        
        // Update local state
        const updatedCycles = activePlan.crop_cycles.map(cycle => 
          cycle.id === editingCycleId ? { ...cycle, ...data } : cycle
        );
        
        setActivePlan(prev => prev ? {
          ...prev,
          crop_cycles: updatedCycles
        } : null);
      } else {
        // Add new cycle
        const cycleData = {
          plan_id: activePlan.id,
          ...cycleFormData
        };
        
        const { data, error } = await addCropCycle(cycleData);
        if (error) throw new Error(error);
        
        // Update local state
        setActivePlan(prev => prev ? {
          ...prev,
          crop_cycles: [...prev.crop_cycles, data]
        } : null);
      }
      
      // Reset form and close
      resetCycleForm();
      setShowAddCycleForm(false);
      
    } catch (err) {
      console.error('Error saving cycle:', err);
      setError(err instanceof Error ? err.message : 'Failed to save crop cycle');
    }
  };
  
  // Edit plan
  const handleEditPlan = (plan: CropRotationPlan) => {
    setPlanFormData({
      name: plan.name,
      location: plan.location,
      start_date: plan.start_date
    });
    setEditingPlanId(plan.id);
    setShowAddPlanForm(true);
  };
  
  // Edit cycle
  const handleEditCycle = (cycle: CropCycle) => {
    setCycleFormData({
      season_name: cycle.season_name,
      crop_family: cycle.crop_family,
      crop_name: cycle.crop_name,
      start_date: cycle.start_date,
      end_date: cycle.end_date,
      notes: cycle.notes || ''
    });
    setEditingCycleId(cycle.id);
    setShowAddCycleForm(true);
  };
  
  // Delete plan
  const handleDeletePlan = async (planId: string) => {
    if (!window.confirm('Are you sure you want to delete this crop rotation plan?')) {
      return;
    }
    
    try {
      const { success, error } = await deleteCropRotationPlan(planId);
      if (error) throw new Error(error);
      
      // Update local state
      const updatedPlans = plans.filter(plan => plan.id !== planId);
      setPlans(updatedPlans);
      
      // Select another plan if available
      if (selectedPlanId === planId) {
        if (updatedPlans.length > 0) {
          setSelectedPlanId(updatedPlans[0].id);
          setActivePlan(updatedPlans[0]);
        } else {
          setSelectedPlanId(null);
          setActivePlan(null);
        }
      }
      
    } catch (err) {
      console.error('Error deleting plan:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete crop rotation plan');
    }
  };
  
  // Delete cycle
  const handleDeleteCycle = async (cycleId: string) => {
    if (!window.confirm('Are you sure you want to delete this crop cycle?') || !activePlan) {
      return;
    }
    
    try {
      const { success, error } = await deleteCropCycle(cycleId);
      if (error) throw new Error(error);
      
      // Update local state
      const updatedCycles = activePlan.crop_cycles.filter(cycle => cycle.id !== cycleId);
      setActivePlan(prev => prev ? {
        ...prev,
        crop_cycles: updatedCycles
      } : null);
      
    } catch (err) {
      console.error('Error deleting cycle:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete crop cycle');
    }
  };

  // Calculate duration in days
  const calculateDurationDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-3">
        <h2 className="text-2xl font-bold text-gray-800">Crop Rotation Planner</h2>
        <button
          onClick={() => {
            resetPlanForm();
            setShowAddPlanForm(!showAddPlanForm);
            setShowAddCycleForm(false);
          }}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
        >
          {showAddPlanForm ? (
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
              New Rotation Plan
            </>
          )}
        </button>
      </div>
      
      {/* Loading state */}
      {isLoading && (
        <div className="bg-white rounded-xl p-6 animate-pulse">
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
      )}
      
      {/* Error state */}
      {error && (
        <div className="bg-white rounded-xl p-6">
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
      )}
      
      {/* Add/Edit Plan Form */}
      {showAddPlanForm && !isLoading && !error && (
        <div className="mb-6 bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800 mb-3">
            {editingPlanId ? 'Edit Rotation Plan' : 'Create New Rotation Plan'}
          </h3>
          <form onSubmit={handlePlanSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-green-700 mb-1">Plan Name</label>
                <input
                  type="text"
                  name="name"
                  value={planFormData.name}
                  onChange={handlePlanInputChange}
                  placeholder="e.g., 3-Year North Field Rotation"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-green-700 mb-1">Farm Location</label>
                <select
                  name="location"
                  value={planFormData.location}
                  onChange={handlePlanInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">Select Location</option>
                  {farmLocations.map(loc => (
                    <option key={loc.id} value={loc.name}>{loc.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-green-700 mb-1">Start Date</label>
                <input
                  type="date"
                  name="start_date"
                  value={planFormData.start_date}
                  onChange={handlePlanInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  resetPlanForm();
                  setShowAddPlanForm(false);
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg mr-2 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                {editingPlanId ? 'Update Plan' : 'Create Plan'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* No plans message */}
      {!isLoading && !error && plans.length === 0 && (
        <div className="bg-green-50 p-6 rounded-lg text-center mb-6">
          <h3 className="text-lg font-medium text-green-800 mb-2">No Crop Rotation Plans Yet</h3>
          <p className="text-green-600 mb-4">Create your first crop rotation plan to improve soil health and increase yields.</p>
          {!showAddPlanForm && (
            <button
              onClick={() => setShowAddPlanForm(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Create First Plan
            </button>
          )}
        </div>
      )}
      
      {/* Main content when there are plans */}
      {!isLoading && !error && plans.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Plans list */}
          <div className="lg:col-span-1 bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-700 mb-3">My Rotation Plans</h3>
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
              {plans.map(plan => (
                <div 
                  key={plan.id}
                  onClick={() => setSelectedPlanId(plan.id)}
                  className={`cursor-pointer p-3 rounded-lg transition-colors ${
                    selectedPlanId === plan.id 
                      ? 'bg-green-100 border-l-4 border-green-600' 
                      : 'bg-white hover:bg-green-50 border-l-4 border-transparent'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-800">{plan.name}</h4>
                      <p className="text-sm text-gray-500">{plan.location}</p>
                      <p className="text-xs text-gray-400 mt-1">Started: {formatDate(plan.start_date)}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditPlan(plan);
                        }}
                        className="text-gray-400 hover:text-blue-500 p-1"
                        title="Edit Plan"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePlan(plan.id);
                        }}
                        className="text-gray-400 hover:text-red-500 p-1"
                        title="Delete Plan"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Active plan details */}
          <div className="lg:col-span-3">
            {activePlan ? (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{activePlan.name}</h3>
                    <p className="text-sm text-gray-500">
                      {activePlan.location} • Started {formatDate(activePlan.start_date)}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      resetCycleForm();
                      setShowAddCycleForm(!showAddCycleForm);
                    }}
                    className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors flex items-center"
                  >
                    {showAddCycleForm ? "Cancel" : "Add Crop Cycle"}
                  </button>
                </div>
                
                {/* Add/Edit Cycle Form */}
                {showAddCycleForm && (
                  <div className="mb-6 bg-green-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-800 mb-3">
                      {editingCycleId ? 'Edit Crop Cycle' : 'Add New Crop Cycle'}
                    </h3>
                    <form onSubmit={handleCycleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-green-700 mb-1">Season</label>
                          <select
                            name="season_name"
                            value={cycleFormData.season_name}
                            onChange={handleCycleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                          >
                            <option value="">Select Season</option>
                            {seasons.map(season => (
                              <option key={season} value={season}>{season}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-green-700 mb-1">Crop Family</label>
                          <select
                            name="crop_family"
                            value={cycleFormData.crop_family}
                            onChange={handleCycleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                          >
                            <option value="">Select Crop Family</option>
                            {cropFamilies.map(family => (
                              <option key={family} value={family}>{family}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-green-700 mb-1">Crop</label>
                          <select
                            name="crop_name"
                            value={cycleFormData.crop_name}
                            onChange={handleCycleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                            disabled={!cycleFormData.crop_family}
                          >
                            <option value="">Select Crop</option>
                            {cycleFormData.crop_family && cropsByFamily[cycleFormData.crop_family]?.map(crop => (
                              <option key={crop} value={crop}>{crop}</option>
                            ))}
                          </select>
                        </div>
                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-green-700 mb-1">Start Date</label>
                            <input
                              type="date"
                              name="start_date"
                              value={cycleFormData.start_date}
                              onChange={handleCycleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-green-700 mb-1">End Date</label>
                            <input
                              type="date"
                              name="end_date"
                              value={cycleFormData.end_date}
                              onChange={handleCycleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                              required
                            />
                          </div>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-green-700 mb-1">Notes</label>
                          <textarea
                            name="notes"
                            value={cycleFormData.notes}
                            onChange={handleCycleInputChange}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Add any notes about fertilizer, irrigation, or special care requirements"
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            resetCycleForm();
                            setShowAddCycleForm(false);
                          }}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg mr-2 hover:bg-gray-100"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          {editingCycleId ? 'Update Cycle' : 'Add Cycle'}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
                
                {/* Crop cycles timeline */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-700 mb-3">Crop Cycles</h3>
                  
                  {activePlan.crop_cycles.length === 0 ? (
                    <div className="bg-white p-4 rounded-lg text-center">
                      <p className="text-gray-500">No crop cycles defined yet. Add your first crop cycle to get started.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Sort crop cycles by start date */}
                      {[...activePlan.crop_cycles]
                        .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
                        .map(cycle => (
                        <div 
                          key={cycle.id} 
                          className="bg-white p-4 rounded-lg border-l-4 border-green-500"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center">
                                <h4 className="font-medium text-gray-800">{cycle.crop_name}</h4>
                                <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                                  {cycle.crop_family}
                                </span>
                                <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                                  {cycle.season_name}
                                </span>
                              </div>
                              <p className="text-sm text-gray-500 mt-1">
                                {formatDate(cycle.start_date)} — {formatDate(cycle.end_date)}
                                <span className="ml-2 text-gray-400">
                                  ({calculateDurationDays(cycle.start_date, cycle.end_date)} days)
                                </span>
                              </p>
                              {cycle.notes && (
                                <p className="text-sm text-gray-600 mt-2 italic">"{cycle.notes}"</p>
                              )}
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleEditCycle(cycle)}
                                className="text-gray-400 hover:text-blue-500 p-1"
                                title="Edit Cycle"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDeleteCycle(cycle.id)}
                                className="text-gray-400 hover:text-red-500 p-1"
                                title="Delete Cycle"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Rotation benefits and tips */}
                {activePlan.crop_cycles.length > 0 && (
                  <div className="mt-6 bg-yellow-50 p-4 rounded-lg">
                    <h3 className="font-medium text-yellow-800 mb-2">Benefits of Your Crop Rotation Plan</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-yellow-700">
                      <li>Maintaining soil fertility through diverse nutrient requirements</li>
                      <li>Breaking pest and disease cycles</li>
                      <li>Improved soil structure through diverse root systems</li>
                      <li>Reduced erosion risk through continuous ground cover</li>
                      <li>Natural weed suppression</li>
                    </ul>
                    
                    <h3 className="font-medium text-yellow-800 mt-4 mb-2">Rotation Tips</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-yellow-700">
                      <li>Follow heavy feeders (like corn) with nitrogen fixers (like legumes)</li>
                      <li>Avoid planting the same family in the same location for 3-4 years</li>
                      <li>Consider cover crops between main crops to protect and enrich soil</li>
                      <li>Alternate between deep and shallow rooted crops</li>
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <p className="text-gray-500">Select a rotation plan from the list to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CropRotationComponent; 