"use client";
import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, Navigation } from 'swiper/modules';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton'; // ডাটা লোড হওয়ার সময় দেখানোর জন্য
import Link from 'next/link';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export default function HeroBanner() {
  const [sliders, setSliders] = useState<any[]>([]);
  const [sidebars, setSidebars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {

        const [sliderRes, sidebarRes] = await Promise.all([
          fetch('/api/hero/slider'),
          fetch('/api/hero/side-bar')
        ]);

        const sliderData = await sliderRes.json();
        const sidebarData = await sidebarRes.json();


        setSliders(Array.isArray(sliderData) ? sliderData.filter((s: any) => s.isActive !== false) : []);
        setSidebars(Array.isArray(sidebarData) ? sidebarData.filter((s: any) => s.isActive !== false) : []);
      } catch (err) {
        console.error("Hero data fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroData();
  }, []);

  if (loading) {
    return (
      <section className="container mx-auto px-4 py-6 mt-12">
        <div className="flex flex-col lg:flex-row gap-5">
          <Skeleton className="lg:w-3/4 w-full h-[250px] md:h-[450px] rounded-2xl" />
          <div className="lg:w-1/4 w-full flex flex-col gap-3">
            <Skeleton className="h-[220px] rounded-3xl" />
            <Skeleton className="h-[220px] rounded-3xl" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-6 mt-12">
      <div className="flex flex-col lg:flex-row gap-5">


        <div className="lg:w-3/4 w-full h-[250px] md:h-[450px] rounded-2xl overflow-hidden shadow-sm border border-gray-100 relative group">
          {sliders.length > 0 ? (
            <Swiper
              modules={[Pagination, Autoplay, Navigation]}
              pagination={{ clickable: true }}
              autoplay={{ delay: 5000 }}
              loop={sliders.length > 1}
              className="w-full h-full"
            >
              {sliders.map((slide) => (
                <SwiperSlide key={slide.id}>
                  <div className="relative w-full h-full">
                    <img src={slide.imageUrl} alt={slide.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center px-12">
                      <div className="max-w-md text-white space-y-4">
                        <Badge className="bg-[#FF4D30] hover:bg-[#FF4D30] border-none text-xs font-bold px-3">
                          Exclusive Offer
                        </Badge>
                        <h2 className="text-3xl md:text-5xl font-black leading-tight italic uppercase">
                          {slide.title}
                        </h2>
                        <p className="text-sm md:text-base text-gray-200 font-medium">
                          {slide.subtitle}
                        </p>
                        {slide.buttonLink && (
                          <Link href={slide.buttonLink}>
                            <Button size="lg" className="bg-[#FF4D30] hover:bg-[#E6442B] border-none font-bold rounded-lg px-8 uppercase italic tracking-widest">
                              Shop Now
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">No Sliders Found</div>
          )}
        </div>


        <div className="lg:w-1/4 w-full flex flex-col gap-3">
          {sidebars.slice(0, 2).map((promo) => (
            <Link
              key={promo.id}
              href={promo.targetUrl || "#"}
              className="flex-1 rounded-3xl overflow-hidden border border-gray-100 transition-transform hover:scale-[1.02] duration-300 relative group"
            >
              <img
                src={promo.imageUrl}
                className="w-full h-full object-cover"
                alt="Promotion"
              />
              <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
            </Link>
          ))}


          {sidebars.length === 0 && (
            <div className="flex-1 rounded-3xl bg-gray-50 border border-dashed border-gray-200 flex items-center justify-center text-gray-300 text-xs">
              Ad Space Available
            </div>
          )}
        </div>

      </div>
    </section>
  );
}