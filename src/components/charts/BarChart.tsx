"use client";

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarChartProps {
  title: string;
  data: ChartData<'bar'>;
  height?: number;
  options?: ChartOptions<'bar'>;
  className?: string;
}

export default function BarChart({
  title,
  data,
  height = 250,
  options,
  className = '',
}: BarChartProps) {
  const defaultOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 16,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const mergedOptions = { ...defaultOptions, ...options };

  return (
    <div className={`rounded-lg p-4 bg-white shadow-sm ${className}`}>
      <div style={{ height: `${height}px` }}>
        <Bar options={mergedOptions} data={data} />
      </div>
    </div>
  );
} 