'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { toast } from 'sonner';

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const loadCart = () => {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
      setLoading(false);
    };
    loadCart();
  }, []);


  const updateCart = (updatedCart: any[]) => {
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));

    window.dispatchEvent(new Event('storage'));
  };


  const updateQuantity = (productId: string, change: number) => {
    const updatedCart = cart.map(item => {
      if (item.id === productId) {
        const newQuantity = (item.qty || item.quantity || 1) + change;
        return { ...item, qty: Math.max(1, newQuantity), quantity: Math.max(1, newQuantity) };
      }
      return item;
    });
    updateCart(updatedCart);
  };


  const removeItem = (productId: string) => {
    const updatedCart = cart.filter(item => item.id !== productId);
    updateCart(updatedCart);
    toast.success('আইটেমটি কার্ট থেকে সরানো হয়েছে');
  };


  const subtotal = cart.reduce((sum, item) => sum + (item.price * (item.qty || item.quantity || 1)), 0);
  const shipping = subtotal > 0 && subtotal < 1000 ? 60 : 0; // ১০০০ টাকার উপরে ফ্রি শিপিং
  const total = subtotal + shipping;
  const cartCount = cart.reduce((sum, item) => sum + (item.qty || item.quantity || 1), 0);

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error('আপনার কার্ট খালি');
      return;
    }

    router.push('/checkout');
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center">
      <Loader2 className="animate-spin w-10 h-10 text-primary" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Navbar />

      <div className="container mx-auto px-4 py-24 md:py-10">
        <div className="flex items-center gap-4 mb-10">
          <div className="p-3 bg-black rounded-2xl shadow-lg shadow-black/10">
            <ShoppingBag className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">
              Shopping <span className="text-primary underline decoration-4 underline-offset-8">Cart</span>
            </h1>
            <p className="text-slate-500 font-bold text-sm uppercase tracking-widest mt-1">
              {cartCount} Items in your bag
            </p>
          </div>
        </div>

        {cart.length === 0 ? (
          <Card className="p-16 text-center border-none shadow-2xl rounded-[40px] bg-white">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-slate-200" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-3">আপনার কার্টটি খালি!</h2>
            <p className="text-slate-400 mb-8 text-lg font-medium">পছন্দের টেক প্রোডাক্ট গুলো খুঁজে নিতে আমাদের শপ ভিজিট করুন।</p>
            <Link href="/">
              <Button size="lg" className="bg-black hover:bg-slate-800 text-white font-bold rounded-2xl px-12 h-16 text-lg transition-all active:scale-95 shadow-xl shadow-black/20">
                কেনাকাটা শুরু করুন
                <ArrowRight className="ml-2 w-6 h-6" />
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">


            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <Card key={item.id} className="border-none shadow-sm hover:shadow-md transition-shadow rounded-3xl bg-white overflow-hidden">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row gap-6">
                      <div className="w-full sm:w-32 h-32 shrink-0 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 p-2">
                        <img
                          src={item.image || item.thumbnail || (item.images && item.images[0]) || '/placeholder.png'}
                          alt={item.name}
                          className="w-full h-full object-contain mix-blend-multiply"
                        />
                      </div>

                      <div className="flex-1 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-black text-xl text-slate-900 line-clamp-1">
                              {item.name}
                            </h3>
                            <p className="text-[10px] font-black text-primary uppercase mt-1 tracking-[0.2em]">Premium Product</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all rounded-xl"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="w-5 h-5" />
                          </Button>
                        </div>

                        <div className="flex items-end justify-between mt-6">
                          <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-10 w-10 hover:bg-white rounded-lg transition-colors"
                              onClick={() => updateQuantity(item.id, -1)}
                            >
                              <Minus className="w-4 h-4 text-slate-600" />
                            </Button>
                            <span className="w-12 text-center font-black text-slate-900 text-lg">{item.qty || item.quantity || 1}</span>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-10 w-10 hover:bg-white rounded-lg transition-colors"
                              onClick={() => updateQuantity(item.id, 1)}
                            >
                              <Plus className="w-4 h-4 text-slate-600" />
                            </Button>
                          </div>

                          <div className="text-right">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Price</p>
                            <p className="font-black text-2xl text-slate-900">
                              ৳{(item.price * (item.qty || item.quantity || 1)).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>


            <div className="lg:col-span-1">
              <Card className="sticky top-28 border-none shadow-2xl rounded-[35px] overflow-hidden bg-white">
                <div className="bg-[#081621] p-8">
                  <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic flex items-center gap-3">
                    <ShoppingBag className="w-6 h-6 text-primary" /> Order Summary
                  </h2>
                </div>
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between font-bold text-slate-500">
                      <span>Subtotal</span>
                      <span className="text-slate-900">৳{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold text-slate-500">
                      <span>Shipping Cost</span>
                      <span className={shipping === 0 ? 'text-green-600' : 'text-slate-900'}>
                        {shipping === 0 ? 'FREE' : `৳${shipping}`}
                      </span>
                    </div>
                    {shipping > 0 && (
                      <p className="text-[10px] font-bold text-slate-400">৳১০০০ এর বেশি অর্ডারে শিপিং ফ্রি!</p>
                    )}
                  </div>

                  <Separator className="bg-slate-100" />

                  <div className="flex justify-between items-center text-3xl font-black text-slate-900 italic">
                    <span className="text-sm not-italic font-bold text-slate-400 uppercase tracking-widest">Grand Total</span>
                    <span className="text-primary leading-none">৳{total.toLocaleString()}</span>
                  </div>

                  <div className="pt-6 space-y-4">
                    <Button
                      className="w-full h-16 font-black bg-primary hover:bg-primary/90 text-white rounded-2xl text-xl uppercase shadow-xl shadow-primary/20 transition-all active:scale-95"
                      onClick={handleCheckout}
                    >
                      Confirm Order
                      <ArrowRight className="ml-2 w-6 h-6" />
                    </Button>
                    <Link href="/" className="block text-center pt-2">
                      <span className="text-xs font-black text-slate-400 hover:text-primary uppercase tracking-[0.2em] transition-colors cursor-pointer">
                        ← Back to Shopping
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