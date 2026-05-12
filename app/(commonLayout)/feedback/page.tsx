"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast, Toaster } from "react-hot-toast"; 
import { MessageSquare, User, Phone, Mail, FileText } from "lucide-react";

export default function FeedbackPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        // SUCCESS TOAST WITH YOUR BRAND COLOR
        toast.success("Request Submitted Successfully!", {
            style: {
              border: '2px solid #FF4D30',
              padding: '16px',
              color: '#1e293b',
              fontWeight: 'bold',
              borderRadius: '15px'
            },
            iconTheme: {
              primary: '#FF4D30',
              secondary: '#fff',
            },
          });
        (e.target as HTMLFormElement).reset();
      } else {
        throw new Error("Failed to submit");
      }
    } catch (err) {
      toast.error("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FBFBFB] min-h-screen font-sans">
      <Toaster position="top-center" reverseOrder={false} />
      <Navbar />
      
      <main className="max-w-5xl mx-auto px-6 py-16">
        {/* Header Section with NextShop Red/Orange accents */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#FF4D30]/10 text-[#FF4D30] rounded-3xl mb-6 shadow-sm">
            <MessageSquare size={28} />
          </div>
          <h1 className="text-3xl font-black text-[#0F172A] mb-4 uppercase italic tracking-tighter">
            Raise a <span className="text-[#FF4D30]">Complaint</span>
          </h1>
          <p className="text-slate-500 max-w-lg mx-auto font-semibold">
            Experiencing an issue? Fill out the details below and our technical experts will get back to you immediately.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-8 md:p-14 border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Full Name */}
              <div className="relative group">
                <label className="flex items-center gap-2 text-slate-800 font-black mb-4 text-xs uppercase tracking-[0.2em]">
                   <User size={16} className="text-[#FF4D30]" /> Full Name <span className="text-[#FF4D30]">*</span>
                </label>
                <input 
                  required name="fullName" type="text" placeholder="e.g. Mahmudul Hasan"
                  className="w-full py-5 bg-slate-50 px-8 rounded-2xl border-2 border-transparent focus:border-[#FF4D30]/30 focus:bg-white focus:shadow-md outline-none transition-all placeholder:text-slate-300 font-bold text-slate-900"
                />
              </div>

              {/* Phone No */}
              <div className="relative group">
                <label className="flex items-center gap-2 text-slate-800 font-black mb-4 text-xs uppercase tracking-[0.2em]">
                   <Phone size={16} className="text-[#FF4D30]" /> Phone No. <span className="text-[#FF4D30]">*</span>
                </label>
                <input 
                  required name="phoneNo" type="text" placeholder="+880 1XXX-XXXXXX"
                  className="w-full py-5 bg-slate-50 px-8 rounded-2xl border-2 border-transparent focus:border-[#FF4D30]/30 focus:bg-white focus:shadow-md outline-none transition-all placeholder:text-slate-300 font-bold text-slate-900"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="relative group">
              <label className="flex items-center gap-2 text-slate-800 font-black mb-4 text-xs uppercase tracking-[0.2em]">
                 <Mail size={16} className="text-[#FF4D30]" /> Email Address
              </label>
              <input 
                name="email" type="email" placeholder="dev.mhratul@gmail.com"
                className="w-full py-5 bg-slate-50 px-8 rounded-2xl border-2 border-transparent focus:border-[#FF4D30]/30 focus:bg-white focus:shadow-md outline-none transition-all placeholder:text-slate-300 font-bold text-slate-900"
              />
            </div>

            {/* Subject */}
            <div className="relative group">
              <label className="flex items-center gap-2 text-slate-800 font-black mb-4 text-xs uppercase tracking-[0.2em]">
                 <FileText size={16} className="text-[#FF4D30]" /> Subject <span className="text-[#FF4D30]">*</span>
              </label>
              <input 
                required name="subject" type="text" placeholder="Hardware Issue / Order Problem"
                className="w-full py-5 bg-slate-50 px-8 rounded-2xl border-2 border-transparent focus:border-[#FF4D30]/30 focus:bg-white focus:shadow-md outline-none transition-all placeholder:text-slate-300 font-bold text-slate-900"
              />
            </div>

            {/* Details */}
            <div className="relative group">
              <label className="block text-slate-800 font-black mb-4 text-xs uppercase tracking-[0.2em]">Details <span className="text-[#FF4D30]">*</span></label>
              <textarea 
                required name="details" rows={6} placeholder="Describe your issue in detail..."
                className="w-full py-6 bg-slate-50 px-8 rounded-[2rem] border-2 border-transparent focus:border-[#FF4D30]/30 focus:bg-white focus:shadow-md outline-none transition-all placeholder:text-slate-300 font-bold text-slate-900 resize-none"
              ></textarea>
            </div>

            {/* Premium Button - Matches the "Shop Now" look */}
            <button 
              disabled={loading}
              type="submit"
              className="w-full bg-[#FF4D30] hover:bg-[#E6442B] text-white font-black py-6 rounded-2xl transition-all shadow-[0_15px_30px_-5px_rgba(255,77,48,0.3)] uppercase italic tracking-widest active:scale-[0.98] disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Transmitting...</span>
                </div>
              ) : "Submit Feedback"}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}