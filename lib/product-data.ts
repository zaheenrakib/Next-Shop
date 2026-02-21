import { Product, Category } from "../types";

export const categories: Category[] = [
  "Processor",
  "Motherboard",
  "RAM",
  "Storage",
  "Graphics Card",
  "Power Supply",
  "Casing",
  "CPU Cooler",
  "Monitor",
];

export const sampleProducts: Product[] = [
  // Processors
  {
    id: "p1",
    name: "Intel Core i9-14900K 14th Gen Processor",
    category: "Processor",
    price: 58500,
    image:
      "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400&h=400&fit=crop",
    slug: "intel-core-i9-14900k",
    description:
      "The Intel Core i9-14900K is a high-performance 24-core processor for the most demanding tasks.",
    status: "In Stock",
    averageRating: 4.9,
    keyFeatures: [
      "24 Cores / 32 Threads",
      "Up to 6.0 GHz Max Turbo Frequency",
      "LGA 1700 Socket",
    ],
    compatibility: { socket: "LGA 1700" },
  },
  {
    id: "p2",
    name: "AMD Ryzen 9 7950X Desktop Processor",
    category: "Processor",
    price: 54000,
    image:
      "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400&h=400&fit=crop", // Placeholder
    slug: "amd-ryzen-9-7950x",
    description:
      "Unleash the speed with AMD Ryzen 9 7950X, featuring 16 cores and 32 threads.",
    status: "In Stock",
    averageRating: 4.8,
    keyFeatures: ["16 Cores / 32 Threads", "Zen 4 Architecture", "AM5 Socket"],
    compatibility: { socket: "AM5" },
  },
  // Motherboards
  {
    id: "m1",
    name: "ASUS ROG MAXIMUS Z790 HERO Motherboard",
    category: "Motherboard",
    price: 68000,
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop",
    slug: "asus-rog-maximus-z790",
    description:
      "Premium Z790 motherboard with robust power delivery and connectivity.",
    status: "In Stock",
    averageRating: 4.7,
    keyFeatures: ["LGA 1700 Socket", "DDR5 Support", "PCIe 5.0"],
    compatibility: { socket: "LGA 1700", ramType: "DDR5" },
  },
  {
    id: "m2",
    name: "MSI MAG B650 TOMAHAWK WIFI Motherboard",
    category: "Motherboard",
    price: 24500,
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop",
    slug: "msi-mag-b650-tomahawk",
    description: "Reliable B650 motherboard for AM5 processors.",
    status: "In Stock",
    averageRating: 4.6,
    keyFeatures: ["AM5 Socket", "DDR5 Memory Support", "Built-in WiFi 6E"],
    compatibility: { socket: "AM5", ramType: "DDR5" },
  },
  // RAM
  {
    id: "r1",
    name: "Corsair Vengeance RGB 32GB (2x16GB) DDR5 6000MHz",
    category: "RAM",
    price: 12500,
    image:
      "https://images.unsplash.com/photo-1541029071515-84cc54f84dc5?w=400&h=400&fit=crop",
    slug: "corsair-vengeance-32gb-ddr5",
    description: "High-speed DDR5 memory with dynamic RGB lighting.",
    status: "In Stock",
    averageRating: 4.9,
    keyFeatures: ["32GB Capacity", "6000MHz Speed", "iCUE Compatible"],
    compatibility: { ramType: "DDR5" },
  },
  // GPUs
  {
    id: "g1",
    name: "NVIDIA GeForce RTX 4090 24GB Graphics Card",
    category: "Graphics Card",
    price: 215000,
    image:
      "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400&h=400&fit=crop",
    slug: "nvidia-rtx-4090",
    description: "The ultimate graphics card for gaming and content creation.",
    status: "In Stock",
    averageRating: 5.0,
    keyFeatures: ["24GB GDDR6X", "DLSS 3.0", "Ada Lovelace Architecture"],
    compatibility: { wattage: 850 },
  },
  // PSUs
  {
    id: "ps1",
    name: "Corsair RM1000x 1000W 80 Plus Gold Modular PSU",
    category: "Power Supply",
    price: 18500,
    image:
      "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&h=400&fit=crop",
    slug: "corsair-rm1000x",
    description: "High-efficiency 1000W power supply for enthusiast builds.",
    status: "In Stock",
    averageRating: 4.8,
    keyFeatures: ["1000W Output", "80 Plus Gold Certified", "Fully Modular"],
    compatibility: { wattage: 1000 },
  },
];
