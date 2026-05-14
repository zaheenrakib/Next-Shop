"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ShoppingCart, LayoutGrid, Filter, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CategoryProductsPage() {
  const { slug } = useParams();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartMessage, setCartMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`/api/categories/${slug}`);
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [slug]);


  const handleAddToCart = (product: any) => {
    try {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const item = {
        id: product.id || product._id,
        name: product.name,
        price: product.discountPrice || product.price,
        image: product.thumbnail,
        sku: product.sku || "N/A",
        qty: 1,
      };

      const existingItemIndex = cart.findIndex(
        (i: any) => i.id === item.id && i.sku === item.sku
      );

      if (existingItemIndex > -1) {
        cart[existingItemIndex].qty += 1;
      } else {
        cart.push(item);
      }

      localStorage.setItem("cart", JSON.stringify(cart));


      window.dispatchEvent(new Event("storage"));


      setCartMessage(`${product.name} added to cart successfully!`);
      setTimeout(() => setCartMessage(null), 3000);

    } catch (error) {
      console.error("Cart sync error", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      <Navbar />


      {cartMessage && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] bg-[#0F172A] text-white px-6 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="bg-green-500 rounded-full p-1">
            <CheckCircle2 size={16} className="text-white" />
          </div>
          <span className="text-sm font-semibold tracking-wide">{cartMessage}</span>
        </div>
      )}

      <div className="min-h-screen bg-slate-50 pb-20">

        <div className="bg-white border-b border-slate-200 sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="p-2 hover:bg-slate-100 rounded-full transition-all">
                <ArrowLeft size={20} className="text-slate-600" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-slate-800 capitalize">
                  {slug?.toString().replace("-", " ")} Collection
                </h1>
                <p className="text-sm text-slate-500">{products.length} Items Available</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors">
                <Filter size={18} />
              </button>
              <button className="p-2 bg-slate-800 text-white rounded-lg transition-transform active:scale-95">
                <LayoutGrid size={18} />
              </button>
            </div>
          </div>
        </div>


        <div className="max-w-7xl mx-auto px-4 mt-8">
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="group bg-white rounded-3xl border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-blue-100 transition-all duration-500"
                >
                  <div className="relative h-64 overflow-hidden bg-slate-50 p-4">
                    <img
                      src={product.thumbnail || "https://placehold.co/600x400?text=No+Image"}
                      alt={product.name}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
                    />
                    {product.discountPrice > 0 && product.price > product.discountPrice && (
                      <div className="absolute top-4 left-4 bg-rose-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg">
                        SAVE ৳{product.price - product.discountPrice}
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-[2px] mb-2">
                      {product.brand?.name || "Premium Quality"}
                    </p>
                    <h3 className="font-bold text-slate-800 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </h3>

                    <div className="flex items-end gap-2 mb-6">
                      <span className="text-2xl font-black text-slate-900">
                        ৳{product.discountPrice || product.price}
                      </span>
                      {product.discountPrice > 0 && (
                        <span className="text-sm text-slate-400 line-through mb-1">
                          ৳{product.price}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-full bg-slate-50 text-slate-800 py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-black hover:text-white transition-all duration-300 active:scale-95 border border-slate-100 hover:border-transparent"
                    >
                      <ShoppingCart size={18} />
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white rounded-[40px] border border-dashed border-slate-200">
              <div className="bg-slate-50 inline-block p-10 rounded-full mb-6">
                <ShoppingCart size={60} className="text-slate-200 mx-auto" />
              </div>
              <h2 className="text-3xl font-bold text-slate-800">No Products Found</h2>
              <p className="text-slate-500 mt-3 max-w-sm mx-auto leading-relaxed">
                We couldn't find any products in this category at the moment. Please try exploring other collections.
              </p>
              <Link href="/products">
                <button className="mt-8 bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95">
                  Browse All Products
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}