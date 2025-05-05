"use client";

import React, { useState } from 'react';
import BarChart from '@/components/charts/BarChart';
import { ChartData } from 'chart.js';

type Product = {
  id: string;
  name: string;
  category: string;
  stock: number;
  minStock: number;
  price: number;
  cost: number;
  supplier: string;
  lastOrder: string;
  isPopular: boolean;
};

type CategoryData = {
  name: string;
  count: number;
  stockValue: number;
  lowStock: number;
};

interface InventoryManagementProps {
  products: Product[];
  onAddProduct?: () => void;
  onEditProduct?: (product: Product) => void;
  onDeleteProduct?: (productId: string) => void;
  onReorderProduct?: (product: Product) => void;
}

export default function InventoryManagementComponent({
  products,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onReorderProduct,
}: InventoryManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  // Get unique categories
  const categories = ['all', ...new Set(products.map(p => p.category))];

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    const matchesStock = stockFilter === 'all' ||
                         (stockFilter === 'low' && product.stock <= product.minStock) ||
                         (stockFilter === 'out' && product.stock === 0) ||
                         (stockFilter === 'ok' && product.stock > product.minStock);
    
    return matchesSearch && matchesCategory && matchesStock;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'stock-low') return a.stock - b.stock;
    if (sortBy === 'stock-high') return b.stock - a.stock;
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    return 0;
  });

  // Prepare data for category chart
  const categoryData = categories
    .filter(cat => cat !== 'all')
    .map(category => {
      const categoryProducts = products.filter(p => p.category === category);
      return {
        name: category,
        count: categoryProducts.length,
        stockValue: categoryProducts.reduce((sum, p) => sum + (p.stock * p.cost), 0),
        lowStock: categoryProducts.filter(p => p.stock <= p.minStock).length,
      };
    });

  const inventoryChartData: ChartData<'bar'> = {
    labels: categoryData.map(cat => cat.name),
    datasets: [
      {
        label: 'Product Count',
        data: categoryData.map(cat => cat.count),
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1,
      },
      {
        label: 'Low Stock Items',
        data: categoryData.map(cat => cat.lowStock),
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1,
      },
    ],
  };

  // Calculate stats
  const totalProducts = products.length;
  const lowStockCount = products.filter(p => p.stock <= p.minStock).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;
  const totalStockValue = products.reduce((sum, p) => sum + (p.stock * p.cost), 0);

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Inventory Management</h2>
          <p className="text-gray-600">Manage products, stock levels, and suppliers</p>
        </div>
        
        <button
          onClick={onAddProduct}
          className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-md transition-colors shadow-sm flex items-center"
        >
          <span className="mr-2">➕</span> Add New Product
        </button>
      </div>
      
      {/* Inventory Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-amber-50 rounded-lg border border-amber-100 p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-amber-800 uppercase tracking-wide mb-1">Total Products</h3>
          <p className="text-3xl font-bold text-amber-700">{totalProducts}</p>
          <p className="text-xs text-amber-600 mt-1">in inventory management system</p>
        </div>
        
        <div className="bg-red-50 rounded-lg border border-red-100 p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-red-800 uppercase tracking-wide mb-1">Low Stock Items</h3>
          <p className="text-3xl font-bold text-red-700">{lowStockCount}</p>
          <p className="text-xs text-red-600 mt-1">below minimum stock level</p>
        </div>
        
        <div className="bg-rose-50 rounded-lg border border-rose-100 p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-rose-800 uppercase tracking-wide mb-1">Out of Stock</h3>
          <p className="text-3xl font-bold text-rose-700">{outOfStockCount}</p>
          <p className="text-xs text-rose-600 mt-1">products currently unavailable</p>
        </div>
        
        <div className="bg-green-50 rounded-lg border border-green-100 p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-green-800 uppercase tracking-wide mb-1">Total Stock Value</h3>
          <p className="text-3xl font-bold text-green-700">₹{totalStockValue.toLocaleString()}</p>
          <p className="text-xs text-green-600 mt-1">based on product cost</p>
        </div>
      </div>
      
      {/* Inventory Chart */}
      <div className="mb-6">
        <BarChart
          title="Inventory by Category"
          data={inventoryChartData}
          height={250}
        />
      </div>
      
      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <div className="relative">
              <input
                type="text"
                placeholder="Search inventory..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50"
                style={{ paddingRight: '2.5rem' }}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
            
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50"
            >
              <option value="all">All Stock Levels</option>
              <option value="low">Low Stock</option>
              <option value="out">Out of Stock</option>
              <option value="ok">In Stock</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50"
            >
              <option value="name">Name (A-Z)</option>
              <option value="stock-low">Stock (Low-High)</option>
              <option value="stock-high">Stock (High-Low)</option>
              <option value="price-low">Price (Low-High)</option>
              <option value="price-high">Price (High-Low)</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Product List */}
      {sortedProducts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-medium text-gray-700 mb-2">No products found</h3>
          <p className="text-gray-500">Try adjusting your search or filter settings</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Order</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedProducts.map((product) => (
                  <tr key={product.id} className={`hover:bg-gray-50 transition-colors ${product.stock <= product.minStock ? 'bg-red-50' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        {product.isPopular && (
                          <span className="ml-2 text-xs text-white bg-amber-600 px-1.5 py-0.5 rounded-full">
                            Popular
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{product.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className={`text-sm font-medium ${
                        product.stock === 0
                          ? 'text-red-600'
                          : product.stock <= product.minStock
                            ? 'text-amber-600'
                            : 'text-green-600'
                      }`}>
                        {product.stock} {product.stock <= product.minStock && product.stock > 0 && '(Low)'}
                        {product.stock === 0 && '(Out)'}
                      </div>
                      <div className="text-xs text-gray-500">Min: {product.minStock}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="text-sm font-medium text-gray-900">₹{product.price}</div>
                      <div className="text-xs text-gray-500">Cost: ₹{product.cost}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{product.supplier}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{product.lastOrder}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {product.stock <= product.minStock && (
                        <button
                          onClick={() => onReorderProduct && onReorderProduct(product)}
                          className="text-amber-600 hover:text-amber-900 mr-3"
                        >
                          Reorder
                        </button>
                      )}
                      <button
                        onClick={() => onEditProduct && onEditProduct(product)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDeleteProduct && onDeleteProduct(product.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Export and Reports */}
      <div className="mt-6 flex flex-wrap gap-4">
        <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md transition-colors flex items-center shadow-sm">
          <span className="mr-2">📊</span> Export Inventory
        </button>
        <button className="bg-amber-100 hover:bg-amber-200 text-amber-800 px-4 py-2 rounded-md transition-colors flex items-center shadow-sm">
          <span className="mr-2">📑</span> Generate Report
        </button>
        <button className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-md transition-colors flex items-center shadow-sm">
          <span className="mr-2">🔄</span> Sync with Billing
        </button>
      </div>
    </div>
  );
} 