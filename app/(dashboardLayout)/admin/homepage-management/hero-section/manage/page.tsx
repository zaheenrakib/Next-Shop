"use client";
import React, { useState, useEffect } from "react";
import { Edit, Trash2, LayoutDashboard, Sidebar as SidebarIcon, Loader2, X, Save, Link as LinkIcon, Plus, AlertCircle, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function HeroTablePage() {
  const [activeTab, setActiveTab] = useState<"slider" | "sidebar">("slider");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Delete Confirmation States
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const endpoint = activeTab === "slider" ? "/api/hero/slider" : "/api/hero/side-bar";
      const res = await fetch(endpoint);
      const result = await res.json();
      
      if (activeTab === "slider") {
        setData(Array.isArray(result) ? result : (result.imageUrl ? [result] : []));
      } else {
        setData(Array.isArray(result) ? result : (result.sidePromotion ? [result.sidePromotion] : []));
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleStatusToggle = async (item: any) => {
    const updatedStatus = !(item.isActive ?? true);
    setData(prev => prev.map(i => i.id === item.id ? { ...i, isActive: updatedStatus } : i));

    try {
      const endpoint = activeTab === "slider" ? "/api/hero/slider" : "/api/hero/side-bar";
      await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          id: item.id,
          mainBanner: { ...item, isActive: updatedStatus } 
        }),
      });
    } catch (error) {
      console.error("Status update failed:", error);
      fetchData(); 
    }
  };

  const openEditModal = (item: any = null) => {
    if (item) {
      setEditData({ ...item, isActive: item.isActive ?? true });
    } else {
      setEditData({ imageUrl: "", title: "", subtitle: "", buttonLink: "", isActive: true });
    }
    setIsModalOpen(true);
  };

  // ডিলিট কনফার্মেশন হ্যান্ডলার (সংশোধিত: ডাইনামিক এন্ডপয়েন্ট ব্যবহার করা হয়েছে)
  const confirmDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      // একটি ভ্যারিয়েবল এ এন্ডপয়েন্ট সেট করা হয়েছে ট্যাব অনুযায়ী
      const endpoint = activeTab === "slider" ? "/api/hero/slider" : "/api/hero/side-bar";
      const res = await fetch(`${endpoint}?id=${deleteId}`, { method: "DELETE" });
      
      if (res.ok) {
        setDeleteId(null);
        setShowSuccess(true);
        fetchData();
        setTimeout(() => setShowSuccess(false), 2000);
      }
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const endpoint = activeTab === "slider" ? "/api/hero/slider" : "/api/hero/side-bar";
      
      // বডি ডাটা ফরম্যাট ট্যাব অনুযায়ী ঠিক করা হয়েছে
      const payload = activeTab === "slider" 
        ? { id: editData.id, mainBanner: editData }
        : { id: editData.id, sidePromotion: editData };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchData();
      }
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-8 bg-[#fbfbfb] min-h-screen relative">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Hero Content Management</h1>
            <p className="text-sm text-gray-500">Manage slider and sidebar</p>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => openEditModal()}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-all shadow-sm"
            >
              <Plus size={16} /> Add {activeTab === "slider" ? "Slider" : "Sidebar"}
            </button>

            <div className="flex bg-white border border-gray-200 p-1 rounded-xl shadow-sm">
              <button onClick={() => setActiveTab("slider")} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "slider" ? "bg-[#ff5232] text-white shadow-md" : "text-gray-600 hover:bg-gray-50"}`}>
                <LayoutDashboard size={16} /> Slider
              </button>
              <button onClick={() => setActiveTab("sidebar")} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "sidebar" ? "bg-[#ff5232] text-white shadow-md" : "text-gray-600 hover:bg-gray-50"}`}>
                <SidebarIcon size={16} /> Sidebar
              </button>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase">Content</th>
                  {activeTab === "slider" && <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase">Details</th>}
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase text-center">Status</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr><td colSpan={5} className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-[#ff5232]" size={32} /></td></tr>
                ) : data.length > 0 ? (
                  data.map((item, idx) => {
                    const isActive = item.isActive ?? true;
                    return (
                      <tr key={item.id || idx} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className={`h-16 w-24 rounded-lg bg-gray-100 border overflow-hidden transition-all duration-300 ${!isActive ? 'grayscale opacity-50' : ''}`}>
                              <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div className={`text-sm font-bold ${!isActive ? 'text-gray-400' : 'text-gray-900'}`}>
                              {item.title || (activeTab === "sidebar" ? "Sidebar Promotion" : "Untitled Slider")}
                            </div>
                          </div>
                        </td>
                        {activeTab === "slider" && <td className="px-6 py-4"><div className={`text-xs line-clamp-2 ${!isActive ? 'text-gray-300' : 'text-gray-600'}`}>{item.subtitle}</div></td>}
                        <td className="px-6 py-4 text-center">
                          <button onClick={() => handleStatusToggle(item)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isActive ? 'bg-[#ff5232]' : 'bg-gray-200'}`}>
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                          </button>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => openEditModal(item)} className="p-2 text-gray-400 hover:text-[#ff5232] hover:bg-orange-50 rounded-lg transition-all"><Edit size={16} /></button>
                            <button onClick={() => setDeleteId(item.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr><td colSpan={5} className="py-20 text-center text-gray-400 text-sm">No content found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- Modals --- */}
      <AnimatePresence>
        {/* Edit/Add Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="text-xl font-bold text-gray-900">{editData?.id ? "Edit" : "Add"} {activeTab}</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white rounded-full text-gray-400 transition-colors"><X size={20} /></button>
              </div>
              <form onSubmit={handleSaveChanges} className="p-8 space-y-5">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Image URL</label>
                  <input type="text" required className="w-full p-3 bg-gray-50 border rounded-xl focus:border-[#ff5232] outline-none text-sm font-medium" value={editData?.imageUrl || ""} onChange={(e) => setEditData({...editData, imageUrl: e.target.value})} />
                </div>
                {activeTab === "slider" && (
                  <>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Title</label>
                      <input type="text" className="w-full p-3 bg-gray-50 border rounded-xl focus:border-[#ff5232] outline-none text-sm font-medium" value={editData?.title || ""} onChange={(e) => setEditData({...editData, title: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Subtitle</label>
                      <textarea rows={2} className="w-full p-3 bg-gray-50 border rounded-xl focus:border-[#ff5232] outline-none text-sm font-medium" value={editData?.subtitle || ""} onChange={(e) => setEditData({...editData, subtitle: e.target.value})} />
                    </div>
                  </>
                )}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">{activeTab === "slider" ? "Button Link" : "Redirect Link"}</label>
                  <div className="relative">
                    <input type="text" className="w-full p-3 pl-10 bg-gray-50 border rounded-xl focus:border-[#ff5232] outline-none text-sm font-medium" value={activeTab === "slider" ? (editData?.buttonLink || "") : (editData?.link || editData?.targetUrl || "")} onChange={(e) => setEditData(activeTab === "slider" ? {...editData, buttonLink: e.target.value} : {...editData, targetUrl: e.target.value})} />
                    <LinkIcon className="absolute left-3 top-3.5 text-gray-400" size={16} />
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border">
                  <span className="text-sm font-bold text-gray-900">Visibility Status</span>
                  <button type="button" onClick={() => setEditData({...editData, isActive: !editData.isActive})} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${editData?.isActive ? 'bg-[#ff5232]' : 'bg-gray-300'}`}>
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${editData?.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 text-sm font-bold text-gray-500 bg-gray-100 rounded-xl hover:bg-gray-200">Cancel</button>
                  <button type="submit" disabled={isSaving} className="flex-1 py-3 text-sm font-bold text-white bg-[#ff5232] rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-orange-100 hover:bg-[#e84628]">
                    {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteId && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeleteId(null)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white max-w-sm w-full rounded-3xl p-8 text-center shadow-2xl">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Are you sure?</h3>
              <p className="text-gray-500 text-sm mb-8">This action cannot be undone. This item will be permanently removed.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)} className="flex-1 py-3 text-sm font-bold text-gray-500 bg-gray-100 rounded-xl hover:bg-gray-200">Cancel</button>
                <button onClick={confirmDelete} disabled={isDeleting} className="flex-1 py-3 text-sm font-bold text-white bg-red-500 rounded-xl hover:bg-red-600 shadow-lg shadow-red-100 flex items-center justify-center gap-2">
                  {isDeleting ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />} Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Success Feedback Modal */}
        {showSuccess && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center pointer-events-none">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className="bg-black text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3">
              <CheckCircle2 className="text-green-400" size={20} />
              <span className="text-sm font-bold">Successfully Deleted!</span>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}