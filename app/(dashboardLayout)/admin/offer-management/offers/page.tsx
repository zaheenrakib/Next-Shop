"use client";

import React, { useState } from "react";
import { 
  Save, Image as ImageIcon, Calendar, Tag, MapPin, 
  Globe, Info, Percent, Truck, CreditCard, ListChecks, 
  ExternalLink, Plus, Trash2, Layout, Loader2 
} from "lucide-react";
import { createOfferAction } from "@/services/offerService";


const DetailedOfferForm = () => {
  const [loading, setLoading] = useState(false);
  const [basicInfo, setBasicInfo] = useState({
    mainTitle: "",
    subHeadline: "",
    imageUrl: "",
    availability: "All Outlet",
    startDate: "",
    endDate: "",
    emiLink: "",
    status: "Draft"
  });

  const [rewards, setRewards] = useState({
    emiAdvantage: "",
    couponCode: "",
    shippingDeal: "",
    maxCashback: ""
  });

  const [terms, setTerms] = useState([""]);

  const handleFinalSubmit = async () => {
    if (!basicInfo.mainTitle || !basicInfo.startDate || !basicInfo.endDate) {
      alert("Please fill required fields: Title and Dates.");
      return;
    }

    setLoading(true);
    const payload = {
      ...basicInfo,
      rewards,
      termsAndConditions: terms.filter(t => t.trim() !== ""),
    };

    const response = await createOfferAction(payload);

    if (response.success) {
      console.log("Success:", response.data);
      alert("Offer saved successfully!");
    } else {
      console.error("Error:", response.error);
      alert("Failed to save offer.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20 px-4 pt-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-gray-200 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#111827] tracking-tight">
            OFFER <span className="text-[#FF5722]">CONFIGURATOR</span>
          </h1>
          <p className="text-gray-500 mt-1 font-medium flex items-center gap-2">
            <Layout size={16} /> Production Mode v2.1
          </p>
        </div>
        <button 
          onClick={handleFinalSubmit}
          disabled={loading}
          className="flex items-center gap-2 bg-[#FF5722] text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-[#FF5722]/30 hover:bg-[#e64a19] disabled:bg-gray-400 transition-all active:scale-95"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
          {loading ? "Processing..." : "Save Full Offer"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          {/* Appearance Section */}
          <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <h2 className="text-lg font-bold flex items-center gap-2 text-[#111827]">
              <ImageIcon size={20} className="text-[#FF5722]" /> Basic Appearance
            </h2>
            <div className="grid grid-cols-1 gap-5">
              <input 
                type="text" 
                placeholder="Main Banner Title" 
                className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-[#FF5722]"
                onChange={(e) => setBasicInfo({...basicInfo, mainTitle: e.target.value})}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  type="text" 
                  placeholder="Catchy Sub-headline" 
                  className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-[#FF5722]"
                  onChange={(e) => setBasicInfo({...basicInfo, subHeadline: e.target.value})}
                />
                <input 
                  type="text" 
                  placeholder="Banner Image URL" 
                  className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-[#FF5722]"
                  onChange={(e) => setBasicInfo({...basicInfo, imageUrl: e.target.value})}
                />
              </div>
            </div>
          </section>

          {/* Rewards Section */}
          <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <h2 className="text-lg font-bold flex items-center gap-2 text-[#111827]">
              <Percent size={20} className="text-[#FF5722]" /> Rewards & Discounts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input placeholder="EMI Advantage" className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-[#FF5722]" onChange={(e) => setRewards({...rewards, emiAdvantage: e.target.value})}/>
                <input placeholder="Coupon Code" className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-[#FF5722] font-mono font-bold" onChange={(e) => setRewards({...rewards, couponCode: e.target.value.toUpperCase()})}/>
                <input placeholder="Shipping Deal" className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-[#FF5722]" onChange={(e) => setRewards({...rewards, shippingDeal: e.target.value})}/>
                <input placeholder="Max Cashback" className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-[#FF5722]" onChange={(e) => setRewards({...rewards, maxCashback: e.target.value})}/>
            </div>
          </section>

          {/* Terms Section */}
          <section className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold flex items-center gap-2 text-[#111827]">
                <ListChecks size={20} className="text-[#FF5722]" /> Terms & Conditions
              </h2>
              <button type="button" onClick={() => setTerms([...terms, ""])} className="text-xs bg-[#FF5722]/10 text-[#FF5722] px-4 py-2 rounded-xl font-black transition-all flex items-center gap-2">
                <Plus size={16} /> Add Line
              </button>
            </div>
            {terms.map((term, index) => (
              <div key={index} className="flex gap-3">
                <input 
                   value={term} 
                   onChange={(e) => {
                     const newTerms = [...terms];
                     newTerms[index] = e.target.value;
                     setTerms(newTerms);
                   }}
                   placeholder={`Condition #${index + 1}`}
                   className="flex-1 px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-[#FF5722]"
                />
                {terms.length > 1 && (
                  <button onClick={() => setTerms(terms.filter((_, i) => i !== index))} className="p-3 text-red-400 hover:bg-red-50 rounded-xl transition-all">
                    <Trash2 size={20} />
                  </button>
                )}
              </div>
            ))}
          </section>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#111827] p-8 rounded-[2.5rem] text-white sticky top-10">
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase block mb-2">Availability</label>
                <div className="flex p-1 bg-white/5 rounded-2xl">
                  {["Online", "All Outlet"].map((type) => (
                    <button
                      key={type}
                      className={`flex-1 py-3 rounded-xl text-xs font-bold ${basicInfo.availability === type ? "bg-[#FF5722]" : "text-gray-400"}`}
                      onClick={() => setBasicInfo({...basicInfo, availability: type})}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              <input 
                type="date" 
                className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm outline-none"
                onChange={(e) => setBasicInfo({...basicInfo, startDate: e.target.value})}
              />
              <input 
                type="date" 
                className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm outline-none"
                onChange={(e) => setBasicInfo({...basicInfo, endDate: e.target.value})}
              />
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                <span className="text-sm font-bold">Status: {basicInfo.status}</span>
                <button 
                  onClick={() => setBasicInfo(prev => ({...prev, status: prev.status === "Published" ? "Draft" : "Published"}))}
                  className={`w-12 h-6 rounded-full transition-all ${basicInfo.status === "Published" ? "bg-green-500" : "bg-gray-700"}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-all ${basicInfo.status === "Published" ? "ml-7" : "ml-1"}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedOfferForm;