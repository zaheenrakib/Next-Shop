"use client";

import React, { useState, useMemo, useRef } from "react";
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
  ChevronDown,
  X,
  UploadCloud,
  CheckCircle2,
  PlusCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";

const CATEGORY_SPEC_FIELDS = {
  "Processor": [
    { name: "cores", label: "Cores", placeholder: "e.g., 16 Cores" },
    { name: "threads", label: "Threads", placeholder: "e.g., 32 Threads" },
    { name: "baseSpeed", label: "Base Clock Speed", placeholder: "e.g., 4.2 GHz" },
    { name: "socket", label: "Socket Type", placeholder: "e.g., AM5 / LGA1700" }
  ],
  "RAM": [
    { name: "capacity", label: "Capacity", placeholder: "e.g., 16GB (8GBx2)" },
    { name: "busSpeed", label: "Bus Speed", placeholder: "e.g., 5200MHz" },
    { name: "memoryType", label: "Memory Type", placeholder: "e.g., DDR5" }
  ],
  "Graphics Card": [
    { name: "vram", label: "VRAM Capacity", placeholder: "e.g., 24GB GDDR6X" },
    { name: "boostClock", label: "Boost Clock Speed", placeholder: "e.g., 2520 MHz" },
    { name: "powerReq", label: "Recommended PSU", placeholder: "e.g., 850W" }
  ],
  "Monitor": [
    { name: "screenSize", label: "Screen Size", placeholder: "e.g., 27 Inch" },
    { name: "resolution", label: "Resolution", placeholder: "e.g., 2560 x 1440" },
    { name: "panelType", label: "Panel Type", placeholder: "e.g., IPS / OLED" },
    { name: "refreshRate", label: "Refresh Rate", placeholder: "e.g., 240Hz" }
  ],
  "Storage": [
    { name: "capacity", label: "Capacity", placeholder: "e.g., 1TB / 2TB" },
    { name: "type", label: "Storage Type", placeholder: "e.g., NVMe M.2 SSD" },
    { name: "readWriteSpeed", label: "Read/Write Speed", placeholder: "e.g., 7300/6000 MB/s" }
  ]
};

const initialCategories = [
  "All", "Processor", "Graphics Card", "RAM", "Storage", "Monitor", "Accessories",
  "Drone", "WiFi Router", "Printer", "Casing", "Power Supply", "Motherboard",
  "Headphone", "Mouse", "Keyboard", "Laptop", "Desktop", "Webcam", "Speaker",
  "Microphone", "VR Headset", "Smart Watch", "Projector", "Scanner", "UPS",
  "Software", "Server", "Cooler", "Thermal Paste", "Sound Card", "Capture Card",
  "Joysticks", "Gaming Chair", "Table", "Cable", "Adapter", "Hub", "External Drive"
];

const initialProducts = [
  { id: "PROD-101", name: "AMD Ryzen 9 7950X", category: "Processor", brand: "AMD", price: "$550", stock: 5, status: "Low Stock" },
  { id: "PROD-102", name: "ASUS ROG RTX 4090", category: "Graphics Card", brand: "ASUS", price: "$1,999", stock: 12, status: "In Stock" },
  { id: "PROD-111", name: "DJI Mavic 3 Pro", category: "Drone", brand: "DJI", price: "$2,100", stock: 3, status: "Low Stock" },
];

