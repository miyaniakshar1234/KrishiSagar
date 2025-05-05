"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { signUpUser, signInWithGoogle, createClient } from '@/lib/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// User types based on Krishi Sagar requirements
const USER_TYPES = [
  { id: 'farmer', label: 'Farmer', icon: '🌾' },
  { id: 'store_owner', label: 'Agro Store Owner', icon: '🏪' },
  { id: 'broker', label: 'Yard Market Broker', icon: '🏢' },
  { id: 'expert', label: 'Agriculture Expert', icon: '👩‍🔬' },
  { id: 'student', label: 'Agriculture Student', icon: '👨‍🎓' },
  { id: 'consumer', label: 'Consumer', icon: '👩‍🛒' },
];

export default function SignUpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isOauth = searchParams.get('oauth') === 'true';
  const emailFromOauth = searchParams.get('email') || '';
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(isOauth ? 1 : 1);
  const [userType, setUserType] = useState<string | null>(null);

  // Form fields
  const [formData, setFormData] = useState({
    // Basic info
    email: emailFromOauth,
    password: '',
    confirmPassword: '',
    name: '',
    mobile: '',
    dob: '',
    address: '',
    
    // Farmer specific
    landArea: '',
    cropTypes: '',
    
    // Store owner specific
    shopName: '',
    shopAddress: '',
    gstNumber: '',
    
    // Broker specific
    marketName: '',
    brokerLicense: '',
    
    // Expert specific
    expertise: '',
    qualification: '',
    
    // Student specific
    institution: '',
    fieldOfStudy: '',
    
    // Consumer specific
    interests: '',
    dietaryPreferences: '',
  });

  // If coming from OAuth redirect, we need to handle differently
  useEffect(() => {
    if (isOauth && emailFromOauth) {
      // Set email from query parameter
      setFormData(prev => ({ ...prev, email: emailFromOauth }));
      // Skip password fields as we're using OAuth
    }
  }, [isOauth, emailFromOauth]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const selectUserType = (type: string) => {
    setUserType(type);
    setCurrentStep(2);
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    // For OAuth users, we don't need to validate password
    if (!isOauth) {
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords don't match");
        setIsLoading(false);
        return;
      }
      
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters");
        setIsLoading(false);
        return;
      }
    }

    // Validate userType is selected
    if (!userType) {
      setError("Please select a user type");
      setIsLoading(false);
      return;
    }

    // Validate required fields based on user type
    if (!formData.name) {
      setError("Please provide your name");
      setIsLoading(false);
      return;
    }
    
    // Validate email format
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Please provide a valid email address");
      setIsLoading(false);
      return;
    }
    
    // Validate user type specific required fields
    if (userType === 'store_owner' && !formData.shopName) {
      setError("Shop name is required for store owners");
      setIsLoading(false);
      return;
    }

    try {
      // For OAuth users, we're just updating the user metadata and profile
      if (isOauth) {
        // We need to update the existing user's metadata and profile
        const supabase = createClient();
        
        // Update user metadata
        await supabase.auth.updateUser({
          data: {
            name: formData.name,
            user_type: userType,
          }
        });
        
        // Insert into users table
        await supabase.from('users').upsert({
          id: (await supabase.auth.getUser()).data.user?.id,
          email: formData.email,
          full_name: formData.name,
          phone: formData.mobile || '',
          user_type: userType,
          language_preference: 'en',
        });
        
        // Insert into type-specific profile table
        if (userType === 'farmer') {
          await supabase.from('farmer_profiles').upsert({
            user_id: (await supabase.auth.getUser()).data.user?.id,
            farm_location: formData.address || '',
            crops_grown: formData.cropTypes ? [formData.cropTypes] : [],
            farming_practices: []
          });
        } else if (userType === 'store_owner') {
          await supabase.from('store_owner_profiles').upsert({
            user_id: (await supabase.auth.getUser()).data.user?.id,
            store_name: formData.shopName || '',
            store_location: formData.shopAddress || '',
            gst_number: formData.gstNumber || '',
            specializations: []
          });
        } else if (userType === 'broker') {
          await supabase.from('broker_profiles').upsert({
            user_id: (await supabase.auth.getUser()).data.user?.id,
            market_name: formData.marketName || '',
            license_number: formData.brokerLicense || '',
            specializations: []
          });
        } else if (userType === 'expert') {
          await supabase.from('expert_profiles').upsert({
            user_id: (await supabase.auth.getUser()).data.user?.id,
            expertise: formData.expertise || '',
            qualification: formData.qualification || '',
            years_experience: 0
          });
        } else if (userType === 'student') {
          await supabase.from('student_profiles').upsert({
            user_id: (await supabase.auth.getUser()).data.user?.id,
            institution: formData.institution || '',
            field_of_study: formData.fieldOfStudy || '',
            graduation_year: 0
          });
        } else if (userType === 'consumer') {
          await supabase.from('consumer_profiles').upsert({
            user_id: (await supabase.auth.getUser()).data.user?.id,
            preferences: formData.dietaryPreferences || '',
            interests: formData.interests ? [formData.interests] : []
          });
        }
        
        setSuccess('Your profile has been set up successfully!');
        
        // Redirect to the dashboard after successful profile setup
        setTimeout(() => {
          router.push(`/dashboard/${userType}`);
        }, 1500);
      } else {
        // Regular email/password sign up
        // Basic registration with Supabase Auth and store additional profile data
        const { data, error } = await signUpUser(
          formData.email, 
          formData.password,
          {
            name: formData.name,
            userType: userType,
            mobile: formData.mobile || '',
            address: formData.address || '',
            language: 'en', // Default language, could be made selectable in the form
            // User type specific fields
            cropTypes: formData.cropTypes || '', // For farmers
            landArea: formData.landArea || '', // For farmers
            shopName: formData.shopName || '', // For store owners
            shopAddress: formData.shopAddress || '', // For store owners
            gstNumber: formData.gstNumber || '', // For store owners
            marketName: formData.marketName || '', // For brokers
            brokerLicense: formData.brokerLicense || '', // For brokers
            expertise: formData.expertise || '', // For experts
            qualification: formData.qualification || '', // For experts
            institution: formData.institution || '', // For students
            fieldOfStudy: formData.fieldOfStudy || '', // For students
            interests: formData.interests || '', // For consumers
            dietaryPreferences: formData.dietaryPreferences || '' // For consumers
          }
        );
        
        if (error) {
          console.error('Signup error:', error);
          
          // Check if it's the "User already registered" error and provide a helpful message
          if (typeof error === 'string' && error.includes('already registered')) {
            setError('This email is already registered. Please sign in instead.');
          } else {
            setError(typeof error === 'string' ? error : 'An error occurred during sign up');
          }
          
          setIsLoading(false);
          return;
        }
        
        setSuccess('Registration successful! Please check your email to confirm your account.');
        
        // Redirect to the dashboard after successful signup
        setTimeout(() => {
          if (userType) {
            router.push(`/dashboard/${userType}`);
          } else {
            router.push('/');
          }
        }, 2000);
      }
    } catch (err: any) {
      const errorMessage = err?.message || err?.error || 'An error occurred during sign up';
      setError(errorMessage);
      console.error('Signup error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await signInWithGoogle();
      if (error) throw error;
      // The user will be redirected to Google Auth
    } catch (err: any) {
      setError(err.message || 'An error occurred during Google sign up');
      setIsLoading(false);
    }
  };

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Render fields based on user type
  const renderUserTypeFields = () => {
    switch (userType) {
      case 'farmer':
        return (
          <>
            <div className="space-y-4">
              <div>
                <label htmlFor="landArea" className="block text-sm font-medium text-gray-700">
                  Area of Land (in acres/hectares)
                </label>
                <input
                  id="landArea"
                  name="landArea"
                  type="text"
                  value={formData.landArea}
                  onChange={handleInputChange}
                  placeholder="e.g., 5 acres"
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2.5 text-gray-900 placeholder-gray-400 bg-white"
                />
              </div>
              <div>
                <label htmlFor="cropTypes" className="block text-sm font-medium text-gray-700">
                  Types of Crops You Grow
                </label>
                <input
                  id="cropTypes"
                  name="cropTypes"
                  type="text"
                  value={formData.cropTypes}
                  onChange={handleInputChange}
                  placeholder="e.g., Rice, Wheat, Vegetables"
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2.5 text-gray-900 placeholder-gray-400 bg-white"
                />
              </div>
            </div>
          </>
        );
      
      case 'store_owner':
        return (
          <>
            <div className="space-y-4">
              <div>
                <label htmlFor="shopName" className="block text-sm font-medium text-gray-700">
                  Shop Name
                </label>
                <input
                  id="shopName"
                  name="shopName"
                  type="text"
                  value={formData.shopName}
                  onChange={handleInputChange}
                  placeholder="e.g., Krishna Agricultural Supplies"
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2.5 text-gray-900 placeholder-gray-400 bg-white"
                />
              </div>
              <div>
                <label htmlFor="shopAddress" className="block text-sm font-medium text-gray-700">
                  Shop Address
                </label>
                <textarea
                  id="shopAddress"
                  name="shopAddress"
                  value={formData.shopAddress}
                  onChange={handleInputChange}
                  placeholder="Enter your shop's complete address"
                  rows={3}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2.5 text-gray-900 placeholder-gray-400 bg-white"
                />
              </div>
              <div>
                <label htmlFor="gstNumber" className="block text-sm font-medium text-gray-700">
                  GST Number
                </label>
                <input
                  id="gstNumber"
                  name="gstNumber"
                  type="text"
                  value={formData.gstNumber}
                  onChange={handleInputChange}
                  placeholder="e.g., 22AAAAA0000A1Z5"
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2.5 text-gray-900 placeholder-gray-400 bg-white"
                />
              </div>
            </div>
          </>
        );
      
      case 'broker':
        return (
          <>
            <div className="space-y-4">
              <div>
                <label htmlFor="marketName" className="block text-sm font-medium text-gray-700">
                  Market Name
                </label>
                <input
                  id="marketName"
                  name="marketName"
                  type="text"
                  value={formData.marketName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2.5 text-gray-900 placeholder-gray-400 bg-white"
                />
              </div>
              <div>
                <label htmlFor="brokerLicense" className="block text-sm font-medium text-gray-700">
                  Broker License Number
                </label>
                <input
                  id="brokerLicense"
                  name="brokerLicense"
                  type="text"
                  value={formData.brokerLicense}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2.5 text-gray-900 placeholder-gray-400 bg-white"
                />
              </div>
            </div>
          </>
        );
      
      case 'expert':
        return (
          <>
            <div className="space-y-4">
              <div>
                <label htmlFor="expertise" className="block text-sm font-medium text-gray-700">
                  Area of Expertise
                </label>
                <input
                  id="expertise"
                  name="expertise"
                  type="text"
                  value={formData.expertise}
                  onChange={handleInputChange}
                  placeholder="e.g., Organic Farming, Pest Control"
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2.5 text-gray-900 placeholder-gray-400 bg-white"
                />
              </div>
              <div>
                <label htmlFor="qualification" className="block text-sm font-medium text-gray-700">
                  Qualifications
                </label>
                <input
                  id="qualification"
                  name="qualification"
                  type="text"
                  value={formData.qualification}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2.5 text-gray-900 placeholder-gray-400 bg-white"
                />
              </div>
            </div>
          </>
        );
      
      case 'student':
        return (
          <>
            <div className="space-y-4">
              <div>
                <label htmlFor="institution" className="block text-sm font-medium text-gray-700">
                  Educational Institution
                </label>
                <input
                  id="institution"
                  name="institution"
                  type="text"
                  value={formData.institution}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2.5 text-gray-900 placeholder-gray-400 bg-white"
                />
              </div>
              <div>
                <label htmlFor="fieldOfStudy" className="block text-sm font-medium text-gray-700">
                  Field of Study
                </label>
                <input
                  id="fieldOfStudy"
                  name="fieldOfStudy"
                  type="text"
                  value={formData.fieldOfStudy}
                  onChange={handleInputChange}
                  placeholder="e.g., Agricultural Science, Horticulture"
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2.5 text-gray-900 placeholder-gray-400 bg-white"
                />
              </div>
            </div>
          </>
        );
      
      case 'consumer':
        return (
          <>
            <div className="space-y-4">
              <div>
                <label htmlFor="interests" className="block text-sm font-medium text-gray-700">
                  Agricultural Interests
                </label>
                <input
                  id="interests"
                  name="interests"
                  type="text"
                  value={formData.interests}
                  onChange={handleInputChange}
                  placeholder="e.g., Organic Produce, Local Farmers"
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2.5 text-gray-900 placeholder-gray-400 bg-white"
                />
              </div>
              <div>
                <label htmlFor="dietaryPreferences" className="block text-sm font-medium text-gray-700">
                  Dietary Preferences
                </label>
                <input
                  id="dietaryPreferences"
                  name="dietaryPreferences"
                  type="text"
                  value={formData.dietaryPreferences}
                  onChange={handleInputChange}
                  placeholder="e.g., Vegetarian, Vegan, Gluten-Free"
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2.5 text-gray-900 placeholder-gray-400 bg-white"
                />
              </div>
            </div>
          </>
        );
      
      default:
        return userType ? (
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-green-800">Basic profile information collected. Additional fields may be requested later.</p>
          </div>
        ) : null;
    }
  };

  const renderBasicInfoFields = () => (
    <div className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleInputChange}
          required
          placeholder="Your full name"
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2.5 text-gray-900 placeholder-gray-400 bg-white"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          required
          placeholder="your.email@example.com"
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2.5 text-gray-900 placeholder-gray-400 bg-white"
        />
      </div>
      <div>
        <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">
          Mobile Number
        </label>
        <input
          id="mobile"
          name="mobile"
          type="tel"
          value={formData.mobile}
          onChange={handleInputChange}
          placeholder="+91 98765 43210"
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2.5 text-gray-900 placeholder-gray-400 bg-white"
        />
      </div>
      <div>
        <label htmlFor="dob" className="block text-sm font-medium text-gray-700">
          Date of Birth
        </label>
        <input
          id="dob"
          name="dob"
          type="date"
          value={formData.dob}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2.5 text-gray-900 placeholder-gray-400 bg-white"
        />
      </div>
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
          Address
        </label>
        <textarea
          id="address"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          placeholder="Your complete address"
          rows={3}
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2.5 text-gray-900 placeholder-gray-400 bg-white"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleInputChange}
          required
          minLength={6}
          placeholder="Create a strong password"
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2.5 text-gray-900 placeholder-gray-400 bg-white"
        />
      </div>
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          required
          minLength={6}
          placeholder="Confirm your password"
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2.5 text-gray-900 placeholder-gray-400 bg-white"
        />
      </div>
    </div>
  );

  return (
    <>
      <div className="min-h-screen bg-cover bg-center bg-no-repeat" style={{ 
        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), url(/images/farm/crops/rice.jpg)',
      }}>
        <Header />
        <div className="pt-24 pb-12 min-h-[calc(100vh-200px)]">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto backdrop-blur-sm bg-white/80 rounded-2xl shadow-xl overflow-hidden border border-green-100">
              {currentStep === 1 ? (
                <div className="p-8">
                  <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-green-800 mb-3">Join Krishi Sagar</h1>
                    <p className="text-gray-600 text-lg">Select your role in the agricultural ecosystem</p>
                  </div>
                  
                  {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r-md" role="alert">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm">{error}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {USER_TYPES.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => selectUserType(type.id)}
                        className="flex flex-col items-center justify-center p-6 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all group"
                      >
                        <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{type.icon}</div>
                        <span className="text-lg font-medium text-gray-800">{type.label}</span>
                      </button>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-center mt-8">
                    <div className="w-full max-w-xs">
                      <button
                        onClick={handleGoogleSignUp}
                        disabled={isLoading}
                        className="w-full flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                      >
                        <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" width="24" height="24">
                          <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                            <path
                              fill="#4285F4"
                              d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
                            />
                            <path
                              fill="#34A853"
                              d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
                            />
                            <path
                              fill="#FBBC05"
                              d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
                            />
                            <path
                              fill="#EA4335"
                              d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
                            />
                          </g>
                        </svg>
                        Continue with Google
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-6 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link href="/auth/sign-in" className="font-medium text-green-600 hover:text-green-700">
                      Sign in
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="md:flex">
                  <div className="md:w-1/3 bg-gradient-to-br from-green-700 to-green-900 text-white p-8 hidden md:block relative overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute -bottom-16 -left-16 w-40 h-40 rounded-full bg-green-600/20"></div>
                    <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-green-600/20"></div>
                    
                    <div className="relative h-full flex flex-col justify-between z-10">
                      <div>
                        <h2 className="text-2xl font-bold mb-6 text-white">Create Your Account</h2>
                        <p className="mb-4 text-green-50">Join our community of agricultural professionals and enthusiasts.</p>
                        
                        <div className="space-y-4 mt-8">
                          <div className="flex items-center">
                            <div className={`rounded-full h-8 w-8 flex items-center justify-center font-bold ${currentStep === 1 ? 'bg-white text-green-700' : 'bg-green-600/30 text-white'}`}>1</div>
                            <span className="ml-3 text-green-50">Select your role</span>
                          </div>
                          <div className="flex items-center">
                            <div className={`rounded-full h-8 w-8 flex items-center justify-center font-bold ${currentStep === 2 ? 'bg-white text-green-700' : 'bg-green-600/30 text-white'}`}>2</div>
                            <span className="ml-3 text-green-50">Complete your profile</span>
                          </div>
                          <div className="flex items-center">
                            <div className={`rounded-full h-8 w-8 flex items-center justify-center font-bold bg-green-600/30 text-white`}>3</div>
                            <span className="ml-3 text-green-50">Start your journey</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-auto">
                        <p className="text-sm text-green-100">
                          By signing up, you agree to our Terms of Service and Privacy Policy.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:w-2/3 p-8">
                    <div className="flex items-center mb-6">
                      <button
                        onClick={goBack}
                        className="p-2 rounded-full hover:bg-gray-100"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <h2 className="text-2xl font-bold text-gray-800 ml-2">
                        {userType && USER_TYPES.find(type => type.id === userType)?.label} Registration
                      </h2>
                    </div>
                    
                    {error && (
                      <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r-md" role="alert">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm">{error}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {success && (
                      <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-r-md" role="alert">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm">{success}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <form onSubmit={handleSignUp}>
                      <div className="space-y-6">
                        {renderBasicInfoFields()}
                        
                        {renderUserTypeFields()}
                        
                        <div className="flex items-center">
                          <input
                            id="terms"
                            name="terms"
                            type="checkbox"
                            required
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                          />
                          <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                            I agree to the{' '}
                            <Link href="/terms" className="font-medium text-green-600 hover:text-green-700">
                              Terms of Service
                            </Link>{' '}
                            and{' '}
                            <Link href="/privacy" className="font-medium text-green-600 hover:text-green-700">
                              Privacy Policy
                            </Link>
                          </label>
                        </div>
                        
                        <div>
                          <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-md text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-colors"
                          >
                            {isLoading ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Creating account...
                              </>
                            ) : 'Create Account'}
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
} 