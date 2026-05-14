"use client";
import React, { useState, useEffect } from "react";
import { Zap, Loader2 } from "lucide-react";

export default function NewsTicker() {
  const [newsList, setNewsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch("/api/news");
        const data = await res.json();
        if (Array.isArray(data)) {
          setNewsList(data.filter((item: any) => item.isActive !== false));
        }
      } catch (error) {
        console.error("Ticker fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 mb-6 mt-4">
        <div className="h-12 w-full bg-gray-100 animate-pulse rounded-2xl md:rounded-full border border-gray-200"></div>
      </div>
    );
  }

  return (
    <section className="container mx-auto px-4 mb-6 mt-4 select-none">
      <div className="bg-white rounded-2xl md:rounded-full shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-slate-100 flex items-center overflow-hidden h-14 md:h-12 group">


        <div className="bg-[#FF4D30] text-white px-4 md:px-6 h-full flex items-center gap-2 z-10 relative">
          <Zap size={14} className="fill-white animate-pulse" />
          <span className="text-[10px] md:text-[11px] font-black uppercase tracking-tighter md:tracking-widest whitespace-nowrap">
            Updates
          </span>

          <div className="absolute -right-3 top-0 bottom-0 w-4 bg-[#FF4D30] skew-x-[20deg] hidden md:block"></div>
        </div>


        <div className="flex-grow overflow-hidden px-4 md:px-8">
          <div className="animate-marquee whitespace-nowrap flex items-center gap-12 hover:[animation-play-state:paused] cursor-pointer transition-all">
            {newsList.length > 0 ? (
              newsList.map((news, idx) => (
                <div key={idx} className="flex items-center gap-2">

                  <span className="text-sm font-black text-[#FF4D30] uppercase tracking-tight">
                    {news.title}
                  </span>


                  <span className="text-slate-300 font-light">|</span>


                  <span className="text-sm font-medium text-slate-600">
                    {news.description}
                  </span>


                  {idx !== newsList.length - 1 && (
                    <span className="ml-8 w-1.5 h-1.5 bg-slate-200 rounded-full"></span>
                  )}
                </div>
              ))
            ) : (
              <span className="text-sm font-medium text-slate-500">
                Welcome to our tech store! Check out our latest arrivals and exclusive offers.
              </span>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}