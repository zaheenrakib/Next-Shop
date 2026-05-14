"use client";

import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, X, PlusCircle, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Category {
  id: string;
  name: string;
  iconUrl: string;
  destinationUrl: string;
  isActive: boolean;
}

const CategoryManagement = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);


  const [formData, setFormData] = useState({ id: '', name: '', iconUrl: '', destinationUrl: '' });
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedForDelete, setSelectedForDelete] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/featured-category');
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : (data.categories || []));
    } catch (error) {
      console.error("Failed to fetch:", error);
      setCategories([]);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const openModal = (cat: Category | null = null) => {
    if (cat) {
      setIsEditMode(true);
      setFormData({ id: cat.id, name: cat.name, iconUrl: cat.iconUrl, destinationUrl: cat.destinationUrl });
    } else {
      setIsEditMode(false);
      setFormData({ id: '', name: '', iconUrl: '', destinationUrl: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ id: '', name: '', iconUrl: '', destinationUrl: '' });
    setIsEditMode(false);
  };

  const triggerSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const method = isEditMode ? 'PATCH' : 'POST';
    const url = isEditMode ? `/api/featured-category/${formData.id}` : '/api/featured-category';

    try {
      const response = await fetch(url, {
        method,
        body: JSON.stringify({
          name: formData.name,
          iconUrl: formData.iconUrl,
          destinationUrl: formData.destinationUrl
        }),
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        closeModal();
        await fetchCategories();
        triggerSuccess(); // Success Feedback
      }
    } catch (err) {
      console.error("Submit Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/featured-category/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ isActive: !currentStatus }),
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        setCategories(prev =>
          prev.map(cat => cat.id === id ? { ...cat, isActive: !currentStatus } : cat)
        );
      }
    } catch (error) {
      console.error("Toggle Error:", error);
    }
  };

  const confirmDelete = async () => {
    if (!selectedForDelete) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/featured-category/${selectedForDelete}`, { method: 'DELETE' });
      if (res.ok) {
        setIsDeleteModalOpen(false);
        setSelectedForDelete(null);
        await fetchCategories();
        triggerSuccess();
      }
    } catch (error) {
      console.error("Delete Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 text-slate-800">

      <div className="flex items-center justify-between bg-white p-6 rounded-2xl border shadow-sm">
        <h2 className="text-2xl font-bold">Featured Categories</h2>
        <button
          onClick={() => openModal()}
          className="bg-black hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition active:scale-95"
        >
          <PlusCircle size={20} />
          Add Category
        </button>
      </div>


      <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="p-4 text-sm font-semibold text-slate-600 uppercase tracking-wider text-center w-24">Icon</th>
              <th className="p-4 text-sm font-semibold text-slate-600 uppercase tracking-wider">Name</th>
              <th className="p-4 text-sm font-semibold text-slate-600 uppercase tracking-wider text-center">Status</th>
              <th className="p-4 text-sm font-semibold text-slate-600 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-slate-50 transition duration-150">
                <td className="p-4 flex justify-center">
                  <div className="w-12 h-12 flex items-center justify-center bg-slate-100 rounded-xl p-1.5 border">
                    <img src={cat.iconUrl} alt={cat.name} className="w-full h-full object-contain" />
                  </div>
                </td>
                <td className="p-4 font-semibold text-slate-900">{cat.name}</td>
                <td className="p-4 text-center">
                  <button
                    onClick={() => toggleStatus(cat.id, cat.isActive)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 outline-none ${cat.isActive ? 'bg-green-500' : 'bg-slate-300'
                      }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${cat.isActive ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                  </button>
                </td>
                <td className="p-4 text-right space-x-2">
                  <button
                    onClick={() => openModal(cat)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => { setSelectedForDelete(cat.id); setIsDeleteModalOpen(true); }}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>

        {isModalOpen && (
          <div className="fixed inset-0   z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 relative space-y-6">
              <button onClick={closeModal} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition">
                <X size={24} />
              </button>
              <h3 className="text-2xl font-bold">{isEditMode ? 'Edit Category' : 'New Category'}</h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-semibold mb-1 block text-slate-600">Category Name</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition" required />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-1 block text-slate-600">Icon URL</label>
                  <input type="url" value={formData.iconUrl} onChange={(e) => setFormData({ ...formData, iconUrl: e.target.value })} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition" required />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-1 block text-slate-600">Destination Route</label>
                  <input type="text" value={formData.destinationUrl} onChange={(e) => setFormData({ ...formData, destinationUrl: e.target.value })} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition" required />
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={closeModal} className="flex-1 bg-slate-100 py-3 rounded-xl font-medium hover:bg-slate-200 transition">Cancel</button>
                  <button type="submit" disabled={loading} className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition disabled:opacity-50">
                    {loading ? 'Processing...' : isEditMode ? 'Update Category' : 'Create Now'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}


        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold">Are you sure?</h3>
                <p className="text-slate-500 text-sm mt-1">This action cannot be undone. This category will be permanently removed.</p>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 bg-slate-100 py-3 rounded-xl font-medium hover:bg-slate-200 transition">No, Cancel</button>
                <button onClick={confirmDelete} disabled={loading} className="flex-1 bg-red-500 text-white py-3 rounded-xl font-medium hover:bg-red-600 transition flex items-center justify-center gap-2">
                  {loading ? <Loader2 className="animate-spin" size={18} /> : 'Yes, Delete'}
                </button>
              </div>
            </motion.div>
          </div>
        )}


        {showSuccess && (
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[70] bg-slate-900 text-white px-6 py-4 rounded-2xl flex items-center gap-3 shadow-2xl">
            <CheckCircle2 className="text-green-400" size={20} />
            <span className="text-sm font-bold tracking-wide">Operation Successful!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategoryManagement;