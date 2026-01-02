'use client';

import { ShoppingCart, Star } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

export default function ProductCard({ product, onAddToCart }) {
  return (
    <Card className="group hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={product.images?.[0] || '/placeholder.jpg'}
            alt={product.name}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
          {product.discount > 0 && (
            <Badge className="absolute top-2 right-2 bg-accent">
              -{product.discount}%
            </Badge>
          )}
        </div>
      </Link>
      
      <CardContent className="p-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center mt-2 text-sm">
          <div className="flex items-center text-yellow-500">
            <Star className="w-4 h-4 fill-current" />
            <span className="ml-1 text-foreground">{product.rating}</span>
          </div>
          <span className="text-muted-foreground ml-2">({product.reviews})</span>
        </div>

        <div className="mt-3 flex items-baseline space-x-2">
          <span className="text-2xl font-bold text-primary">${product.price}</span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ${product.originalPrice}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={() => onAddToCart(product)} 
          className="w-full"
          size="sm"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}