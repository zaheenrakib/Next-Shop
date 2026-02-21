'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Gift, 
  Zap, 
  User, 
  Cpu, 
  Menu, 
  X,
  ShoppingCart
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const categories = [
  "Desktop", "Laptop", "Component", "Monitor", "Processor", "UPS", "Phone", "Tablet", 
  "Office Equipment", "Camera", "Security", "Networking", "Software", 
  "Server & Storage", "Accessories", "Gadget", "Gaming", "TV", "Appliance"
];

export default function Navbar({ cartCount = 0 }: { cartCount?: number }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] w-full flex flex-col shadow-xl">
      {/* Top Bar - Dark Section */}
      <div className="bg-[#081621] w-full py-3 lg:py-5 border-b border-white/5">
        <div className="container mx-auto px-4 flex items-center justify-between gap-4 md:gap-8">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-2 group">
            <div className="w-9 h-9 md:w-11 md:h-11 bg-primary rounded-full flex items-center justify-center -rotate-12 group-hover:rotate-0 transition-transform shadow-lg shadow-primary/20">
              <Cpu className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-black tracking-tighter leading-none italic uppercase text-primary">
                Next<span className="text-white">Shop</span>
              </span>
              <span className="text-[10px] uppercase tracking-widest text-[#ef4a23] font-bold">Premium Tech Store</span>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-grow max-w-xl relative group">
            <Input 
              placeholder="Search everything tech..." 
              className="w-full bg-white text-slate-900 h-11 md:h-12 pr-12 rounded-lg border-none focus-visible:ring-2 focus-visible:ring-primary/50 shadow-inner"
            />
            <button className="absolute right-0 top-0 h-full w-12 flex items-center justify-center text-slate-400 hover:text-primary transition-colors">
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Action Items */}
          <div className="hidden lg:flex items-center space-x-6 whitespace-nowrap text-white">
            <Link href="/offers" className="flex items-center gap-3 group">
              <div className="p-2 rounded-full bg-white/5 group-hover:bg-primary/20 transition-colors">
                <Gift className="w-6 h-6 text-primary" />
              </div>
              <div className="hidden xl:block">
                <p className="text-sm font-bold leading-tight group-hover:text-primary transition-colors">Offers</p>
                <p className="text-[10px] text-gray-400">Latest Deals</p>
              </div>
            </Link>
            
            <Link href="/account" className="flex items-center gap-3 group">
              <div className="p-2 rounded-full bg-white/5 group-hover:bg-primary/20 transition-colors">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div className="hidden xl:block">
                <p className="text-sm font-bold leading-tight group-hover:text-primary transition-colors">Account</p>
                <p className="text-[10px] text-gray-400">Login/Register</p>
              </div>
            </Link>

            {/* PC Builder Button */}
            <Link href="/pc-builder">
              <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-blue-600 hover:to-cyan-500 text-white font-black h-11 md:h-12 px-6 rounded-lg border-none shadow-lg shadow-blue-500/20 transition-all active:scale-95 text-sm uppercase tracking-wide">
                PC Builder
              </Button>
            </Link>
          </div>

          {/* Mobile Right Icons */}
          <div className="lg:hidden flex items-center gap-3">
            <Link href="/pc-builder" className="xs:block hidden">
              <Button size="sm" className="bg-gradient-to-r from-cyan-500 to-blue-600 h-10 px-4 rounded-lg text-xs font-bold">
                Builder
              </Button>
            </Link>
             <Link href="/cart">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/5">
                <ShoppingCart className="w-6 h-6" />
              </Button>
            </Link>
            <button className="text-white p-2 hover:bg-white/5 rounded-lg" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar - White Section */}
      <div className="bg-white border-b border-slate-200 hidden md:block w-full">
        <div className="container mx-auto px-4 py-2">
          <ul className="flex items-center justify-between gap-1 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <li key={cat}>
                <Link 
                  href={`/category/${cat.toLowerCase().replace(' ', '-')}`}
                  className="text-[14px] font-bold text-slate-800 hover:text-primary px-3 py-2 transition-colors whitespace-nowrap block"
                >
                  {cat}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Mobile Menu Content */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#081621] border-t border-white/10 animate-in slide-in-from-top-4 duration-300 max-h-[85vh] overflow-y-auto w-full">
          <div className="container mx-auto px-4 py-8 flex flex-col space-y-6 text-white text-center">
             <div className="relative">
              <Input 
                placeholder="Search products..." 
                className="w-full bg-white/10 border-white/20 text-white h-12 pr-12 rounded-xl text-lg"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-white/40" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Link href="/offers" className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5">
                <Gift className="w-8 h-8 text-primary" />
                <span className="font-bold">Offers</span>
              </Link>
              <Link href="/account" className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5">
                <User className="w-8 h-8 text-primary" />
                <span className="font-bold">Profile</span>
              </Link>
            </div>
            
            <div className="pt-4 text-left">
              <p className="text-xs font-black text-primary uppercase mb-6 tracking-widest pl-2">Product Categories</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-4">
                {categories.map((cat) => (
                  <Link 
                    key={cat}
                    href={`/category/${cat.toLowerCase().replace(' ', '-')}`}
                    className="text-base font-semibold text-gray-300 hover:text-white pl-2 border-l-2 border-white/5"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}