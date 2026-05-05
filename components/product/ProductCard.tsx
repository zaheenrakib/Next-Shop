'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingCart, Plus } from 'lucide-react';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: any;
  onAddToCart?: (product: any) => void;
  onSelect?: (product: any) => void;
  actionType?: 'cart' | 'select';
}

export default function ProductCard({ product, onAddToCart, onSelect, actionType = 'cart' }: ProductCardProps) {
  const displayPrice = product.variants?.[0]?.price || 0;
  const inStock = product.variants?.some((v: any) => v.stock > 0);

  return (
    <Card className="group overflow-hidden card-hover border-none shadow-md bg-card/50 backdrop-blur-sm">
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-[5/4] overflow-hidden bg-muted">
          <Image
            src={product.thumbnail || 'https://images.unsplash.com/photo-1591405351990-4726e33df48c?w=400&h=400&fit=crop'}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <Badge className="absolute top-2 right-2 glass text-foreground font-medium">
            {product.category?.name || 'Gadget'}
          </Badge>
          {!inStock && (
            <div className="absolute inset-0 bg-background/60 flex items-center justify-center backdrop-blur-[2px]">
              <Badge variant="destructive" className="px-4 py-1 text-sm">Out of Stock</Badge>
            </div>
          )}
        </div>
      </Link>
      
      <CardHeader className="p-3 pb-0">
        <div className="flex items-center gap-1 text-yellow-500 mb-1">
          <Star className="w-3 h-3 fill-current" />
          <span className="text-[10px] font-bold">4.5</span>
        </div>
        <Link href={`/products/${product.slug}`}>
          <CardTitle className="text-sm font-bold line-clamp-2 group-hover:text-primary transition-colors leading-tight">
            {product.name}
          </CardTitle>
        </Link>
      </CardHeader>

      <CardContent className="p-3 pt-2">
        <div className="text-base font-black text-primary">
          ৳{displayPrice.toLocaleString()}
        </div>
        <p className="text-[10px] text-muted-foreground mt-1 line-clamp-1">
          {product.brand?.name}
        </p>
      </CardContent>

      <CardFooter className="p-3 pt-0">
        {actionType === 'cart' ? (
          <Button 
            className="w-full h-9 gap-2 bg-secondary hover:bg-secondary/90 text-white font-bold text-xs transition-all" 
            onClick={() => onAddToCart?.(product)}
            disabled={!inStock}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Add to Cart
          </Button>
        ) : (
          <Button 
            className="w-full h-9 gap-2 bg-primary hover:bg-primary/90 text-white font-bold text-xs transition-all" 
            onClick={() => onSelect?.(product)}
            disabled={!inStock}
          >
            <Plus className="w-3.5 h-3.5" />
            Select
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
