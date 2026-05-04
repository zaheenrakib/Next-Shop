'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function AccountRegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Account created successfully!');
        router.push('/account/login');
      } else {
        toast.error(data.error || 'Registration failed');
      }
    } catch (error) {
      toast.error('An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-12">
          <Link href="/" className="hover:text-primary transition-colors">
            <span className="sr-only">Home</span>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
          </Link>
          <span>/</span>
          <Link href="/account" className="hover:text-primary transition-colors">Account</Link>
          <span>/</span>
          <span className="text-slate-900 font-medium italic">Register</span>
        </nav>

        <div className="max-w-[450px] mx-auto bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-gray-100">
          <h1 className="text-2xl font-black text-slate-900 mb-8">Register Account</h1>
          
          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-bold text-slate-700">Full Name</Label>
              <Input
                id="name"
                placeholder="Full Name"
                className="h-12 border-gray-200 rounded-lg"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-bold text-slate-700">Phone Number</Label>
              <Input
                id="phone"
                placeholder="Phone Number"
                className="h-12 border-gray-200 rounded-lg"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" id="register-password-label" className="text-sm font-bold text-slate-700">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                className="h-12 border-gray-200 rounded-lg"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" id="confirm-password-label" className="text-sm font-bold text-slate-700">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                className="h-12 border-gray-200 rounded-lg"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 bg-[#3749bb] hover:bg-[#2c3a96] text-white font-black rounded-lg transition-colors border-none"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Continue'}
            </Button>
          </form>

          <div className="text-center mt-8">
            <p className="text-sm font-bold text-slate-400">
              Already have an account? <Link href="/account/login" className="text-[#ef4a23] hover:underline">Login here</Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
