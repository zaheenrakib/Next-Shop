"use client";
import React, { useState, useEffect } from "react";
import { Edit, Trash2, Loader2, Save, Plus, AlertCircle, CheckCircle2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function NewsManagementPage() {
  const [newsList, setNewsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState<any>(null);
  
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Form State (For Create Only)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
  });

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/news");
      const data = await res.json();
      setNewsList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNews(); }, []);

  // Create News Function
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setFormData({ title: "", description: "", imageUrl: "" });
        fetchNews();
        triggerSuccess();
      }
    } catch (error) { console.error(error); }
    finally { setIsSaving(false); }
  };

  // Update News Function (From Modal)
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedNews),
      });
      if (res.ok) {
        setIsEditModalOpen(false);
        fetchNews();
        triggerSuccess();
      }
    } catch (error) { console.error(error); }
    finally { setIsSaving(false); }
  };

  // Delete News Function
  const confirmDelete = async () => {
    if (!selectedNews?.id) return;
    setIsDeleting(true);
    try {
      await fetch(`/api/news?id=${selectedNews.id}`, { method: "DELETE" });
      setIsDeleteModalOpen(false);
      fetchNews();
      triggerSuccess();
    } catch (error) { console.error(error); }
    finally { setIsDeleting(false); }
  };

  const handleStatusToggle = async (item: any) => {
    try {
      await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...item, isActive: !item.isActive }),
      });
      fetchNews();
    } catch (error) { console.error(error); }
  };

  const triggerSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  return (
    <div className="p-8 bg-[#fbfbfb] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">News Management</h1>
          <p className="text-sm text-gray-500">Create and manage your official updates</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* --- Left Side: Create Form --- */}
          <div className="lg:w-1/3">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm sticky top-8">
              <h2 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Plus size={18} className="text-[#ff5232]" /> Create New News
              </h2>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Title</label>
                  <input required className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:border-[#ff5232] text-sm" 
                    value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Description</label>
                  <textarea rows={3} required className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:border-[#ff5232] text-sm" 
                    value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Image URL</label>
                  <input required className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:border-[#ff5232] text-sm" 
                    value={formData.imageUrl} onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} />
                </div>
                <button type="submit" disabled={isSaving} className="w-full py-3 bg-black text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-800 transition-all">
                  {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Publish News
                </button>
              </form>
            </div>
          </div>

          {/* --- Right Side: Table --- */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase">News Info</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase text-center">Status</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading ? (
                    <tr><td colSpan={3} className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-[#ff5232]" /></td></tr>
                  ) : newsList.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img src={item.imageUrl} className={`h-12 w-12 rounded-xl object-cover border ${!item.isActive && 'grayscale'}`} alt="" />
                          <div className={`text-sm font-bold ${!item.isActive ? 'text-gray-400' : 'text-gray-900'}`}>{item.title}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button onClick={() => handleStatusToggle(item)} className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${item.isActive ? 'bg-[#ff5232]' : 'bg-gray-200'}`}>
                          <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${item.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => { setSelectedNews(item); setIsEditModalOpen(true); }} className="p-2 text-gray-400 hover:text-[#ff5232] hover:bg-orange-50 rounded-lg transition-all"><Edit size={16} /></button>
                          <button onClick={() => { setSelectedNews(item); setIsDeleteModalOpen(true); }} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* --- Edit Modal --- */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEditModalOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="text-xl font-bold text-gray-900">Update News</h3>
                <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-white rounded-full text-gray-400"><X size={20} /></button>
              </div>
              <form onSubmit={handleUpdate} className="p-8 space-y-5">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Title</label>
                  <input required className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:border-[#ff5232] text-sm" value={selectedNews?.title || ""} onChange={(e) => setSelectedNews({...selectedNews, title: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Description</label>
                  <textarea rows={4} required className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:border-[#ff5232] text-sm" value={selectedNews?.description || ""} onChange={(e) => setSelectedNews({...selectedNews, description: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Image URL</label>
                  <input required className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:border-[#ff5232] text-sm" value={selectedNews?.imageUrl || ""} onChange={(e) => setSelectedNews({...selectedNews, imageUrl: e.target.value})} />
                </div>
                <button type="submit" disabled={isSaving} className="w-full py-3 bg-[#ff5232] text-white rounded-xl font-bold flex items-center justify-center gap-2">
                  {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Update Changes
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {/* --- Delete Confirmation Modal --- */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDeleteModalOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white max-w-sm w-full rounded-3xl p-8 text-center shadow-2xl">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Delete News?</h3>
              <p className="text-gray-500 text-sm mb-8">Are you sure you want to delete <br/><strong>"{selectedNews?.title}"</strong>?</p>
              <div className="flex gap-3">
                <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-3 text-sm font-bold text-gray-500 bg-gray-100 rounded-xl hover:bg-gray-200">Cancel</button>
                <button onClick={confirmDelete} disabled={isDeleting} className="flex-1 py-3 text-sm font-bold text-white bg-red-500 rounded-xl hover:bg-red-600 flex items-center justify-center gap-2">
                  {isDeleting ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />} Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Success Feedback */}
        {showSuccess && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[120] bg-black text-white px-6 py-4 rounded-2xl flex items-center gap-3">
            <CheckCircle2 className="text-green-400" size={20} />
            <span className="text-sm font-bold">Action Completed Successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}