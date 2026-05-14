'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  product: any;
}

export default function ProductCard({ product }: ProductCardProps) {
  const currentPrice = product?.discountPrice || product?.price || 0;
  const originalPrice = product?.price || 0;
  const saveAmount = Math.max(0, originalPrice - currentPrice);
  const discountPercentage = originalPrice > 0 ? Math.round((saveAmount / originalPrice) * 100) : 0;

  return (
    <Card className="group relative flex flex-col h-full overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 rounded-xl bg-white">


      {saveAmount > 0 && (
        <div className="absolute top-0 left-0 z-10 bg-[#FF4D30] text-white text-[11px] px-3 py-1.5 rounded-br-2xl font-bold shadow-md">
          Save: {saveAmount.toLocaleString()}৳
        </div>
      )}


      <Link href={`/products/${product.slug}`} className="block relative aspect-square p-6 overflow-hidden bg-white">
        <Image
          src={product.thumbnail}
          alt={product.name}
          fill
          className="object-contain p-4 transition-transform duration-700 group-hover:scale-110"
        />


        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <ShoppingCart className="w-5 h-5 text-[#FF4D30]" />
          </div>
        </div>
      </Link>


      <div className="p-4 flex flex-col flex-grow border-t border-gray-50">
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-[14px] font-bold text-slate-800 line-clamp-2 leading-tight hover:text-[#FF4D30] transition-colors min-h-[40px]">
            {product.name}
          </h3>
        </Link>

        <div className="mt-4 flex flex-col gap-1">

          <div className="flex items-center gap-2">
            <span className="text-lg font-black text-[#FF4D30]">
              {currentPrice.toLocaleString()}৳
            </span>
            {saveAmount > 0 && (
              <span className="text-xs text-gray-400 line-through font-medium">
                {originalPrice.toLocaleString()}৳
              </span>
            )}
          </div>


          <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider mt-1">
            In Stock
          </p>
        </div>

      </div>
    </Card>
  );
}