export default function ProductsPage() {
  const [categories, setCategories] = useState(initialCategories);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAllCats, setShowAllCats] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);

  const itemsPerPage = 10;
  const scrollRef = useRef(null);

  const { register, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: {
      category: "Laptop",
      specs: {}
    }
  });
  const { register: registerCat, handleSubmit: handleSubmitCat, reset: resetCat } = useForm();

  const selectedFormCategory = watch("category");

  const onSubmit = (data) => {
    console.log("New Product Data with dynamic specs:", data);
    setIsModalOpen(false);
    reset();
  };

  const onAddCategory = (data) => {
    if (data.newCategory && !categories.includes(data.newCategory)) {
      setCategories([...categories, data.newCategory]);
    }
    setIsCatModalOpen(false);
    resetCat();
  };

  const filteredProducts = useMemo(() => {
    return initialProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === "All" || product.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory]);

  const paginatedData = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const dynamicFields = CATEGORY_SPEC_FIELDS[selectedFormCategory] || [];

  return (
    <div className="relative space-y-6 p-6 bg-gray-50 min-h-screen font-sans text-[#262B3B]">

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Package className="text-[#FF5722]" size={28} />
            Products Inventory
          </h1>
          <p className="text-gray-500 text-sm">Efficiently managing products and stock levels.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-[#FF5722] text-white rounded-xl text-sm font-bold shadow-lg shadow-orange-200 hover:bg-[#e64a19] hover:scale-[1.02] active:scale-95 transition-all"
        >
          <Plus size={18} /> Add New Product
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Products", count: "1,240", icon: <Package size={20} />, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Low Stock Alert", count: "12", icon: <AlertTriangle size={20} />, color: "text-orange-600", bg: "bg-orange-50" },
          { label: "Out of Stock", count: "05", icon: <Layers size={20} />, color: "text-red-600", bg: "bg-red-50" },
          { label: "Categories", count: categories.length - 1, icon: <Filter size={20} />, color: "text-purple-600", bg: "bg-purple-50" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className={`${stat.bg} ${stat.color} p-3 rounded-xl`}>{stat.icon}</div>
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-lg font-black">{stat.count}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Filters & Category Management */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative flex items-center w-full md:w-[65%]">
            <div ref={scrollRef} className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth w-full">
              {categories.slice(0, 8).map(cat => (
                <button
                  key={cat}
                  onClick={() => { setActiveCategory(cat); setCurrentPage(1); }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeCategory === cat ? "bg-[#262B3B] text-white shadow-md" : "bg-gray-50 text-gray-500 hover:bg-gray-100 border border-gray-100"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-2 ml-2">
              <div className="relative">
                <button
                  onClick={() => setShowAllCats(!showAllCats)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-[#262B3B] hover:bg-gray-100"
                >
                  More <ChevronDown size={14} className={`${showAllCats ? 'rotate-180' : ''} transition-transform`} />
                </button>
                {showAllCats && (
                  <div className="absolute right-0 mt-2 w-64 max-h-80 overflow-y-auto bg-white border border-gray-100 rounded-2xl shadow-xl z-50 p-2">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => { setActiveCategory(cat); setShowAllCats(false); setCurrentPage(1); }}
                        className="w-full text-left px-3 py-2 text-xs hover:bg-orange-50 hover:text-[#FF5722] rounded-lg transition-colors font-medium"
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => setIsCatModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-dashed border-gray-200 rounded-xl text-xs font-black text-gray-400 hover:border-[#FF5722] hover:text-[#FF5722] transition-all"
              >
                <PlusCircle size={14} /> Add Category
              </button>
            </div>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#FF5722]/20"
            />
          </div>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50">
              <tr className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
                <th className="px-6 py-4">Product Details</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4 text-center">Stock</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Manage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginatedData.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-bold text-[#262B3B] group-hover:text-[#FF5722] transition-colors">{product.name}</p>
                      <p className="text-[10px] text-gray-400 font-medium mt-0.5">{product.brand} • {product.id}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md uppercase">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-black text-[#262B3B] text-sm">{product.price}</td>
                  <td className="px-6 py-4 text-center font-bold text-gray-600">{product.stock}</td>
                  <td className="px-6 py-4">
                    <div className={`flex items-center gap-1.5 text-[10px] font-black uppercase px-2 py-1 rounded-lg w-fit ${product.status === 'In Stock' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                      {product.status}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-all"><Edit3 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Category Modal */}
      <AnimatePresence>
        {isCatModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-[110] p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCatModalOpen(false)}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-md p-8 rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full -mr-16 -mt-16 z-0" />
              
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-6">
                  <div className="p-3 bg-orange-100 text-[#FF5722] rounded-2xl">
                    <PlusCircle size={24} />
                  </div>
                  <button onClick={() => setIsCatModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                    <X size={24} />
                  </button>
                </div>
                
                <h2 className="text-2xl font-black mb-2">New Category</h2>
                <p className="text-sm text-gray-500 mb-8">Create a specialized group for your products.</p>

                <form onSubmit={handleSubmitCat(onAddCategory)} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Category Name</label>
                    <input 
                      {...registerCat("newCategory", { required: true })}
                      autoFocus
                      placeholder="e.g. Smart Home"
                      className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-[#FF5722] focus:bg-white rounded-2xl text-sm font-bold outline-none transition-all"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsCatModalOpen(false)}
                      className="flex-1 py-4 text-sm font-bold text-gray-500 hover:bg-gray-50 rounded-2xl transition-colors"
                    >
                      Discard
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-4 bg-[#FF5722] text-white text-sm font-black rounded-2xl shadow-lg shadow-orange-100 hover:bg-[#e64a19] transition-all"
                    >
                      Create Now
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Product Side Drawer */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0  z-[99]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 180, damping: 25 }}
              className="fixed top-0 right-0 h-full w-full md:w-[600px] bg-white shadow-2xl z-[100] flex flex-col"
            >
              <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-md z-10">
                <div>
                  <h2 className="text-2xl font-black">Create Product</h2>
                  <p className="text-xs text-gray-400 font-medium">Add product with full details</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X size={26} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8">
                <form id="product-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                  
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 border-b pb-2">Basic Info</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider ml-1">Product Name</label>
                        <input 
                          {...register("name", { required: true })} 
                          placeholder="Product Name"
                          className="w-full mt-1 px-5 py-3.5 rounded-xl bg-gray-50 border border-transparent focus:border-[#FF5722] focus:bg-white outline-none transition-all text-sm font-semibold" 
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider ml-1">Brand</label>
                          <input 
                            {...register("brand")} 
                            placeholder="Brand" 
                            className="w-full mt-1 px-5 py-3.5 rounded-xl bg-gray-50 border border-transparent focus:border-[#FF5722] focus:bg-white outline-none transition-all text-sm font-semibold" 
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider ml-1">Category</label>
                          <select 
                            {...register("category")} 
                            onChange={(e) => {
                              setValue("category", e.target.value);
                              setValue("specs", {});
                            }}
                            className="w-full mt-1 px-5 py-3.5 rounded-xl bg-gray-50 border border-transparent focus:border-[#FF5722] focus:bg-white outline-none transition-all text-sm font-semibold"
                          >
                            {categories.filter(cat => cat !== "All").map(cat => <option key={cat} value={cat}>{cat}</option>)}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider ml-1">Model</label>
                          <input 
                            {...register("model")} 
                            placeholder="Model Name" 
                            className="w-full mt-1 px-5 py-3.5 rounded-xl bg-gray-50 border border-transparent focus:border-[#FF5722] focus:bg-white outline-none transition-all text-sm font-semibold" 
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider ml-1">Product Code</label>
                          <input 
                            {...register("productCode")} 
                            placeholder="Code" 
                            className="w-full mt-1 px-5 py-3.5 rounded-xl bg-gray-50 border border-transparent focus:border-[#FF5722] focus:bg-white outline-none transition-all text-sm font-semibold" 
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider ml-1">MPN</label>
                          <input 
                            {...register("mpn")} 
                            placeholder="MPN Number" 
                            className="w-full mt-1 px-5 py-3.5 rounded-xl bg-gray-50 border border-transparent focus:border-[#FF5722] focus:bg-white outline-none transition-all text-sm font-semibold" 
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pricing & Stock */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 border-b pb-2">Pricing & Inventory</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider ml-1">Cash Price (৳)</label>
                        <input 
                          type="number" 
                          {...register("price", { required: true })} 
                          placeholder="Price"
                          className="w-full mt-1 px-4 py-3.5 rounded-xl bg-gray-50 border border-transparent focus:border-[#FF5722] focus:bg-white outline-none transition-all text-sm font-bold" 
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider ml-1">Regular Price (৳)</label>
                        <input 
                          type="number" 
                          {...register("regularPrice")} 
                          placeholder="Regular Price"
                          className="w-full mt-1 px-4 py-3.5 rounded-xl bg-gray-50 border border-transparent focus:border-[#FF5722] focus:bg-white outline-none transition-all text-sm font-bold" 
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider ml-1">Stock Qty</label>
                        <input 
                          type="number" 
                          {...register("stock", { required: true })} 
                          placeholder="Qty"
                          className="w-full mt-1 px-4 py-3.5 rounded-xl bg-gray-50 border border-transparent focus:border-[#FF5722] focus:bg-white outline-none transition-all text-sm font-bold" 
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider ml-1">Status</label>
                        <select 
                          {...register("status")} 
                          className="w-full mt-1 px-4 py-3.5 rounded-xl bg-gray-50 border border-transparent focus:border-[#FF5722] focus:bg-white outline-none transition-all text-sm font-bold"
                        >
                          <option value="In Stock">In Stock</option>
                          <option value="Low Stock">Low Stock</option>
                          <option value="Out of Stock">Out of Stock</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Detailed Specifications */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 border-b pb-2">Technical Specs ({selectedFormCategory})</h3>
                    
                    {dynamicFields.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {dynamicFields.map((field) => (
                          <div 
                            key={field.name} 
                            className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100 space-y-2"
                          >
                            <label className="text-[10px] font-black text-[#262B3B] uppercase tracking-wider">
                              {field.label}
                            </label>
                            <input 
                              {...register(`specs.${field.name}`)} 
                              placeholder={field.placeholder} 
                              className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-100 outline-none focus:ring-2 focus:ring-[#FF5722]/10 text-xs font-semibold" 
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-5 bg-orange-50/30 border border-dashed border-orange-100 rounded-2xl flex items-center gap-3 text-orange-600/90">
                        <AlertTriangle size={18} />
                        <p className="text-xs font-medium">No specialized fields defined for &quot;{selectedFormCategory}&quot;. Default attributes will apply.</p>
                      </div>
                    )}
                  </div>

                  {/* Product Image Upload */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 border-b pb-2">Product Images</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-1 h-32 relative border-2 border-dashed border-gray-200 hover:border-[#FF5722]/40 rounded-2xl cursor-pointer bg-gray-50 flex flex-col items-center justify-center group transition-all">
                        <UploadCloud size={24} className="text-gray-400 group-hover:text-[#FF5722] transition-colors" />
                        <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 mt-2">Primary Image</span>
                        <input type="file" {...register("primaryImage")} className="absolute inset-0 opacity-0 cursor-pointer" />
                      </div>

                      <div className="col-span-1 h-32 border border-dashed border-gray-200 rounded-2xl bg-gray-50/40 flex items-center justify-center">
                        <Plus size={18} className="text-gray-300" />
                      </div>
                      <div className="col-span-1 h-32 border border-dashed border-gray-200 rounded-2xl bg-gray-50/40 flex items-center justify-center">
                        <Plus size={18} className="text-gray-300" />
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 border-b pb-2">Product Description</h3>
                    <div>
                      <textarea 
                        rows={4}
                        {...register("description")}
                        placeholder="Write product overview..."
                        className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-transparent focus:border-[#FF5722] focus:bg-white outline-none transition-all text-xs font-semibold leading-relaxed"
                      />
                    </div>
                  </div>
                </form>
              </div>

              <div className="p-8 border-t flex gap-4 bg-white">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 text-sm font-bold text-gray-500 hover:bg-gray-50 rounded-2xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="product-form"
                  className="flex-[2] py-4 bg-[#262B3B] text-white font-black rounded-2xl shadow-xl hover:bg-black transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={18} /> Save Product
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}