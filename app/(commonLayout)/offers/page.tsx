'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Calendar, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { offers } from '@/lib/offer-data';

export default function OffersPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate-900 font-medium italic">Offer</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {offers.map((offer) => (
            <div key={offer.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full group hover:shadow-md transition-shadow">
              {/* Image Container */}
              <div className="relative aspect-square overflow-hidden bg-slate-100">
                <img 
                  src={offer.image} 
                  alt={offer.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-grow text-center">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{offer.startDate} - {offer.endDate}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Monitor className="w-3.5 h-3.5" />
                    <span>{offer.status}</span>
                  </div>
                </div>

                <h2 className="text-xl font-black text-slate-900 mb-3 leading-tight group-hover:text-primary transition-colors italic">
                  {offer.title}
                </h2>
                
                <p className="text-sm text-slate-500 font-medium mb-6 flex-grow line-clamp-2">
                  {offer.description}
                </p>

                <div className="pt-2">
                  <Link href={`/offers/${offer.slug}`}>
                    <Button className="w-full h-11 bg-[#3749bb] hover:bg-[#3749bb]/90 text-white font-black text-sm rounded-lg border-none shadow-lg shadow-blue-500/10">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
