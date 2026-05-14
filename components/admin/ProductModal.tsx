"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  X, Plus, Trash2, Image as ImageIcon, Layout, Tag, 
  ShieldCheck, Activity, DollarSign, Package, Truck, Globe,
  AlertCircle
} from "lucide-react";
import { toast } from "react-hot-toast";
import TiptapEditor from "./TiptapEditor";

const productSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters"),
  categoryId: z.string().min(1, "Category is required"),
  subCategoryId: z.string().optional().nullable(),
  brandId: z.string().optional().nullable(),
  shortDescription: z.string().optional(),
  longDescription: z.string().optional(),
  thumbnail: z.string().url("Must be a valid URL").or(z.literal("")),
  images: z.array(z.string()).default([]),
  
  // Pricing
  basePrice: z.number().min(0, "Price cannot be negative"),
  comparePrice: z.number().min(0).optional().nullable(),
  costPerItem: z.number().min(0).optional().nullable(),
  
  // Inventory
  stockQuantity: z.number().int().min(0, "Stock cannot be negative"),
  lowStockThreshold: z.number().int().min(0).default(5),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  
  // Shipping
  weight: z.number().optional().nullable(),
  length: z.number().optional().nullable(),
  width: z.number().optional().nullable(),
  height: z.number().optional().nullable(),
  
  // Status & Flags
  status: z.enum(["DRAFT", "PENDING", "ACTIVE", "INACTIVE", "REJECTED"]),
  isVariantParent: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  isFreeShipping: z.boolean().default(false),
  taxClass: z.string().default("standard"),
  
  // SEO
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  
  tags: z.string().or(z.array(z.string())).optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function ProductModal({ product, onClose, refresh }: any) {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [activeTab, setActiveTab] = useState("basic");

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: product ? {
      ...product,
      tags: product.tags ? product.tags.join(", ") : "",
      subCategoryId: product.subCategoryId || null,
      brandId: product.brandId || null,
    } : {
      name: "",
      slug: "",
      categoryId: "",
      status: "PENDING",
      basePrice: 0,
      stockQuantity: 0,
      lowStockThreshold: 5,
      isFeatured: false,
      isFreeShipping: false,
      taxClass: "standard",
    }
  });

  const productName = watch("name");

  useEffect(() => {
    // Auto-generate slug from name if creating new
    if (!product && productName) {
      const slug = productName.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
      setValue("slug", slug);
    }
  }, [productName, setValue, product]);

  useEffect(() => {
    fetch("/api/categories")
      .then(res => res.json())
      .then(data => setCategories(Array.isArray(data) ? data : (data.categories || [])));
    
    fetch("/api/brands")
      .then(res => res.json())
      .then(data => setBrands(Array.isArray(data) ? data : (data.brands || [])));
  }, []);

  const onSubmit = async (data: ProductFormValues) => {
    const method = product ? "PUT" : "POST";
    const url = product ? `/api/products/${product.id}` : "/api/products";

    try {
      const finalPayload = {
        ...data,
        tags: typeof data.tags === 'string' ? data.tags.split(",").map((t: string) => t.trim()).filter(Boolean) : data.tags
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: finalPayload, variants: product?.variants || [] })
      });

      if (res.ok) {
        toast.success(product ? "Product updated successfully!" : "Product created successfully!");
        refresh();
        onClose();
      } else {
        const errData = await res.json();
        toast.error(errData.error || "Something went wrong!");
      }
    } catch (err) {
      toast.error("An unexpected error occurred!");
    }
  };

  const renderError = (field: keyof ProductFormValues) => {
    if (errors[field]) {
      return (
        <p className="text-rose-500 text-xs mt-1 flex items-center gap-1">
          <AlertCircle size={12} /> {errors[field]?.message as string}
        </p>
      );
    }
    return null;
  };

  const tabs = [
    { id: "basic", label: "Basic Info", icon: <Layout size={16} /> },
    { id: "pricing", label: "Pricing & Inventory", icon: <DollarSign size={16} /> },
    { id: "shipping", label: "Shipping", icon: <Truck size={16} /> },
    { id: "seo", label: "SEO & Meta", icon: <Globe size={16} /> },
  ];

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex justify-end transition-all">
      <div className="w-full max-w-4xl bg-white h-full overflow-y-auto shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col">
        
        {/* Header */}
        <div className="sticky top-0 bg-white/80 backdrop-blur-md z-10 px-8 py-5 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {product ? "Edit Premium Product" : "New Premium Product"}
            </h2>
            <p className="text-xs text-slate-500">Comprehensive catalog management system</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 text-slate-400 hover:text-rose-500 rounded-xl transition-all">
            <X size={24} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-8 border-b border-slate-100 flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 text-sm font-semibold transition-all border-b-2 flex items-center gap-2 ${
                activeTab === tab.id 
                ? "border-blue-600 text-blue-600" 
                : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8 flex-1">
          
          {/* Basic Information Section */}
          {activeTab === "basic" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Product Title</label>
                  <input 
                    {...register("name")}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 ring-blue-100 focus:border-blue-500 outline-none transition-all" 
                    placeholder="e.g. iPhone 15 Pro Max Titanium" 
                  />
                  {renderError("name")}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">URL Slug</label>
                  <input 
                    {...register("slug")}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 outline-none" 
                    placeholder="iphone-15-pro-max" 
                  />
                  {renderError("slug")}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Main Category</label>
                  <select 
                    {...register("categoryId")}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                  >
                    <option value="">Choose Category</option>
                    {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  {renderError("categoryId")}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Brand</label>
                  <select 
                    {...register("brandId")}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                  >
                    <option value="">None / Choose Brand</option>
                    {brands.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Short Description</label>
                  <Controller
                    name="shortDescription"
                    control={control}
                    render={({ field }) => (
                      <TiptapEditor 
                        value={field.value || ""} 
                        onChange={field.onChange} 
                        placeholder="Brief highlights..." 
                      />
                    )}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Long Description</label>
                  <Controller
                    name="longDescription"
                    control={control}
                    render={({ field }) => (
                      <TiptapEditor 
                        value={field.value || ""} 
                        onChange={field.onChange} 
                        placeholder="Detailed product information..." 
                      />
                    )}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Thumbnail URL</label>
                  <div className="flex gap-4">
                    <input 
                      {...register("thumbnail")}
                      className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-500 outline-none" 
                      placeholder="https://image-link.com" 
                    />
                    <div className="h-11 w-11 bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden border border-slate-200">
                      {watch("thumbnail") ? (
                        <img src={watch("thumbnail")} alt="Mini" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon size={18} className="text-slate-400" />
                      )}
                    </div>
                  </div>
                  {renderError("thumbnail")}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tags (Comma separated)</label>
                  <input 
                    {...register("tags")}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" 
                    placeholder="tech, mobile, flagship" 
                  />
                </div>
              </div>
            </div>
          )}

          {/* Pricing & Inventory Section */}
          {activeTab === "pricing" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                <h4 className="text-sm font-bold text-blue-700 mb-4 flex items-center gap-2">
                  <DollarSign size={16} /> Financial Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Base Price (৳)</label>
                    <input 
                      type="number" 
                      {...register("basePrice", { valueAsNumber: true })}
                      className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:border-blue-500" 
                    />
                    {renderError("basePrice")}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Compare At Price (৳)</label>
                    <input 
                      type="number" 
                      {...register("comparePrice", { valueAsNumber: true })}
                      className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:border-blue-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Cost Per Item (৳)</label>
                    <input 
                      type="number" 
                      {...register("costPerItem", { valueAsNumber: true })}
                      className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:border-blue-500" 
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <h4 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                  <Package size={16} /> Stock Management
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Total Stock</label>
                    <input 
                      type="number" 
                      {...register("stockQuantity", { valueAsNumber: true })}
                      className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:border-blue-500" 
                    />
                    {renderError("stockQuantity")}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Low Stock Alert</label>
                    <input 
                      type="number" 
                      {...register("lowStockThreshold", { valueAsNumber: true })}
                      className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:border-blue-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">SKU</label>
                    <input 
                      {...register("sku")}
                      className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:border-blue-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Status</label>
                    <select 
                      {...register("status")}
                      className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="ACTIVE">Active</option>
                      <option value="DRAFT">Draft</option>
                      <option value="INACTIVE">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-8 px-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" {...register("isFeatured")} className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">Featured Product</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" {...register("isFreeShipping")} className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">Free Shipping</span>
                </label>
              </div>
            </div>
          )}

          {/* Shipping Section */}
          {activeTab === "shipping" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                    <Truck size={14} /> Product Weight (kg)
                  </label>
                  <input 
                    type="number" 
                    step="0.01"
                    {...register("weight", { valueAsNumber: true })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500" 
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tax Class</label>
                  <select 
                    {...register("taxClass")}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500"
                  >
                    <option value="standard">Standard Tax</option>
                    <option value="reduced">Reduced Rate</option>
                    <option value="zero">Zero Rated</option>
                    <option value="exempt">Tax Exempt</option>
                  </select>
                </div>
              </div>

              <div className="pt-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-4 tracking-wider">Physical Dimensions (cm)</h4>
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Length</label>
                    <input type="number" {...register("length", { valueAsNumber: true })} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Width</label>
                    <input type="number" {...register("width", { valueAsNumber: true })} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Height</label>
                    <input type="number" {...register("height", { valueAsNumber: true })} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SEO Section */}
          {activeTab === "seo" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="p-6 bg-emerald-50/30 rounded-2xl border border-emerald-100/50">
                <h4 className="text-sm font-bold text-emerald-700 mb-4 flex items-center gap-2">
                  <Globe size={16} /> Search Engine Optimization
                </h4>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Meta Title</label>
                    <input 
                      {...register("metaTitle")}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 outline-none" 
                      placeholder="SEO Title (recommended < 60 chars)" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Meta Description</label>
                    <textarea 
                      {...register("metaDescription")}
                      rows={4}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none resize-none focus:border-emerald-500"
                      placeholder="Detailed SEO description (recommended < 160 chars)"
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-start gap-3">
                <AlertCircle size={20} className="text-slate-400 mt-0.5" />
                <div className="text-xs text-slate-500 leading-relaxed">
                  Proper SEO information helps your product appear in Google search results. 
                  If left empty, the system will fallback to the Product Name and Short Description.
                </div>
              </div>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="sticky bottom-0 bg-white/90 backdrop-blur-md pt-6 pb-2 border-t border-slate-100 flex gap-4">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 text-white py-3.5 rounded-2xl font-bold hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? "Processing..." : (product ? "Save Premium Changes" : "Publish Premium Product")}
            </button>
            <button 
              type="button" 
              onClick={onClose} 
              className="px-10 bg-slate-100 text-slate-600 py-3.5 rounded-2xl font-semibold hover:bg-slate-200 transition-all"
            >
              Discard
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}