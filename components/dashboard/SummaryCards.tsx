'use client';

import { MapPin, Truck } from 'lucide-react';

export default function SummaryCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-4 hover:bg-gray-50 transition-colors cursor-pointer group">
        <div className="p-4 rounded-2xl bg-teal-50 text-teal-600 group-hover:bg-white group-hover:shadow-md transition-all">
          <Truck size={32} />
        </div>
        <span className="font-bold text-gray-700">Order Tracking</span>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-4 hover:bg-gray-50 transition-colors cursor-pointer group">
        <div className="p-4 rounded-2xl bg-blue-50 text-blue-600 group-hover:bg-white group-hover:shadow-md transition-all">
          <MapPin size={32} />
        </div>
        <span className="font-bold text-gray-700">Address Book</span>
      </div>
    </div>
  );
}
