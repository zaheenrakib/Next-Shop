'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { Ticket, Copy, CheckCircle2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

export default function CouponPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [coupons, setCoupons] = useState([
    { id: 1, code: 'WELCOME10', discount: '10% OFF', description: 'Available for your first order', expiry: '2026-12-31', status: 'valid' },
    { id: 2, code: 'SAVE20', discount: '20% OFF', description: 'Special summer discount', expiry: '2026-06-30', status: 'valid' },
    { id: 3, code: 'NEWSHOP', discount: '$50 OFF', description: 'On orders over $500', expiry: '2026-03-15', status: 'expired' },
  ]);

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

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Code ${code} copied to clipboard!`);
  };

  return (
    <DashboardLayout user={user} onLogout={handleLogout}>
      <div className="flex items-center gap-2 text-sm mb-8">
        <Link href="/" className="text-gray-500 hover:text-primary">Home</Link>
        <span className="text-gray-300">/</span>
        <Link href="/dashboard" className="text-gray-500 hover:text-primary">Dashboard</Link>
        <span className="text-gray-300">/</span>
        <span className="text-primary font-medium">Coupons</span>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Coupons</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {coupons.map((coupon) => (
          <div key={coupon.id} className={`group relative bg-white border rounded-3xl p-6 shadow-sm overflow-hidden transition-all hover:shadow-md ${coupon.status === 'expired' ? 'grayscale opacity-60' : 'border-primary/10'}`}>
            {/* Ticket Decorative Elements */}
            <div className="absolute top-1/2 -left-4 -translate-y-1/2 w-8 h-8 rounded-full bg-[#F8FAFC] border border-gray-100 shadow-inner"></div>
            <div className="absolute top-1/2 -right-4 -translate-y-1/2 w-8 h-8 rounded-full bg-[#F8FAFC] border border-gray-100 shadow-inner"></div>
            
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl ${coupon.status === 'valid' ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-500'}`}>
                <Ticket size={24} />
              </div>
              <Badge variant={coupon.status === 'valid' ? 'default' : 'secondary'} className="rounded-lg">
                {coupon.status.toUpperCase()}
              </Badge>
            </div>

            <div className="mb-6">
              <h3 className="text-2xl font-black text-gray-900">{coupon.discount}</h3>
              <p className="text-gray-500 font-medium text-sm mt-1">{coupon.description}</p>
            </div>

            <div className={`flex items-center justify-between p-4 rounded-2xl ${coupon.status === 'valid' ? 'bg-gray-50 border-dashed border-2 border-primary/20' : 'bg-gray-100 border-2 border-gray-200'}`}>
              <span className="font-mono font-bold text-lg tracking-widest text-gray-900">{coupon.code}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                disabled={coupon.status === 'expired'}
                onClick={() => copyToClipboard(coupon.code)}
                className="hover:bg-primary/10 text-primary font-bold"
              >
                <Copy size={16} className="mr-2" /> Copy
              </Button>
            </div>

            <div className="mt-4 flex items-center text-xs text-gray-400 font-medium">
              <Clock size={12} className="mr-1" />
              Expires on {new Date(coupon.expiry).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
