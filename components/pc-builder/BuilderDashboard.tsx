'use client';

import { usePCBuilder } from '@/hooks/usePCBuilder';
import { Category } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Monitor, Cpu, HardDrive, Layout, Zap, Box, Thermometer, Wind, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const iconMap: Record<string, any> = {
  'Processor': Cpu,
  'Motherboard': Layout,
  'RAM': Box,
  'Storage': HardDrive,
  'Graphics Card': Zap,
  'Power Supply': Wind,
  'Casing': Box,
  'CPU Cooler': Thermometer,
  'Monitor': Monitor,
};

export default function PCBuilderDashboard() {
  const { build, removeComponent } = usePCBuilder();
  const components = Object.values(build.components);

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 glass p-6 rounded-2xl shadow-lg">
        <div>
          <h1 className="text-3xl font-extrabold text-secondary dark:text-white">PC Builder</h1>
          <p className="text-muted-foreground">Select components to build your dream PC</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Estimated Total</div>
          <div className="text-3xl font-black text-primary">৳{build.totalPrice.toLocaleString()}</div>
        </div>
      </div>

      <div className="space-y-4">
        {components.map((comp) => {
          const Icon = iconMap[comp.category] || Box;
          const isSelected = !!comp.selectedProduct;

          return (
            <Card key={comp.category} className={`overflow-hidden transition-all duration-300 ${isSelected ? 'border-primary/50 bg-primary/5' : 'bg-card/50'}`}>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className={`p-4 rounded-xl ${isSelected ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
                    <Icon className="w-8 h-8" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg">{comp.category}</h3>
                      {comp.isRequired && <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold uppercase">Required</span>}
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-primary" />}
                    </div>

                    {isSelected ? (
                      <div className="mt-1 flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden border">
                          <Image
                            src={comp.selectedProduct!.images?.[0] || comp.selectedProduct!.image || 'https://images.unsplash.com/photo-1591405351990-4726e33df48c?w=400&h=400&fit=crop'}
                            alt={comp.selectedProduct!.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-sm line-clamp-1">{comp.selectedProduct!.name}</p>
                          <p className="text-primary font-bold">৳{comp.selectedProduct!.price.toLocaleString()}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm mt-1">No component selected</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {isSelected ? (
                      <>
                        <Link href={`/pc-builder/${comp.category.toLowerCase().replace(' ', '-')}`} className="flex-1 sm:flex-none">
                          <Button variant="outline" size="sm" className="w-full">Change</Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => removeComponent(comp.category)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <Link href={`/pc-builder/${comp.category.toLowerCase().replace(' ', '-')}`} className="w-full sm:w-auto">
                        <Button className="tech-gradient w-full" size="sm">
                          <Plus className="w-4 h-4 mr-2" />
                          Choose
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-10 flex justify-end">
        <Button
          size="lg"
          className="px-10 font-bold tech-gradient"

        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
