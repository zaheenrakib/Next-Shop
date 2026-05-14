import React from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const ContactPage = () => {
  return (
    <div className="bg-white min-h-screen font-sans">
      
      {/* Header Section */}
      <section className="bg-zinc-950 py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="text-[#FF5722] text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">
            Contact Us
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter mb-6">
            Get in <span className="text-[#FF5722]">Touch</span>
          </h1>
          <p className="text-zinc-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Have a question about a product or an order? Our team is here to help you 24/7. Reach out and we'll get back to you as soon as possible.
          </p>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="max-w-7xl mx-auto px-6 -mt-12 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Side: Contact Information */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white border border-zinc-100 p-8 rounded-[2rem] shadow-xl shadow-zinc-100/50">
              <h3 className="text-xl font-black uppercase italic tracking-tight mb-8">Information</h3>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-orange-50 text-[#FF5722] rounded-xl flex items-center justify-center shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Email Address</p>
                    <p className="text-sm font-semibold text-zinc-900">support@nextshop.com</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-zinc-900 text-white rounded-xl flex items-center justify-center shrink-0">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Phone Number</p>
                    <p className="text-sm font-semibold text-zinc-900">+880 1234 567 890</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-zinc-50 text-zinc-400 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Our Location</p>
                    <p className="text-sm font-semibold text-zinc-900">Banani, Dhaka, Bangladesh</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-zinc-50 text-zinc-400 rounded-xl flex items-center justify-center shrink-0">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Working Hours</p>
                    <p className="text-sm font-semibold text-zinc-900">Sat - Thu: 10AM - 8PM</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="mt-12 pt-8 border-t border-zinc-100">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4 text-center">Follow Our Journey</p>
                <div className="flex justify-center gap-3">
                  {[Facebook, Instagram, Twitter, Linkedin].map((Icon, i) => (
                    <button key={i} className="p-3 bg-zinc-50 rounded-full hover:bg-[#FF5722] hover:text-white transition-all">
                      <Icon size={18} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-zinc-100 p-8 md:p-12 rounded-[2rem] shadow-xl shadow-zinc-100/50">
              <div className="flex items-center gap-3 mb-8">
                <MessageSquare className="text-[#FF5722]" size={28} />
                <h2 className="text-2xl font-black uppercase italic tracking-tighter">Send us a Message</h2>
              </div>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Full Name</label>
                    <input 
                      type="text" 
                      placeholder="John Doe"
                      className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5722]/20 focus:border-[#FF5722] transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Email Address</label>
                    <input 
                      type="email" 
                      placeholder="john@example.com"
                      className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5722]/20 focus:border-[#FF5722] transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Subject</label>
                  <select className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5722]/20 focus:border-[#FF5722] transition-all appearance-none">
                    <option>General Inquiry</option>
                    <option>Order Support</option>
                    <option>Returns & Refunds</option>
                    <option>Business Collaboration</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Your Message</label>
                  <textarea 
                    rows={5} 
                    placeholder="How can we help you today?"
                    className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5722]/20 focus:border-[#FF5722] transition-all resize-none"
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-zinc-900 text-white font-black uppercase text-xs tracking-[0.2em] py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-[#FF5722] hover:shadow-lg hover:shadow-orange-200 transition-all active:scale-95"
                >
                  Send Message <Send size={16} />
                </button>
              </form>
            </div>
          </div>

        </div>
      </section>

      {/* Mini Map Placeholder */}
      <section className="px-6 pb-24 max-w-7xl mx-auto">
        <div className="w-full h-[400px] bg-zinc-100 rounded-[3rem] overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 border border-zinc-100 flex items-center justify-center relative">
           <div className="absolute inset-0 bg-zinc-900/5"></div>
           <div className="relative z-10 text-center">
             <MapPin size={48} className="text-[#FF5722] mx-auto mb-4" />
             <p className="font-bold text-zinc-400 uppercase tracking-widest text-xs">Interactive Map Integration Here</p>
           </div>
        </div>
      </section>

    </div>
  );
};

export default ContactPage;