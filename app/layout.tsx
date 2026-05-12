import './globals.css';
import { Toaster } from 'sonner';
import { Metadata } from 'next';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'NextShop - Global Ecommerce Marketplace',
  description: 'Shop premium products from China to Bangladesh and worldwide. Fast delivery, secure payments, quality guaranteed.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {/* //<Navbar>></Navbar> */}
        {children}
        {/* <Toaster position="top-right" richColors /> */}
        <Toaster position="bottom-right" richColors />

      </body>
    </html>
  );
}



