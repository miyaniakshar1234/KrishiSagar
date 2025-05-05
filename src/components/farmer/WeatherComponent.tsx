"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface WeatherData {
  location: string;
  condition: string;
  icon: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  rainChance: number;
  uvIndex: number;
  airQuality?: string;
  timestamp: Date;
  forecast: DailyForecast[];
}

interface DailyForecast {
  date: string;
  condition: string;
  icon: string;
  tempMax: number;
  tempMin: number;
  rainChance: number;
}

const WeatherComponent = ({ farmLocation }: { farmLocation?: string }) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForecast, setShowForecast] = useState(false);
  const [userLocation, setUserLocation] = useState<string | null>(farmLocation || null);
  
  useEffect(() => {
    // If farm location is provided, use it directly
    if (farmLocation) {
      setUserLocation(farmLocation);
      fetchWeatherData(farmLocation);
      return;
    }
    
    // Otherwise, try to get the user's location
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = `${position.coords.latitude},${position.coords.longitude}`;
          setUserLocation(coords);
          fetchWeatherData(coords);
        },
        (err) => {
          console.error('Error getting location:', err);
          setError('Failed to get your location. Please enter it manually.');
          setIsLoading(false);
          // Fall back to a default location
          fetchWeatherData('New Delhi, India');
        }
      );
    } else {
      setError('Geolocation is not supported by your browser. Please enter your location manually.');
      setIsLoading(false);
      // Fall back to a default location
      fetchWeatherData('New Delhi, India');
    }
  }, [farmLocation]);
  
  const fetchWeatherData = async (location: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, we would use a weather API like OpenWeatherMap, AccuWeather, etc.
      // Since we can't actually make API calls for this demo, we'll use mock data
      
      // This is where you would make the actual API call in a production app
      // Example:
      // const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${process.env.WEATHER_API_KEY}&q=${location}&days=7`);
      // const data = await response.json();
      
      // For now, create some realistic mock data
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call delay
      
      const mockData: WeatherData = {
        location: location.includes(',') ? 'Your Farm' : location,
        condition: getRandomCondition(),
        icon: '☀️', // Would be a URL to an icon in a real API
        temperature: 25 + Math.floor(Math.random() * 10),
        humidity: 50 + Math.floor(Math.random() * 30),
        windSpeed: 5 + Math.floor(Math.random() * 15),
        windDirection: 'NE',
        rainChance: Math.floor(Math.random() * 30),
        uvIndex: Math.floor(Math.random() * 10) + 1,
        airQuality: 'Good',
        timestamp: new Date(),
        forecast: Array.from({ length: 7 }, (_, i) => ({
          date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toLocaleDateString(),
          condition: getRandomCondition(),
          icon: '☀️', // Would be a URL to an icon in a real API
          tempMax: 25 + Math.floor(Math.random() * 10),
          tempMin: 18 + Math.floor(Math.random() * 7),
          rainChance: Math.floor(Math.random() * 30)
        }))
      };
      
      setWeatherData(mockData);
      setIsLoading(false);
      
      // In a real app, we might store this data in the user's profile
      // const supabase = createClient();
      // await supabase.from('farmer_profiles').update({ last_weather_check: new Date().toISOString() }).eq('user_id', userId);
      
    } catch (err) {
      console.error('Error fetching weather data:', err);
      setError('Failed to fetch weather data. Please try again later.');
      setIsLoading(false);
    }
  };
  
  // Helper function to get a random weather condition
  const getRandomCondition = () => {
    const conditions = [
      'Sunny', 'Partly cloudy', 'Cloudy', 'Overcast', 'Mist', 
      'Patchy rain possible', 'Light rain', 'Moderate rain'
    ];
    return conditions[Math.floor(Math.random() * conditions.length)];
  };
  
  // Helper function to get weather icon based on condition
  const getWeatherIcon = (condition: string) => {
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes('sun')) return '☀️';
    if (conditionLower.includes('cloud')) return '⛅';
    if (conditionLower.includes('rain')) return '🌧️';
    if (conditionLower.includes('storm') || conditionLower.includes('thunder')) return '⛈️';
    if (conditionLower.includes('snow')) return '❄️';
    if (conditionLower.includes('mist') || conditionLower.includes('fog')) return '🌫️';
    return '☁️';
  };
  
  // Helper function to format UV index
  const getUVIndexDescription = (index: number) => {
    if (index <= 2) return 'Low';
    if (index <= 5) return 'Moderate';
    if (index <= 7) return 'High';
    if (index <= 10) return 'Very High';
    return 'Extreme';
  };
  
  // Function to handle location search
  const handleLocationSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.elements.namedItem('location') as HTMLInputElement;
    
    if (input?.value) {
      setUserLocation(input.value);
      fetchWeatherData(input.value);
    }
  };
  
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
        <div className="flex justify-between items-center mb-4">
          <div className="h-8 bg-blue-100 rounded w-1/3"></div>
          <div className="h-6 bg-blue-100 rounded w-1/4"></div>
        </div>
        <div className="flex space-x-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full"></div>
          <div className="flex-1">
            <div className="h-6 bg-blue-100 rounded w-2/3 mb-2"></div>
            <div className="h-4 bg-blue-100 rounded w-1/2"></div>
            <div className="grid grid-cols-4 gap-3 mt-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-blue-50 p-3 rounded-lg">
                  <div className="h-3 bg-blue-100 rounded w-full mb-2"></div>
                  <div className="h-4 bg-blue-100 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center p-4">
          <div className="text-red-500 text-lg mb-3">🌩️ {error}</div>
          <form onSubmit={handleLocationSearch} className="flex">
            <input 
              type="text" 
              name="location" 
              placeholder="Enter your city or region" 
              className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
              type="submit" 
              className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      </div>
    );
  }
  
  if (!weatherData) {
    return null;
  }
  
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Current Weather */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-semibold text-blue-800">Current Weather</h2>
            <p className="text-blue-700 font-medium">{weatherData.location}</p>
          </div>
          <div className="text-sm text-blue-700 font-medium">
            {weatherData.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="text-6xl mr-6">{getWeatherIcon(weatherData.condition)}</div>
          <div className="flex-1">
            <div className="flex items-baseline">
              <span className="text-4xl font-bold text-blue-800">{weatherData.temperature}°C</span>
              <span className="ml-3 text-blue-700 font-medium">{weatherData.condition}</span>
            </div>
            <p className="text-blue-700 text-sm font-medium">
              Feels like {weatherData.temperature - 2 + Math.floor(Math.random() * 4)}°C
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
              <div className="bg-white/90 p-3 rounded-lg shadow-sm">
                <p className="text-xs text-blue-700 font-medium">Humidity</p>
                <p className="text-sm font-semibold text-blue-800">{weatherData.humidity}%</p>
              </div>
              <div className="bg-white/90 p-3 rounded-lg shadow-sm">
                <p className="text-xs text-blue-700 font-medium">Wind</p>
                <p className="text-sm font-semibold text-blue-800">{weatherData.windSpeed} km/h</p>
              </div>
              <div className="bg-white/90 p-3 rounded-lg shadow-sm">
                <p className="text-xs text-blue-700 font-medium">Rain Chance</p>
                <p className="text-sm font-semibold text-blue-800">{weatherData.rainChance}%</p>
              </div>
              <div className="bg-white/90 p-3 rounded-lg shadow-sm">
                <p className="text-xs text-blue-700 font-medium">UV Index</p>
                <p className="text-sm font-semibold text-blue-800">{getUVIndexDescription(weatherData.uvIndex)}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-5 flex justify-between items-center">
          <button 
            onClick={() => setShowForecast(!showForecast)}
            className="text-blue-800 hover:text-blue-900 text-sm font-medium flex items-center"
          >
            {showForecast ? 'Hide Forecast' : '7-Day Forecast'}
            <svg className={`h-4 w-4 ml-1 transition-transform ${showForecast ? 'rotate-180' : ''}`} 
                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <div>
            <form onSubmit={handleLocationSearch} className="flex">
              <input 
                type="text" 
                name="location" 
                placeholder="Change location" 
                className="w-32 sm:w-40 text-xs border-2 border-blue-300 rounded-l-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button 
                type="submit" 
                className="bg-blue-600 text-white text-xs px-3 py-1 rounded-r-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Update
              </button>
            </form>
          </div>
        </div>
      </div>
      
      {/* 7-Day Forecast */}
      {showForecast && (
        <div className="p-4 bg-white">
          <h3 className="text-lg font-medium text-gray-800 mb-3">7-Day Forecast</h3>
          <div className="space-y-2 overflow-x-auto">
            <div className="grid grid-cols-7 gap-2 min-w-[700px]">
              {weatherData.forecast.map((day, index) => (
                <div key={index} className={`p-3 rounded-lg text-center ${index === 0 ? 'bg-blue-50 border border-blue-100' : 'hover:bg-gray-50'}`}>
                  <p className="text-xs font-medium text-gray-600">{index === 0 ? 'Today' : new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}</p>
                  <div className="text-2xl my-1">{getWeatherIcon(day.condition)}</div>
                  <div className="flex justify-center gap-2 text-xs">
                    <span className="font-medium text-gray-800">{day.tempMax}°</span>
                    <span className="text-gray-600">{day.tempMin}°</span>
                  </div>
                  <div className="mt-1 text-xs text-blue-700 font-medium">{day.rainChance}% rain</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Farming Tips Based on Weather */}
          <div className="mt-5 bg-green-50 rounded-lg p-4 border border-green-100 shadow-sm">
            <h3 className="text-sm font-medium text-green-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Weather-Based Farming Tips
            </h3>
            <ul className="mt-2 space-y-1">
              {weatherData.rainChance > 20 ? (
                <li className="text-xs text-green-800 flex items-start font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-green-600 mr-1 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Consider delaying pesticide application due to expected rainfall
                </li>
              ) : (
                <li className="text-xs text-green-800 flex items-start font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-green-600 mr-1 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Good conditions for pesticide application
                </li>
              )}
              {weatherData.windSpeed > 10 ? (
                <li className="text-xs text-green-800 flex items-start font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-green-600 mr-1 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Strong winds expected - secure any covers or equipment
                </li>
              ) : (
                <li className="text-xs text-green-800 flex items-start font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-green-600 mr-1 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Light wind conditions good for drone monitoring or spraying
                </li>
              )}
              <li className="text-xs text-green-800 flex items-start font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-green-600 mr-1 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {weatherData.temperature > 30 
                  ? "High temperatures expected - ensure adequate irrigation"
                  : "Moderate temperatures favorable for most crops"}
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherComponent; 