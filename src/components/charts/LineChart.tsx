"use client";

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface LineChartProps {
  title: string;
  data: ChartData<'line'>;
  height?: number;
  options?: ChartOptions<'line'>;
  className?: string;
}

export default function LineChart({
  title,
  data,
  height = 250,
  options,
  className = '',
}: LineChartProps) {
  const defaultOptions: ChartOptions<'line'> = {
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
        <Line options={mergedOptions} data={data} />
      </div>
    </div>
  );
} 