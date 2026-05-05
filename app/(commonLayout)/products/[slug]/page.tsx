'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { Star, ShoppingCart, ShieldCheck, Truck, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

export default function ProductDetailsPage({ params }: { params: { slug: string } }) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [selectedAttrValues, setSelectedAttrValues] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchProduct();
  }, [params.slug]);

  const fetchProduct = async () => {
    try {
      // Find product by slug - for now using a search param or similar
      // In a real app, you'd have an API that finds by slug
      // For this demo, let's assume we can fetch by slug or use the ID if we had it
      // Let's fetch all products and find the one with the slug
      const res = await fetch(`/api/products`);
      const data = await res.json();
      const found = data.products.find((p: any) => p.slug === params.slug);
      
      if (found) {
        const fullRes = await fetch(`/api/products/${found.id}`);
        const fullProduct = await fullRes.json();
        setProduct(fullProduct);
        
        // Default to first variant
        if (fullProduct.variants?.length > 0) {
          setSelectedVariant(fullProduct.variants[0]);
          
          // Initialize selected attributes from first variant
          const initialAttrs: Record<string, string> = {};
          fullProduct.variants[0].variantAttributes.forEach((va: any) => {
            initialAttrs[va.attributeValue.attribute.name] = va.attributeValue.id;
          });
          setSelectedAttrValues(initialAttrs);
        }
      }
    } catch (error) {
      toast.error('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  // Find variant based on selected attributes
  useEffect(() => {
    if (!product) return;

    const variant = product.variants.find((v: any) => {
      return v.variantAttributes.every((va: any) => {
        return selectedAttrValues[va.attributeValue.attribute.name] === va.attributeValue.id;
      });
    });

    if (variant) {
      setSelectedVariant(variant);
    }
  }, [selectedAttrValues, product]);

  const handleAttrChange = (attrName: string, valueId: string) => {
    setSelectedAttrValues(prev => ({
      ...prev,
      [attrName]: valueId
    }));
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin w-12 h-12" /></div>;
  if (!product) return <div className="text-center py-20">Product not found</div>;

  // Extract all unique attributes and their values across all variants
  const availableAttrs: Record<string, any[]> = {};
  product.variants.forEach((v: any) => {
    v.variantAttributes.forEach((va: any) => {
      const a = va.attributeValue;
      if (!availableAttrs[a.attribute.name]) {
        availableAttrs[a.attribute.name] = [];
      }
      if (!availableAttrs[a.attribute.name].find(val => val.id === a.id)) {
        availableAttrs[a.attribute.name].push(a);
      }
    });
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-12 mb-16">
          {/* Image Section */}
          <div className="w-full lg:w-1/2">
            <div className="relative aspect-square rounded-[2.5rem] overflow-hidden glass shadow-2xl group">
              <Image 
                src={selectedVariant?.image || product.thumbnail || 'https://images.unsplash.com/photo-1591405351990-4726e33df48c?w=400&h=400&fit=crop'} 
                alt={product.name} 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <Badge className="absolute top-6 right-6 px-4 py-1.5 text-sm tech-gradient border-none">
                {product.category?.name}
              </Badge>
            </div>
          </div>

          {/* Info Section */}
          <div className="w-full lg:w-1/2 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-1 text-yellow-500">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                <span className="ml-2 text-sm font-bold text-foreground">(4.5)</span>
                <span className="mx-2 text-muted-foreground">|</span>
                <span className="text-sm text-primary font-medium">12 Reviews</span>
              </div>
              
              <h1 className="text-4xl font-black tracking-tight text-secondary dark:text-white leading-tight">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-4">
                <span className="text-4xl font-black text-primary">৳{selectedVariant?.price.toLocaleString()}</span>
                {selectedVariant?.stock > 0 ? (
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none px-3 font-bold">
                    <Check className="w-3 h-3 mr-1" /> IN STOCK ({selectedVariant.stock})
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="px-3 font-bold">OUT OF STOCK</Badge>
                )}
              </div>
            </div>

            {/* Dynamic Attribute Selectors */}
            <div className="space-y-6 border-y py-6">
              {Object.keys(availableAttrs).map(attrName => (
                <div key={attrName} className="space-y-3">
                  <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">{attrName}</h3>
                  <div className="flex flex-wrap gap-3">
                    {availableAttrs[attrName].map(val => (
                      <button
                        key={val.id}
                        onClick={() => handleAttrChange(attrName, val.id)}
                        className={`px-4 py-2 rounded-xl border-2 font-bold transition-all ${
                          selectedAttrValues[attrName] === val.id 
                          ? 'border-primary bg-primary/10 text-primary' 
                          : 'border-transparent bg-muted hover:bg-muted/80'
                        }`}
                      >
                        {val.value}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                size="lg" 
                className="flex-1 tech-gradient h-14 text-lg font-bold shadow-lg shadow-primary/20"
                disabled={!selectedVariant || selectedVariant.stock === 0}
              >
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
            </TabsList>
            
            <TabsContent value="specs" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                {selectedVariant?.variantAttributes.map((va: any) => (
                  <div key={va.id} className="flex justify-between border-b border-border py-4">
                    <span className="text-muted-foreground font-medium">{va.attributeValue.attribute.name}</span>
                    <span className="font-bold text-right">{va.attributeValue.value}</span>
                  </div>
                ))}
                <div className="flex justify-between border-b border-border py-4">
                  <span className="text-muted-foreground font-medium">Brand</span>
                  <span className="font-bold">{product.brand?.name}</span>
                </div>
                <div className="flex justify-between border-b border-border py-4">
                  <span className="text-muted-foreground font-medium">SKU</span>
                  <span className="font-bold">{selectedVariant?.sku}</span>
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
