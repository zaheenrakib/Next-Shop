'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingCart, Plus } from 'lucide-react';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onSelect?: (product: Product) => void;
  actionType?: 'cart' | 'select';
}

export default function ProductCard({ product, onAddToCart, onSelect, actionType = 'cart' }: ProductCardProps) {
  return (
    <Card className="group overflow-hidden card-hover border-none shadow-md bg-card/50 backdrop-blur-sm">
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={product.images?.[0] || product.image || 'https://images.unsplash.com/photo-1591405351990-4726e33df48c?w=400&h=400&fit=crop'}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <Badge className="absolute top-2 right-2 glass text-foreground font-medium">
            {product.category}
          </Badge>
          {product.status === 'Out of Stock' && (
            <div className="absolute inset-0 bg-background/60 flex items-center justify-center backdrop-blur-[2px]">
              <Badge variant="destructive" className="px-4 py-1 text-sm">Out of Stock</Badge>
            </div>
          )}
        </div>
      </Link>
      
      <CardHeader className="p-4 pb-0">
        <div className="flex items-center gap-1 text-yellow-500 mb-1">
          <Star className="w-3 h-3 fill-current" />
          <span className="text-xs font-semibold">{product.averageRating}</span>
        </div>
        <Link href={`/products/${product.slug}`}>
          <CardTitle className="text-sm font-bold line-clamp-2 min-h-[40px] group-hover:text-primary transition-colors">
            {product.name}
          </CardTitle>
        </Link>
      </CardHeader>

      <CardContent className="p-4 pt-2">
        <div className="text-lg font-bold text-primary">
          ৳{product.price.toLocaleString()}
        </div>
        {product.keyFeatures && (
          <ul className="mt-2 space-y-1">
            {product.keyFeatures.slice(0, 2).map((feature, idx) => (
              <li key={idx} className="text-[10px] text-muted-foreground flex items-center gap-1">
                <div className="w-1 h-1 rounded-full bg-primary/50" />
                {feature}
              </li>
            ))}
          </ul>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0">
        {actionType === 'cart' ? (
          <Button 
            className="w-full gap-2 tech-gradient border-none" 
            onClick={() => onAddToCart?.(product)}
            disabled={product.status === 'Out of Stock'}
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </Button>
        ) : (
          <Button 
            className="w-full gap-2 tech-gradient border-none" 
            onClick={() => onSelect?.(product)}
            disabled={product.status === 'Out of Stock'}
          >
            <Plus className="w-4 h-4" />
            Select Component
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
