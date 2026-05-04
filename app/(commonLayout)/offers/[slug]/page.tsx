'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Calendar, Monitor, ChevronLeft, Share2, Facebook, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { offers } from '@/lib/offer-data';
import { Offer } from '@/types';

export default function OfferDetailsPage() {
  const { slug } = useParams();
  const [offer, setOffer] = useState<Offer | null>(null);
  const [timeLeft, setTimeLeft] = useState({
    days: 29,
    hours: 7,
    minutes: 41,
    seconds: 35
  });

  useEffect(() => {
    const foundOffer = offers.find(o => o.slug === slug);
    if (foundOffer) {
      setOffer(foundOffer);
    }
  }, [slug]);

  // Mock countdown effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!offer) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link href="/offers" className="hover:text-primary transition-colors">Offer</Link>
          <span>/</span>
          <span className="text-slate-900 font-medium italic">{offer.title}</span>
        </nav>

        <div className="max-w-4xl mx-auto bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 px-8 py-10 md:px-12">
          {/* Header Row */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 border-b border-gray-100 pb-8">
            <button className="flex items-center gap-2 text-slate-800 font-black text-lg hover:text-primary transition-colors">
              <ChevronLeft size={24} />
              Offer Details
            </button>

            <div className="flex items-center gap-4">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest italic">Offer Ends In</span>
              <div className="flex gap-2">
                {[
                  { label: 'Days', val: timeLeft.days },
                  { label: 'Hours', val: timeLeft.hours },
                  { label: 'Minutes', val: timeLeft.minutes },
                  { label: 'Seconds', val: timeLeft.seconds }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="bg-[#ef4a23] text-white w-9 h-9 flex items-center justify-center text-lg font-black rounded-lg">
                      {String(item.val).padStart(2, '0')}
                    </div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase mt-1 tracking-tighter">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-10">
            {/* Offer Image */}
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border border-gray-100">
               <img src={offer.image} alt={offer.title} className="w-full aspect-square md:aspect-[16/9] object-cover" />
               <div className="absolute top-8 right-8 w-20 h-8 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
                 <span className="text-[10px] text-white font-black italic tracking-widest uppercase">Promo</span>
               </div>
            </div>

            {/* Title & Info */}
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight italic">
                {offer.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-slate-500">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span>{offer.startDate} - {offer.endDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Monitor className="w-5 h-5 text-primary" />
                  <span>{offer.status}</span>
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pt-4 border-t border-gray-100">
              <div className="md:col-span-2 space-y-8">
                <div className="space-y-4">
                  <h3 className="text-xl font-black text-slate-900 flex items-center gap-2 italic">
                     <span className="w-1 h-6 bg-primary rounded-full" />
                     Campaign Details
                  </h3>
                  <p className="text-md text-slate-600 leading-relaxed font-medium">
                    {offer.details}
                  </p>
                </div>

                {offer.terms && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-black text-slate-900 flex items-center gap-2 italic">
                       <span className="w-1 h-6 bg-primary rounded-full" />
                       Terms & Conditions
                    </h3>
                    <ul className="space-y-3">
                      {offer.terms.map((term, i) => (
                        <li key={i} className="flex items-start gap-3 text-slate-600 font-medium text-md">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0" />
                          {term}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="pt-6 border-t border-gray-100">
                  <p className="text-slate-900 font-black mb-4 italic">Check out our best prices:</p>
                  <Link href="/products">
                    <Button variant="link" className="p-0 h-auto text-[#ef4a23] hover:text-[#ef4a23]/80 font-black text-md">
                       Shop Now
                    </Button>
                  </Link>
                </div>

                {/* Share */}
                <div className="flex items-center gap-4 pt-4">
                   <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest italic">Share Offer:</span>
                   <div className="flex gap-2">
                     <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-slate-100 text-slate-600 p-0">
                       <Facebook size={18} />
                     </Button>
                     <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-slate-100 text-slate-600 p-0">
                       <Twitter size={18} />
                     </Button>
                     <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-slate-100 text-slate-600 p-0">
                       <Share2 size={18} />
                     </Button>
                   </div>
                </div>
              </div>

              {/* Sidebar Action? */}
              <div className="space-y-6">
                <div className="bg-[#081621] p-8 rounded-3xl text-center shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-primary/20 rounded-full blur-3xl" />
                  <h4 className="text-white font-black text-lg mb-2 italic">Quick Shop</h4>
                  <p className="text-gray-400 text-xs mb-6 font-medium">Grab your favorite gadgets before the deal ends!</p>
                  <Link href="/products">
                    <Button className="w-full tech-gradient border-none font-black h-12 rounded-xl text-sm shadow-xl shadow-primary/20 italic">
                      View Products
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
