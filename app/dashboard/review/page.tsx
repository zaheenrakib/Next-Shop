'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { Star, MessageSquare, Package, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

export default function ReviewPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);

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
        <span className="text-primary font-medium">Reviews</span>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Product Reviews</h1>

      <Tabs defaultValue="pending">
        <TabsList className="bg-white p-1 rounded-2xl shadow-sm border border-gray-100 flex overflow-x-auto h-auto mb-8">
          <TabsTrigger value="pending" className="flex-1 rounded-xl px-6 py-3 data-[state=active]:bg-primary data-[state=active]:text-white transition-all">To Review (0)</TabsTrigger>
          <TabsTrigger value="history" className="flex-1 rounded-xl px-6 py-3 data-[state=active]:bg-primary data-[state=active]:text-white transition-all">My Reviews (0)</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending">
          <div className="bg-white rounded-3xl p-20 text-center shadow-sm border border-gray-100">
            <div className="bg-orange-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Star className="text-orange-400 w-10 h-10 fill-orange-400/10" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No pending reviews</h2>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">Once you purchase and receive products, you can share your experience here.</p>
            <Link href="/dashboard/orders">
              <Button variant="outline" className="rounded-xl px-8 border-gray-200">View My Orders</Button>
            </Link>
          </div>
        </TabsContent>

        <TabsContent value="history">
           <div className="bg-white rounded-3xl p-20 text-center shadow-sm border border-gray-100">
            <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="text-blue-400 w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No reviews yet</h2>
            <p className="text-gray-500">You haven't written any reviews yet. Your reviews help others make better choices!</p>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
