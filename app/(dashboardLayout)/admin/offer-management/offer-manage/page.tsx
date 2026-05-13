"use client";

import React, { useState, useEffect } from "react";
import { 
  Edit, Trash2, Loader2, PlusCircle, AlertCircle, 
  CheckCircle2, X, Calendar, MapPin 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function OfferManage() {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const [formData, setFormData] = useState({
    mainTitle: "",
    subHeadline: "",
    imageUrl: "",
    availability: "All Outlet",
    startDate: "",
    endDate: "",
    emiLink: "",
    status: "Active",
  });

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/offers");
      const data = await res.json();
      setOffers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOffers(); }, []);

  const openModal = (offer: any = null) => {
    if (offer) {
      setIsEditMode(true);
      setSelectedOffer(offer);
      setFormData({
        mainTitle: offer.mainTitle,
        subHeadline: offer.subHeadline,
        imageUrl: offer.imageUrl,
        availability: offer.availability,
        startDate: offer.startDate ? offer.startDate.split('T')[0] : "",
        endDate: offer.endDate ? offer.endDate.split('T')[0] : "",
        emiLink: offer.emiLink || "",
        status: offer.status,
      });
    } else {
      setIsEditMode(false);
      setFormData({
        mainTitle: "", subHeadline: "", imageUrl: "",
        availability: "All Outlet", startDate: "", endDate: "",
        emiLink: "", status: "Active"
      });
    }
    setIsModalOpen(true);
  };

  const handleStatusToggle = async (offer: any) => {
    const newStatus = offer.status === "Active" ? "Inactive" : "Active";
    try {
      const res = await fetch(`/api/offers/${offer.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) fetchOffers();
    } catch (error) { console.error(error); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const method = isEditMode ? "PATCH" : "POST";
    const url = isEditMode ? `/api/offers/${selectedOffer.id}` : "/api/offers";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            ...formData,
            startDate: new Date(formData.startDate).toISOString(),
            endDate: new Date(formData.endDate).toISOString(),
            rewards: {}, 
            termsAndConditions: [] 
        }),
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchOffers();
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
      }
    } catch (error) { console.error(error); }
    finally { setIsSaving(false); }
  };

  const confirmDelete = async () => {
    if (!selectedOffer?.id) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/offers/${selectedOffer.id}`, { method: "DELETE" });
      if (res.ok) {
        setIsDeleteModalOpen(false);
        fetchOffers();
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
      }
    } catch (error) { console.error(error); }
    finally { setIsSaving(false); }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 text-slate-800 min-h-screen">
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl border shadow-sm">
        <div>
          <h2 className="text-2xl font-bold">Offer Management</h2>
          <p className="text-slate-500 text-sm">Create and control campaign offers</p>
        </div>
        <button 
          onClick={() => openModal()}
          className="bg-black hover:bg-gray-900 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all active:scale-95"
        >
          <PlusCircle size={20} /> Add Offer
        </button>
      </div>

      <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Offer Details</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Validity</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-center">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr><td colSpan={4} className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-blue-600" /></td></tr>
            ) : offers.map((offer) => (
              <tr key={offer.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <img src={offer.imageUrl} className="h-12 w-20 rounded-lg object-cover border bg-slate-100" />
                    <div>
                      <div className="font-bold text-slate-900">{offer.mainTitle}</div>
                      <div className="text-xs text-slate-400 flex items-center gap-1"><MapPin size={12}/> {offer.availability}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-[11px] font-medium text-slate-600">
                    <div>{new Date(offer.startDate).toLocaleDateString()}</div>
                    <div className="text-slate-300">to</div>
                    <div className="font-bold">{new Date(offer.endDate).toLocaleDateString()}</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => handleStatusToggle(offer)}
                    className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${offer.status === "Active" ? 'bg-green-500' : 'bg-slate-200'}`}
                  >
                    <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${offer.status === "Active" ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openModal(offer)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"><Edit size={16}/></button>
                    <button onClick={() => { setSelectedOffer(offer); setIsDeleteModalOpen(true); }} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"><Trash2 size={16}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 " />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl p-8">
              <h3 className="text-xl font-bold mb-6">{isEditMode ? 'Update Offer' : 'Create New Offer'}</h3>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                   <label className="text-xs font-bold text-slate-500 uppercase">Main Title</label>
                   <input required className="w-full p-2.5 bg-slate-50 border rounded-xl outline-none focus:border-blue-500 text-sm" value={formData.mainTitle} onChange={(e) => setFormData({...formData, mainTitle: e.target.value})} />
                </div>
                <div className="md:col-span-2">
                   <label className="text-xs font-bold text-slate-500 uppercase">Sub Headline</label>
                   <input required className="w-full p-2.5 bg-slate-50 border rounded-xl outline-none focus:border-blue-500 text-sm" value={formData.subHeadline} onChange={(e) => setFormData({...formData, subHeadline: e.target.value})} />
                </div>
                <div>
                   <label className="text-xs font-bold text-slate-500 uppercase">Image URL</label>
                   <input required className="w-full p-2.5 bg-slate-50 border rounded-xl outline-none focus:border-blue-500 text-sm" value={formData.imageUrl} onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} />
                </div>
                <div>
                   <label className="text-xs font-bold text-slate-500 uppercase">Availability</label>
                   <input className="w-full p-2.5 bg-slate-50 border rounded-xl outline-none focus:border-blue-500 text-sm" value={formData.availability} onChange={(e) => setFormData({...formData, availability: e.target.value})} />
                </div>
                <div>
                   <label className="text-xs font-bold text-slate-500 uppercase">Start Date</label>
                   <input type="date" required className="w-full p-2.5 bg-slate-50 border rounded-xl outline-none focus:border-blue-500 text-sm" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} />
                </div>
                <div>
                   <label className="text-xs font-bold text-slate-500 uppercase">End Date</label>
                   <input type="date" required className="w-full p-2.5 bg-slate-50 border rounded-xl outline-none focus:border-blue-500 text-sm" value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} />
                </div>
                <div className="md:col-span-2 flex gap-3 mt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 bg-slate-100 rounded-xl font-bold">Cancel</button>
                  <button type="submit" className="flex-1 py-2.5 bg-black text-white rounded-xl font-bold">
                    {isSaving ? <Loader2 className="animate-spin mx-auto" size={20}/> : (isEditMode ? 'Update' : 'Publish')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDeleteModalOpen(false)} className="absolute inset-0 " />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white max-w-sm w-full rounded-3xl p-8 text-center shadow-2xl">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4"><AlertCircle size={32}/></div>
              <h3 className="text-xl font-bold">Are you sure?</h3>
              <p className="text-slate-500 text-sm mt-2 mb-6 font-medium">Delete "{selectedOffer?.mainTitle}" permanently?</p>
              <div className="flex gap-3">
                <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-3 bg-slate-100 rounded-xl font-bold">No</button>
                <button onClick={confirmDelete} className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold">Yes, Delete</button>
              </div>
            </motion.div>
          </div>
        )}

        {showSuccess && (
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[120] bg-slate-900 text-white px-6 py-4 rounded-2xl flex items-center gap-3">
            <CheckCircle2 className="text-green-400" size={20} />
            <span className="text-sm font-bold">Operation Successful!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}