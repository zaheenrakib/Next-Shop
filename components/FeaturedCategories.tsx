'use client';

import React from 'react';
import {
  Wifi,
  Waves,
  Plane,
  Aperture,
  Tablet,
  Tv,
  Smartphone,
  Usb,
  HardDrive,
  Video,
  Scissors,
  Watch,
  Camera,
  Headphones,
  Speaker,
  Gamepad2
} from 'lucide-react';
import Link from 'next/link';

const categories = [
  { name: 'Starlink', icon: Wifi },
  { name: 'Water Heater Geyser', icon: Waves },
  { name: 'Drone', icon: Plane },
  { name: 'Gimbal', icon: Aperture },
  { name: 'Table PC', icon: Tablet },
  { name: 'TV', icon: Tv },
  { name: 'Mobile Phone', icon: Smartphone },
  { name: 'Mobile Accessories', icon: Usb },
  { name: 'Portable SSD', icon: HardDrive },
  { name: 'WiFi Camera', icon: Video },
  { name: 'Trimmer', icon: Scissors },
  { name: 'Smart Watch', icon: Watch },
  { name: 'Action Camera', icon: Camera },
  { name: 'Earbuds', icon: Headphones },
  { name: 'Bluetooth Speakers', icon: Speaker },
  { name: 'Gaming Console', icon: Gamepad2 },
];

export default function FeaturedCategories() {
  return (
    <section className="py-12 bg-gray-50/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">Featured Category</h2>
          <p className="text-slate-500 font-medium">Get Your Desired Product from Featured Category!</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              href={`/products?category=${encodeURIComponent(cat.name)}`}
              className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center gap-4 transition-all duration-300 hover:shadow-md hover:border-primary/20 hover:-translate-y-1"
            >
              <div className="text-slate-700 group-hover:text-primary transition-colors duration-300">
                <cat.icon size={40} strokeWidth={1.5} />
              </div>
              <span className="text-xs font-bold text-center text-slate-800 group-hover:text-primary transition-colors leading-tight">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
