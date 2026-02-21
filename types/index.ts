export type Category =
  | "Processor"
  | "Motherboard"
  | "RAM"
  | "Storage"
  | "Graphics Card"
  | "Power Supply"
  | "Casing"
  | "CPU Cooler"
  | "Monitor"
  | "Others";

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  category: Category | string;
  description: string;
  image?: string;
  images?: string[];
  stock?: number;
  rating?: number;
  reviews?: number;
  features?: string[];
  status?: "In Stock" | "Out of Stock";
  averageRating?: number;
  keyFeatures?: string[];
  // PC Builder specific fields
  compatibility?: {
    socket?: string;
    formFactor?: string;
    ramType?: string;
    wattage?: number;
  };
}

export interface Review {
  id: string;
  userId: string;
  username: string;
  rating: number;
  comment: string;
  date: string;
}

export interface PCBuildComponent {
  category: Category;
  selectedProduct: Product | null;
  isRequired: boolean;
}

export interface PCBuild {
  components: Record<Category, PCBuildComponent>;
  totalPrice: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  shippingAddress: {
    address: string;
    city: string;
    zipCode: string;
  };
  paymentMethod: string;
  subtotal: number;
  shipping: number;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed";
  createdAt: string;
  paidAt?: string;
  paymentId?: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  role: "user" | "admin";
}

export interface APIResponse<T> {
  data?: T;
  error?: string;
  loading: boolean;
}
