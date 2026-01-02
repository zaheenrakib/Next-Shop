'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, Zap, Shield, Truck } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, Navigation } from 'swiper/modules';
import { toast } from 'sonner';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetchProducts();
    loadCart();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCart = () => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    let updatedCart;
    
    if (existingItem) {
      updatedCart = cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updatedCart = [...cart, { ...product, quantity: 1 }];
    }
    
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    toast.success('Added to cart!');
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartCount={cartCount} />

      {/* Hero Section with Swiper */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <Swiper
            modules={[Pagination, Autoplay]}
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            loop={true}
            className="rounded-2xl overflow-hidden"
          >
            <SwiperSlide>
              <div className="flex flex-col md:flex-row items-center justify-between bg-gradient-to-r from-primary to-blue-600 text-white p-8 md:p-16 rounded-2xl">
                <div className="md:w-1/2 space-y-6">
                  <Badge className="bg-white text-primary">New Arrivals</Badge>
                  <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                    Premium Electronics from China
                  </h1>
                  <p className="text-lg text-blue-100">
                    Discover cutting-edge gadgets and accessories at unbeatable prices
                  </p>
                  <Link href="/products">
                    <Button size="lg" variant="secondary" className="group">
                      Shop Now
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
                <div className="md:w-1/2 mt-8 md:mt-0">
                  <img
                    src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=400&fit=crop"
                    alt="Electronics"
                    className="rounded-xl shadow-2xl"
                  />
                </div>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="flex flex-col md:flex-row items-center justify-between bg-gradient-to-r from-accent to-green-600 text-white p-8 md:p-16 rounded-2xl">
                <div className="md:w-1/2 space-y-6">
                  <Badge className="bg-white text-accent">Limited Offer</Badge>
                  <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                    Up to 50% OFF
                  </h1>
                  <p className="text-lg text-green-100">
                    On selected items. Free shipping worldwide on orders over $100
                  </p>
                  <Link href="/products">
                    <Button size="lg" variant="secondary" className="group">
                      Browse Deals
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
                <div className="md:w-1/2 mt-8 md:mt-0">
                  <img
                    src="https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=600&h=400&fit=crop"
                    alt="Deals"
                    className="rounded-xl shadow-2xl"
                  />
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Truck className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Fast Delivery</h3>
                <p className="text-sm text-muted-foreground">
                  Free shipping on orders over $100
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-accent/10 rounded-lg">
                <Shield className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Secure Payment</h3>
                <p className="text-sm text-muted-foreground">
                  100% secure transactions with Stripe
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <Zap className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Quality Guarantee</h3>
                <p className="text-sm text-muted-foreground">
                  30-day money-back guarantee
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-secondary">Featured Products</h2>
              <p className="text-muted-foreground mt-2">
                Handpicked items just for you
              </p>
            </div>
            <Link href="/products">
              <Button variant="outline">
                View All
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-muted h-64 rounded-lg"></div>
                  <div className="mt-4 space-y-2">
                    <div className="bg-muted h-4 rounded w-3/4"></div>
                    <div className="bg-muted h-4 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.slice(0, 8).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addToCart}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Product Slider Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-secondary mb-8">Trending Now</h2>
          <Swiper
            modules={[Navigation, Autoplay]}
            navigation={true}
            autoplay={{ delay: 3000 }}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
          >
            {products.map((product) => (
              <SwiperSlide key={product.id}>
                <ProductCard product={product} onAddToCart={addToCart} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Start Shopping?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers shopping from China to Bangladesh and beyond
          </p>
          <Link href="/products">
            <Button size="lg" variant="secondary" className="group">
              Explore Products
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
