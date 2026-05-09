'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProductCardProps {
  product: any;
}

export default function ProductCard({ product }: ProductCardProps) {
  const currentPrice = product.discountPrice || product.price;
  const originalPrice = product.price;
  const saveAmount = originalPrice - currentPrice;
  const discountPercentage = Math.round((saveAmount / originalPrice) * 100);

  return (
    <Card className="group relative overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 rounded-md bg-white">
      {/* Discount Badge (Top Left) */}
      {saveAmount > 0 && (
        <div className="absolute top-2 left-0 z-10 bg-[#6b21a8] text-white text-[11px] px-2 py-1 rounded-r-full font-medium">
          Save: {saveAmount.toLocaleString()}৳ (-{discountPercentage}%)
        </div>
      )}

      {/* Product Image */}
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-square p-4 flex items-center justify-center bg-white">
          <Image
            src={product.thumbnail}
            alt={product.name}
            width={250}
            height={250}
            className="object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </Link>

      {/* Product Details */}
      <CardHeader className="p-4 pt-2 text-center">
        <Link href={`/products/${product.slug}`}>
          <CardTitle className="text-[15px] font-medium text-gray-800 line-clamp-2 hover:text-red-600 transition-colors">
            {product.name}
          </CardTitle>
        </Link>
      </CardHeader>

      <CardContent className="p-4 pt-0 text-center">
        <div className="flex items-center justify-center gap-3">
          {/* Current Price */}
          <span className="text-xl font-bold text-[#d32f2f]">
            {currentPrice.toLocaleString()}৳
          </span>
          
          {/* Original Price */}
          {saveAmount > 0 && (
            <span className="text-sm text-gray-400 line-through">
              {originalPrice.toLocaleString()}৳
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}