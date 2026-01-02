import './globals.css';
import { Toaster } from 'sonner';

export const metadata = {
  title: 'NextBazaar - Global Ecommerce Marketplace',
  description: 'Shop premium products from China to Bangladesh and worldwide. Fast delivery, secure payments, quality guaranteed.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
