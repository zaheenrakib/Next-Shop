'use client';

import { ShoppingCart, Heart, Ticket } from 'lucide-react';

export default function DashboardFeatureCards() {
  const cards = [
    {
      title: 'My Orders',
      description: 'All of your orders in here',
      icon: ShoppingCart,
      bgColor: 'bg-gradient-to-br from-purple-500/10 to-purple-500/20',
      iconColor: 'bg-purple-500',
      accentColor: 'border-purple-100',
      iconBg: 'bg-purple-600'
    },
    {
      title: 'Wishlist',
      description: 'All of your wishlist items in here',
      icon: Heart,
      bgColor: 'bg-gradient-to-br from-teal-500/10 to-teal-500/20',
      iconColor: 'bg-teal-500',
      accentColor: 'border-teal-100',
      iconBg: 'bg-teal-600'
    },
    {
      title: 'Coupon',
      description: 'All of your coupons in here',
      icon: Ticket,
      bgColor: 'bg-gradient-to-br from-pink-500/10 to-pink-500/20',
      iconColor: 'bg-pink-500',
      accentColor: 'border-pink-100',
      iconBg: 'bg-pink-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {cards.map((card) => (
        <div key={card.title} className={`relative overflow-hidden rounded-3xl p-6 h-64 flex flex-col items-center justify-end bg-white border border-gray-100 shadow-sm transition-transform hover:-translate-y-1`}>
          {/* Top Decorative Graphic Area */}
          <div className={`absolute top-0 left-0 right-0 h-40 ${card.bgColor} flex items-center justify-center`}>
            <div className={`p-6 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 shadow-2xl`}>
               <card.icon size={48} className="text-white fill-white/20" />
            </div>
          </div>

          {/* Bottom Content */}
          <div className="pt-2 flex flex-col items-center text-center">
            <div className={`-mt-10 mb-4 p-3 rounded-2xl ${card.iconBg} text-white shadow-xl rotate-3`}>
              <card.icon size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">{card.title}</h3>
            <p className="text-xs text-gray-500 font-medium">{card.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
