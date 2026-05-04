"use client";

import React, { useState } from "react";
import { 
  Ticket, 
  Image as ImageIcon, 
  Cpu, 
  Plus, 
  ToggleRight, 
  Edit, 
  Trash2, 
  Settings2,
  Calendar,
  Monitor
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function MarketingTools() {
  const [activeSection, setActiveSection] = useState("Coupons");

  // Fake Data for Coupons
  const coupons = [
    { id: 1, code: "EID2026", discount: "20%", type: "Percentage", expiry: "2026-06-20", status: "Active" },
    { id: 2, code: "TECHLOVER", discount: "$50", type: "Fixed", expiry: "2026-05-15", status: "Expired" },
  ];

  // Fake Data for Banners
  const banners = [
    { id: 1, title: "Summer Flash Sale", image: "https://via.placeholder.com/600x200", position: "Main Slider" },
    { id: 2, title: "Intel 14th Gen Launch", image: "https://via.placeholder.com/600x200", position: "Side Banner" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#262B3B] flex items-center gap-2">
            <Ticket className="text-[#FF5722]" size={28} />
            Marketing & Promotions
          </h1>
          <p className="text-gray-500 text-sm">Boost your sales with smart campaigns and visual controls.</p>
        </div>
      </div>

      {/* Control Tabs */}
      <div className="flex p-1 bg-gray-100 rounded-2xl w-fit border border-gray-200">
        {[
          { id: "Coupons", icon: <Ticket size={18} />, label: "Coupons" },
          { id: "Banners", icon: <ImageIcon size={18} />, label: "Banners" },
          { id: "PCBuilder", icon: <Cpu size={18} />, label: "PC Builder" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id)}
            className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all ${
              activeSection === tab.id ? "bg-white text-[#FF5722] shadow-sm" : "text-gray-500"
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Sections Content */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          {/* 1. Coupons & Discounts */}
          {activeSection === "Coupons" && (
            <motion.div
              key="coupons"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-[#262B3B]">Active Promo Codes</h3>
                <button className="bg-[#FF5722] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
                  <Plus size={16} /> Create Coupon
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {coupons.map((coupon) => (
                  <div key={coupon.id} className="bg-white p-6 rounded-2xl border-2 border-dashed border-gray-200 flex justify-between items-center relative overflow-hidden group">
                    <div className={`absolute top-0 right-0 w-16 h-16 transition-colors ${coupon.status === 'Active' ? 'bg-green-50' : 'bg-red-50'} rounded-bl-full flex items-start justify-end p-2`}>
                      <span className={`text-[10px] font-black uppercase ${coupon.status === 'Active' ? 'text-green-600' : 'text-red-600'}`}>{coupon.status}</span>
                    </div>
                    <div>
                      <h4 className="text-2xl font-black text-[#262B3B]">{coupon.code}</h4>
                      <p className="text-sm font-bold text-[#FF5722] mt-1">{coupon.discount} Off • {coupon.type}</p>
                      <div className="flex items-center gap-2 text-gray-400 text-xs mt-3">
                        <Calendar size={14} /> Expires: {coupon.expiry}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400"><Edit size={16}/></button>
                      <button className="p-2 hover:bg-red-50 rounded-lg text-red-500"><Trash2 size={16}/></button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* 2. Banner & Slider Control */}
          {activeSection === "Banners" && (
            <motion.div
              key="banners"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {banners.map((banner) => (
                <div key={banner.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-4 group">
                  <div className="relative aspect-[3/1] bg-gray-100 rounded-xl overflow-hidden">
                    <img src={banner.image} alt={banner.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="bg-white text-[#262B3B] px-4 py-2 rounded-lg text-xs font-bold">Change Image</button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-[#262B3B]">{banner.title}</h4>
                      <p className="text-xs text-gray-500 uppercase font-medium">{banner.position}</p>
                    </div>
                    <ToggleRight className="text-green-500 cursor-pointer" size={28} />
                  </div>
                </div>
              ))}
              <div className="border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center p-10 hover:bg-white transition-all cursor-pointer group">
                <div className="bg-gray-50 p-4 rounded-full group-hover:scale-110 transition-transform">
                  <Plus className="text-gray-400" size={32} />
                </div>
                <p className="text-gray-400 font-bold text-sm mt-4">Add New Banner</p>
              </div>
            </motion.div>
          )}

          {/* 3. PC Builder Logic */}
          {activeSection === "PCBuilder" && (
            <motion.div
              key="pcbuilder"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
            >
              <div className="p-6 border-b border-gray-50 bg-gray-50/50">
                <h3 className="font-bold text-[#262B3B] flex items-center gap-2">
                  <Settings2 size={18} /> Compatibility Rules & Components
                </h3>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { name: "Processors", count: "120 Models", icon: <Cpu /> },
                  { name: "Motherboards", count: "85 Models", icon: <Monitor /> },
                  { name: "Power Supply", count: "40 Models", icon: <Settings2 /> },
                ].map((comp, i) => (
                  <div key={i} className="p-4 border border-gray-100 rounded-xl hover:border-[#FF5722] hover:shadow-md transition-all cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-50 text-[#FF5722] rounded-lg group-hover:bg-[#FF5722] group-hover:text-white transition-colors">
                        {comp.icon}
                      </div>
                      <div>
                        <h5 className="font-bold text-sm text-[#262B3B]">{comp.name}</h5>
                        <p className="text-[10px] text-gray-400 font-medium">{comp.count}</p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-[#FF5722]">
                      Set Logic <Plus size={14} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-6 bg-blue-50/50 flex items-start gap-4 mx-6 mb-6 rounded-xl border border-blue-100">
                <div className="text-blue-500 mt-1"><Settings2 size={20} /></div>
                <p className="text-xs text-blue-700 leading-relaxed">
                  <strong>Note:</strong> Here you can define which <strong>Processor Socket</strong> (e.g., LGA1700) is compatible with which <strong>Motherboard Chipset</strong> (e.g., Z790). This prevents users from selecting incompatible parts in the PC Builder.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}