'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle2, ShoppingBag, Truck, CreditCard, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Hydration fix করার জন্য স্টেট
  const [isMounted, setIsMounted] = useState(false);
  const [orderId, setOrderId] = useState("");

  // URL থেকে ডাটা নেওয়া
  const method = searchParams.get('method') || 'cod'; // default cod if null
  const orderIdFromUrl = searchParams.get('orderId');

  useEffect(() => {
    setIsMounted(true);
    // সার্ভার ও ক্লায়েন্টের টাইম স্ট্যাম্পের অমিল এড়াতে মাউন্ট হওয়ার পর আইডি সেট করা
    if (orderIdFromUrl) {
      setOrderId(orderIdFromUrl);
    } else {
      setOrderId(`ORD-${Date.now().toString().slice(-6)}`);
    }
  }, [orderIdFromUrl]);

  // মাউন্ট হওয়ার আগে কিছু রেন্ডার করবে না (Hydration Error protection)
  if (!isMounted) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const isCOD = method === 'cod';
  console.log(method)

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-32 pb-20 flex justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl w-full bg-white rounded-[2rem] shadow-xl shadow-slate-200/60 overflow-hidden border border-slate-100"
        >
          {/* Header Banner - Color changes based on method */}
          <div className={`p-8 text-center ${isCOD ? 'bg-amber-50' : 'bg-green-50'}`}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white shadow-sm mb-4"
            >
              {isCOD ? (
                <Truck className="w-10 h-10 text-amber-600" />
              ) : (
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              )}
            </motion.div>
            
            <h1 className="text-3xl font-black text-slate-800 mb-2">
              {isCOD ? 'Order Placed!' : 'Payment Successful!'}
            </h1>
            <p className="text-slate-600 font-medium">
              Your order <span className="text-[#3b49bb] font-bold">#{orderId}</span> has been confirmed
            </p>
          </div>

          <div className="p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 mb-10">
              {/* Payment Method Card */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3 mb-2 text-slate-500 font-semibold text-sm uppercase tracking-wider">
                  <CreditCard className="w-4 h-4" />
                  Payment Method
                </div>
                <p className="text-slate-800 font-bold text-lg">
                  {isCOD ? 'Cash on Delivery' : 'Online Payment'}
                </p>
              </div>

              {/* Status Card */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3 mb-2 text-slate-500 font-semibold text-sm uppercase tracking-wider">
                  <Truck className="w-4 h-4" />
                  Delivery Status
                </div>
                <p className="text-slate-800 font-bold text-lg">Processing</p>
              </div>
            </div>

            {/* Instruction Box */}
            <div className="bg-slate-900 rounded-2xl p-6 text-white mb-10 relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="font-bold text-lg mb-2">What happens next?</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {isCOD 
                    ? "আমাদের একজন প্রতিনিধি আপনার অর্ডারটি নিশ্চিত করতে শীঘ্রই কল করবেন। ডেলিভারি এজেন্ট পৌঁছালে অনুগ্রহ করে নগদ টাকা প্রস্তুত রাখুন।"
                    : "আমরা আপনার পেমেন্টটি পেয়েছি। আপনার ইমেইলে একটি ইনভয়েস পাঠানো হয়েছে। আমরা শীঘ্রই আপনার পণ্যটি শিপিংয়ের জন্য প্রস্তুত করছি।"
                  }
                </p>
              </div>
              <div className="absolute top-0 right-0 opacity-10 translate-x-1/4 -translate-y-1/4">
                <ShoppingBag size={150} />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => router.push('/')}
                className="flex-1 h-14 bg-[#3b49bb] hover:bg-[#2e3a9c] text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-200 transition-all active:scale-95"
              >
                Continue Shopping
              </Button>
              <Button 
                variant="outline"
                onClick={() => router.push('/dashboard/orders')}
                className="flex-1 h-14 border-slate-200 hover:bg-slate-50 rounded-xl font-bold text-lg transition-all active:scale-95 flex items-center justify-center gap-2 text-slate-700"
              >
                Track Order <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}

// Full page wrapper with Suspense
export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}