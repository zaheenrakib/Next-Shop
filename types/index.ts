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
  category: Category | string;
  price: number;
  image: string;
  slug: string;
  description: string;
  status: "In Stock" | "Out of Stock";
  averageRating: number;
  reviews?: Review[];
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

export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

export interface APIResponse<T> {
  data?: T;
  error?: string;
  loading: boolean;
}
