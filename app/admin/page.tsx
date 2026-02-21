'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Package, Users, DollarSign, ShoppingBag, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface AnalyticsData {
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  totalRevenue: number;
  pendingOrders: number;
}

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  userId: string;
  total: number;
  status: string;
  createdAt: string;
  items?: OrderItem[];
}

interface User {
  id: string;
  name: string;
  phone: string;
  role: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== 'admin') {
        router.push('/dashboard');
        return;
      }
      setUser(parsedUser);
    }

    fetchData();
  }, [router]);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    
    try {
      const [analyticsRes, ordersRes, usersRes] = await Promise.all([
        fetch('/api/admin/analytics', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/admin/orders', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/admin/users', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      const analyticsData = await analyticsRes.json();
      const ordersData = await ordersRes.json();
      const usersData = await usersRes.json();

      if (analyticsRes.ok) setAnalytics(analyticsData.analytics);
      if (ordersRes.ok) setOrders(ordersData.orders || []);
      if (usersRes.ok) setUsers(usersData.users || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        toast.success('Order status updated');
        fetchData();
      }
    } catch (error) {
      toast.error('Failed to update order');
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

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 bg-[#081621] text-white border-b border-gray-700 shadow-xl">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center space-x-2">
               <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center -rotate-12">
                 <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <span className="font-black text-xl italic uppercase tracking-tighter">
                Next<span className="text-primary italic">Panel</span>
              </span>
            </Link>
            <div className="flex items-center space-x-6">
              <span className="text-sm font-bold text-gray-300">{user?.name}</span>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-white hover:text-white hover:bg-white/10 font-bold border border-white/10 rounded-lg h-10 px-4">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : (
          <>
            {/* Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <Card className="border-none shadow-md rounded-2xl overflow-hidden">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Total Revenue</p>
                      <h3 className="text-3xl font-black text-secondary mt-1">
                        ${analytics?.totalRevenue?.toFixed(2) || '0.00'}
                      </h3>
                    </div>
                    <div className="p-4 bg-primary/10 rounded-2xl">
                      <DollarSign className="w-7 h-7 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md rounded-2xl overflow-hidden">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Total Orders</p>
                      <h3 className="text-3xl font-black text-secondary mt-1">
                        {analytics?.totalOrders || 0}
                      </h3>
                    </div>
                    <div className="p-4 bg-blue-500/10 rounded-2xl">
                      <Package className="w-7 h-7 text-blue-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md rounded-2xl overflow-hidden">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Total Users</p>
                      <h3 className="text-3xl font-black text-secondary mt-1">
                        {analytics?.totalUsers || 0}
                      </h3>
                    </div>
                    <div className="p-4 bg-indigo-500/10 rounded-2xl">
                      <Users className="w-7 h-7 text-indigo-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md rounded-2xl overflow-hidden">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Pending Orders</p>
                      <h3 className="text-3xl font-black text-secondary mt-1">
                        {analytics?.pendingOrders || 0}
                      </h3>
                    </div>
                    <div className="p-4 bg-orange-500/10 rounded-2xl">
                      <ShoppingBag className="w-7 h-7 text-orange-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="orders" className="space-y-8">
              <TabsList className="bg-gray-100 p-1 rounded-xl">
                <TabsTrigger value="orders" className="rounded-lg font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm px-8">Orders</TabsTrigger>
                <TabsTrigger value="users" className="rounded-lg font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm px-8">Users</TabsTrigger>
              </TabsList>

              <TabsContent value="orders">
                <Card className="border-none shadow-xl rounded-2xl">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-2xl font-black text-secondary">ORDER MANAGEMENT</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent">
                          <TableHead className="font-bold text-gray-400">ORDER ID</TableHead>
                          <TableHead className="font-bold text-gray-400">DATE</TableHead>
                          <TableHead className="font-bold text-gray-400">CUSTOMER</TableHead>
                          <TableHead className="font-bold text-gray-400">TOTAL</TableHead>
                          <TableHead className="font-bold text-gray-400">STATUS</TableHead>
                          <TableHead className="font-bold text-gray-400 text-right">ACTIONS</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.map((order) => (
                          <TableRow key={order.id} className="hover:bg-gray-50/50">
                            <TableCell className="font-black text-slate-700">
                              #{order.id.substring(0, 8).toUpperCase()}
                            </TableCell>
                            <TableCell className="text-slate-500 font-medium">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="font-bold text-slate-800">{order.userId.substring(0, 8)}</TableCell>
                            <TableCell className="font-black text-primary">
                              ${order.total.toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <Badge className={`${getStatusColor(order.status)} text-white border-none font-bold rounded-lg px-3 py-1`}>
                                {order.status.toUpperCase()}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Select
                                value={order.status}
                                onValueChange={(value) => handleUpdateOrderStatus(order.id, value)}
                              >
                                <SelectTrigger className="w-32 inline-flex border-gray-200">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-none shadow-2xl">
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="processing">Processing</SelectItem>
                                  <SelectItem value="shipped">Shipped</SelectItem>
                                  <SelectItem value="delivered">Delivered</SelectItem>
                                  <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="users">
                <Card className="border-none shadow-xl rounded-2xl">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-2xl font-black text-secondary">USER DIRECTORY</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent">
                          <TableHead className="font-bold text-gray-400">NAME</TableHead>
                          <TableHead className="font-bold text-gray-400">PHONE</TableHead>
                          <TableHead className="font-bold text-gray-400">ROLE</TableHead>
                          <TableHead className="font-bold text-gray-400 text-right">JOINED</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((u) => (
                          <TableRow key={u.id} className="hover:bg-gray-50/50">
                            <TableCell className="font-bold text-slate-800">{u.name}</TableCell>
                            <TableCell className="font-medium text-slate-600">{u.phone}</TableCell>
                            <TableCell>
                              <Badge variant={u.role === 'admin' ? 'default' : 'secondary'} className="rounded-lg font-bold">
                                {u.role.toUpperCase()}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right font-medium text-slate-500">
                              {new Date(u.createdAt).toLocaleDateString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
}
