'use client';

import { useState, useEffect } from 'react';
import { Category, Product } from '@/types';
import { productService } from '@/services/productService';
import { usePCBuilder } from '@/hooks/usePCBuilder';
import ProductCard from '@/components/product/ProductCard';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ComponentSelectorProps {
  category: Category;
}

export default function ComponentSelector({ category }: ComponentSelectorProps) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addComponent, isCompatible } = usePCBuilder();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getAllProducts(category);
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  const handleSelect = (product: Product) => {
    const { compatible, reason } = isCompatible(category, product);
    
    if (!compatible) {
      toast.error(reason || 'Incompatible component!', {
        description: 'Please check your motherboard/processor combination.',
        duration: 5000,
      });
      return;
    }

    addComponent(category, product);
    toast.success(`${product.name} added to your build!`);
    router.push('/pc-builder');
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Button variant="ghost" onClick={() => router.back()} className="mb-4 gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Builder
          </Button>
          <h1 className="text-3xl font-extrabold text-secondary dark:text-white">Select {category}</h1>
          <p className="text-muted-foreground mt-1">Showing all compatible {category} components</p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-[400px] rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              actionType="select" 
              onSelect={handleSelect}
            />
          ))}
        </div>
      ) : (
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No products found</AlertTitle>
          <AlertDescription>
            We couldn't find any products in this category at the moment.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
