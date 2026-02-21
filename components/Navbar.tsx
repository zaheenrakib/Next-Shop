'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShoppingCart, ShoppingBag, User, Menu, X, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface NavbarProps {
  cartCount?: number;
}

export default function Navbar({ cartCount = 0 }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'glass py-3 shadow-lg' : 'bg-transparent py-5'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 tech-gradient rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <span className="font-black text-2xl tracking-tighter text-secondary dark:text-white">Next<span className="text-primary">Bazaar</span></span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-sm font-bold hover:text-primary transition-colors">Home</Link>
            <Link href="/products" className="text-sm font-bold hover:text-primary transition-colors">Products</Link>
            <Link href="/pc-builder" className="group">
              <Button variant="ghost" className="text-sm font-bold gap-2 text-primary hover:text-primary hover:bg-primary/5 border border-primary/20 rounded-full px-6">
                <Monitor className="w-4 h-4" />
                PC Builder
              </Button>
            </Link>
          </div>

          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" className="relative hover:bg-primary/5 rounded-full">
              <ShoppingCart className="w-5 h-5 text-secondary dark:text-white" />
              {cartCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 tech-gradient border-none">
                  {cartCount}
                </Badge>
              )}
            </Button>
            <Link href="/login">
              <Button variant="ghost" size="icon" className="hover:bg-primary/5 rounded-full">
                <User className="w-5 h-5 text-secondary dark:text-white" />
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden rounded-full"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass border-t border-white/10 animate-in slide-in-from-top-4 duration-300">
          <div className="container mx-auto px-4 py-8 flex flex-col space-y-4">
            <Link href="/" className="text-lg font-bold">Home</Link>
            <Link href="/products" className="text-lg font-bold">Products</Link>
            <Link href="/pc-builder" className="text-lg font-bold text-primary flex items-center gap-2">
              <Monitor className="w-5 h-5" />
              PC Builder
            </Link>
            <hr className="border-white/10" />
            <Link href="/login" className="text-lg font-bold">Profile</Link>
          </div>
        </div>
      )}
    </nav>
  );
}