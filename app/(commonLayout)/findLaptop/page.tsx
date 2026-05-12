"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Laptop, Banknote, ArrowRight } from "lucide-react";
import Link from "next/link";

const budgets = [
  { label: "Under 50k", value: 50000 },
  { label: "Under 1 Lakh", value: 100000 },
  { label: "Under 2 Lakh", value: 200000 },
  { label: "Under 3.5 Lakh", value: 350000 },
  { label: "Unlimited", value: 1000000 },
];

export default function FindLaptopPage() {
  const [selectedBudget, setSelectedBudget] = useState(1000000);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // তোমার ডাটাবেসের ল্যাপটপ ক্যাটাগরি আইডি এখানে দিচ্ছি
  const laptopCategoryId = "69fb279db553f59b0fa4a617";

  useEffect(() => {
    const fetchLaptops = async () => {
      setLoading(true);
      try {
        // search=laptop বাদ দিয়ে সরাসরি ক্যাটাগরি আইডি দিয়ে ফিল্টার করছি
        const res = await fetch(`/api/products?maxPrice=${selectedBudget}&category=${laptopCategoryId}`);
        const data = await res.json();
        setProducts(data.products || []);
      } catch (err) {
        console.error("Error finding laptops:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLaptops();
  }, [selectedBudget]);

  return (
    <div className="bg-slate-50 min-h-screen">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-slate-900 mb-4 italic uppercase tracking-tight">
            Find Your <span className="text-[#FF4D30]">Perfect</span> Laptop
          </h1>
          <p className="text-slate-500 text-lg font-medium">
  Select your budget range to discover the best-performing laptops tailored for you.
</p>
        </div>


        {/* Budget Picker */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {budgets.map((b) => (
            <button
  key={b.value}
  onClick={() => setSelectedBudget(b.value)}
  className={`px-8 py-4 rounded-2xl font-bold transition-all duration-500 flex items-center gap-3 border-2 tracking-tight ${
    selectedBudget === b.value
      ? "bg-[#FF4D30] border-[#FF4D30] text-white shadow-[0_10px_25px_-5px_rgba(255,77,48,0.4)] scale-105"
      : "bg-white border-slate-100 text-slate-500 hover:border-[#FF4D30]/30 hover:text-[#FF4D30]"
  }`}
>
  <Banknote 
    size={20} 
    className={`transition-colors duration-300 ${
      selectedBudget === b.value ? "text-white" : "text-slate-400"
    }`} 
  />
  {b.label}
</button>
          ))}
        </div>

        {/* Loading / Results Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.length > 0 ? (
              products.map((product: any) => (
                <div key={product.id} className="group bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden hover:shadow-2xl transition-all duration-500">
                  <div className="relative h-56 bg-slate-50 p-6 flex items-center justify-center">
                    <img src={product.thumbnail} alt={product.name} className="max-h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="p-6">
                    <p className="text-[10px] font-bold text-blue-600 uppercase mb-1 tracking-widest">{product.brand?.name}</p>
                    <h3 className="font-bold text-slate-800 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">{product.name}</h3>
                    <p className="text-2xl font-black text-slate-900 mb-6">৳{product.price.toLocaleString()}</p>
                    <Link href={`/products/${product.slug}`}>
                      <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-600 transition-all active:scale-95">
                        View Details <ArrowRight size={18} />
                      </button>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-24 bg-white rounded-[40px] border border-dashed border-slate-200">
                <Laptop size={64} className="mx-auto text-slate-200 mb-4" />
                <h2 className="text-xl font-bold text-slate-800">No Laptops found within ৳{selectedBudget.toLocaleString()}!</h2>
                <p className="text-slate-400 mt-2">Try increasing your budget or checking back later.</p>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}