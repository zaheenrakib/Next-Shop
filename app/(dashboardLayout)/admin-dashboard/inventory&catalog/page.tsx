"use client";

import React, { useState, useMemo } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  AlertTriangle, 
  Package, 
  Layers, 
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ২০টি টেকনিক্যাল প্রোডাক্টের ফেক ডেটা (Testing Purpose)
const initialProducts = [
  { id: "PROD-101", name: "AMD Ryzen 9 7950X Processor", category: "Processor", brand: "AMD", price: "$550", stock: 5, status: "Low Stock" },
  { id: "PROD-102", name: "ASUS ROG Strix RTX 4090 GPU", category: "Graphics Card", brand: "ASUS", price: "$1,999", stock: 12, status: "In Stock" },
  { id: "PROD-103", name: "Samsung 990 Pro 2TB NVMe SSD", category: "Storage", brand: "Samsung", price: "$180", stock: 0, status: "Out of Stock" },
  { id: "PROD-104", name: "Logitech G Pro X Superlight", category: "Accessories", brand: "Logitech", price: "$120", stock: 45, status: "In Stock" },
  { id: "PROD-105", name: "Corsair Vengeance 32GB DDR5", category: "RAM", brand: "Corsair", price: "$140", stock: 8, status: "Low Stock" },
  { id: "PROD-106", name: "LG UltraGear 27' OLED Monitor", category: "Monitor", brand: "LG", price: "$850", stock: 15, status: "In Stock" },
  { id: "PROD-107", name: "Keychron Q1 Mechanical Keyboard", category: "Accessories", brand: "Keychron", price: "$160", stock: 20, status: "In Stock" },
  { id: "PROD-108", name: "NZXT Kraken Elite 360 RGB", category: "Cooler", brand: "NZXT", price: "$280", stock: 3, status: "Low Stock" },
  { id: "PROD-109", name: "Lian Li PC-O11 Dynamic Case", category: "Casing", brand: "Lian Li", price: "$150", stock: 25, status: "In Stock" },
  { id: "PROD-110", name: "Seasonic Prime 1000W Platinum", category: "Power Supply", brand: "Seasonic", price: "$220", stock: 7, status: "Low Stock" },
  // অতিরিক্ত ডেটা প্যাগিনেশন টেস্ট করার জন্য
  { id: "PROD-111", name: "Intel Core i9-14900K", category: "Processor", brand: "Intel", price: "$590", stock: 18, status: "In Stock" },
  { id: "PROD-112", name: "MSI MAG Z790 Motherboard", category: "Motherboard", brand: "MSI", price: "$320", stock: 10, status: "In Stock" },
  { id: "PROD-113", name: "Razer DeathAdder V3 Pro", category: "Accessories", brand: "Razer", price: "$130", stock: 4, status: "Low Stock" },
  { id: "PROD-114", name: "HyperX Cloud III Wireless", category: "Headphone", brand: "HyperX", price: "$150", stock: 0, status: "Out of Stock" },
  { id: "PROD-115", name: "Gigabyte M27Q Gaming Monitor", category: "Monitor", brand: "Gigabyte", price: "$299", stock: 30, status: "In Stock" },
];

export default function InventoryManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // ক্যাটাগরি লিস্ট
  const categories = ["All", "Processor", "Graphics Card", "RAM", "Storage", "Monitor", "Accessories"];

  // ফিল্টারিং লজিক
  const filteredProducts = useMemo(() => {
    return initialProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           product.brand.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === "All" || product.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory]);

  // প্যাগিনেশন
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedData = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6">
      {/* Header with Quick Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#262B3B] flex items-center gap-2">
            <Package className="text-[#FF5722]" size={28} />
            Inventory & Catalog
          </h1>
          <p className="text-gray-500 text-sm">Manage products, stock alerts and catalog settings.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-[#FF5722] text-white rounded-xl text-sm font-bold shadow-lg shadow-orange-100 hover:scale-[1.02] transition-all">
            <Plus size={18} /> Add New Product
          </button>
        </div>
      </div>

      {/* Stats Cards (Mini) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Products", count: "1,240", icon: <Package size={20}/>, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Low Stock Alert", count: "12", icon: <AlertTriangle size={20}/>, color: "text-orange-600", bg: "bg-orange-50" },
          { label: "Out of Stock", count: "05", icon: <Layers size={20}/>, color: "text-red-600", bg: "bg-red-50" },
          { label: "Active Brands", count: "48", icon: <ArrowUpRight size={20}/>, color: "text-green-600", bg: "bg-green-50" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className={`${stat.bg} ${stat.color} p-3 rounded-xl`}>{stat.icon}</div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">{stat.label}</p>
              <h3 className="text-lg font-black text-[#262B3B]">{stat.count}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => {setActiveCategory(cat); setCurrentPage(1);}}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeCategory === cat ? "bg-[#262B3B] text-white" : "bg-gray-50 text-gray-500 hover:bg-gray-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or brand..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#FF5722]/10 transition-all"
          />
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50">
              <tr className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
                <th className="px-6 py-4">Product Info</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4 text-center">Stock</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <AnimatePresence mode="wait">
                {paginatedData.map((product) => (
                  <motion.tr 
                    key={product.id}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-bold text-[#262B3B] group-hover:text-[#FF5722] transition-colors line-clamp-1">{product.name}</p>
                        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tighter mt-0.5">{product.brand} • {product.id}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-md">{product.category}</span>
                    </td>
                    <td className="px-6 py-4 font-black text-[#262B3B] text-sm">{product.price}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`text-sm font-bold ${product.stock <= 5 ? 'text-red-500' : 'text-gray-700'}`}>
                        {product.stock.toString().padStart(2, '0')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`flex items-center gap-1.5 text-[10px] font-black uppercase px-2 py-1 rounded-lg w-fit ${
                        product.status === 'In Stock' ? 'bg-green-100 text-green-700' : 
                        product.status === 'Low Stock' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                      }`}>
                        <div className={`w-1 h-1 rounded-full ${
                          product.status === 'In Stock' ? 'bg-green-500' : 
                          product.status === 'Low Stock' ? 'bg-orange-500' : 'bg-red-500'
                        }`} />
                        {product.status}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-all" title="Edit Product">
                          <Edit3 size={16} />
                        </button>
                        <button className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-all" title="Delete Product">
                          <Trash2 size={16} />
                        </button>
                        <button className="p-2 hover:bg-gray-100 text-gray-400 rounded-lg">
                          <MoreHorizontal size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-6 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Inventory Capacity: <span className="text-[#262B3B]">85% Used</span>
          </p>
          <div className="flex items-center gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-30 transition-all"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-9 h-9 rounded-xl text-xs font-black transition-all ${
                    currentPage === i + 1 ? "bg-[#262B3B] text-white shadow-lg" : "text-gray-400 hover:bg-gray-50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-30 transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}