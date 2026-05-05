"use client";

import React from "react";
import { 
  DollarSign, 
  Package, 
  Users, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  AlertTriangle,
  ShoppingCart
} from "lucide-react";
import { motion } from "framer-motion";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

// Fake Data for Chart
const data = [
  { name: "Sat", sales: 4000 },
  { name: "Sun", sales: 3000 },
  { name: "Mon", sales: 2000 },
  { name: "Tue", sales: 2780 },
  { name: "Wed", sales: 1890 },
  { name: "Thu", sales: 2390 },
  { name: "Fri", sales: 3490 },
];

// Stats Configuration
const stats = [
  { label: "Total Sales", value: "$124,500", icon: <DollarSign size={20} />, trend: "+12.5%", up: true },
  { label: "Active Orders", value: "156", icon: <ShoppingCart size={20} />, trend: "+5.2%", up: true },
  { label: "New Customers", value: "2,420", icon: <Users size={20} />, trend: "+18%", up: true },
  { label: "Low Stock Items", value: "12", icon: <AlertTriangle size={20} />, trend: "Critical", up: false },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#262B3B]">Executive Overview</h1>
          <p className="text-gray-500 text-sm">Monitoring your tech store's performance in real-time.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all shadow-sm">
            Download Report
          </button>
          <button className="px-4 py-2 bg-[#FF5722] text-white rounded-xl text-sm font-semibold hover:bg-[#e64a19] transition-all shadow-md shadow-orange-200">
            + Add Product
          </button>
        </div>
      </div>

      {/* 1. Stat Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex justify-between items-start">
              <div className="p-3 bg-gray-50 group-hover:bg-[#FF5722]/10 rounded-xl text-[#FF5722] transition-colors">
                {item.icon}
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-lg ${item.up ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                {item.trend}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-gray-500 text-sm font-medium">{item.label}</p>
              <h3 className="text-2xl font-bold text-[#262B3B] mt-1">{item.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 2. Sales Analytics (Chart) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-[#262B3B]">Sales Revenue</h2>
            <select className="text-xs border-gray-200 rounded-lg bg-gray-50 p-1 outline-none">
              <option>Last 7 Days</option>
              <option>Last Month</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF5722" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#FF5722" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#FF5722" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. Best Selling Products & Low Stock */}
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="font-bold text-[#262B3B] mb-4">Top Tech Items</h2>
            <div className="space-y-4">
              {[
                { name: "MacBook Pro M3", price: "$1,999", stock: 45 },
                { name: "RTX 4090 GPU", price: "$1,599", stock: 12 },
                { name: "Sony WH-1000XM5", price: "$349", stock: 89 },
              ].map((product, i) => (
                <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
                  <div>
                    <p className="text-sm font-bold text-[#262B3B]">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.stock} units sold</p>
                  </div>
                  <p className="text-sm font-bold text-[#FF5722]">{product.price}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
            <div className="flex items-center gap-2 text-red-600 mb-2">
              <AlertTriangle size={18} />
              <h2 className="font-bold">Stock Alerts</h2>
            </div>
            <p className="text-xs text-red-500 mb-4">The following items are almost out of stock.</p>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-gray-700">
                <span>Core i9 14900K</span>
                <span className="text-red-600">2 Left</span>
              </div>
              <div className="w-full bg-gray-200 h-1.5 rounded-full">
                <div className="bg-red-500 h-1.5 rounded-full w-[15%]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Recent Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
          <h2 className="font-bold text-[#262B3B]">Latest Transactions</h2>
          <button className="text-xs font-bold text-[#FF5722] hover:bg-orange-50 px-3 py-1.5 rounded-lg transition-colors">
            View All Orders
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#F8F9FA]">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Product</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[1, 2, 3, 4].map((_, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-[#262B3B] text-white flex items-center justify-center text-[10px] font-bold">
                        MH
                      </div>
                      <span className="text-sm font-semibold text-gray-700">Mahmudul Hasan</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">Samsung Odyssey G9</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-blue-50 text-blue-600 uppercase">
                      Shipping
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-[#262B3B] text-right">$1,299.00</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}