'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroBanner from '@/components/Home/HeroBanner';
import NewsTicker from '@/components/Home/NewsTicker';
import ServiceGrid from '@/components/Home/ServiceGrid';
import FeaturedProducts from '@/components/Home/FeaturedProducts';
import PCBuilderCTA from '@/components/Home/PCBuilderCTA';
import FeaturedCategories from '@/components/Home/FeaturedCategories';
import NewsArchivePage from '@/components/Home/NewsTicker';


export default function HomePage() {
  
  return (
    <div className="min-h-screen bg-slate-50 text-foreground">
      <Navbar />
      <main>
        <HeroBanner />
        {/* <NewsTicker />/ */}
        <NewsArchivePage></NewsArchivePage>
        <ServiceGrid />
        <FeaturedCategories />
        <FeaturedProducts />
        <PCBuilderCTA />
      </main>
      <Footer />
    </div>
  );
}