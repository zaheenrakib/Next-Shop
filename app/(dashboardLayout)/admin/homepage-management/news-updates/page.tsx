"use client";
import React, { useState, useEffect } from "react";
import { Edit, Trash2, Loader2, Save, Plus, AlertCircle, CheckCircle2, X, PlusCircle, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function NewsManagementPage() {
  const [newsList, setNewsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);


  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);


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

  const openFormModal = (item: any = null) => {
    if (item) {
      setIsEditMode(true);
      setSelectedNews(item);
      setFormData({ title: item.title, description: item.description, imageUrl: item.imageUrl });
    } else {
      setIsEditMode(false);
      setFormData({ title: "", description: "", imageUrl: "" });
    }
    setIsFormModalOpen(true);
  };

  const closeFormModal = () => {
    setIsFormModalOpen(false);
    setIsEditMode(false);
    setFormData({ title: "", description: "", imageUrl: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const body = isEditMode ? { ...formData, id: selectedNews.id } : formData;
    try {
      const res = await fetch("/api/news", {
        method: "POST", // আপনার লজিক অনুযায়ী POST রাখা হয়েছে
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        closeFormModal();
        fetchNews();
        triggerSuccess();
      }
    } catch (error) { console.error(error); }
    finally { setIsSaving(false); }
  };

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
    <div className="max-w-6xl mx-auto p-6 space-y-8 text-slate-800 min-h-screen">

      <div className="flex items-center justify-between bg-white p-6 rounded-2xl border shadow-sm">
        <div>
          <h2 className="text-2xl font-bold">News Management</h2>
          <p className="text-slate-500 text-sm">Create and manage your official updates</p>
        </div>
        <button
          onClick={() => openFormModal()}
          className="bg-black hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all active:scale-95 shadow-md shadow-blue-100"
        >
          <PlusCircle size={20} />
          Add News
        </button>
      </div>


      <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600 uppercase tracking-wider">News Info</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600 uppercase tracking-wider text-center">Status</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan={3} className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-blue-600" /></td></tr>
            ) : newsList.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors duration-150">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 flex-shrink-0">
                      <img src={item.imageUrl} className={`h-full w-full object-cover ${!item.isActive && 'grayscale opacity-50'}`} alt="" />
                    </div>
                    <div>
                      <div className={`font-bold ${!item.isActive ? 'text-slate-400' : 'text-slate-900'}`}>{item.title}</div>
                      <div className="text-xs text-slate-400 truncate max-w-[250px]">{item.description}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => handleStatusToggle(item)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${item.isActive ? 'bg-green-500' : 'bg-slate-200'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${item.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openFormModal(item)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Edit size={18} /></button>
                    <button onClick={() => { setSelectedNews(item); setIsDeleteModalOpen(true); }} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && newsList.length === 0 && (
          <div className="p-12 text-center text-slate-400 italic">No news updates available.</div>
        )}
      </div>

      <AnimatePresence>

        {isFormModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeFormModal} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-xl font-bold text-slate-900">{isEditMode ? 'Edit News Update' : 'Publish New News'}</h3>
                <button onClick={closeFormModal} className="p-2 hover:bg-white rounded-full text-slate-400 transition-all"><X size={20} /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-8 space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Title</label>
                  <input required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all"
                    value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Enter news title" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Description</label>
                  <textarea rows={4} required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all"
                    value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Write details here..." />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Image URL</label>
                  <input required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all"
                    value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} placeholder="https://image-link.com" />
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={closeFormModal} className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-all">Cancel</button>
                  <button type="submit" disabled={isSaving} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 disabled:opacity-50">
                    {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} {isEditMode ? 'Update' : 'Publish'} News
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}


        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDeleteModalOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white max-w-sm w-full rounded-3xl p-8 text-center shadow-2xl">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Delete News?</h3>
              <p className="text-slate-500 text-sm mb-8">Are you sure you want to delete <br /><strong>"{selectedNews?.title}"</strong>?</p>
              <div className="flex gap-3">
                <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-3 text-sm font-bold text-slate-500 bg-slate-100 rounded-xl hover:bg-slate-200 transition-all">Cancel</button>
                <button onClick={confirmDelete} disabled={isDeleting} className="flex-1 py-3 text-sm font-bold text-white bg-red-500 rounded-xl hover:bg-red-600 flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-100">
                  {isDeleting ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />} Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}


        {showSuccess && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[120] bg-slate-900 text-white px-6 py-4 rounded-2xl flex items-center gap-3 shadow-2xl">
            <CheckCircle2 className="text-green-400" size={20} />
            <span className="text-sm font-bold">Action Completed Successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}