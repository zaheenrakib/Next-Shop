"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Loader2, Save, X, Image as ImageIcon } from "lucide-react";

export default function SidePromotionManagement() {
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ show: false, type: 'success' as 'success' | 'error', message: '' });

  const [formData, setFormData] = useState({
    sidePromotion: { imageUrl: "", targetUrl: "" }
  });


  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/hero/side-bar");
        const data = await res.json();
        if (res.ok && data.sidePromotion) {
          setFormData({ sidePromotion: data.sidePromotion });
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/hero/side-bar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (res.ok) {
        setModal({ show: true, type: 'success', message: 'Promotion updated successfully!' });
        if (result.sidePromotion) {
          setFormData({ sidePromotion: result.sidePromotion });
        }
      } else {
        throw new Error(result.error || "Update failed");
      }
    } catch (error: any) {
      setModal({ show: true, type: 'error', message: error.message });
    } finally {
      setLoading(false);
      setTimeout(() => setModal((prev) => ({ ...prev, show: false })), 3000);
    }
  };

  return (
    <div className="p-10 bg-[#fbfbfb] min-h-screen font-sans text-[#4b5563]">
      <AnimatePresence>
        {modal.show && (
          <div className="fixed top-8 left-0 right-0 flex justify-center z-[9999] px-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="pointer-events-auto flex items-center gap-3 p-4 rounded-xl shadow-lg bg-white border border-gray-100 min-w-[300px]"
            >
              <div className={modal.type === 'success' ? 'text-green-500' : 'text-red-500'}>
                {modal.type === 'success' ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
              </div>
              <p className="flex-grow text-sm font-medium text-gray-700">{modal.message}</p>
              <button onClick={() => setModal({ ...modal, show: false })} className="text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="max-w-xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#111827]">Side Promotion</h1>
            <p className="text-sm text-[#6b7280]">Static promotion banner settings</p>
          </div>
          <button
            onClick={() => handleSubmit()}
            disabled={loading}
            className="flex items-center gap-2 bg-[#ff5232] text-white px-6 py-2.5 rounded-xl hover:bg-[#e84628] disabled:opacity-50 transition-all font-semibold shadow-sm"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            {loading ? "Saving..." : "Update Banner"}
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-[#f3f4f6] p-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#9ca3af] uppercase tracking-wider">Image URL</label>
              <input
                type="text"
                className="w-full p-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-xl outline-none focus:border-[#ff5232] text-sm"
                value={formData.sidePromotion.imageUrl}
                onChange={(e) => setFormData({ sidePromotion: { ...formData.sidePromotion, imageUrl: e.target.value } })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#9ca3af] uppercase tracking-wider">Target URL</label>
              <input
                type="text"
                className="w-full p-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-xl outline-none focus:border-[#ff5232] text-sm"
                value={formData.sidePromotion.targetUrl}
                onChange={(e) => setFormData({ sidePromotion: { ...formData.sidePromotion, targetUrl: e.target.value } })}
              />
            </div>

            <div className="pt-4 border-t border-[#f3f4f6]">
              <p className="text-xs font-bold text-[#9ca3af] uppercase mb-3">Live Preview</p>
              <div className="rounded-xl overflow-hidden border border-gray-100 aspect-video bg-gray-50 flex items-center justify-center">
                {formData.sidePromotion.imageUrl ? (
                  <img src={formData.sidePromotion.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="text-gray-200" size={48} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}