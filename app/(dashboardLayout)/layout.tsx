"use client";

import React, { useState } from "react";
import { 
  ShoppingBag, LogOut, Menu, X, Bell, Search, Heart,
  LayoutDashboard, Package, Users, Megaphone, BarChart3,
  MessageSquare, Settings, Plus, FolderTree
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation"; 

const UserDashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
<<<<<<< HEAD
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, href: "/admin-dashboard" }, 
    { name: "Sales & Orders", icon: <ShoppingBag size={20} />, href: "/admin-dashboard/sales&orders" },
    { name: "Products", icon: <Package size={20} />, href: "/admin-dashboard/products" },
=======
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, href: "/admin-dashboard" },
    { name: "Products", icon: <Package size={20} />, href: "/admin/products" },
    { name: "Add Product", icon: <Plus size={20} />, href: "/admin/products/new" },
    { name: "Categories", icon: <FolderTree size={20} />, href: "/admin/categories" },
    { name: "Attributes", icon: <Settings size={20} />, href: "/admin/attributes" },
    { name: "Sales & Orders", icon: <ShoppingBag size={20} />, href: "/admin-dashboard/sales&orders" },
>>>>>>> 317bcccf4cdddea93f3111fdb8cf2c05b33812be
    { name: "Users", icon: <Users size={20} />, href: "/admin-dashboard/user-management" },
    { name: "Analytics", icon: <BarChart3 size={20} />, href: "/admin-dashboard/reports&analytics" },
    { name: "Support & Reviews", icon: <MessageSquare size={20} />, href: "/admin-dashboard/support&reviews" },
    { name: "Settings", icon: <Settings size={20} />, href: "/admin-dashboard/settings" },
  ];

  return (
    <div className="flex h-screen bg-[#F8F9FA] text-[#262B3B] font-sans overflow-hidden">
      {/* Desktop Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } hidden md:flex flex-col bg-[#262B3B] text-white transition-all duration-300 ease-in-out relative z-30 shadow-2xl`}
      >
        <div className="h-20 flex items-center px-6 shrink-0">
          <div className="bg-[#FF5722] p-2 rounded-lg shrink-0">
            <ShoppingBag size={24} className="text-white" />
          </div>
          {isSidebarOpen && (
            <motion.span 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="ml-3 text-xl font-bold tracking-tight whitespace-nowrap"
            >
              NEXT<span className="text-[#FF5722]">SHOP</span>
            </motion.span>
          )}
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-2 overflow-y-auto custom-scrollbar">
          {menuItems.map((item, idx) => {
          
            const isActive = pathname === item.href;

            return (
              <Link key={idx} href={item.href}>
                <div 
                  className={`flex items-center gap-4 p-3 rounded-xl transition-all cursor-pointer group mb-1 ${
                    isActive 
                      ? "bg-white/10 text-white" 
                      : "hover:bg-white/10 text-gray-300 hover:text-white"
                  }`}
                >
                  <span className={`transition-colors shrink-0 ${
                    isActive ? "text-[#FF5722]" : "text-gray-400 group-hover:text-[#FF5722]"
                  }`}>
                    {item.icon}
                  </span>
                  {isSidebarOpen && (
                    <span className={`text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis ${isActive ? "text-white" : ""}`}>
                      {item.name}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-white/10 shrink-0 bg-[#262B3B]">
          <button className="flex items-center gap-4 p-3 w-full rounded-xl hover:bg-red-500/10 text-red-400 transition-colors">
            <LogOut size={20} className="shrink-0" />
            {isSidebarOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content & Mobile Sidebar logic stays exactly the same... */}
      
      
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header... */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm shrink-0 z-20">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="hidden md:flex p-2 hover:bg-gray-100 rounded-lg text-gray-500">
              <Menu size={20} />
            </button>
            <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-2 hover:bg-gray-100 rounded-lg text-gray-500">
              <Menu size={20} />
            </button>
            <div className="relative hidden lg:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type="text" placeholder="Search your orders..." className="pl-10 pr-4 py-2 bg-gray-100 border-none rounded-full text-sm w-72 focus:ring-2 focus:ring-[#FF5722]/20 outline-none" />
            </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="text-right hidden sm:block">
               <p className="text-sm font-bold leading-none">Mahmudul Hasan</p>
               <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">Premium Member</p>
             </div>
             <div className="h-10 w-10 rounded-full bg-[#262B3B] flex items-center justify-center text-white font-bold shadow-md ring-2 ring-[#FF5722]/10 uppercase text-xs">MR</div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-[#F8F9FA] relative">
          <div className="p-6 max-w-[1600px] mx-auto">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              {children}
            </motion.div>
          </div>
        </main>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
      `}</style>
      
      {/* Mobile Sidebar logic with Active State */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMobileMenuOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden" />
            <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} className="fixed inset-y-0 left-0 w-80 bg-[#262B3B] z-[70] flex flex-col md:hidden shadow-2xl">
              <div className="p-6 flex justify-between items-center shrink-0">
                <span className="text-white text-xl font-bold">NEXTSHOP</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-400 p-2 hover:bg-white/10 rounded-full"><X size={24} /></button>
              </div>
              <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
                {menuItems.map((item, idx) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link key={idx} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                      <div className={`flex items-center gap-4 p-4 rounded-xl transition-colors ${isActive ? "bg-white/10 text-white" : "text-gray-300"}`}>
                        <span className={isActive ? "text-[#FF5722]" : "text-gray-400"}>{item.icon}</span>
                        <span className="font-medium">{item.name}</span>
                      </div>
                    </Link>
                  );
                })}
              </nav>
              <div className="p-6 border-t border-white/10">
                <button className="flex items-center gap-4 p-4 w-full bg-red-500/10 text-red-400 rounded-xl"><LogOut size={20} /> Logout</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserDashboardLayout;