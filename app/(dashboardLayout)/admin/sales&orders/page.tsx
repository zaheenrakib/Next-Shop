"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Download,
  Eye,
  MoreVertical,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";


const allOrders = [
  { id: "ORD-9921", customer: "Mahmudul Hasan", date: "2026-05-04", total: "$1,299", status: "Delivered", payment: "Paid" },
  { id: "ORD-9922", customer: "Md. Rasel Mahmud", date: "2026-05-03", total: "$850", status: "Processing", payment: "Pending" },
  { id: "ORD-9923", customer: "Sumo Khan", date: "2026-05-03", total: "$2,100", status: "Shipped", payment: "Paid" },
  { id: "ORD-9924", customer: "Ahsan Habib", date: "2026-05-02", total: "$45", status: "Pending", payment: "Pending" },
  { id: "ORD-9925", customer: "Tanvir Ahmed", date: "2026-05-01", total: "$320", status: "Canceled", payment: "Refunded" },
  { id: "ORD-9926", customer: "Ariful Islam", date: "2026-04-30", total: "$1,500", status: "Delivered", payment: "Paid" },
  { id: "ORD-9927", customer: "Sabbir Rahman", date: "2026-04-29", total: "$210", status: "Processing", payment: "Paid" },
  { id: "ORD-9928", customer: "Jasim Uddin", date: "2026-04-28", total: "$99", status: "Pending", payment: "Pending" },
  { id: "ORD-9929", customer: "Kamal Hossain", date: "2026-04-27", total: "$750", status: "Shipped", payment: "Paid" },
  { id: "ORD-9930", customer: "Nayeem Ali", date: "2026-04-26", total: "$1,100", status: "Delivered", payment: "Paid" },
  { id: "ORD-9931", customer: "Rifat Ahmed", date: "2026-04-25", total: "$450", status: "Canceled", payment: "Refunded" },
  { id: "ORD-9932", customer: "Sohel Rana", date: "2026-04-24", total: "$1,800", status: "Processing", payment: "Paid" },
  { id: "ORD-9933", customer: "Mehedi Hasan", date: "2026-04-23", total: "$600", status: "Shipped", payment: "Paid" },
  { id: "ORD-9934", customer: "Faruk Khan", date: "2026-04-22", total: "$120", status: "Pending", payment: "Pending" },
  { id: "ORD-9935", customer: "Sujon Ahmed", date: "2026-04-21", total: "$2,500", status: "Delivered", payment: "Paid" },
  { id: "ORD-9936", customer: "Tariqul Islam", date: "2026-04-20", total: "$85", status: "Pending", payment: "Pending" },
  { id: "ORD-9937", customer: "Rakib Hossain", date: "2026-04-19", total: "$950", status: "Processing", payment: "Paid" },
  { id: "ORD-9938", customer: "Sakib Al Hasan", date: "2026-04-18", total: "$3,200", status: "Shipped", payment: "Paid" },
  { id: "ORD-9939", customer: "Tamim Iqbal", date: "2026-04-17", total: "$150", status: "Canceled", payment: "Refunded" },
  { id: "ORD-9940", customer: "Mushfiqur Rahim", date: "2026-04-16", total: "$4,000", status: "Delivered", payment: "Paid" },
];

const statusStyles: any = {
  Delivered: "bg-green-100 text-green-700",
  Processing: "bg-blue-100 text-blue-700",
  Shipped: "bg-purple-100 text-purple-700",
  Pending: "bg-orange-100 text-orange-700",
  Canceled: "bg-red-100 text-red-700",
};

export default function OrderManagement() {
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;


  const filteredOrders = useMemo(() => {
    return allOrders.filter((order) => {
      const matchesTab = activeTab === "All" || order.status === activeTab;
      const matchesSearch =
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery]);


  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const currentData = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const tabs = ["All", "Pending", "Processing", "Shipped", "Delivered", "Canceled"];

  return (
    <div className="space-y-6 pb-10">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#262B3B]">Sales & Orders</h1>
          <p className="text-gray-500 text-sm">Efficiently manage and track your business sales.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#262B3B] text-white rounded-xl text-sm font-semibold hover:bg-[#1a1e29] transition-all shadow-lg">
          <Download size={18} /> Export Data
        </button>
      </div>


      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">

          <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl border border-gray-100 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
                className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab
                  ? "bg-white text-[#FF5722] shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>


          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder="Search by ID or Customer..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-[#FF5722]/20 outline-none transition-all"
            />
          </div>
        </div>
      </div>


      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/80">
              <tr className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Total</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <AnimatePresence mode="wait">
                {currentData.length > 0 ? (
                  currentData.map((order, index) => (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-gray-50/50 transition-colors text-sm"
                    >
                      <td className="px-6 py-4 font-bold text-[#262B3B]">{order.id}</td>
                      <td className="px-6 py-4 font-semibold text-gray-600">{order.customer}</td>
                      <td className="px-6 py-4 text-gray-500">{order.date}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${statusStyles[order.status]}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-black text-[#262B3B]">{order.total}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button className="p-2 hover:bg-[#FF5722]/10 text-[#FF5722] rounded-lg transition-all">
                            <Eye size={18} />
                          </button>
                          <button className="p-2 hover:bg-gray-100 text-gray-400 rounded-lg transition-all">
                            <MoreVertical size={18} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-gray-400 font-medium">
                      No orders found matching your criteria.
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>


        <div className="p-6 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">
            Showing <span className="text-[#262B3B]">{currentData.length}</span> of {filteredOrders.length} Results
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-30 transition-all shadow-sm"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 rounded-xl text-xs font-black transition-all ${currentPage === page
                    ? "bg-[#FF5722] text-white shadow-lg shadow-orange-100"
                    : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                    }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-30 transition-all shadow-sm"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}