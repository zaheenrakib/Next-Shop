'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DashboardSidebar from './DashboardSidebar';

export default function DashboardLayout({ 
  children, 
  user, 
  onLogout 
}: { 
  children: React.ReactNode; 
  user: any; 
  onLogout: () => void 
}) {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar cartCount={0} />
      
      <main className="container mx-auto px-4 pt-32 pb-20">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - fixed width on desktop */}
          <aside className="w-full lg:w-80 flex-shrink-0">
            <DashboardSidebar user={user} onLogout={onLogout} />
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {children}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
