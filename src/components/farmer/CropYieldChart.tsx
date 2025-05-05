"use client";

import React, { useState } from 'react';
import BarChart from '@/components/charts/BarChart';
import { ChartData } from 'chart.js';

type CropData = {
  name: string;
  currentYield: number;
  previousYield: number;
  targetYield: number;
  unit: string;
};

interface CropYieldChartProps {
  crops: CropData[];
  title?: string;
  className?: string;
}

export default function CropYieldChart({
  crops,
  title = 'Crop Yield Comparison',
  className = '',
}: CropYieldChartProps) {
  const [selectedMetric, setSelectedMetric] = useState<'current' | 'comparison'>('current');
  
  // Format the data for the current yield view
  const currentYieldData: ChartData<'bar'> = {
    labels: crops.map(crop => crop.name),
    datasets: [
      {
        label: 'Current Yield',
        data: crops.map(crop => crop.currentYield),
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1,
      },
      {
        label: 'Target Yield',
        data: crops.map(crop => crop.targetYield),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
    ],
  };
  
  // Format the data for the comparison view
  const comparisonData: ChartData<'bar'> = {
    labels: crops.map(crop => crop.name),
    datasets: [
      {
        label: 'Current Yield',
        data: crops.map(crop => crop.currentYield),
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1,
      },
      {
        label: 'Previous Yield',
        data: crops.map(crop => crop.previousYield),
        backgroundColor: 'rgba(234, 179, 8, 0.5)',
        borderColor: 'rgb(234, 179, 8)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm p-4 ${className}`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <p className="text-sm text-gray-600">
            {selectedMetric === 'current' ? 'Current yield vs target yield' : 'Current yield vs previous season'}
          </p>
        </div>
        
        <div className="flex mt-2 md:mt-0 border rounded-lg overflow-hidden">
          <button
            onClick={() => setSelectedMetric('current')}
            className={`px-3 py-1 text-sm ${
              selectedMetric === 'current'
                ? 'bg-green-600 text-white'
                : 'bg-white text-green-700 hover:bg-green-50'
            }`}
          >
            Target
          </button>
          <button
            onClick={() => setSelectedMetric('comparison')}
            className={`px-3 py-1 text-sm ${
              selectedMetric === 'comparison'
                ? 'bg-green-600 text-white'
                : 'bg-white text-green-700 hover:bg-green-50'
            }`}
          >
            Previous Season
          </button>
        </div>
      </div>
      
      <BarChart
        title=""
        data={selectedMetric === 'current' ? currentYieldData : comparisonData}
        height={300}
        options={{
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: false,
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: crops[0]?.unit || 'kg/hectare',
              },
            },
          },
        }}
      />
      
      {/* Crop Details */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-2">
        {crops.map((crop, index) => (
          <div key={index} className="border border-green-100 rounded-lg p-3 bg-green-50">
            <div className="flex justify-between items-start">
              <h4 className="font-medium text-green-800">{crop.name}</h4>
              <span className="text-xs bg-white px-2 py-1 rounded-full text-green-600 border border-green-200">
                {crop.unit}
              </span>
            </div>
            <div className="mt-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Current:</span>
                <span className="font-medium text-green-700">{crop.currentYield}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Previous:</span>
                <span className="font-medium text-amber-700">{crop.previousYield}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Target:</span>
                <span className="font-medium text-blue-700">{crop.targetYield}</span>
              </div>
              <div className="flex justify-between mt-1 pt-1 border-t border-green-200">
                <span className="text-gray-600">Performance:</span>
                <span className={`font-medium ${
                  crop.currentYield >= crop.targetYield 
                    ? 'text-green-700' 
                    : crop.currentYield >= crop.previousYield 
                      ? 'text-amber-700' 
                      : 'text-red-700'
                }`}>
                  {crop.currentYield >= crop.targetYield 
                    ? 'On Target' 
                    : crop.currentYield >= crop.previousYield 
                      ? 'Improving' 
                      : 'Needs Attention'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 