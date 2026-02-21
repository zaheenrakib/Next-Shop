'use client';

import { useCart } from '@/hooks/useCart';
import { CartItem } from '@/types';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShoppingBag, CreditCard, Truck, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCart();
  const totalPrice = getTotalPrice();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success('Order placed successfully!', {
        description: 'Thank you for shopping with NextBazaar.',
      });
      clearCart();
      router.push('/');
    }, 2000);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-40 text-center">
          <ShoppingBag className="w-16 h-16 mx-auto mb-6 text-muted-foreground" />
          <h1 className="text-3xl font-bold">Your cart is empty</h1>
          <Button className="mt-6 tech-gradient" onClick={() => router.push('/products')}>Start Shopping</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartCount={items.length} />
      
      <main className="container mx-auto px-4 py-10">
        <h1 className="text-4xl font-black mb-10 tracking-tight">Checkout</h1>
        
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Shipping Form */}
          <div className="lg:w-2/3">
            <div className="glass p-8 rounded-3xl space-y-8">
              <div className="flex items-center gap-3">
                <Truck className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">Shipping Information</h2>
              </div>
              
              <form onSubmit={handleCheckout} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" required placeholder="John Doe" className="h-12 glass border-none" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" required placeholder="john@example.com" className="h-12 glass border-none" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" required placeholder="+880 1XXX XXXXXX" className="h-12 glass border-none" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" required placeholder="Dhaka" className="h-12 glass border-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Full Address</Label>
                  <Input id="address" required placeholder="House #, Road #, Area" className="h-12 glass border-none" />
                </div>

                <div className="pt-6 space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <CreditCard className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-bold">Payment Method</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {['Cash on Delivery', 'Stripe / Card', 'bKash / MFS'].map((method) => (
                      <div key={method} className="relative group cursor-pointer">
                        <input type="radio" name="payment" value={method} className="peer absolute inset-0 opacity-0 cursor-pointer" defaultChecked={method === 'Cash on Delivery'} />
                        <div className="p-4 rounded-xl glass border-2 border-transparent peer-checked:border-primary peer-checked:bg-primary/5 transition-all text-center font-bold">
                          {method}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Button type="submit" size="lg" className="w-full h-14 text-lg font-bold tech-gradient mt-8" disabled={loading}>
                  {loading ? 'Processing Order...' : `Confirm Order (৳${totalPrice.toLocaleString()})`}
                </Button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="glass p-8 rounded-3xl sticky top-28 space-y-6">
              <h3 className="text-xl font-bold">Order Summary</h3>
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item: CartItem) => (
                  <div key={item.id} className="flex justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden border">
                        <img src={item.images?.[0] || item.image || 'https://images.unsplash.com/photo-1591405351990-4726e33df48c?w=400&h=400&fit=crop'} alt={item.name} className="object-cover" />
                      </div>
                      <div>
                        <p className="text-sm font-bold line-clamp-1">{item.name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-bold whitespace-nowrap">৳{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>
              <hr className="border-white/10" />
              <div className="space-y-2">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>৳{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span className="text-green-500 font-bold">FREE</span>
                </div>
                <div className="flex justify-between text-xl font-black pt-4">
                  <span>Total</span>
                  <span className="text-primary">৳{totalPrice.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="bg-primary/5 p-4 rounded-xl flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <p className="text-[10px] text-muted-foreground">You are eligible for free shipping on this order!</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
