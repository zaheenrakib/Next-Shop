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

export default function AccountLoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // API integration would go here
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        toast.success('Login successful!');
        router.push('/dashboard');
      } else {
        toast.error(data.error || 'Invalid credentials');
      }
    } catch (error) {
      toast.error('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-12">
          <Link href="/" className="hover:text-primary transition-colors">
            <span className="sr-only">Home</span>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
          </Link>
          <span>/</span>
          <Link href="/account" className="hover:text-primary transition-colors">Account</Link>
          <span>/</span>
          <span className="text-slate-900 font-medium italic">Login</span>
        </nav>

        <div className="max-w-[450px] mx-auto bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-gray-100">
          <h1 className="text-2xl font-black text-slate-900 mb-8">Account Login</h1>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-bold text-slate-700">Phone / E-Mail</Label>
              <Input
                id="phone"
                type="text"
                placeholder="Phone / E-Mail"
                className="h-12 border-gray-200 rounded-lg focus:ring-primary/20"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" id="password-label" className="text-sm font-bold text-slate-700">Password</Label>
                <Link href="/account/forgot-password" className="text-[11px] font-bold text-[#ef4a23] hover:underline">
                  Forgotten Password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                className="h-12 border-gray-200 rounded-lg focus:ring-primary/20"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 bg-[#3749bb] hover:bg-[#2c3a96] text-white font-black rounded-lg transition-colors border-none"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-100"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-4 text-[11px] font-bold text-slate-400">Don't have an account?</span>
            </div>
          </div>

          <Link href="/account/register">
            <Button 
              variant="outline" 
              className="w-full h-12 border-[#3749bb] text-[#3749bb] hover:bg-[#3749bb] hover:text-white font-black rounded-lg transition-all"
            >
              Create Your Account
            </Button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
