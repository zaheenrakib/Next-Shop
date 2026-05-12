"use client";

import React, { useState, useEffect } from "react";
import {
  ShoppingBag, LogOut, Menu, Search, LayoutDashboard,
  Package, Settings, Megaphone, ChevronDown, Bell, User
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

const UserDashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={22} />, href: "/admin" },

    {
      name: "Homepage",
      icon: <Megaphone size={22} />,
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
      icon: <Bell size={22} />,
      children: [{ name: "Manage Offers", href: "/admin/offer-management/offers" }],
    },

    {
      name: "Products",
      icon: <Package size={22} />,
      children: [{ name: "All Products", href: "/admin/products" }],
    },

    {
      name: "Settings",
      icon: <Settings size={22} />,
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
        child.children?.some(sub => sub.href === pathname)
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
    <div className="flex h-screen bg-[#F3F4F6] text-[#1F2937]">

      {/* SIDEBAR */}
      <aside
        className={`hidden md:flex flex-col bg-[#0A0F1C] text-gray-300 border-r border-white/5
        transition-all duration-300 ${isSidebarOpen ? "w-80" : "w-24"}`}
      >

        {/* LOGO */}
        <div className="h-24 flex items-center px-6 border-b border-white/5">
          <div className="w-11 h-11 bg-[#FF5722] rounded-2xl flex items-center justify-center shadow-lg shadow-[#FF5722]/20">
            <ShoppingBag size={20} className="text-white" />
          </div>

          {isSidebarOpen && (
            <span className="ml-4 text-lg font-bold text-white tracking-wide">
              Next<span className="text-[#FF5722]">Shop</span>
            </span>
          )}
        </div>

        {/* MENU */}
        <nav className="flex-1 px-4 mt-6 space-y-2 overflow-y-auto">

          {menuItems.map((item, idx) => {
            const isActive = pathname === item.href;
            const isOpen = openMenus.includes(item.name);

            // SIMPLE LINK ITEM
            if (item.href) {
              return (
                <Link key={idx} href={item.href}>
                  <div className={`flex items-center gap-4 px-4 py-3 rounded-xl transition relative
                    ${isActive ? "bg-[#FF5722]/10 text-white" : "hover:bg-white/5"}`}>

                    {isActive && (
                      <div className="absolute left-0 top-2 bottom-2 w-1 bg-[#FF5722] rounded-r-full" />
                    )}

                    {item.icon}
                    {isSidebarOpen && <span className="font-medium">{item.name}</span>}
                  </div>
                </Link>
              );
            }

            return (
              <div key={idx}>

                {/* MAIN MENU */}
                <button
                  onClick={() => toggleMenu(item.name)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-white/5"
                >
                  <div className="flex items-center gap-4">
                    {item.icon}
                    {isSidebarOpen && <span className="font-medium">{item.name}</span>}
                  </div>

                  {isSidebarOpen && (
                    <ChevronDown size={18}
                      className={`transition ${isOpen ? "rotate-180" : ""}`}
                    />
                  )}
                </button>

                {/* SUB MENU */}
                <AnimatePresence>
                  {isOpen && isSidebarOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="ml-8 mt-2 space-y-2 border-l border-white/10 pl-5"
                    >

                      {item.children.map((child: any, i: number) => {

                        // HERO SECTION (nested)
                        if (child.children) {
                          const isChildOpen = openMenus.includes(child.name);

                          return (
                            <div key={i}>
                              <button
                                onClick={() => toggleMenu(child.name)}
                                className="text-sm text-gray-300 hover:text-white py-2"
                              >
                                {child.name}
                              </button>

                              {isChildOpen && (
                                <div className="ml-4 mt-1 space-y-2 border-l border-white/10 pl-4">
                                  {child.children.map((sub: any, j: number) => {
                                    const active = pathname === sub.href;

                                    return (
                                      <Link key={j} href={sub.href}>
                                        <div className={`text-sm py-1 relative
                                          ${active ? "text-[#FF5722] font-semibold" : "text-gray-400 hover:text-white"}`}>

                                          {active && (
                                            <span className="absolute -left-4 top-2 w-2 h-2 bg-[#FF5722] rounded-full" />
                                          )}

                                          {sub.name}
                                        </div>
                                      </Link>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        }

                        const active = pathname === child.href;

                        return (
                          <Link key={i} href={child.href}>
                            <div className={`text-sm py-2 relative
                              ${active ? "text-[#FF5722] font-semibold" : "text-gray-400 hover:text-white"}`}>

                              {active && (
                                <span className="absolute -left-4 top-2 w-2 h-2 bg-[#FF5722] rounded-full" />
                              )}

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

        {/* LOGOUT */}
        <div className="p-5 border-t border-white/5">
          <button className="flex items-center gap-3 text-red-400 hover:text-red-300">
            <LogOut size={20} />
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        {/* HEADER (IMPROVED PROFILE SECTION) */}
        <header className="h-20 bg-white/80 backdrop-blur border-b flex items-center justify-between px-8">

          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-3 hover:bg-gray-100 rounded-xl"
          >
            <Menu size={22} />
          </button>

          <div className="hidden md:flex items-center bg-gray-100 px-4 py-2 rounded-xl w-[380px]">
            <Search size={18} className="text-gray-400" />
            <input
              placeholder="Search dashboard..."
              className="bg-transparent outline-none px-3 text-[15px] w-full"
            />
          </div>

          {/* PREMIUM PROFILE SECTION */}
          <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-200">

            <div className="text-right hidden sm:block">
              <p className="text-[14px] font-semibold text-gray-800 leading-tight">
                Mahmudul Hasan
              </p>
              <p className="text-[11px] text-[#FF5722] font-medium">
                Super Admin
              </p>
            </div>

            <div className="w-11 h-11 bg-gradient-to-tr from-[#111827] to-[#374151]
              text-white flex items-center justify-center rounded-xl shadow-md">
              <User size={20} />
            </div>

          </div>

        </header>

        {/* CONTENT */}
        <main className="p-8 overflow-y-auto">
          {children}
        </main>

      </div>
    </div>
  );
};

export default UserDashboardLayout;