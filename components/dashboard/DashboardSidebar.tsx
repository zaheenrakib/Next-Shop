'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  User, 
  ShoppingBag, 
  Heart, 
  Ticket, 
  Star, 
  MapPin, 
  Truck, 
  Bell, 
  LogOut 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'My Profile', href: '/dashboard/profile', icon: User },
  { name: 'My Orders', href: '/dashboard/orders', icon: ShoppingBag },
  { name: 'Wishlist', href: '/dashboard/wishlist', icon: Heart },
  { name: 'Coupon', href: '/dashboard/coupon', icon: Ticket },
  { name: 'Review', href: '/dashboard/review', icon: Star },
  { name: 'Address Book', href: '/dashboard/address', icon: MapPin },
  { name: 'Order Tracking', href: '/dashboard/tracking', icon: Truck },
  { name: 'Notification', href: '/dashboard/notifications', icon: Bell },
];

export default function DashboardSidebar({ user, onLogout }: { user: any; onLogout: () => void }) {
  const pathname = usePathname();

  return (
    <div className="w-full h-fit bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
      {/* Profile Section */}
      <div className="p-6 flex items-center gap-4">
        <Avatar className="h-16 w-16 border-2 border-primary/10">
          <AvatarImage src="" />
          <AvatarFallback className="bg-gray-100 text-gray-400">
            <User size={32} />
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold text-gray-900 text-lg leading-tight">{user?.name || 'User'}</h3>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 pb-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                    isActive 
                      ? "bg-blue-50 text-primary border-l-4 border-primary" 
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <item.icon size={20} className={cn(
                    "transition-colors",
                    isActive ? "text-primary" : "text-gray-400 group-hover:text-gray-600"
                  )} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 mt-auto">
        <Button 
          variant="destructive" 
          className="w-full rounded-xl py-6 text-base font-semibold bg-red-600 hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
          onClick={onLogout}
        >
          <LogOut size={20} className="mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
}
