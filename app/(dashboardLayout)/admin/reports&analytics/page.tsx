"use client";

import React, { useState, useMemo } from "react";
import {
  BarChart3,
  TrendingUp,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  PackageCheck,
  Users,
  Heart,
  Download
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function AnalyticsReport() {
  const [timeRange, setTimeRange] = useState("Monthly");


  const reportData = {
    Daily: {
      revenue: [
        { name: "08 AM", sales: 400, profit: 200 },
        { name: "12 PM", sales: 1200, profit: 800 },
        { name: "04 PM", sales: 900, profit: 500 },
        { name: "08 PM", sales: 2100, profit: 1400 },
      ],
      stats: [
        { label: "Today's Revenue", value: "$4,600", change: "+4.2%", isPositive: true, icon: <TrendingUp size={20} /> },
        { label: "Today's Orders", value: "42", change: "+12.1%", isPositive: true, icon: <PackageCheck size={20} /> },
        { label: "Active Now", value: "124", change: "+2.4%", isPositive: true, icon: <Users size={20} /> },
        { label: "New Wishlist", value: "15", change: "-5.3%", isPositive: false, icon: <Heart size={20} /> },
      ]
    },
    Weekly: {
      revenue: [
        { name: "Mon", sales: 2500, profit: 1500 },
        { name: "Wed", sales: 4200, profit: 2800 },
        { name: "Fri", sales: 3800, profit: 2100 },
        { name: "Sun", sales: 5100, profit: 3400 },
      ],
      stats: [
        { label: "Weekly Revenue", value: "$15,200", change: "+10.5%", isPositive: true, icon: <TrendingUp size={20} /> },
        { label: "Weekly Orders", value: "310", change: "+5.2%", isPositive: true, icon: <PackageCheck size={20} /> },
        { label: "Weekly Visitors", value: "2,400", change: "+8.4%", isPositive: true, icon: <Users size={20} /> },
        { label: "Wishlist Added", value: "142", change: "+12.3%", isPositive: true, icon: <Heart size={20} /> },
      ]
    },
    Monthly: {
      revenue: [
        { name: "Jan", sales: 4000, profit: 2400 },
        { name: "Feb", sales: 3000, profit: 1398 },
        { name: "Mar", sales: 5000, profit: 3800 },
        { name: "Apr", sales: 2780, profit: 3908 },
        { name: "May", sales: 1890, profit: 4800 },
        { name: "Jun", sales: 6390, profit: 3800 },
        { name: "Jul", sales: 7490, profit: 4300 },
      ],
      stats: [
        { label: "Total Revenue", value: "$45,290", change: "+12.5%", isPositive: true, icon: <TrendingUp size={20} /> },
        { label: "Total Orders", value: "1,240", change: "+8.2%", isPositive: true, icon: <PackageCheck size={20} /> },
        { label: "Active Customers", value: "8,500", change: "-2.4%", isPositive: false, icon: <Users size={20} /> },
        { label: "Wishlist Items", value: "3,120", change: "+15.3%", isPositive: true, icon: <Heart size={20} /> },
      ]
    },
    Yearly: {
      revenue: [
        { name: "2023", sales: 45000, profit: 28000 },
        { name: "2024", sales: 62000, profit: 41000 },
        { name: "2025", sales: 84000, profit: 59000 },
      ],
      stats: [
        { label: "Annual Revenue", value: "$240,000", change: "+22.5%", isPositive: true, icon: <TrendingUp size={20} /> },
        { label: "Annual Orders", value: "15,240", change: "+18.2%", isPositive: true, icon: <PackageCheck size={20} /> },
        { label: "Total Reach", value: "92,500", change: "+42.4%", isPositive: true, icon: <Users size={20} /> },
        { label: "Brand Loyalty", value: "85%", change: "+5.3%", isPositive: true, icon: <Heart size={20} /> },
      ]
    }
  };


  const currentContent = useMemo(() => reportData[timeRange as keyof typeof reportData], [timeRange]);

  const bestSellingItems = [
    { name: "AMD Ryzen 9 7950X", sales: 450, stock: "12 Left", revenue: "$247,500" },
    { name: "RTX 4090 ROG Strix", sales: 320, stock: "05 Left", revenue: "$639,680" },
    { name: "Samsung 990 Pro 2TB", sales: 280, stock: "Out of Stock", revenue: "$50,400" },
    { name: "Keychron Q1 Pro", sales: 210, stock: "45 Left", revenue: "$33,600" },
  ];

  return (
    <div className="space-y-6 pb-10">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#262B3B] flex items-center gap-2">
            <BarChart3 className="text-[#FF5722]" size={28} />
            Business Analytics & Reports
          </h1>
          <p className="text-gray-500 text-sm">Showing analytical data for <strong>{timeRange}</strong> view.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white border border-gray-200 rounded-xl px-3 py-2 flex items-center gap-2 shadow-sm focus-within:ring-2 focus-within:ring-[#FF5722]/20">
            <Calendar size={16} className="text-[#FF5722]" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="text-xs font-bold outline-none bg-transparent text-gray-600 cursor-pointer"
            >
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Yearly">Yearly</option>
            </select>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#262B3B] text-white rounded-xl text-sm font-bold hover:bg-[#FF5722] transition-all shadow-md active:scale-95">
            <Download size={18} /> Export PDF
          </button>
        </div>
      </div>


      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnimatePresence mode="wait">
          {currentContent.stats.map((stat, i) => (
            <motion.div
              key={`${timeRange}-${i}`} // Key change triggers animation when range changes
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm group hover:border-[#FF5722]/50 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="p-3 bg-gray-50 rounded-xl text-[#262B3B] group-hover:bg-[#FF5722] group-hover:text-white transition-all">
                  {stat.icon}
                </div>
                <div className={`flex items-center gap-1 text-xs font-black ${stat.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {stat.change}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
                <h3 className="text-2xl font-black text-[#262B3B] mt-1">{stat.value}</h3>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-[#262B3B]">Revenue Overview ({timeRange})</h3>
            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest">
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#FF5722]"></span> Sales</div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-gray-300"></span> Profit</div>
            </div>
          </div>

          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentContent.revenue} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF5722" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#FF5722" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fontWeight: 600, fill: '#9ca3af' }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fontWeight: 600, fill: '#9ca3af' }}
                />
                <Tooltip
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#FF5722"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorSales)"
                />
                <Area
                  type="monotone"
                  dataKey="profit"
                  stroke="#D1D5DB"
                  strokeWidth={2}
                  fill="transparent"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>


        <div className="bg-[#262B3B] p-6 rounded-2xl shadow-xl text-white">
          <h3 className="font-bold mb-6 flex items-center gap-2">
            <PieChart size={20} className="text-[#FF5722]" /> Customer Insights
          </h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-xs font-bold mb-2">
                <span>Direct Search</span>
                <span>65%</span>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-[#FF5722] w-[65%]"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-bold mb-2">
                <span>Wishlist Conversions</span>
                <span>42%</span>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-blue-400 w-[42%]"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-bold mb-2">
                <span>Cart Abandonment</span>
                <span>12%</span>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-red-400 w-[12%]"></div>
              </div>
            </div>
          </div>
          <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/10">
            <p className="text-[10px] text-gray-400 uppercase font-black">Top Traffic Source</p>
            <h4 className="text-lg font-bold mt-1 text-[#FF5722]">Facebook Ads</h4>
          </div>
        </div>
      </div>


      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
          <h3 className="font-bold text-[#262B3B]">Best Selling Products</h3>
          <button className="text-xs font-bold text-[#FF5722] hover:underline">View Full Report</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50">
              <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <th className="px-6 py-4">Item Name</th>
                <th className="px-6 py-4">Units Sold</th>
                <th className="px-6 py-4">Stock Status</th>
                <th className="px-6 py-4 text-right">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {bestSellingItems.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-[#262B3B]">{item.name}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-600">{item.sales} Units</td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${item.stock === 'Out of Stock' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-600'
                      }`}>
                      {item.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-black text-[#262B3B] text-sm">{item.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}