"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Loader2, Save, ImageIcon, X } from "lucide-react";

interface BannerData {
  imageUrl: string;
  title: string;
  subtitle: string;
  buttonLink: string;
}

export default function HeroManagement() {
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ show: false, type: 'success' as 'success' | 'error', message: '' });

  const [formData, setFormData] = useState<{ id?: string; mainBanner: BannerData }>({
    mainBanner: { imageUrl: "", title: "", subtitle: "", buttonLink: "" }
  });


  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/hero/slider");
        const data = await res.json();

        if (res.ok && data && data.imageUrl !== undefined) {
          setFormData({
            mainBanner: {
              imageUrl: data.imageUrl || "",
              title: data.title || "",
              subtitle: data.subtitle || "",
              buttonLink: data.buttonLink || ""
            }
          });
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (field: keyof BannerData, value: string) => {
    setFormData(prev => ({
      ...prev,
      mainBanner: { ...prev.mainBanner, [field]: value }
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/hero/slider", {
        method: "POST",
        headers: { "Content-Type": "application/json" },


        body: JSON.stringify({
          id: formData.id,
          mainBanner: formData.mainBanner,
        }),
      });

      const result = await res.json();
      console.log("ratul", result.id)

      if (!res.ok) throw new Error(result.error || "Update failed");

      setModal({
        show: true,
        type: "success",
        message: "Slider updated successfully!",
      });

      setFormData({
        id: result.id, // FIXED
        mainBanner: {
          imageUrl: result.imageUrl,
          title: result.title,
          subtitle: result.subtitle,
          buttonLink: result.buttonLink
        },
      });
    } catch (error: any) {
      setModal({
        show: true,
        type: "error",
        message: error.message,
      });
    } finally {
      setLoading(false);

      setTimeout(
        () => setModal((prev) => ({ ...prev, show: false })),
        3000
      );
    }
  };

  return (
    <div className="p-10 bg-[#fbfbfb] min-h-screen font-sans text-[#4b5563] relative">
      <AnimatePresence>
        {modal.show && (
          <div className="fixed top-8 left-0 right-0 flex justify-center z-[9999] px-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: -40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
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

      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-2xl font-bold text-[#111827]">Hero Slider Management</h1>
            <p className="text-sm text-[#6b7280]">Customize your landing page slider</p>
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 bg-[#ff5232] text-white px-6 py-2.5 rounded-xl hover:bg-[#e84628] disabled:opacity-50 transition-all font-semibold shadow-sm"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            {loading ? "Saving..." : "Publish Changes"}
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-[#f3f4f6] p-8">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#9ca3af] uppercase">Banner Image URL</label>
              <input
                type="text"
                className="w-full p-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-xl outline-none focus:border-[#ff5232]"
                value={formData.mainBanner.imageUrl}
                onChange={(e) => handleInputChange("imageUrl", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#9ca3af] uppercase">Title</label>
                  <input
                    type="text"
                    className="w-full p-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-xl outline-none focus:border-[#ff5232]"
                    value={formData.mainBanner.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#9ca3af] uppercase">Button Link</label>
                  <input
                    type="text"
                    className="w-full p-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-xl outline-none focus:border-[#ff5232]"
                    value={formData.mainBanner.buttonLink}
                    onChange={(e) => handleInputChange("buttonLink", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#9ca3af] uppercase">Subtitle</label>
                <textarea
                  rows={5}
                  className="w-full p-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-xl outline-none focus:border-[#ff5232] resize-none"
                  value={formData.mainBanner.subtitle}
                  onChange={(e) => handleInputChange("subtitle", e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}