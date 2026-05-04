'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types';
import { productService } from '@/services/productService';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { Star, ShoppingCart, ShieldCheck, Truck, RefreshCcw, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PageProps {
  params: {
    slug: string;
  };
}

export default function ProductDetailsPage({ params }: PageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await productService.getProductBySlug(params.slug);
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <div className="flex flex-col md:flex-row gap-10 animate-pulse">
            <div className="w-full md:w-1/2 aspect-square bg-muted rounded-3xl" />
            <div className="w-full md:w-1/2 space-y-6">
              <div className="h-10 bg-muted rounded w-3/4" />
              <div className="h-6 bg-muted rounded w-1/4" />
              <div className="h-32 bg-muted rounded" />
              <div className="h-12 bg-muted rounded w-1/2" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">Product Not Found</h1>
        <Button className="mt-4" onClick={() => window.history.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-12 mb-16">
          {/* Image Section */}
          <div className="w-full lg:w-1/2">
            <div className="relative aspect-square rounded-[2.5rem] overflow-hidden glass shadow-2xl group">
              <Image 
                src={product.images?.[0] || product.image || 'https://images.unsplash.com/photo-1591405351990-4726e33df48c?w=400&h=400&fit=crop'} 
                alt={product.name} 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <Badge className="absolute top-6 right-6 px-4 py-1.5 text-sm tech-gradient border-none">
                {product.category}
              </Badge>
            </div>
          </div>

          {/* Info Section */}
          <div className="w-full lg:w-1/2 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-1 text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.averageRating || 0) ? 'fill-current' : 'text-muted'}`} />
                ))}
                <span className="ml-2 text-sm font-bold text-foreground">({product.averageRating || 0})</span>
                <span className="mx-2 text-muted-foreground">|</span>
                <span className="text-sm text-primary font-medium">12 Reviews</span>
              </div>
              
              <h1 className="text-4xl font-black tracking-tight text-secondary dark:text-white leading-tight">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-4">
                <span className="text-4xl font-black text-primary">৳{product.price.toLocaleString()}</span>
                {product.status === 'In Stock' ? (
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none px-3 font-bold">
                    <Check className="w-3 h-3 mr-1" /> IN STOCK
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="px-3 font-bold">OUT OF STOCK</Badge>
                )}
              </div>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 glass rounded-2xl">
                <ShieldCheck className="w-6 h-6 text-primary" />
                <div>
                  <h4 className="font-bold text-sm">Official Warranty</h4>
                  <p className="text-xs text-muted-foreground">1 Year Replacement Warranty</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 glass rounded-2xl">
                <Truck className="w-6 h-6 text-blue-500" />
                <div>
                  <h4 className="font-bold text-sm">Fast Delivery</h4>
                  <p className="text-xs text-muted-foreground">Free shipping on orders over ৳10,000</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" className="flex-1 tech-gradient h-14 text-lg font-bold shadow-lg shadow-primary/20">
                <ShoppingCart className="w-5 h-5 mr-3" />
                Add to Cart
              </Button>
              <Button size="lg" variant="outline" className="flex-1 h-14 text-lg font-bold border-2">
                Buy Now
              </Button>
            </div>
          </div>
        </div>

        {/* Detailed Specs Tabs */}
        <div className="glass rounded-[2rem] p-8 md:p-12 shadow-xl">
          <Tabs defaultValue="specs">
            <TabsList className="bg-muted/50 p-1 rounded-xl mb-8">
              <TabsTrigger value="specs" className="rounded-lg px-8 py-2.5 font-bold data-[state=active]:bg-background data-[state=active]:text-primary">
                Specification
              </TabsTrigger>
              <TabsTrigger value="description" className="rounded-lg px-8 py-2.5 font-bold data-[state=active]:bg-background data-[state=active]:text-primary">
                Description
              </TabsTrigger>
              <TabsTrigger value="reviews" className="rounded-lg px-8 py-2.5 font-bold data-[state=active]:bg-background data-[state=active]:text-primary">
                Reviews (12)
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="specs" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                {product.keyFeatures?.map((feature, i) => (
                  <div key={i} className="flex justify-between border-b border-border py-4">
                    <span className="text-muted-foreground font-medium">{feature.split(':')[0]}</span>
                    <span className="font-bold text-right">{feature.split(':')[1] || feature}</span>
                  </div>
                ))}
                <div className="flex justify-between border-b border-border py-4">
                  <span className="text-muted-foreground font-medium">Category</span>
                  <span className="font-bold">{product.category}</span>
                </div>
                <div className="flex justify-between border-b border-border py-4">
                  <span className="text-muted-foreground font-medium">Status</span>
                  <span className="font-bold">{product.status}</span>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="description" className="text-muted-foreground leading-loose">
              {product.description}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
