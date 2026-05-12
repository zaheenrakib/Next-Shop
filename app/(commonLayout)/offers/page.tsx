import React from 'react';
import prisma from "@/lib/prisma";
import Image from "next/image";
import { Calendar, MapPin, Globe, ArrowRight } from "lucide-react";
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Helper function for date formatting
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(new Date(date));
};

export default async function OffersPage() {
  // Fetching data from Prisma
  const offers = await prisma.offer.findMany({
    where: { status: "Published" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <Navbar></Navbar>
      <div className="bg-[#f2f4f8] min-h-screen py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-[#081621] mb-8 border-b border-gray-300 pb-4">
            All Offers
          </h1>

          {offers.length === 0 ? (
            <div className="text-center py-20 text-gray-500">No active offers found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {offers.map((offer) => (
                <div
                  key={offer.id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col h-full border border-gray-100"
                >
                  {/* Image Section */}
                  <div className="relative h-64 w-full overflow-hidden rounded-t-lg">
                    <Image
                      src={offer.imageUrl || "https://via.placeholder.com/400"}
                      alt={offer.mainTitle}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Info Section */}
                  <div className="p-5 flex flex-col flex-grow">
                    {/* Validity & Store Type */}
                    <div className="flex items-center justify-between text-[13px] text-gray-600 mb-4 bg-gray-50 p-2 rounded-md">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Calendar size={14} className="text-[#ef4a23]" />
                        <span>{formatDate(offer.startDate)} - {formatDate(offer.endDate)}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-medium">
                        {offer.availability === "Online" ? (
                          <Globe size={14} className="text-[#ef4a23]" />
                        ) : (
                          <MapPin size={14} className="text-[#ef4a23]" />
                        )}
                        <span>{offer.availability}</span>
                      </div>
                    </div>

                    {/* Title & Subtitle */}
                    <div className="flex-grow text-center mb-6">
                      <h3 className="text-lg font-bold text-[#081621] leading-tight mb-2 hover:text-[#ef4a23] cursor-pointer">
                        {offer.mainTitle}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2 italic">
                        {offer.subHeadline}
                      </p>
                    </div>

                    {/* Action Button */}
                    <div className="mt-auto">
                      <Link
                        href={`/offers/${offer.id}`}
                        className="w-full flex items-center justify-center gap-2 bg-[#ef4a23] text-white py-2.5 rounded-md font-semibold hover:bg-[#2c3a96] transition-colors"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
}