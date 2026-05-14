'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, ArrowRight, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { authClient } from '@/lib/auth-client';

export default function AccountLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);


  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'success' | 'error'>('success');
  const [modalMessage, setModalMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {

      const { data, error } = await authClient.signIn.email({
        email: email,
        password: password,
        callbackURL: '/', // লগইন হয়ে সরাসরি হোমপেজে যাবে
      });

      if (error) {
        setModalType('error');
        setModalMessage(error.message || 'Invalid email or password. Please try again.');
        setModalOpen(true);
      } else {
        setModalType('success');
        setModalMessage('Login successful! Welcome back to NextShop.');
        setModalOpen(true);
      }
    } catch (err) {
      console.error('Login Error:', err);
      setModalType('error');
      setModalMessage('An unexpected error occurred. Please try again later.');
      setModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    if (modalType === 'success') {
      router.push('/'); // লগইন সফল হলে সরাসরি হোম পেজে রিডাইরেক্ট
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8 relative">

        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-12">
          <Link href="/" className="hover:text-primary transition-colors">
            <span className="sr-only">Home</span>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
            </svg>
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-medium italic">Login</span>
          <span>/</span>
          <Link href="/account/register" className="hover:text-primary transition-colors">Register</Link>
        </nav>

        <div className="max-w-[450px] mx-auto bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-gray-100">
          <h1 className="text-2xl font-black text-slate-900 mb-8">Account Login</h1>

          <form onSubmit={handleLogin} className="space-y-6">

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-bold text-slate-700">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                className="h-12 border-gray-200 rounded-lg focus-visible:ring-1 focus-visible:ring-[#3749bb]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                className="h-12 border-gray-200 rounded-lg focus-visible:ring-1 focus-visible:ring-[#3749bb]"
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
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" /> Logging in...
                </span>
              ) : 'Login'}
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




      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleModalClose}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />


            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="relative w-full max-w-[400px] bg-white rounded-3xl p-8 text-center shadow-2xl border border-slate-100 overflow-hidden"
            >

              <div className={`absolute -top-20 -left-20 w-40 h-40 rounded-full blur-[80px] pointer-events-none opacity-50 ${modalType === 'success' ? 'bg-emerald-400' : 'bg-rose-400'
                }`} />

              <div className="flex flex-col items-center">

                <motion.div
                  initial={{ rotate: -15, scale: 0.5 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ delay: 0.15, type: 'spring' }}
                  className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-inner ${modalType === 'success'
                    ? 'bg-emerald-50 text-emerald-500 border border-emerald-100'
                    : 'bg-rose-50 text-rose-500 border border-rose-100'
                    }`}
                >
                  {modalType === 'success' ? (
                    <CheckCircle2 className="w-10 h-10 stroke-[2.2]" />
                  ) : (
                    <XCircle className="w-10 h-10 stroke-[2.2]" />
                  )}
                </motion.div>


                <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">
                  {modalType === 'success' ? 'Welcome Back!' : 'Login Failed'}
                </h3>


                <p className="text-slate-500 text-sm leading-relaxed mb-8 px-2">
                  {modalMessage}
                </p>


                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
                  <Button
                    onClick={handleModalClose}
                    className={`w-full h-13 rounded-xl font-bold flex items-center justify-center gap-2 border-none shadow-md transition-all ${modalType === 'success'
                      ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                      : 'bg-rose-500 hover:bg-rose-600 text-white'
                      }`}
                  >
                    {modalType === 'success' ? (
                      <>
                        Go to Homepage <ArrowRight className="w-4 h-4" />
                      </>
                    ) : (
                      'Try Again'
                    )}
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}