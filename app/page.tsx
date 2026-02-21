'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, Monitor, Cpu, Zap, Shield, Truck, Package } from 'lucide-react';
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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-20 right-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 left-[-10%] w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] -z-10" />
        
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="lg:w-1/2 space-y-8 text-center lg:text-left">
              <Badge className="px-4 py-1.5 glass text-primary font-bold border-primary/20 text-sm animate-bounce">
                🎉 New Era of Tech Store
              </Badge>
              <h1 className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tight text-secondary dark:text-white">
                Build the <span className="text-primary italic">Perfect</span> Rig with NextBazaar
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
                Experience the ultimate gadget shopping destination. From high-end components to custom PC builds, we deliver tech that empowers you.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <Link href="/pc-builder">
                  <Button size="lg" className="h-16 px-10 rounded-2xl tech-gradient text-lg font-bold shadow-xl shadow-primary/30 group">
                    <Monitor className="w-6 h-6 mr-2" />
                    Start PC Building
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/products">
                  <Button size="lg" variant="outline" className="h-16 px-10 rounded-2xl text-lg font-bold border-2 hover:bg-muted">
                    Browse All Gadgets
                  </Button>
                </Link>
              </div>
            </div>

            <div className="lg:w-1/2 relative">
              <div className="relative z-10 animate-float">
                <img 
                  src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&h=600&fit=crop" 
                  alt="Tech Setup" 
                  className="rounded-[3rem] shadow-2xl border-4 border-white/50 dark:border-white/10"
                />
              </div>
              <div className="absolute -top-10 -right-10 glass p-6 rounded-3xl shadow-2xl animate-pulse delay-700 hidden md:block">
                <Cpu className="w-12 h-12 text-primary" />
                <p className="mt-2 font-black text-xl">Top CPUs</p>
                <p className="text-sm text-muted-foreground">In Stock</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Zap, title: "Custom PC Builder", desc: "Select components with compatibility check" },
              { icon: Shield, title: "Official Warranty", desc: "Authorized dealer of global brands" },
              { icon: Truck, title: "Express Delivery", desc: "Same day delivery in major cities" },
              { icon: Package, title: "Bulk Sourcing", desc: "B2B solutions for your workspace" }
            ].map((feature, i) => (
              <div key={i} className="glass p-8 rounded-3xl border-none card-hover">
                <div className="w-14 h-14 tech-gradient rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary/20 text-white">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-4xl font-black text-secondary dark:text-white tracking-tight">Featured Gear</h2>
              <p className="text-muted-foreground mt-2 text-lg">Hand-picked tech for enthusiasts</p>
            </div>
            <Link href="/products">
              <Button variant="link" className="text-lg font-bold group text-primary p-0">
                View All Arrivals
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-96 rounded-3xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 text-center glass py-20 rounded-[4rem] border-primary/10 shadow-3xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 tech-gradient rounded-full blur-[100px] opacity-20" />
          <h2 className="text-5xl md:text-7xl font-black mb-8 max-w-4xl mx-auto leading-tight">
            Ready to Build Your <span className="text-primary italic">Ultimate</span> PC?
          </h2>
          <Link href="/pc-builder">
            <Button size="lg" className="h-16 px-12 rounded-2xl tech-gradient text-xl font-black shadow-2xl shadow-primary/40">
              Launch PC Builder
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
