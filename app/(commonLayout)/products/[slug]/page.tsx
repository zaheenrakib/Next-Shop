'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // useRouter যোগ করা হয়েছে
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { Star, ShoppingCart, Loader2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

// --- Success Notification Component ---
const AddToCartSuccess = ({ name, image }: { name: string; image: string }) => (
  <div className="flex items-center gap-4 p-2 w-full">
    <div className="relative h-12 w-12 flex-shrink-0">
      <Image
        src={image}
        alt={name}
        fill
        className="object-cover rounded-lg border border-gray-100"
      />
    </div>
    <div className="flex flex-col">
      <p className="text-sm font-bold text-gray-900">কার্টে যোগ করা হয়েছে!</p>
      <p className="text-xs text-gray-500 line-clamp-1">{name}</p>
    </div>
  </div>
);

export default function ProductDetailsPage({ params }: any) {
  const router = useRouter(); // Router initialize
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);

  useEffect(() => {
    fetchProduct();
  }, [params.slug]);

  const fetchProduct = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      const found = data.products.find((p: any) => p.slug === params.slug);

      if (found) {
        const fullRes = await fetch(`/api/products/${found.id}`);
        const full = await fullRes.json();
        setProduct(full);
        if (full.variants?.length) {
          setSelectedVariant(full.variants[0]);
        }
      }
    } catch (err) {
      toast.error('Product load করতে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  // 🛒 ADD TO CART FUNCTION
  const addToCart = () => {
    if (!product) return;
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const item = {
        id: product.id || product._id,
        name: product.name,
        price: selectedVariant?.price || product.price,
        image: product.thumbnail,
        sku: selectedVariant?.sku || product.sku,
        qty: 1
      };
      const existingItemIndex = cart.findIndex((i: any) => i.id === item.id && i.sku === item.sku);
      if (existingItemIndex > -1) {
        cart[existingItemIndex].qty += 1;
      } else {
        cart.push(item);
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('storage')); 
      toast(<AddToCartSuccess name={product.name} image={product.thumbnail} />, {
        duration: 3000,
        className: "rounded-2xl border-none shadow-2xl bg-white p-4",
      });
    } catch (error) {
      toast.error('কার্টে অ্যাড করা যায়নি');
    }
  };

  // 🚀 BUY NOW FUNCTION (DIRECT CHECKOUT)
  const handleBuyNow = () => {
    if (!product) return;
    
    const item = {
      id: product.id || product._id,
      name: product.name,
      price: selectedVariant?.price || product.price,
      image: product.thumbnail,
      sku: selectedVariant?.sku || product.sku,
      qty: 1
    };

    // সরাসরি লোকাল স্টোরেজে এই আইটেমটি সেট করে চেকআউট পেজে পাঠানো
    // এটি করলে আগের কার্ট ক্লিয়ার হয়ে যাবে, যা "Buy Now" এর জন্য স্ট্যান্ডার্ড
    localStorage.setItem('cart', JSON.stringify([item]));
    window.dispatchEvent(new Event('storage')); 
    router.push('/checkout');
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin w-10 h-10 text-gray-400" />
      </div>
    );
  }

  if (!product) return <div className="text-center py-20 font-bold">Product not found</div>;

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-black">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          
          {/* IMAGE SECTION */}
          <div className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 p-6 flex items-center justify-center">
            <Image
              src={product.thumbnail}
              alt={product.name}
              width={600}
              height={600}
              className="w-full h-[450px] object-contain mix-blend-multiply"
            />
          </div>

          {/* INFO SECTION */}
          <div className="flex flex-col justify-center">
            <Badge variant="secondary" className="w-fit bg-blue-50 text-blue-600 border-none px-3 py-1 mb-4">
              {product.brand?.name || 'Premium Quality'}
            </Badge>
            
            <h1 className="text-4xl font-extrabold tracking-tight mb-4 leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} className={i < Math.floor(product.rating) ? "" : "text-gray-300"} />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-500">({product.reviews} Reviews)</span>
            </div>

            <p className="text-gray-600 mb-8 text-lg">{product.shortDescription}</p>

            <div className="mb-8">
              <span className="text-sm text-gray-400 uppercase font-bold tracking-widest block mb-1">Price</span>
              <div className="text-4xl font-black">৳{(selectedVariant?.price || product.price).toLocaleString()}</div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={addToCart}
                variant="outline"
                className="flex-1 h-14 text-lg font-bold border-2 border-black hover:bg-black hover:text-white transition-all rounded-xl"
                disabled={product.stock <= 0}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>

              <Button
                onClick={handleBuyNow} // Modal এর বদলে সরাসরি ফাংশন কল
                className="flex-1 h-14 text-lg font-bold bg-black text-white hover:bg-gray-800 rounded-xl transition-all active:scale-95"
                disabled={product.stock <= 0}
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Buy Now
              </Button>
            </div>
          </div>
        </div>

        {/* DETAILS TABS */}
        <div className="mt-12 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <Tabs defaultValue="specs">
            <TabsList className="bg-gray-100 p-1 rounded-xl">
              <TabsTrigger value="specs" className="px-8">Specifications</TabsTrigger>
              <TabsTrigger value="desc" className="px-8">Description</TabsTrigger>
            </TabsList>

            <TabsContent value="specs" className="mt-8">
              <div className="grid md:grid-cols-2 gap-x-12 gap-y-4">
                {Object.entries(product.specifications || {}).map(([key, value]: any) => (
                  <div key={key} className="flex justify-between border-b border-gray-50 py-4 px-2">
                    <span className="text-gray-500 font-medium">{key}</span>
                    <span className="font-bold text-gray-900">{value}</span>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="desc" className="mt-8 text-gray-600 leading-relaxed text-lg">
              {product.description}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}