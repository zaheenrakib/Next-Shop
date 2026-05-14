import React from 'react';
import prisma from "@/lib/prisma";
import Image from "next/image";
import { Calendar, MapPin, Globe } from "lucide-react";
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';


const formatDate = (date: any) => {
  if (!date) return "N/A";
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(new Date(date));
};

export default async function OffersPage() {


  const offers = await prisma.offer.findMany({
    where: {
      OR: [
        { status: "Active" },
        { status: "Published" }
      ]
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow bg-[#f2f4f8] py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8 border-b border-gray-300 pb-4">
            <h1 className="text-2xl font-bold text-[#081621]">All Offers</h1>
            <span className="text-sm font-medium text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm">
              {offers.length} Offers Available
            </span>
          </div>

          {offers.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-2xl shadow-sm border border-dashed border-gray-300">
              <div className="text-gray-400 mb-2 font-medium">No active offers found.</div>
              <p className="text-sm text-gray-400">Please check back later for new updates.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {offers.map((offer) => (
                <div
                  key={offer.id}
                  className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full border border-gray-100 overflow-hidden"
                >

                  <div className="relative h-56 w-full overflow-hidden">
                    <Image
                      src={offer.imageUrl || "https://via.placeholder.com/400x250"}
                      alt={offer.mainTitle}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[11px] font-bold text-[#ef4a23] shadow-sm uppercase tracking-wider">
                      Limited Time
                    </div>
                  </div>


                  <div className="p-6 flex flex-col flex-grow">

                    <div className="flex items-center justify-between text-[12px] text-slate-600 mb-5 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-[#ef4a23]" />
                        <span className="font-semibold">{formatDate(offer.startDate)} - {formatDate(offer.endDate)}</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-2 py-0.5 bg-white rounded-md border border-slate-200">
                        {offer.availability === "Online" ? (
                          <Globe size={13} className="text-blue-500" />
                        ) : (
                          <MapPin size={13} className="text-green-500" />
                        )}
                        <span className="font-bold text-slate-700">{offer.availability}</span>
                      </div>
                    </div>


                    <div className="flex-grow mb-6">
                      <h3 className="text-lg font-black text-[#081621] leading-tight mb-2 group-hover:text-[#ef4a23] transition-colors">
                        {offer.mainTitle}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                        {offer.subHeadline}
                      </p>
                    </div>


                    <Link
                      href={`/offers/${offer.id}`}
                      className="w-full flex items-center justify-center gap-2 bg-[#081621] text-white py-3 rounded-xl font-bold hover:bg-[#ef4a23] transition-all active:scale-95 shadow-md shadow-gray-200"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}