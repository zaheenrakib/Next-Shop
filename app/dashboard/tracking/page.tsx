'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { Truck, Search, Package, MapPin, CheckCircle2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

export default function TrackingPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [orderId, setOrderId] = useState('');

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

  const steps = [
    { title: 'Order Placed', time: 'Feb 20, 2026 - 10:30 AM', status: 'completed' },
    { title: 'Processing', time: 'Feb 21, 2026 - 02:15 PM', status: 'completed' },
    { title: 'Shipped', time: 'Feb 22, 2026 - 09:00 AM', status: 'active' },
    { title: 'Out for Delivery', time: 'Expected Today', status: 'pending' },
    { title: 'Delivered', time: 'Expected Today', status: 'pending' },
  ];

  return (
    <DashboardLayout user={user} onLogout={handleLogout}>
      <div className="flex items-center gap-2 text-sm mb-8">
        <Link href="/" className="text-gray-500 hover:text-primary">Home</Link>
        <span className="text-gray-300">/</span>
        <Link href="/dashboard" className="text-gray-500 hover:text-primary">Dashboard</Link>
        <span className="text-gray-300">/</span>
        <span className="text-primary font-medium">Order Tracking</span>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Track Your Order</h1>

      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm mb-8">
        <p className="text-gray-600 mb-6 font-medium">To track your order, please enter your Order ID in the box below and press the "Track" button.</p>
        <div className="flex flex-col md:flex-row gap-4 max-w-2xl">
          <div className="relative flex-1">
            <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input 
              placeholder="Order ID (e.g. #ORD-12345)" 
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="pl-12 rounded-2xl h-14 border-gray-200 focus:border-primary focus:ring-primary/10 text-lg font-mono" 
            />
          </div>
          <Button className="rounded-2xl h-14 px-10 font-bold text-lg shadow-lg shadow-primary/20">
            Track Now
          </Button>
        </div>
      </div>

      {/* Track Result Demo */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/50">
          <div>
            <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Order ID</span>
            <h3 className="text-xl font-bold text-gray-900">#ORD-9023184</h3>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-right">
                <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Estimated Delivery</span>
                <p className="font-bold text-gray-900">Today, 23 Feb 2026</p>
             </div>
             <div className="p-3 bg-blue-50 text-blue-500 rounded-2xl">
                <Truck size={32} />
             </div>
          </div>
        </div>

        <div className="p-10">
          <div className="relative space-y-12">
            {/* Connecting Line */}
            <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-gray-100"></div>

            {steps.map((step, index) => (
              <div key={index} className="relative flex items-start gap-8">
                <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  step.status === 'completed' ? 'bg-primary text-white shadow-lg shadow-primary/30' : 
                  step.status === 'active' ? 'bg-white border-4 border-primary text-primary shadow-xl ring-8 ring-primary/5' : 
                  'bg-white border-2 border-gray-200 text-gray-300'
                }`}>
                  {step.status === 'completed' ? <CheckCircle2 size={24} /> : <Clock size={20} />}
                </div>
                <div>
                  <h4 className={`text-lg font-bold ${step.status === 'pending' ? 'text-gray-400' : 'text-gray-900'}`}>{step.title}</h4>
                  <p className="text-sm text-gray-500 mt-1 font-medium">{step.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
