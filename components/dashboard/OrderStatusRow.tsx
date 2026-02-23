'use client';

import { Loader2, UserCheck, Truck, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function OrderStatusRow() {
  const statuses = [
    { label: 'Processing', icon: Loader2, color: 'text-purple-500', bgColor: 'bg-purple-50' },
    { label: 'Ready To Ship', icon: UserCheck, color: 'text-teal-500', bgColor: 'bg-teal-50' },
    { label: 'Shipped', icon: Truck, color: 'text-blue-500', bgColor: 'bg-blue-50' },
    { label: 'Review', icon: Star, color: 'text-green-500', bgColor: 'bg-green-50' },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold text-gray-900">My Orders</h2>
        <Button variant="outline" size="sm" className="text-primary border-primary hover:bg-primary/5 rounded-lg flex items-center gap-2">
          See More <span>→</span>
        </Button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {statuses.map((status) => (
          <div key={status.label} className="flex flex-col items-center gap-3">
            <div className={`p-4 rounded-2xl ${status.bgColor} ${status.color}`}>
              <status.icon size={28} />
            </div>
            <span className="text-sm font-medium text-gray-500">{status.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
