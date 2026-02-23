'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { Heart, ShoppingCart, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

export default function WishlistPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]); // In a real app, fetch from API
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) setUser(JSON.parse(userData));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    router.push('/');
  };

  return (
    <DashboardLayout user={user} onLogout={handleLogout}>
      <div className="flex items-center gap-2 text-sm mb-8">
        <Link href="/" className="text-gray-500 hover:text-primary">Home</Link>
        <span className="text-gray-300">/</span>
        <Link href="/dashboard" className="text-gray-500 hover:text-primary">Dashboard</Link>
        <span className="text-gray-300">/</span>
        <span className="text-primary font-medium">Wishlist</span>
      </div>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
        <span className="text-gray-500 font-medium">{items.length} Items saved</span>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-3xl p-20 text-center shadow-sm border border-gray-100">
          <div className="bg-pink-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="text-pink-500 w-12 h-12 fill-pink-500/10" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">Found something you love? Save it here so you can find it easily later.</p>
          <Link href="/products">
            <Button size="lg" className="rounded-xl px-12 h-14 text-base font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
              Start Shopping
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
           {/* Map wishlist items here */}
        </div>
      )}
    </DashboardLayout>
  );
}
