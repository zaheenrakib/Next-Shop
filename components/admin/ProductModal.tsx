"use client";

import { useState, useEffect } from "react";
import { X, Plus, Trash2, Image as ImageIcon, Layout, Tag, ShieldCheck, Activity } from "lucide-react";
import { toast } from "react-hot-toast";

export default function ProductModal({ product, onClose, refresh }: any) {
  const [formData, setFormData] = useState<any>({
    name: "", slug: "", price: 0, discountPrice: 0, stock: 0,
    categoryId: "", brandId: "", description: "", shortDescription: "",
    thumbnail: "", images: [], status: "active", sku: "",
    model: "", warranty: "", tags: "",
    specifications: {}
  });

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [specKey, setSpecKey] = useState("");
  const [specValue, setSpecValue] = useState("");

  useEffect(() => {
    fetch("/api/categories").then(res => res.json()).then(setCategories);
    fetch("/api/brands").then(res => res.json()).then(setBrands);

    if (product) {
      setFormData({
        ...product,
        tags: product.tags ? product.tags.join(", ") : ""
      });
    }
  }, [product]);

  const addSpec = () => {
    if (specKey && specValue) {
      setFormData({
        ...formData,
        specifications: { ...formData.specifications, [specKey]: specValue }
      });
      setSpecKey(""); setSpecValue("");
    }
  };

  const removeSpec = (key: string) => {
    const newSpecs = { ...formData.specifications };
    delete newSpecs[key];
    setFormData({ ...formData, specifications: newSpecs });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = product ? "PUT" : "POST";
    const url = product ? `/api/products/${product.id}` : "/api/products";

    try {
      const finalPayload = {
        ...formData,
        tags: typeof formData.tags === 'string' ? formData.tags.split(",").map((t: string) => t.trim()) : formData.tags
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: finalPayload, variants: product?.variants || [] })
      });

      if (res.ok) {
        toast.success(product ? "মাখন আপডেট হয়েছে!" : "প্রোডাক্ট পাবলিশ হয়েছে!");
        refresh();
        onClose();
      }
    } catch (err) {
      toast.error("মামা, কিছু একটা গড়বড় হইছে!");
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex justify-end transition-all">
      <div className="w-full max-w-4xl bg-white h-full overflow-y-auto shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col">


        <div className="sticky top-0 bg-white/80 backdrop-blur-md z-10 px-8 py-5 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-800">{product ? "Update Product" : "New Premium Entry"}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 text-slate-400 hover:text-rose-500 rounded-xl transition-all">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8 flex-1">


          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-blue-600 flex items-center gap-2">
              <Layout size={16} /> Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Product Title</label>
                <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 ring-blue-100 focus:border-blue-500 outline-none transition-all" placeholder="Enter product name..." required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select value={formData.categoryId} onChange={e => setFormData({ ...formData, categoryId: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-all">
                  <option value="">Choose Category</option>
                  {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Brand</label>
                <select value={formData.brandId} onChange={e => setFormData({ ...formData, brandId: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-all">
                  <option value="">Choose Brand</option>
                  {brands.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
            </div>
          </div>


          <div className="space-y-4 pt-4 border-t border-slate-50">
            <h3 className="text-sm font-semibold text-blue-600 flex items-center gap-2">
              <ImageIcon size={16} /> Media & Assets
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Thumbnail URL</label>
                <input value={formData.thumbnail} onChange={e => setFormData({ ...formData, thumbnail: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 outline-none" placeholder="https://image-link.com" />
              </div>
              <div className="h-32 w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center overflow-hidden">
                {formData.thumbnail ? (
                  <img src={formData.thumbnail} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center text-slate-400">
                    <ImageIcon size={24} className="mx-auto mb-1" />
                    <span className="text-xs">No Preview</span>
                  </div>
                )}
              </div>
            </div>
          </div>


          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 p-6 bg-blue-50/50 rounded-2xl border border-blue-100/50">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Price (৳)</label>
              <input type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Discounted</label>
              <input type="number" value={formData.discountPrice} onChange={e => setFormData({ ...formData, discountPrice: Number(e.target.value) })} className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">In Stock</label>
              <input type="number" value={formData.stock} onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })} className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Status</label>
              <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg outline-none">
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </div>
          </div>


          <div className="space-y-4 pt-4">
            <h3 className="text-sm font-semibold text-blue-600 flex items-center gap-2">
              <Activity size={16} /> Content & Descriptions
            </h3>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Short Description (Snippet)</label>
              <input value={formData.shortDescription} onChange={e => setFormData({ ...formData, shortDescription: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" placeholder="A quick summary for list view..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Description</label>
              <textarea rows={5} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none resize-none" placeholder="Describe everything about the product..."></textarea>
            </div>
          </div>


          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-blue-600 flex items-center gap-2">
              <ShieldCheck size={16} /> Technical Specifications
            </h3>
            <div className="flex gap-3">
              <input placeholder="Key (e.g. RAM)" value={specKey} onChange={e => setSpecKey(e.target.value)} className="flex-1 px-4 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-all" />
              <input placeholder="Value (e.g. 16GB)" value={specValue} onChange={e => setSpecValue(e.target.value)} className="flex-1 px-4 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-all" />
              <button type="button" onClick={addSpec} className="px-4 bg-slate-800 text-white rounded-xl hover:bg-black transition-all">
                <Plus size={20} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(formData.specifications || {}).map(([key, val]: any) => (
                <div key={key} className="flex justify-between items-center p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <span className="text-sm"><b className="text-slate-600">{key}:</b> <span className="text-slate-500">{val}</span></span>
                  <button type="button" onClick={() => removeSpec(key)} className="text-rose-400 hover:text-rose-600 p-1 hover:bg-rose-50 rounded-lg transition-all"><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2"><ShieldCheck size={14} /> Warranty</label>
              <input value={formData.warranty} onChange={e => setFormData({ ...formData, warranty: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" placeholder="e.g. 1 Year Service Warranty" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2"><Tag size={14} /> Tags</label>
              <input value={formData.tags} onChange={e => setFormData({ ...formData, tags: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" placeholder="tag1, tag2, tag3" />
            </div>
          </div>


          <div className="sticky bottom-0 bg-white/90 backdrop-blur-md pt-6 pb-2 border-t border-slate-100 flex gap-4">
            <button type="submit" className="flex-1 bg-blue-600 text-white py-3.5 rounded-2xl font-bold hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all transform active:scale-[0.98]">
              {product ? "Update Changes" : "Create Product Now"}
            </button>
            <button type="button" onClick={onClose} className="px-10 bg-slate-100 text-slate-600 py-3.5 rounded-2xl font-semibold hover:bg-slate-200 transition-all">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}