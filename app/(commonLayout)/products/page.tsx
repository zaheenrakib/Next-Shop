'use client';

import { useState, useEffect } from 'react';
import ProductCard from '@/components/product/ProductCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Search, Filter, Loader2, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [attributes, setAttributes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');


  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedAttrValues, setSelectedAttrValues] = useState<string[]>([]);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, selectedBrands, searchQuery]);

  const fetchInitialData = async () => {
    const [catRes, brandRes, attrRes] = await Promise.all([
      fetch('/api/categories'),
      fetch('/api/brands'),
      fetch('/api/attribute-values')
    ]);
    setCategories(await catRes.json());
    setBrands(await brandRes.json());


    const allValues = await attrRes.json();
    const grouped: any[] = [];
    allValues.forEach((val: any) => {
      const attr = grouped.find(a => a.id === val.attribute.id);
      if (attr) {
        attr.values.push(val);
      } else {
        grouped.push({ ...val.attribute, values: [val] });
      }
    });
    setAttributes(grouped);
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = `/api/products?search=${searchQuery}`;
      if (selectedCategory) url += `&category=${selectedCategory}`;
      if (selectedBrands.length > 0) url += `&brand=${selectedBrands.join(',')}`;

      const res = await fetch(url);
      const data = await res.json();
      setProducts(data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleBrand = (brandId: string) => {
    setSelectedBrands(prev =>
      prev.includes(brandId) ? prev.filter(id => id !== brandId) : [...prev, brandId]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-secondary dark:text-white tracking-tight">Tech Catalog</h1>
            <p className="text-muted-foreground mt-2">Filter and find the perfect gadget for your needs</p>
          </div>

          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search products..."
              className="pl-10 h-12 glass border-none focus-visible:ring-2 focus-visible:ring-primary shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">

          <aside className="lg:col-span-1 space-y-8">
            <Card className="border-none shadow-xl glass overflow-hidden">
              <CardContent className="p-6 space-y-8">

                <div className="space-y-4">
                  <h3 className="font-bold text-lg flex items-center gap-2"><Filter className="w-4 h-4" /> Categories</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-all text-sm font-medium flex justify-between items-center ${!selectedCategory ? 'bg-primary text-white' : 'hover:bg-muted'}`}
                    >
                      All Categories <ChevronRight className="w-4 h-4" />
                    </button>
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-all text-sm font-medium flex justify-between items-center ${selectedCategory === cat.id ? 'bg-primary text-white' : 'hover:bg-muted'}`}
                      >
                        {cat.name} <ChevronRight className="w-4 h-4" />
                      </button>
                    ))}
                  </div>
                </div>


                <div className="space-y-4">
                  <h3 className="font-bold text-lg">Brands</h3>
                  <div className="space-y-3">
                    {brands.map(brand => (
                      <div key={brand.id} className="flex items-center space-x-2 cursor-pointer group" onClick={() => toggleBrand(brand.id)}>
                        <Checkbox checked={selectedBrands.includes(brand.id)} />
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer group-hover:text-primary transition-colors">
                          {brand.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>


                <Accordion type="multiple" className="w-full">
                  {attributes.map(attr => (
                    <AccordionItem key={attr.id} value={attr.id} className="border-none">
                      <AccordionTrigger className="font-bold py-3 hover:no-underline">{attr.name}</AccordionTrigger>
                      <AccordionContent className="pt-1 pb-4">
                        <div className="space-y-3">
                          {attr.values.map((val: any) => (
                            <div key={val.id} className="flex items-center space-x-2">
                              <Checkbox />
                              <label className="text-sm font-medium leading-none">{val.value}</label>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>

                <Button className="w-full mt-4" variant="outline" onClick={() => {
                  setSelectedCategory(null);
                  setSelectedBrands([]);
                  setSearchQuery('');
                }}>
                  Reset Filters
                </Button>
              </CardContent>
            </Card>
          </aside>


          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="h-80 rounded-2xl bg-muted animate-pulse" />
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 glass rounded-3xl">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-secondary">No products found</h2>
                <p className="text-muted-foreground">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
