import ComponentSelector from '@/components/pc-builder/ComponentSelector';
import { Category } from '@/types';
import { notFound } from 'next/navigation';

interface PageProps {
  params: {
    category: string;
  };
}

const validCategories = [
  'processor',
  'motherboard',
  'ram',
  'storage',
  'graphics-card',
  'power-supply',
  'casing',
  'cpu-cooler',
  'monitor',
];

export async function generateMetadata({ params }: PageProps) {
  const categoryName = params.category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  return {
    title: `Select ${categoryName} | NextBazaar PC Builder`,
  };
}

export default function CategorySelectionPage({ params }: PageProps) {
  const { category } = params;

  if (!validCategories.includes(category)) {
    notFound();
  }


  const categoryMap: Record<string, Category> = {
    'processor': 'Processor',
    'motherboard': 'Motherboard',
    'ram': 'RAM',
    'storage': 'Storage',
    'graphics-card': 'Graphics Card',
    'power-supply': 'Power Supply',
    'casing': 'Casing',
    'cpu-cooler': 'CPU Cooler',
    'monitor': 'Monitor',
  };

  return (
    <main className="min-h-screen bg-background">
      <ComponentSelector category={categoryMap[category]} />
    </main>
  );
}
