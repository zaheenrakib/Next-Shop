"use client";

import React, { useState } from "react";
import { 
  MessageSquare, 
  Star, 
  CheckCircle2, 
  Trash2, 
  User, 
  Search, 
  Filter, 
  Reply,
  ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Fake Data for Reviews
const initialReviews = [
  { id: 1, user: "Sabbir Rahman", product: "RTX 4090 GPU", rating: 5, comment: "Excellent performance! The delivery was super fast.", date: "2 mins ago", status: "pending" },
  { id: 2, user: "Anika Tasnim", product: "Keychron Q1 Pro", rating: 4, comment: "The build quality is solid, but the price is a bit high.", date: "1 hour ago", status: "approved" },
  { id: 3, user: "Rakibul Islam", product: "AMD Ryzen 9", rating: 2, comment: "Box was damaged during shipping. Not happy.", date: "5 hours ago", status: "pending" },
];

// Fake Data for Tickets
const initialTickets = [
  { id: "TK-1024", subject: "Payment Failed", user: "Mehedi Hasan", priority: "High", status: "Open", date: "10 May, 2026" },
  { id: "TK-1025", subject: "Refund Request", user: "Jannat Akter", priority: "Medium", status: "In Progress", date: "09 May, 2026" },
  { id: "TK-1026", subject: "Login Issue", user: "Tanvir Ahmed", priority: "Low", status: "Closed", date: "08 May, 2026" },
];

export default function SupportAndReviews() {
  const [activeTab, setActiveTab] = useState("reviews"); 
  const [reviews, setReviews] = useState(initialReviews);
  const [searchQuery, setSearchQuery] = useState("");

  // --- Search Logic ---
  // রিভিউ ফিল্টার করার লজিক (ইউজার নাম বা প্রোডাক্ট নাম দিয়ে)
  const filteredReviews = reviews.filter(review => 
    review.user.toLowerCase().includes(searchQuery.toLowerCase()) || 
    review.product.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // টিকেট ফিল্টার করার লজিক (ইউজার নাম বা সাবজেক্ট দিয়ে)
  const filteredTickets = initialTickets.filter(ticket => 
    ticket.user.toLowerCase().includes(searchQuery.toLowerCase()) || 
    ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handlers for Reviews
  const handleApprove = (id: number) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, status: "approved" } : r));
  };

  const handleDeleteReview = (id: number) => {
    setReviews(reviews.filter(r => r.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#262B3B] flex items-center gap-2">
            <ShieldCheck className="text-[#FF5722]" size={28} />
            Support & Feedback
          </h1>
          <p className="text-gray-500 text-sm">Manage customer opinions and technical queries.</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-gray-100 p-1 rounded-xl w-fit">
          <button 
            onClick={() => { setActiveTab("reviews"); setSearchQuery(""); }}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "reviews" ? "bg-white text-[#FF5722] shadow-sm" : "text-gray-500 hover:text-[#262B3B]"}`}
          >
            Product Reviews
          </button>
          <button 
            onClick={() => { setActiveTab("tickets"); setSearchQuery(""); }}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "tickets" ? "bg-white text-[#FF5722] shadow-sm" : "text-gray-500 hover:text-[#262B3B]"}`}
          >
            Support Tickets
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-wrap gap-4 items-center justify-between">
        <div className="relative flex-1 min-w-[280px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            value={searchQuery}
            placeholder={activeTab === "reviews" ? "Search by user or product..." : "Search by user, subject or ID..."}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#FF5722]/20 outline-none transition-all"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-100 transition-all">
          <Filter size={18} /> Filters
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "reviews" ? (
          <motion.div 
            key="reviews"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 gap-4"
          >
            {filteredReviews.length > 0 ? (
              filteredReviews.map((review) => (
                <div key={review.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-[#FF5722]/30 transition-all group">
                  <div className="flex flex-col md:flex-row gap-6 justify-between">
                    <div className="flex gap-4">
                      <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-[#262B3B] font-bold shrink-0">
                        {review.user.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-[#262B3B]">{review.user}</h4>
                          <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full font-black uppercase tracking-widest">{review.date}</span>
                        </div>
                        <p className="text-xs text-[#FF5722] font-bold mt-0.5">Purchased: {review.product}</p>
                        <div className="flex gap-1 my-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14} className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} />
                          ))}
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed italic">"{review.comment}"</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center">
                      {review.status === "pending" && (
                        <button 
                          onClick={() => handleApprove(review.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-xl text-xs font-black uppercase hover:bg-green-100 transition-all"
                        >
                          <CheckCircle2 size={16} /> Approve
                        </button>
                      )}
                      {review.status === "approved" && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase">
                          <CheckCircle2 size={14} /> Public
                        </div>
                      )}
                      <button 
                        onClick={() => handleDeleteReview(review.id)}
                        className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200 text-gray-400 font-medium">
                No reviews found matching "{searchQuery}"
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            key="tickets"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
          >
            {filteredTickets.length > 0 ? (
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <th className="px-6 py-4 text-center">ID</th>
                    <th className="px-6 py-4">User & Subject</th>
                    <th className="px-6 py-4">Priority</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredTickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4 text-xs font-black text-gray-400 text-center">{ticket.id}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gray-100 rounded-lg text-gray-500">
                            <MessageSquare size={16} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#262B3B]">{ticket.subject}</p>
                            <p className="text-[10px] text-gray-500 flex items-center gap-1 font-bold">
                              <User size={10} /> {ticket.user}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-black px-2 py-1 rounded-md uppercase ${
                          ticket.priority === 'High' ? 'bg-red-50 text-red-500' : 
                          ticket.priority === 'Medium' ? 'bg-orange-50 text-orange-500' : 'bg-green-50 text-green-500'
                        }`}>
                          {ticket.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                          <span className={`w-2 h-2 rounded-full ${
                            ticket.status === 'Open' ? 'bg-green-500 animate-pulse' : 
                            ticket.status === 'In Progress' ? 'bg-blue-500' : 'bg-gray-400'
                          }`}></span>
                          {ticket.status}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-bold text-gray-500">{ticket.date}</td>
                      <td className="px-6 py-4 text-right">
                        <button className="px-4 py-1.5 bg-[#262B3B] text-white rounded-lg text-[10px] font-bold hover:bg-[#FF5722] transition-all flex items-center gap-2 ml-auto">
                          <Reply size={14} /> Reply
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-20 text-gray-400 font-medium">
                No tickets found matching "{searchQuery}"
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}