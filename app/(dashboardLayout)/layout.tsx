"use client";

import React, { useState, useEffect } from "react";
import {
  ShoppingBag, LogOut, Menu, Search, LayoutDashboard,
  Package, Settings, Megaphone, ChevronDown, Bell, User, Users,
  MessageSquare
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

const UserDashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, href: "/admin" },
    {
      name: "Homepage",
      icon: <Megaphone size={20} />,
      children: [
        {
          name: "Hero Section",
          children: [
            { name: "Slider", href: "/admin/homepage-management/hero-section/slider" },
            { name: "Sidebar", href: "/admin/homepage-management/hero-section/sidebar" },
            { name: "Manage Hero Section", href: "/admin/homepage-management/hero-section/manage" },
          ],
        },
        { name: "News & Updates", href: "/admin/homepage-management/news-updates" },
        { name: "Featured Category", href: "/admin/homepage-management/featured-category" },
      ],
    },
    {
      name: "Offers",
      icon: <Bell size={20} />,
      children: [
        { name: "Create Offers", href: "/admin/offer-management/offers" },
        { name: "Manage Offers", href: "/admin/offer-management/offer-manage" }
      ],
    },
    {
      name: "Products",
      icon: <Package size={20} />,
      children: [{ name: "All Products", href: "/admin/products" }],
    },
    {
      name: "Brands",
      icon: <Package size={20} />,
      children: [{ name: "All Brands", href: "/admin/brands" }],
    },
    {
      name: "Categories",
      icon: <Package size={20} />,
      children: [{ name: "All Categories", href: "/admin/categories" }],
    },
    {
      name: "User's & Admin",
      icon: <Users size={20} />,
      children: [{ name: "Manage Users", href: "/admin/user&admin" }],
    },
    {
      name: "Complain Box",
      icon: <MessageSquare size={20} />,
      children: [{ name: "Manage Users", href: "/admin/manage-feedback" }],
    },
    {
      name: "Settings",
      icon: <Settings size={20} />,
      children: [
        { name: "Categories", href: "/admin/categories" },
        { name: "Attributes", href: "/admin/attributes" },
      ],
    },
  ];

  useEffect(() => {
    const active = menuItems.find(item =>
      item.children?.some(child =>
        child.href === pathname ||
        child.children?.some((sub: any) => sub.href === pathname)
      )
    );
    if (active) setOpenMenus([active.name]);
  }, [pathname]);

  const toggleMenu = (name: string) => {
    setOpenMenus(prev =>
      prev.includes(name) ? prev.filter(i => i !== name) : [...prev, name]
    );
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-[#1E293B]">


      <aside
        className={`hidden md:flex flex-col bg-[#0F172A] text-slate-400 
        transition-all duration-500 ease-in-out relative ${isSidebarOpen ? "w-72" : "w-20"}`}
      >

        <div className="h-20 flex items-center px-6 mb-4 mt-2">
          <Link href="/" className="flex items-center group">
            <div className="w-10 h-10 bg-gradient-to-br from-[#FF5722] to-[#FF8A65] rounded-xl flex items-center justify-center shadow-lg shadow-[#FF5722]/30 group-hover:scale-110 transition-transform">
              <ShoppingBag size={22} className="text-white" />
            </div>
            {isSidebarOpen && (
              <span className="ml-3 text-xl font-black text-white tracking-tight uppercase italic">
                Next<span className="text-[#FF5722]">Shop</span>
              </span>
            )}
          </Link>
        </div>


        <nav className="flex-1 px-3 space-y-1 overflow-y-auto custom-scrollbar">
          {menuItems.map((item, idx) => {
            const isActive = pathname === item.href;
            const isOpen = openMenus.includes(item.name);

            if (item.href) {
              return (
                <Link key={idx} href={item.href}>
                  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                    ${isActive ? "bg-[#FF5722] text-white shadow-md shadow-[#FF5722]/20" : "hover:bg-white/5 hover:text-white"}`}>
                    <span className={`${isActive ? "text-white" : "text-slate-400 group-hover:text-[#FF5722]"}`}>
                      {item.icon}
                    </span>
                    {isSidebarOpen && <span className="font-semibold text-[14px]">{item.name}</span>}
                  </div>
                </Link>
              );
            }

            return (
              <div key={idx} className="space-y-1">
                <button
                  onClick={() => toggleMenu(item.name)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all
                    ${isOpen ? "text-white" : "hover:bg-white/5 hover:text-white group"}`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`${isOpen ? "text-[#FF5722]" : "text-slate-400 group-hover:text-[#FF5722]"}`}>
                      {item.icon}
                    </span>
                    {isSidebarOpen && <span className="font-semibold text-[14px]">{item.name}</span>}
                  </div>
                  {isSidebarOpen && (
                    <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                  )}
                </button>

                <AnimatePresence>
                  {isOpen && isSidebarOpen && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="ml-6 border-l border-slate-800 space-y-1 my-1"
                    >
                      {item.children.map((child: any, i: number) => {
                        if (child.children) {
                          const isChildOpen = openMenus.includes(child.name);
                          return (
                            <div key={i} className="pl-4">
                              <button
                                onClick={() => toggleMenu(child.name)}
                                className="w-full text-left text-[13px] py-2 px-3 text-slate-400 hover:text-white flex justify-between items-center"
                              >
                                {child.name}
                                <ChevronDown size={12} className={`${isChildOpen ? "rotate-180" : ""}`} />
                              </button>
                              {isChildOpen && (
                                <div className="ml-2 border-l border-slate-800 pl-4 space-y-1">
                                  {child.children.map((sub: any, j: number) => (
                                    <Link key={j} href={sub.href}>
                                      <div className={`text-[12px] py-1.5 px-3 rounded-lg transition ${pathname === sub.href ? "text-[#FF5722] font-bold bg-[#FF5722]/5" : "text-slate-500 hover:text-white"}`}>
                                        {sub.name}
                                      </div>
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        }
                        const isChildActive = pathname === child.href;
                        return (
                          <Link key={i} href={child.href}>
                            <div className={`ml-4 text-[13px] py-2 px-3 rounded-lg transition-all
                              ${isChildActive ? "text-white font-bold bg-white/5" : "text-slate-400 hover:text-white"}`}>
                              {child.name}
                            </div>
                          </Link>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>


        <div className="p-4 bg-black/20 m-4 rounded-2xl border border-white/5">
          <button className="w-full flex items-center gap-3 px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-xl transition-all font-medium text-sm">
            <LogOut size={18} />
            {isSidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>


      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">


        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-10 sticky top-0">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2.5 hover:bg-slate-100 rounded-xl transition-colors text-slate-500"
            >
              <Menu size={20} />
            </button>
            <div className="hidden lg:flex items-center bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-100 w-96 group focus-within:border-[#FF5722]/30 transition-all">
              <Search size={18} className="text-slate-400 group-focus-within:text-[#FF5722]" />
              <input
                placeholder="Search anything..."
                className="bg-transparent outline-none px-3 text-[14px] w-full text-slate-600 placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-5">

            <div className="relative p-2.5 hover:bg-slate-100 rounded-xl cursor-pointer transition-colors text-slate-500">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#FF5722] rounded-full border-2 border-white"></span>
            </div>


            <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
              <div className="text-right hidden sm:block">
                <p className="text-[13px] font-bold text-slate-800 tracking-tight leading-none mb-1">
                  Mahmudul Hasan
                </p>
                <div className="flex items-center justify-end gap-1">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    Super Admin
                  </p>
                </div>
              </div>
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-inner shadow-white/10 group cursor-pointer overflow-hidden border border-slate-800">
                <User size={20} className="group-hover:scale-110 transition-transform" />
              </div>
            </div>
          </div>
        </header>


        <main className="flex-1 p-6 lg:p-10 overflow-y-auto bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserDashboardLayout;