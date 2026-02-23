'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { ShoppingBag, Search, Filter, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Order } from '@/types';

export default function OrdersPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) setUser(JSON.parse(userData));
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/orders/user', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) setOrders(data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    router.push('/');
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-500',
      processing: 'bg-blue-500',
      shipped: 'bg-purple-500',
      delivered: 'bg-green-500',
      cancelled: 'bg-red-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const filteredOrders = activeTab === 'all' 
    ? orders 
    : orders.filter(o => o.status === activeTab);

  return (
    <DashboardLayout user={user} onLogout={handleLogout}>
      <div className="flex items-center gap-2 text-sm mb-8">
        <Link href="/" className="text-gray-500 hover:text-primary">Home</Link>
        <span className="text-gray-300">/</span>
        <Link href="/dashboard" className="text-gray-500 hover:text-primary">Dashboard</Link>
        <span className="text-gray-300">/</span>
        <span className="text-primary font-medium">My Orders</span>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input placeholder="Search orders..." className="pl-10 rounded-xl" />
        </div>
      </div>

      <Tabs defaultValue="all" onValueChange={setActiveTab} className="mb-8">
        <TabsList className="bg-white p-1 rounded-2xl shadow-sm border border-gray-100 flex overflow-x-auto h-auto">
          <TabsTrigger value="all" className="rounded-xl px-6 py-3 data-[state=active]:bg-primary data-[state=active]:text-white transition-all">All Orders</TabsTrigger>
          <TabsTrigger value="pending" className="rounded-xl px-6 py-3 data-[state=active]:bg-yellow-500 data-[state=active]:text-white transition-all">Pending</TabsTrigger>
          <TabsTrigger value="processing" className="rounded-xl px-6 py-3 data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-all">Processing</TabsTrigger>
          <TabsTrigger value="shipped" className="rounded-xl px-6 py-3 data-[state=active]:bg-purple-500 data-[state=active]:text-white transition-all">Shipped</TabsTrigger>
          <TabsTrigger value="delivered" className="rounded-xl px-6 py-3 data-[state=active]:bg-green-500 data-[state=active]:text-white transition-all">Delivered</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div></div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-gray-100">
            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="text-gray-400 w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders found</h2>
            <p className="text-gray-500 mb-8">You haven't placed any orders matching this status yet.</p>
            <Link href="/products">
              <Button size="lg" className="rounded-xl px-10">Explore Products</Button>
            </Link>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:border-primary/20 transition-all group">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <ShoppingBag size={28} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">Order #{order.id.substring(0, 8)}</h3>
                    <p className="text-sm text-gray-500">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 items-center gap-8 flex-1 md:justify-items-end">
                  <div className="flex flex-col md:items-end">
                    <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Status</span>
                    <Badge className={`${getStatusColor(order.status)} text-white border-none rounded-lg px-3 py-1 mt-1`}>
                      {order.status.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex flex-col md:items-end">
                    <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Items</span>
                    <span className="font-bold text-gray-900 mt-1">{order.items?.length || 0} Products</span>
                  </div>
                  <div className="flex flex-col md:items-end">
                    <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Total</span>
                    <span className="font-bold text-gray-900 text-xl mt-1">${order.total.toFixed(2)}</span>
                  </div>
                  <Button variant="ghost" className="rounded-xl group-hover:bg-primary/10 group-hover:text-primary transition-all p-2 h-10 w-10">
                    <ChevronRight size={24} />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}
