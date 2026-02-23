'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { User, Mail, Phone, Lock, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

interface UserData {
  id: string;
  name: string;
  phone: string;
  role: string;
  email?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setFormData({
        name: parsedUser.name || '',
        email: parsedUser.email || '',
        phone: parsedUser.phone || '',
      });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    router.push('/');
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      toast.success('Profile updated successfully');
      setLoading(false);
    }, 1000);
  };

  return (
    <DashboardLayout user={user} onLogout={handleLogout}>
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm mb-8">
        <Link href="/" className="text-gray-500 hover:text-primary">Home</Link>
        <span className="text-gray-300">/</span>
        <Link href="/dashboard" className="text-gray-500 hover:text-primary">Dashboard</Link>
        <span className="text-gray-300">/</span>
        <span className="text-primary font-medium">My Profile</span>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Personal Information */}
        <Card className="rounded-3xl shadow-sm border-gray-100 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent pb-8">
            <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <User className="text-primary" /> Personal Information
            </CardTitle>
            <CardDescription>Manage your account details and how we contact you.</CardDescription>
          </CardHeader>
          <CardContent className="pt-8">
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700 font-semibold">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input 
                      id="name" 
                      value={formData.name} 
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="pl-10 rounded-xl border-gray-200 focus:border-primary focus:ring-primary/10" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-semibold">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input 
                      id="email" 
                      type="email" 
                      value={formData.email} 
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="pl-10 rounded-xl border-gray-200 focus:border-primary focus:ring-primary/10" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-700 font-semibold">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input 
                      id="phone" 
                      value={formData.phone} 
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="pl-10 rounded-xl border-gray-200 focus:border-primary focus:ring-primary/10" 
                    />
                  </div>
                </div>
              </div>
              <div className="pt-4">
                <Button disabled={loading} className="rounded-xl px-8 py-6 text-base font-semibold shadow-lg shadow-primary/20">
                  {loading ? 'Saving Changes...' : <><Save className="mr-2 w-5 h-5" /> Save Changes</>}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card className="rounded-3xl shadow-sm border-gray-100 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-orange-500/5 to-transparent pb-8">
            <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Lock className="text-orange-500" /> Change Password
            </CardTitle>
            <CardDescription>Secure your account with a strong password.</CardDescription>
          </CardHeader>
          <CardContent className="pt-8">
            <div className="space-y-6 max-w-md">
              <div className="space-y-2">
                <Label htmlFor="current_password" ...>Current Password</Label>
                <Input id="current_password" type="password" className="rounded-xl border-gray-200" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new_password" ...>New Password</Label>
                <Input id="new_password" type="password" className="rounded-xl border-gray-200" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm_password" ...>Confirm New Password</Label>
                <Input id="confirm_password" type="password" className="rounded-xl border-gray-200" />
              </div>
              <Button variant="outline" className="rounded-xl border-orange-200 text-orange-600 hover:bg-orange-50">
                Update Password
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
