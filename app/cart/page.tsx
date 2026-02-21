'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { toast } from 'sonner';
import { CartItem } from '@/types';

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  };

  const updateCart = (updatedCart: CartItem[]) => {
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const updateQuantity = (productId: string, change: number) => {
    const updatedCart = cart.map(item => {
      if (item.id === productId) {
        const newQuantity = item.quantity + change;
        return { ...item, quantity: Math.max(1, newQuantity) };
      }
      return item;
    });
    updateCart(updatedCart);
  };

  const removeItem = (productId: string) => {
    const updatedCart = cart.filter(item => item.id !== productId);
    updateCart(updatedCart);
    toast.success('Item removed from cart');
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + shipping;
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to continue');
      router.push('/login');
      return;
    }
    router.push('/checkout');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar cartCount={cartCount} />

      <div className="container mx-auto px-4 py-32 md:py-40">
        <h1 className="text-3xl font-extrabold text-secondary mb-8 tracking-tight italic uppercase">
          Shopping <span className="text-primary underline decoration-4 underline-offset-8">Cart</span>
        </h1>

        {cart.length === 0 ? (
          <Card className="p-16 text-center glass border-none shadow-xl rounded-3xl">
            <ShoppingBag className="w-20 h-20 mx-auto text-primary/20 mb-6" />
            <h2 className="text-3xl font-black text-secondary mb-3">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8 text-lg font-medium">Ready to start your next build?</p>
            <Link href="/">
              <Button size="lg" className="tech-gradient border-none font-bold rounded-xl px-12 h-14">
                Explore Tech
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {cart.map((item) => (
                <Card key={item.id} className="border-none shadow-md overflow-hidden rounded-2xl">
                  <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row gap-6 p-4">
                      <div className="w-full sm:w-32 h-32 shrink-0 rounded-xl overflow-hidden border border-gray-100">
                        <img
                          src={item.images?.[0] || 'https://images.unsplash.com/photo-1591405351990-4726e33df48c?w=400&h=400&fit=crop'}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <Link href={`/products/${item.slug}`}>
                              <h3 className="font-bold text-lg hover:text-primary transition-colors leading-tight">
                                {item.name}
                              </h3>
                            </Link>
                            <p className="text-xs font-black text-primary uppercase mt-1 tracking-widest">{item.category}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-400 hover:text-red-500 transition-colors"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="w-5 h-5" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center justify-between pt-4">
                          <div className="flex items-center bg-gray-50 border border-gray-100 rounded-lg p-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 hover:bg-white"
                              onClick={() => updateQuantity(item.id, -1)}
                            >
                              <Minus className="w-3 h-3 text-gray-600" />
                            </Button>
                            <span className="w-10 text-center font-black text-slate-800">{item.quantity}</span>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 hover:bg-white"
                              onClick={() => updateQuantity(item.id, 1)}
                            >
                              <Plus className="w-3 h-3 text-gray-600" />
                            </Button>
                          </div>
                          <div className="text-right">
                            <div className="font-black text-2xl text-slate-900 leading-none">
                              ${(item.price * item.quantity).toFixed(2)}
                            </div>
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-1">
                              ${item.price.toFixed(2)} UNIT PRICE
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-40 border-none shadow-2xl rounded-3xl overflow-hidden">
                <div className="bg-[#081621] p-6">
                   <h2 className="text-xl font-black text-white uppercase tracking-wider italic">Checkout Summary</h2>
                </div>
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between font-bold text-slate-600">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-slate-600">
                      <span>Shipping</span>
                      <span className={shipping === 0 ? 'text-green-600' : ''}>
                        {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                      </span>
                    </div>
                  </div>
                  
                  <Separator className="bg-slate-100" />
                  
                  <div className="flex justify-between text-2xl font-black text-slate-900 italic">
                    <span>TOTAL</span>
                    <span className="text-primary">${total.toFixed(2)}</span>
                  </div>
                  
                  <div className="pt-4 space-y-4">
                    <Button className="w-full h-14 font-black tech-gradient border-none rounded-xl text-lg uppercase shadow-lg shadow-primary/20" onClick={handleCheckout}>
                      Confirm Order
                      <ArrowRight className="ml-2 w-6 h-6" />
                    </Button>
                    <Link href="/products" className="block text-center">
                      <span className="text-sm font-bold text-gray-400 hover:text-primary transition-colors cursor-pointer">
                        Continue Shopping
                      </span>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
