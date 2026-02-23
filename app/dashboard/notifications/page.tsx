'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { Bell, BellOff, CheckCircle2, Package, Tag, Info, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

export default function NotificationsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Order Shipped', message: 'Your order #ORD-9023184 has been shipped and is on its way.', time: '2 hours ago', type: 'order', isRead: false },
    { id: 2, title: 'Big Sale Start!', message: 'Checkout our latest summer collection with up to 50% discount.', time: '5 hours ago', type: 'promo', isRead: false },
    { id: 3, title: 'Profile Updated', message: 'Your personal information has been updated successfully.', time: '1 day ago', type: 'info', isRead: true },
    { id: 4, title: 'Welcome to NextShop', message: 'Thank you for joining us! Hope you have a great shopping experience.', time: '2 days ago', type: 'info', isRead: true },
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

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({...n, isRead: true})));
    toast.success('All notifications marked as read');
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'order': return <Package className="text-blue-500" />;
      case 'promo': return <Tag className="text-pink-500" />;
      default: return <Info className="text-gray-400" />;
    }
  };

  return (
    <DashboardLayout user={user} onLogout={handleLogout}>
      <div className="flex items-center gap-2 text-sm mb-8">
        <Link href="/" className="text-gray-500 hover:text-primary">Home</Link>
        <span className="text-gray-300">/</span>
        <Link href="/dashboard" className="text-gray-500 hover:text-primary">Dashboard</Link>
        <span className="text-gray-300">/</span>
        <span className="text-primary font-medium">Notifications</span>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          Notifications <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">{notifications.filter(n => !n.isRead).length} New</span>
        </h1>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="rounded-xl border-gray-200" onClick={markAllAsRead}>
            Mark all as read
          </Button>
          <Button variant="ghost" size="sm" className="rounded-xl text-red-500 hover:bg-red-50" onClick={() => setNotifications([])}>
            <Trash2 size={16} className="mr-2" /> Clear all
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="bg-white rounded-3xl p-20 text-center shadow-sm border border-gray-100">
            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <BellOff className="text-gray-300 w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No notifications</h2>
            <p className="text-gray-500">We'll notify you when something important happens.</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div key={n.id} className={`group relative bg-white border rounded-3xl p-6 shadow-sm transition-all hover:shadow-md ${!n.isRead ? 'border-primary/20 bg-primary/5' : 'border-gray-100'}`}>
              <div className="flex items-start gap-6">
                <div className={`p-4 rounded-2xl flex-shrink-0 ${!n.isRead ? 'bg-white shadow-sm' : 'bg-gray-50'}`}>
                  {getIcon(n.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`text-lg font-bold truncate ${!n.isRead ? 'text-gray-900' : 'text-gray-600'}`}>{n.title}</h3>
                    <span className="text-xs text-gray-400 font-medium whitespace-nowrap">{n.time}</span>
                  </div>
                  <p className={`text-base leading-relaxed ${!n.isRead ? 'text-gray-700 font-medium' : 'text-gray-500'}`}>
                    {n.message}
                  </p>
                </div>
                {!n.isRead && (
                   <div className="absolute top-6 right-6 w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}
