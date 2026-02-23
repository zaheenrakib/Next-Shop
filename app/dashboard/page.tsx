'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { Order } from '@/types';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import OrderStatusRow from '@/components/dashboard/OrderStatusRow';
import DashboardFeatureCards from '@/components/dashboard/DashboardFeatureCards';
import SummaryCards from '@/components/dashboard/SummaryCards';
import RecentOrders from '@/components/dashboard/RecentOrders';

interface UserData {
  id: string;
  name: string;
  phone: string;
  role: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    // if (!token) {
    //   router.push('/login');
    //   return;
    // }

    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Check if admin
      if (parsedUser.role === 'admin') {
        router.push('/admin');
        return;
      }
    }

    fetchOrders();
  }, [router]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/orders/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setOrders(data.orders || []);
      }
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

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <DashboardLayout user={user} onLogout={handleLogout}>
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm mb-8">
        <Link href="/" className="text-gray-500 hover:text-primary">Home</Link>
        <span className="text-gray-300">/</span>
        <span className="text-primary font-medium">Dashboard</span>
      </div>

      {/* Greeting */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
          {getTimeGreeting()} <span className="text-primary">{user?.name}!</span>
        </h1>
      </div>

      {/* Grid Layout for Content */}
      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <OrderStatusRow />
          <SummaryCards />
        </div>

        <DashboardFeatureCards />

        <RecentOrders orders={orders} loading={loading} />
      </div>
    </DashboardLayout>
  );
}
