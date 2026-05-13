"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import ProductCard from "@/components/product/ProductCard";
import { Product } from "@/types";


export default function FeaturedProducts() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/products"
        );

        // আপনার API স্ট্রাকচার অনুযায়ী products অ্যারেটি বের করে আনা হলো
        const productsArray = response.data.products || [];

        // এখন সঠিকভাবে স্লাইস হবে
        setFeaturedProducts(productsArray.slice(0, 8));
      } catch (error) {
        console.error("Error fetching featured products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        {/* হেডার সেকশনটি প্রিমিয়াম করার জন্য padding এবং layout ঠিক করা হয়েছে */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic">
              Featured <span className="text-[#FF4D30]">Products</span>
            </h2>
            <p className="text-slate-500 mt-1 text-sm font-medium italic">
              Hand-picked tech for enthusiasts
            </p>
          </div>

          <Link href="/products">
            <Button
              variant="link"
              className="text-sm font-black group text-[#FF4D30] p-0"
            >
              VIEW ALL PRODUCTS
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="h-96 rounded-2xl bg-white border border-gray-100 animate-pulse shadow-sm"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}