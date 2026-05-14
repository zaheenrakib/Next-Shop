"use client";

import React, { useState } from "react";
import {
  Settings,
  Truck,
  Globe,
  Image as ImageIcon,
  Phone,
  Share2,
  Lock,
  Save,
  CheckCircle2,
  Info,
  DollarSign,
  Percent
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function GeneralSettings() {
  const [activeSection, setActiveSection] = useState("shipping");
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);


  const handleSave = () => {
    setIsSaving(true);

    setTimeout(() => {
      setIsSaving(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 1500);
  };

  const navItems = [
    { id: "shipping", label: "Shipping & Tax", icon: Truck },
    { id: "config", label: "Site Configuration", icon: Globe },
    { id: "payment", label: "Payment Gateways", icon: Lock },
  ];

  return (
    <div className=" space-y-6 pb-20">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#262B3B] flex items-center gap-2">
            <Settings className="text-[#FF5722]" size={28} />
            System Settings
          </h1>
          <p className="text-gray-500 text-sm">Configure your store infrastructure and preferences.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#FF5722] text-white rounded-xl font-bold shadow-lg shadow-[#FF5722]/20 hover:bg-[#e64a19] transition-all disabled:opacity-70"
        >
          {isSaving ? <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" /> : <Save size={18} />}
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

        <div className="md:col-span-3 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeSection === item.id
                ? "bg-white text-[#FF5722] shadow-sm border border-gray-100"
                : "text-gray-500 hover:bg-gray-100 hover:text-[#262B3B]"
                }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </div>


        <div className="md:col-span-9">
          <AnimatePresence mode="wait">
            {activeSection === "shipping" && (
              <motion.div
                key="shipping"
                initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                className="space-y-6"
              >
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                  <h3 className="font-black text-[#262B3B] flex items-center gap-2 border-b pb-4 border-gray-50">
                    <Truck size={20} className="text-[#FF5722]" /> Shipping Charges
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Inside Dhaka (BDT)</label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input type="number" defaultValue="60" className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#FF5722]/20 font-bold text-[#262B3B]" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Outside Dhaka (BDT)</label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input type="number" defaultValue="120" className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#FF5722]/20 font-bold text-[#262B3B]" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                  <h3 className="font-black text-[#262B3B] flex items-center gap-2 border-b pb-4 border-gray-50">
                    <Percent size={20} className="text-[#FF5722]" /> Tax & VAT
                  </h3>
                  <div className="space-y-2 max-w-xs">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Standard Tax Rate (%)</label>
                    <div className="relative">
                      <input type="number" defaultValue="5" className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#FF5722]/20 font-bold text-[#262B3B]" />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">%</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeSection === "config" && (
              <motion.div
                key="config"
                initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                className="space-y-6"
              >
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                  <h3 className="font-black text-[#262B3B] flex items-center gap-2 border-b pb-4 border-gray-50">
                    <ImageIcon size={20} className="text-[#FF5722]" /> Branding & Media
                  </h3>
                  <div className="flex items-center gap-6">
                    <div className="h-24 w-24 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-[#FF5722] hover:text-[#FF5722] cursor-pointer transition-all">
                      <ImageIcon size={24} />
                      <span className="text-[10px] font-bold mt-2 uppercase">Upload Logo</span>
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-bold text-[#262B3B]">Brand Logo</p>
                      <p className="text-xs text-gray-400">PNG or SVG, max size 2MB. Recommended 256x256px.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                  <h3 className="font-black text-[#262B3B] flex items-center gap-2 border-b pb-4 border-gray-50">
                    <Phone size={20} className="text-[#FF5722]" /> Contact Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Primary Phone</label>
                      <input type="text" placeholder="+880 1XXX XXXXXX" className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#FF5722]/20 font-bold" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Support Email</label>
                      <input type="email" placeholder="support@brand.com" className="w-full px-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#FF5722]/20 font-bold" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                  <h3 className="font-black text-[#262B3B] flex items-center gap-2 border-b pb-4 border-gray-50">
                    <Share2 size={20} className="text-[#FF5722]" /> Social Media Links
                  </h3>
                  <div className="space-y-4">
                    {['Facebook', 'Instagram', 'LinkedIn'].map((platform) => (
                      <div key={platform} className="flex items-center gap-4">
                        <span className="w-24 text-xs font-black text-gray-400 uppercase">{platform}</span>
                        <input type="url" placeholder={`https://${platform.toLowerCase()}.com/yourbrand`} className="flex-1 px-4 py-2 bg-gray-50 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-[#FF5722]/20" />
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeSection === "payment" && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6"
              >
                <div className="flex items-center justify-between border-b pb-4 border-gray-50">
                  <h3 className="font-black text-[#262B3B] flex items-center gap-2">
                    <Lock size={20} className="text-[#FF5722]" /> Gateway Credentials
                  </h3>
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-tighter">
                    <Info size={12} /> Sandbox Mode Enabled
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-2xl space-y-4 border border-gray-100">
                    <p className="text-xs font-black text-[#262B3B] uppercase">SSLCommerz Credentials</p>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase">Store ID</label>
                        <input type="password" value="********" className="w-full px-4 py-2 bg-white border-gray-100 border rounded-xl text-xs font-bold" readOnly />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase">Store Password</label>
                        <input type="password" value="********" className="w-full px-4 py-2 bg-white border-gray-100 border rounded-xl text-xs font-bold" readOnly />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>


      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-10 right-10 flex items-center gap-3 px-6 py-3 bg-[#262B3B] text-white rounded-2xl shadow-2xl z-50 border-b-4 border-[#FF5722]"
          >
            <CheckCircle2 size={20} className="text-[#FF5722]" />
            <span className="text-sm font-bold">Settings updated successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}