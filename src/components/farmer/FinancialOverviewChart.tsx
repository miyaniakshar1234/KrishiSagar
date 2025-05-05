"use client";

import React from 'react';
import BarChart from '@/components/charts/BarChart';
import LineChart from '@/components/charts/LineChart';
import { ChartData } from 'chart.js';

type FinanceData = {
  labels: string[];
  revenue: number[];
  expenses: number[];
  profit: number[];
};

interface FinancialOverviewProps {
  data: FinanceData;
  title?: string;
  period: 'weekly' | 'monthly' | 'yearly';
  chartType?: 'line' | 'bar';
  className?: string;
}

export default function FinancialOverviewChart({
  data,
  title = 'Financial Overview',
  period = 'monthly',
  chartType = 'bar',
  className = '',
}: FinancialOverviewProps) {
  // Calculate total values
  const totalRevenue = data.revenue.reduce((sum, val) => sum + val, 0);
  const totalExpenses = data.expenses.reduce((sum, val) => sum + val, 0);
  const totalProfit = totalRevenue - totalExpenses;
  
  // Format the chart data
  const chartData: ChartData<'bar' | 'line'> = {
    labels: data.labels,
    datasets: [
      {
        label: 'Revenue',
        data: data.revenue,
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1,
      },
      {
        label: 'Expenses',
        data: data.expenses,
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1,
      },
      {
        label: 'Profit',
        data: data.profit,
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
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
            {period === 'weekly' ? 'Last 7 days' : period === 'monthly' ? 'Last 6 months' : 'Last 12 months'}
          </p>
        </div>
        
        <div className="flex gap-2 mt-2 md:mt-0">
          <div className="text-sm px-3 py-1 bg-green-100 text-green-800 rounded-full">
            Revenue: ₹{totalRevenue.toLocaleString()}
          </div>
          <div className="text-sm px-3 py-1 bg-red-100 text-red-800 rounded-full">
            Expenses: ₹{totalExpenses.toLocaleString()}
          </div>
          <div className="text-sm px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
            Profit: ₹{totalProfit.toLocaleString()}
          </div>
        </div>
      </div>
      
      {chartType === 'bar' ? (
        <BarChart
          title=""
          data={chartData}
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
          }}
        />
      ) : (
        <LineChart
          title=""
          data={chartData}
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
          }}
        />
      )}
      
      <div className="mt-4 text-center">
        <button className="text-sm text-green-600 hover:text-green-800 font-medium">
          View Detailed Report →
        </button>
      </div>
    </div>
  );
} 