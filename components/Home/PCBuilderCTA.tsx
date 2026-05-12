"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function PCBuilderCTA() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        {/* NextShop Premium Dark Theme Container */}
        <div className="bg-[#081621] p-12 md:p-20 rounded-[3rem] text-center relative overflow-hidden shadow-2xl">
          
          {/* Glowing Background Effect - Your Brand Color */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#FF4D30]/20 rounded-full blur-[100px] -z-0" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FF4D30]/10 rounded-full blur-[80px] -z-0" />
          
          <div className="relative z-10 space-y-8">
            <h2 className="text-4xl md:text-6xl font-black text-white leading-tight italic uppercase tracking-tighter">
              BUILD YOUR <span className="text-[#FF4D30] underline underline-offset-[12px] decoration-8">LEGACY</span> RIG
            </h2>
            
            <p className="text-slate-400 max-w-2xl mx-auto text-lg font-medium">
              Use our professional PC Builder tool to assemble your dream setup with real-time compatibility checks and expert guidance.
            </p>
            
            <Link href="/pc-builder">
              <Button 
                size="lg" 
                className="h-16 px-12 rounded-2xl bg-[#FF4D30] hover:bg-[#E6442B] text-white text-xl font-black shadow-[0_15px_40px_-10px_rgba(255,77,48,0.5)] uppercase italic tracking-widest border-none transition-all active:scale-95"
              >
                Start Building Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}