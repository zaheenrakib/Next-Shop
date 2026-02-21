import { Product, Category } from "../types";
import { sampleProducts } from "../lib/product-data";

// Simulate an API call with latency
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const productService = {
  // Get all products or filter by category
  getAllProducts: async (category?: Category | string): Promise<Product[]> => {
    await delay(500);
    if (category) {
      return sampleProducts.filter((p) => p.category === category);
    }
    return sampleProducts;
  },

  // Get featured products
  getFeaturedProducts: async (): Promise<Product[]> => {
    await delay(500);
    return sampleProducts.slice(0, 8);
  },

  // Get product by slug
  getProductBySlug: async (slug: string): Promise<Product | null> => {
    await delay(300);
    const product = sampleProducts.find((p) => p.slug === slug);
    return product || null;
  },

  // Search products
  searchProducts: async (query: string): Promise<Product[]> => {
    await delay(500);
    const searchTerms = query.toLowerCase().split(" ");
    return sampleProducts.filter((p) =>
      searchTerms.every(
        (term) =>
          p.name.toLowerCase().includes(term) ||
          p.category.toLowerCase().includes(term),
      ),
    );
  },
};

export const pcBuilderService = {
  // Get components for a specific category
  getComponentsByCategory: async (category: Category): Promise<Product[]> => {
    await delay(500);
    return sampleProducts.filter((p) => p.category === category);
  },
};
