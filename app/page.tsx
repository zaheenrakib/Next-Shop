'use client';

import { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Monitor, 
  Cpu, 
  Zap, 
  Shield, 
  Truck, 
  Package, 
  Laptop, 
  MessageSquare, 
  Home, 
  Settings, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/product/ProductCard';
import { productService } from '@/services/productService';
import { Product } from '@/types';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, Navigation } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await productService.getFeaturedProducts();
        setFeaturedProducts(data);
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  const banners = [
    "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=1200&h=600&fit=crop",
    "https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=1200&h=600&fit=crop",
    "https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?w=1200&h=600&fit=crop"
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-foreground">
      <Navbar />

      <main>
        {/* Banner Section */}
        <section className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-5">
            {/* Main Slider */}
            <div className="lg:w-3/4 w-full h-[250px] md:h-[450px] rounded-2xl overflow-hidden shadow-sm border border-gray-100 relative group">
              <Swiper
                modules={[Pagination, Autoplay, Navigation]}
                pagination={{ clickable: true }}
                autoplay={{ delay: 5000 }}
                loop={true}
                className="w-full h-full"
              >
                {banners.map((src, i) => (
                  <SwiperSlide key={i}>
                    <div className="relative w-full h-full">
                      <img src={src} alt={`Banner ${i}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent flex items-center px-12">
                         <div className="max-w-md text-white space-y-4">
                            <Badge className="bg-primary hover:bg-primary border-none text-xs font-bold px-3">Exclusive Offer</Badge>
                            <h2 className="text-3xl md:text-5xl font-black leading-tight italic">UPGRADE YOUR <span className="text-primary underline decoration-4 underline-offset-8">EXPERIENCE</span></h2>
                            <p className="text-sm md:text-base text-gray-200 font-medium">Grab the best tech deals of the season with official warranty and express delivery options.</p>
                            <Button size="lg" className="tech-gradient border-none font-bold rounded-lg px-8">Shop Now</Button>
                         </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* Side Banners */}
            <div className="lg:w-1/4 w-full flex flex-col gap-5">
              <div className="flex-1 h-[215px] rounded-2xl overflow-hidden shadow-sm border border-gray-100 group transition-transform hover:scale-[1.02] duration-300">
                <img 
                  src="https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&h=400&fit=crop" 
                  alt="Side Banner 1" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 h-[215px] rounded-2xl overflow-hidden shadow-sm border border-gray-100 group transition-transform hover:scale-[1.02] duration-300">
                <img 
                  src="https://images.unsplash.com/photo-1547082299-de196ea013d6?w=600&h=400&fit=crop" 
                  alt="Side Banner 2" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* News Ticker Section */}
        <section className="container mx-auto px-4 mb-6">
          <div className="bg-white rounded-full shadow-sm border border-gray-100 px-8 py-3 flex items-center gap-4 overflow-hidden">
            <div className="whitespace-nowrap font-bold text-xs uppercase tracking-widest text-primary animate-pulse shrink-0">News & Updates:</div>
            <div className="relative flex-grow overflow-hidden">
                <div className="animate-marquee whitespace-nowrap text-sm font-semibold text-slate-600">
                  Saturday, 21 February, All our branches are open except IDB, Multiplan Chattogram Agrabad, & Gazipur branch. Additionally, our online activities are open and operational! Enjoy 0% EMI on selected products... 
                </div>
            </div>
          </div>
        </section>

        {/* Service Feature Grid */}
        <section className="container mx-auto px-4 mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Laptop, title: "Laptop Finder", desc: "Find Your Laptop Easily", color: "bg-orange-500" },
              { icon: MessageSquare, title: "Raise a Complain", desc: "Share your experience", color: "bg-red-500" },
              { icon: Home, title: "Home Service", desc: "Get expert help", color: "bg-red-600" },
              { icon: Settings, title: "Servicing Center", desc: "Repair Your Device", color: "bg-orange-600" }
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 group hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 ${item.color} rounded-full flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-slate-800 text-sm">{item.title}</h3>
                  <p className="text-[11px] text-gray-500 font-medium">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Trending Items</h2>
                <p className="text-slate-500 mt-1 text-sm font-medium italic">Hand-picked tech for enthusiasts</p>
              </div>
              <Link href="/products">
                <Button variant="link" className="text-sm font-black group text-primary p-0">
                  VIEW ALL PRODUCTS
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-96 rounded-2xl bg-white border border-gray-100 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="bg-[#081621] p-12 md:p-20 rounded-[3rem] text-center relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 rounded-full blur-[100px] -z-0" />
              <div className="relative z-10 space-y-8">
                <h2 className="text-4xl md:text-6xl font-black text-white leading-tight italic">
                  BUILD YOUR <span className="text-primary underline underline-offset-[12px] decoration-8">LEGACY</span> RIG
                </h2>
                <p className="text-gray-400 max-w-2xl mx-auto text-lg font-medium">Use our professional PC Builder tool to assemble your dream setup with real-time compatibility checks.</p>
                <Link href="/pc-builder">
                  <Button size="lg" className="h-14 px-12 rounded-xl tech-gradient text-lg font-black shadow-2xl shadow-primary/40 uppercase tracking-widest border-none">
                    Start Building
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
