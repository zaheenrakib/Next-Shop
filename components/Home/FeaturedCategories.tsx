'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  iconUrl: string;
  destinationUrl: string;
  isActive: boolean;
}

export default function FeaturedCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // ডেটা ফেচ করার ফাংশন
  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/featured-category');
      const data = await res.json();
      if (Array.isArray(data)) {
        // শুধুমাত্র Active ক্যাটাগরিগুলো দেখানোর জন্য ফিল্টার
        setCategories(data.filter((cat: Category) => cat.isActive));
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex justify-center items-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <section className="py-12 bg-gray-50/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">
            Featured Category
          </h2>
          <p className="text-slate-500 font-medium">
            Get Your Desired Product from Featured Category!
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`${cat.destinationUrl}` || `/category/${cat.id}`}
              className="group bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center gap-4 transition-all duration-300 hover:shadow-xl hover:border-blue-200 hover:-translate-y-1.5"
            >
              {/* Icon Container */}
              <div className="w-16 h-16 flex items-center justify-center bg-slate-50 rounded-2xl p-3 group-hover:bg-blue-50 transition-colors duration-300">
                <img 
                  src={cat.iconUrl} 
                  alt={cat.name} 
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              
              {/* Name */}
              <span className="text-xs font-bold text-center text-slate-800 group-hover:text-blue-600 transition-colors leading-tight">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>

        {/* যদি কোনো ক্যাটাগরি না থাকে */}
        {!loading && categories.length === 0 && (
          <div className="text-center text-slate-400 py-10">
            No categories available at the moment.
          </div>
        )}
      </div>
    </section>
  );
}