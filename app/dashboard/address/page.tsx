'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { MapPin, Plus, Home, Briefcase, Map, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

export default function AddressPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([
    { id: 1, type: 'Home', name: 'John Doe', phone: '+1234567890', street: '123 Main St', city: 'New York', state: 'NY', zip: '10001', isDefault: true },
    { id: 2, type: 'Work', name: 'John Doe', phone: '+0987654321', street: '456 Business Ave', city: 'Brooklyn', state: 'NY', zip: '11201', isDefault: false },
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

  const deleteAddress = (id: number) => {
    setAddresses(addresses.filter(a => a.id !== id));
    toast.success('Address deleted successfully');
  };

  return (
    <DashboardLayout user={user} onLogout={handleLogout}>
      <div className="flex items-center gap-2 text-sm mb-8">
        <Link href="/" className="text-gray-500 hover:text-primary">Home</Link>
        <span className="text-gray-300">/</span>
        <Link href="/dashboard" className="text-gray-500 hover:text-primary">Dashboard</Link>
        <span className="text-gray-300">/</span>
        <span className="text-primary font-medium">Address Book</span>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Address Book</h1>
        <Button className="rounded-xl px-6 h-12 font-bold shadow-lg shadow-primary/20">
          <Plus className="mr-2 w-5 h-5" /> Add New Address
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {addresses.map((address) => (
          <div key={address.id} className="relative bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:border-primary/20 transition-all group">
            {address.isDefault && (
              <Badge className="absolute top-6 right-8 bg-primary/10 text-primary border-none rounded-lg px-3 py-1 font-bold">
                DEFAULT
              </Badge>
            )}
            
            <div className="flex items-start gap-4 mb-6">
              <div className={`p-4 rounded-2xl ${address.type === 'Home' ? 'bg-blue-50 text-blue-500' : 'bg-orange-50 text-orange-500'}`}>
                {address.type === 'Home' ? <Home size={28} /> : <Briefcase size={28} />}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{address.type} Address</h3>
                <p className="text-gray-500 font-medium">{address.name}</p>
              </div>
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3 text-gray-600">
                <MapPin size={18} className="text-gray-400" />
                <span className="font-medium">{address.street}, {address.city}, {address.state} {address.zip}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Map size={18} className="text-gray-400" />
                <span className="font-medium">{address.phone}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 border-t border-gray-50 pt-6">
              <Button variant="ghost" className="rounded-xl hover:bg-gray-100 text-gray-600 h-11 px-6">
                <Edit2 size={18} className="mr-2" /> Edit
              </Button>
              <Button variant="ghost" className="rounded-xl hover:bg-red-50 text-red-500 h-11 px-6" onClick={() => deleteAddress(address.id)}>
                <Trash2 size={18} className="mr-2" /> Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
