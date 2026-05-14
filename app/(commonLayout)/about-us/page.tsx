import React from 'react';
import { ShoppingBag, ShieldCheck, Truck, Zap, Users, Star, ArrowRight, Globe, Award } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="bg-white min-h-screen font-sans text-zinc-900">
      
      {/* Hero Section: Minimal & Bold */}
      <section className="relative py-24 md:py-32 overflow-hidden bg-zinc-950 text-white">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center text-center">
            <span className="px-4 py-1.5 rounded-full border border-zinc-700 text-[10px] font-black uppercase tracking-[0.3em] text-[#FF5722] mb-6">
              Since 2024
            </span>
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.9]">
              Elevating the <br />
              <span className="text-[#FF5722]">Standard</span> of Retail
            </h1>
            <p className="mt-8 text-zinc-400 max-w-xl text-sm md:text-base font-medium leading-relaxed">
              Next-Shop is more than just a marketplace. We are a bridge between quality craftsmanship and modern consumers, delivering excellence to your doorstep.
            </p>
          </div>
        </div>
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-transparent to-transparent opacity-50"></div>
      </section>

      {/* Stats Section: Modern Grid */}
      <section className="relative -mt-12 z-20 max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-0 bg-white border border-zinc-100 shadow-2xl rounded-[2rem] overflow-hidden divide-x divide-zinc-50">
          {[
            { label: 'Active Users', value: '50K+', icon: <Users size={16}/> },
            { label: 'Order Delivered', value: '120K+', icon: <Truck size={16}/> },
            { label: 'Global Brands', value: '85+', icon: <Globe size={16}/> },
            { label: 'Top Ratings', value: '4.9/5', icon: <Star size={16}/> },
          ].map((stat, i) => (
            <div key={i} className="p-8 flex flex-col items-center group hover:bg-zinc-50 transition-colors">
              <div className="text-[#FF5722] mb-3 group-hover:scale-110 transition-transform">{stat.icon}</div>
              <div className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tighter">{stat.value}</div>
              <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Core Values: Card Layout */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-start gap-16">
          <div className="lg:w-1/3 sticky top-24">
            <h2 className="text-4xl font-black text-zinc-900 tracking-tighter uppercase italic leading-none mb-6">
              Why <span className="text-[#FF5722]">Choose</span> Us?
            </h2>
            <p className="text-zinc-500 text-sm leading-relaxed mb-8">
              We focus on the intersection of technology and human connection to provide a seamless shopping experience that actually matters.
            </p>
            <button className="flex items-center gap-2 group text-xs font-black uppercase tracking-widest text-zinc-900">
              Read Our Manifesto <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform text-[#FF5722]" />
            </button>
          </div>

          <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: <ShieldCheck />, title: 'Guaranteed Authenticity', desc: 'Every product in our store undergoes a rigorous 5-step quality check.' },
              { icon: <Zap />, title: 'Hyper-Fast Logistics', desc: 'Our smart routing technology ensures your package arrives in record time.' },
              { icon: <Award />, title: 'Premium Curation', desc: 'We only partner with brands that align with our high standards of quality.' },
              { icon: <ShoppingBag />, title: 'Seamless Checkout', desc: 'Experience the world’s most intuitive and secure payment infrastructure.' },
            ].map((item, i) => (
              <div key={i} className="p-8 border border-zinc-100 rounded-3xl hover:shadow-xl hover:shadow-zinc-100 transition-all group">
                <div className="mb-6 p-3 bg-zinc-50 w-fit rounded-2xl group-hover:bg-zinc-900 group-hover:text-white transition-all">
                  {React.cloneElement(item.icon as React.ReactElement, { size: 24 })}
                </div>
                <h3 className="font-bold text-zinc-900 text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision: Black Box Design */}
      <section className="px-6 pb-24">
        <div className="max-w-7xl mx-auto bg-zinc-900 rounded-[3rem] p-12 md:p-24 relative overflow-hidden text-center">
          <div className="relative z-10 max-w-3xl mx-auto space-y-8">
            <div className="inline-block p-4 rounded-full bg-zinc-800 text-[#FF5722] mb-4">
              <Star size={32} fill="#FF5722" />
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter">
              Our Vision
            </h2>
            <p className="text-lg md:text-2xl text-zinc-300 font-medium leading-tight">
              "To become the world's most customer-centric ecosystem where everyone can discover anything they might want to buy online with total confidence."
            </p>
            <div className="pt-8">
              <button className="bg-[#FF5722] text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-orange-900/20">
                Join the Community
              </button>
            </div>
          </div>
          {/* Subtle Background Accent */}
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#FF5722] opacity-20 blur-[120px]"></div>
        </div>
      </section>

    </div>
  );
};

export default AboutPage;