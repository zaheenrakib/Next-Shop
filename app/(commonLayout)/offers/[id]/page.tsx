import React from 'react';
import prisma from "@/lib/prisma";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  Calendar,
  Globe,
  MapPin,
  Tag,
  Truck,
  CreditCard,
  Info,
  BadgePercent
} from "lucide-react";
import Link from 'next/link';
import Navbar from '@/components/Navbar';


const formatDate = (date: string | Date) => {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(new Date(date));
};

export default async function OfferDetail({ params }: { params: { id: string } }) {

  const offer = await prisma.offer.findUnique({
    where: { id: params.id }
  });

  if (!offer) {
    return notFound();
  }


  const rewards = offer.rewards as any;
  const terms = offer.termsAndConditions as string[];

  return (
    <div>
      <Navbar></Navbar>
      <div className="bg-[#f2f4f8] min-h-screen py-8 px-4">
        <div className="max-w-5xl mx-auto">


          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">


            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-10 border-b border-gray-100">
              <div className="relative h-[300px] md:h-[400px] w-full rounded-lg overflow-hidden shadow-inner bg-gray-50">
                <Image
                  src={offer.imageUrl || ""}
                  alt={offer.mainTitle}
                  fill
                  className="object-contain p-4"
                  priority
                />
              </div>

              <div className="flex flex-col justify-center">
                <h1 className="text-2xl md:text-3xl font-bold text-[#081621] mb-2">
                  {offer.mainTitle}
                </h1>
                <p className="text-gray-600 text-lg mb-6 italic">
                  {offer.subHeadline}
                </p>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gray-700 bg-blue-50 p-3 rounded-lg">
                    <Calendar className="text-[#3749bb]" size={20} />
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold">Offer Validity</p>
                      <p className="font-semibold">{formatDate(offer.startDate)} - {formatDate(offer.endDate)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-gray-700 bg-orange-50 p-3 rounded-lg">
                    {offer.availability === "Online" ? <Globe className="text-orange-600" size={20} /> : <MapPin className="text-orange-600" size={20} />}
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold">Availability</p>
                      <p className="font-semibold">{offer.availability}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>


            <div className="p-6 md:p-10 grid grid-cols-1 md:grid-cols-3 gap-8">


              <div className="md:col-span-2 space-y-8">
                <div>
                  <h2 className="text-xl font-bold text-[#081621] mb-4 flex items-center gap-2">
                    <BadgePercent className="text-[#3749bb]" /> Offer Rewards
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {rewards?.couponCode && (
                      <div className="border border-dashed border-[#3749bb] bg-blue-50/50 p-4 rounded-lg flex flex-col items-center justify-center">
                        <span className="text-xs text-gray-500 font-bold uppercase mb-1">Coupon Code</span>
                        <span className="text-xl font-mono font-bold text-[#3749bb]">{rewards.couponCode}</span>
                      </div>
                    )}
                    {rewards?.maxCashback && (
                      <div className="bg-green-50 p-4 rounded-lg flex items-center gap-4">
                        <div className="bg-green-500 p-2 rounded-full text-white"><CreditCard size={18} /></div>
                        <div>
                          <p className="text-xs text-gray-500 font-bold uppercase">Max Cashback</p>
                          <p className="font-bold text-gray-800">৳ {rewards.maxCashback}</p>
                        </div>
                      </div>
                    )}
                    {rewards?.shippingDeal && (
                      <div className="bg-purple-50 p-4 rounded-lg flex items-center gap-4">
                        <div className="bg-purple-500 p-2 rounded-full text-white"><Truck size={18} /></div>
                        <div>
                          <p className="text-xs text-gray-500 font-bold uppercase">Shipping</p>
                          <p className="font-bold text-gray-800">{rewards.shippingDeal}</p>
                        </div>
                      </div>
                    )}
                    {rewards?.emiAdvantage && (
                      <div className="bg-yellow-50 p-4 rounded-lg flex items-center gap-4">
                        <div className="bg-yellow-600 p-2 rounded-full text-white"><Tag size={18} /></div>
                        <div>
                          <p className="text-xs text-gray-500 font-bold uppercase">EMI Benefit</p>
                          <p className="font-bold text-gray-800">{rewards.emiAdvantage}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>


                <div>
                  <h2 className="text-xl font-bold text-[#081621] mb-4 flex items-center gap-2">
                    <Info className="text-[#3749bb]" /> Terms & Conditions
                  </h2>
                  <ul className="space-y-3">
                    {terms?.map((term, index) => (
                      <li key={index} className="flex gap-3 text-gray-700 text-sm leading-relaxed">
                        <span className="min-w-[20px] h-[20px] bg-gray-200 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5">
                          {index + 1}
                        </span>
                        {term}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>


              <div className="bg-gray-50 p-6 rounded-xl h-fit border border-gray-200">
                <h3 className="font-bold text-[#081621] mb-4 border-b pb-2">Quick Summary</h3>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status</span>
                    <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold uppercase">
                      {offer.status}
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-3">
                    <span className="text-gray-500">Offer ID</span>
                    <span className="font-mono font-medium text-gray-800">#{offer.id.slice(-6).toUpperCase()}</span>
                  </div>
                </div>
                <button className="w-full mt-8 bg-[#3749bb] text-white py-3 rounded-lg font-bold hover:bg-[#2c3a96] transition-all shadow-lg shadow-blue-200">
                  <Link href={'/products'} >
                    Shop Now
                  </Link>
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}