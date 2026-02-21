export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice: number;
  discount: number;
  category: string;
  description: string;
  images: string[];
  stock: number;
  rating: number;
  reviews: number;
  features: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  count: number;
}

export const sampleProducts: Product[] = [
  {
    id: "1",
    name: "Wireless Earbuds Pro",
    slug: "wireless-earbuds-pro",
    price: 79.99,
    originalPrice: 129.99,
    discount: 38,
    category: "Electronics",
    description:
      "Premium wireless earbuds with active noise cancellation and 30-hour battery life. Crystal clear sound quality with deep bass.",
    images: [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&h=800&fit=crop",
    ],
    stock: 150,
    rating: 4.5,
    reviews: 328,
    features: [
      "Active Noise Cancellation",
      "30hrs Battery",
      "Wireless Charging",
      "IPX7 Waterproof",
    ],
  },
  {
    id: "2",
    name: "Smart Watch Ultra",
    slug: "smart-watch-ultra",
    price: 299.99,
    originalPrice: 399.99,
    discount: 25,
    category: "Electronics",
    description:
      "Advanced fitness tracking, heart rate monitoring, and seamless smartphone integration. Perfect for active lifestyles.",
    images: [
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1544117519-31a4b719223d?w=800&h=800&fit=crop",
    ],
    stock: 85,
    rating: 4.7,
    reviews: 512,
    features: [
      "Heart Rate Monitor",
      "GPS Tracking",
      "7-Day Battery",
      "Water Resistant",
    ],
  },
  {
    id: "3",
    name: "Laptop Stand Aluminum",
    slug: "laptop-stand-aluminum",
    price: 49.99,
    originalPrice: 69.99,
    discount: 29,
    category: "Accessories",
    description:
      "Ergonomic aluminum laptop stand with adjustable height and angle. Improves posture and reduces neck strain.",
    images: [
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1593642532400-2682810df593?w=800&h=800&fit=crop",
    ],
    stock: 200,
    rating: 4.3,
    reviews: 189,
    features: [
      "Adjustable Height",
      "Aluminum Build",
      "Heat Dissipation",
      "Foldable Design",
    ],
  },
  {
    id: "4",
    name: "USB-C Hub 7-in-1",
    slug: "usb-c-hub-7-in-1",
    price: 39.99,
    originalPrice: 59.99,
    discount: 33,
    category: "Accessories",
    description:
      "7-in-1 USB-C hub with HDMI, USB 3.0, SD card reader, and more. Essential for modern laptops.",
    images: [
      "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1572297794098-3b0513eb4963?w=800&h=800&fit=crop",
    ],
    stock: 350,
    rating: 4.6,
    reviews: 421,
    features: ["7 Ports", "4K HDMI", "Fast Charging", "Compact Design"],
  },
  {
    id: "5",
    name: "Mechanical Keyboard RGB",
    slug: "mechanical-keyboard-rgb",
    price: 89.99,
    originalPrice: 129.99,
    discount: 31,
    category: "Electronics",
    description:
      "Premium mechanical gaming keyboard with customizable RGB lighting and tactile switches.",
    images: [
      "https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&h=800&fit=crop",
    ],
    stock: 120,
    rating: 4.8,
    reviews: 654,
    features: [
      "RGB Lighting",
      "Mechanical Switches",
      "Anti-Ghosting",
      "Aluminum Frame",
    ],
  },
  {
    id: "6",
    name: "Wireless Mouse Ergonomic",
    slug: "wireless-mouse-ergonomic",
    price: 29.99,
    originalPrice: 44.99,
    discount: 33,
    category: "Accessories",
    description:
      "Ergonomic wireless mouse with precision tracking and comfortable grip for all-day use.",
    images: [
      "https://images.unsplash.com/photo-1527814050087-3793815479db?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&h=800&fit=crop",
    ],
    stock: 280,
    rating: 4.4,
    reviews: 298,
    features: ["Ergonomic Design", "Wireless", "6 Buttons", "18-Month Battery"],
  },
  {
    id: "7",
    name: "Phone Case Premium Leather",
    slug: "phone-case-premium-leather",
    price: 24.99,
    originalPrice: 39.99,
    discount: 37,
    category: "Accessories",
    description:
      "Genuine leather phone case with card slots and magnetic closure. Elegant and protective.",
    images: [
      "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800&h=800&fit=crop",
    ],
    stock: 450,
    rating: 4.5,
    reviews: 512,
    features: [
      "Genuine Leather",
      "Card Slots",
      "Magnetic Closure",
      "Slim Design",
    ],
  },
  {
    id: "8",
    name: "Portable SSD 1TB",
    slug: "portable-ssd-1tb",
    price: 119.99,
    originalPrice: 179.99,
    discount: 33,
    category: "Electronics",
    description:
      "Ultra-fast portable SSD with 1TB storage. USB-C 3.2 Gen 2 for blazing fast transfers.",
    images: [
      "https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&h=800&fit=crop",
    ],
    stock: 95,
    rating: 4.9,
    reviews: 721,
    features: ["1TB Storage", "1050MB/s Speed", "USB-C 3.2", "Shock Resistant"],
  },
];

export const categories: Category[] = [
  { id: "1", name: "Electronics", slug: "electronics", count: 128 },
  { id: "2", name: "Accessories", slug: "accessories", count: 245 },
  { id: "3", name: "Fashion", slug: "fashion", count: 189 },
  { id: "4", name: "Home & Living", slug: "home-living", count: 156 },
  { id: "5", name: "Sports", slug: "sports", count: 98 },
];
