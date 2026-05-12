import Link from 'next/link';
import { Laptop, MessageSquare, Home, Settings } from 'lucide-react';

const services = [
  { icon: Laptop, title: "Laptop Finder", desc: "Find Your Laptop Easily", color: "bg-orange-500", href: "/findLaptop" },
  { icon: MessageSquare, title: "Raise a Complain", desc: "Share your experience", color: "bg-red-500", href: "/feedback" },
  { icon: Home, title: "Home Service", desc: "Get expert help", color: "bg-red-600", href: "/services/home" },
  { icon: Settings, title: "Servicing Center", desc: "Repair Your Device", color: "bg-orange-600", href: "/services/repair" }
];

export default function ServiceGrid() {
  return (
    <section className="container mx-auto px-4 mb-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {services.map((item, i) => (
          <Link href={item.href} key={i}>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 group hover:shadow-md transition-all active:scale-95">
              <div className={`w-12 h-12 ${item.color} rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                <item.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-slate-800 text-sm uppercase italic">{item.title}</h3>
                <p className="text-[11px] text-gray-500 font-medium">{item.desc}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}