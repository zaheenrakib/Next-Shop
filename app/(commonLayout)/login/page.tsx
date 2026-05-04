'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingCart, Cpu } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const [loginData, setLoginData] = useState({ phone: '', password: '' });
  const [registerData, setRegisterData] = useState({ phone: '', password: '', name: '' });
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate login
      setTimeout(() => {
        toast.success('Login successful!');
        router.push('/');
        setLoading(false);
      }, 1500);
    } catch (error) {
      toast.error('An error occurred');
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate register
      setTimeout(() => {
        toast.success('Registration successful!');
        router.push('/');
        setLoading(false);
      }, 1500);
    } catch (error) {
      toast.error('An error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#081621] via-[#0b1d2b] to-[#081621] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-4 group">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center -rotate-12 group-hover:rotate-0 transition-transform">
              <Cpu className="w-7 h-7 text-white" />
            </div>
            <div className="flex flex-col items-start translate-y-1">
              <span className="font-black text-3xl tracking-tighter italic uppercase text-primary">
                Next<span className="text-white">Shop</span>
              </span>
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-white mt-4 tracking-tight">Access Your Account</h1>
          <p className="text-gray-400 mt-2">Join the premium tech community</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/5 p-1 rounded-xl">
            <TabsTrigger value="login" className="data-[state=active]:bg-primary data-[state=active]:text-white font-bold">Login</TabsTrigger>
            <TabsTrigger value="register" className="data-[state=active]:bg-primary data-[state=active]:text-white font-bold">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="mt-6">
            <Card className="glass border-white/5 bg-white/5 text-white">
              <CardHeader>
                <CardTitle className="text-white">Login</CardTitle>
                <CardDescription className="text-gray-400">Enter your phone number and password</CardDescription>
              </CardHeader>
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-phone" className="text-gray-300">Phone Number</Label>
                    <Input
                      id="login-phone"
                      type="tel"
                      placeholder="+880 1234-567890"
                      className="bg-white/10 border-white/10 text-white placeholder:text-gray-600 h-11"
                      value={loginData.phone}
                      onChange={(e) => setLoginData({ ...loginData, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password" id="password-label" className="text-gray-300">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="Enter your password"
                      className="bg-white/10 border-white/10 text-white placeholder:text-gray-600 h-11"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full h-11 font-bold tech-gradient border-none" disabled={loading}>
                    {loading ? 'Authenticating...' : 'Sign In'}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="register" className="mt-6">
            <Card className="glass border-white/5 bg-white/5 text-white">
              <CardHeader>
                <CardTitle className="text-white">Create Account</CardTitle>
                <CardDescription className="text-gray-400">Join NextShop today</CardDescription>
              </CardHeader>
              <form onSubmit={handleRegister}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name" className="text-gray-300">Full Name</Label>
                    <Input
                      id="register-name"
                      type="text"
                      placeholder="John Doe"
                      className="bg-white/10 border-white/10 text-white placeholder:text-gray-600 h-11"
                      value={registerData.name}
                      onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-phone" className="text-gray-300">Phone Number</Label>
                    <Input
                      id="register-phone"
                      type="tel"
                      placeholder="+880 1234-567890"
                      className="bg-white/10 border-white/10 text-white placeholder:text-gray-600 h-11"
                      value={registerData.phone}
                      onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password" id="register-password-label" className="text-gray-300">Password</Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="Create a password"
                      className="bg-white/10 border-white/10 text-white placeholder:text-gray-600 h-11"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full h-11 font-bold tech-gradient border-none" disabled={loading}>
                    {loading ? 'Creating account...' : 'Create Account'}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="text-center mt-8">
          <Link href="/" className="text-sm text-gray-400 hover:text-primary transition-colors font-medium">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
