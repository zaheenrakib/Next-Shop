"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Category, PCBuild, Product } from "../types";

interface PCBuilderState {
  build: PCBuild;
  addComponent: (category: Category, product: Product) => void;
  removeComponent: (category: Category) => void;
  resetBuild: () => void;
  isCompatible: (
    category: Category,
    product: Product,
  ) => { compatible: boolean; reason?: string };
}

const initialBuild: PCBuild = {
  components: {
    Processor: {
      category: "Processor",
      selectedProduct: null,
      isRequired: true,
    },
    Motherboard: {
      category: "Motherboard",
      selectedProduct: null,
      isRequired: true,
    },
    RAM: { category: "RAM", selectedProduct: null, isRequired: true },
    Storage: { category: "Storage", selectedProduct: null, isRequired: true },
    "Graphics Card": {
      category: "Graphics Card",
      selectedProduct: null,
      isRequired: false,
    },
    "Power Supply": {
      category: "Power Supply",
      selectedProduct: null,
      isRequired: true,
    },
    Casing: { category: "Casing", selectedProduct: null, isRequired: true },
    "CPU Cooler": {
      category: "CPU Cooler",
      selectedProduct: null,
      isRequired: false,
    },
    Monitor: { category: "Monitor", selectedProduct: null, isRequired: false },
    Others: { category: "Others", selectedProduct: null, isRequired: false },
  },
  totalPrice: 0,
};

export const usePCBuilder = create<PCBuilderState>()(
  persist(
    (set, get) => ({
      build: initialBuild,

      addComponent: (category, product) => {
        set((state) => {
          const newBuild = { ...state.build };
          newBuild.components[category].selectedProduct = product;


          newBuild.totalPrice = Object.values(newBuild.components).reduce(
            (sum, comp) => sum + (comp.selectedProduct?.price || 0),
            0,
          );

          return { build: newBuild };
        });
      },

      removeComponent: (category) => {
        set((state) => {
          const newBuild = { ...state.build };
          newBuild.components[category].selectedProduct = null;

          newBuild.totalPrice = Object.values(newBuild.components).reduce(
            (sum, comp) => sum + (comp.selectedProduct?.price || 0),
            0,
          );

          return { build: newBuild };
        });
      },

      resetBuild: () => set({ build: initialBuild }),

      isCompatible: (category, product) => {
        const { build } = get();


        if (category === "Motherboard") {
          const processor = build.components["Processor"].selectedProduct;
          if (
            processor &&
            processor.compatibility?.socket !== product.compatibility?.socket
          ) {
            return {
              compatible: false,
              reason: `Processor socket (${processor.compatibility?.socket}) does not match Motherboard socket (${product.compatibility?.socket})`,
            };
          }
        }

        if (category === "Processor") {
          const motherboard = build.components["Motherboard"].selectedProduct;
          if (
            motherboard &&
            motherboard.compatibility?.socket !== product.compatibility?.socket
          ) {
            return {
              compatible: false,
              reason: `Motherboard socket (${motherboard.compatibility?.socket}) does not match Processor socket (${product.compatibility?.socket})`,
            };
          }
        }


        if (category === "RAM") {
          const motherboard = build.components["Motherboard"].selectedProduct;
          if (
            motherboard &&
            motherboard.compatibility?.ramType !==
            product.compatibility?.ramType
          ) {
            return {
              compatible: false,
              reason: `Motherboard supports ${motherboard.compatibility?.ramType}, but you selected ${product.compatibility?.ramType}`,
            };
          }
        }

        return { compatible: true };
      },
    }),
    {
      name: "pc-builder-storage",
    },
  ),
);
