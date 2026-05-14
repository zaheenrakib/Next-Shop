'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Save, Loader2, RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';

export default function NewProduct() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [attributes, setAttributes] = useState<any[]>([]);
  const [allAttrValues, setAllAttrValues] = useState<any[]>([]);


  const [product, setProduct] = useState({
    name: '',
    brand: '',
    category: '',
    description: '',
    thumbnail: '',
    status: 'active',
    specifications: [] as { attributeId: string, value: string }[]
  });

  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [variants, setVariants] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [catRes, brandRes, attrRes, valRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/brands'),
        fetch('/api/attributes'),
        fetch('/api/attribute-values')
      ]);

      const catData = await catRes.json();
      setCategories(Array.isArray(catData) ? catData : (catData.categories || []));
      
      const brandData = await brandRes.json();
      setBrands(Array.isArray(brandData) ? brandData : (brandData.brands || []));
      
      const attrData = await attrRes.json();
      setAttributes(Array.isArray(attrData) ? attrData : (attrData.attributes || []));
      
      const valData = await valRes.json();
      setAllAttrValues(Array.isArray(valData) ? valData : (valData.values || []));
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load initial data');
    }
  };

  const handleCategoryChange = (catId: string) => {
    const cat = categories.find(c => c.id === catId);
    setSelectedCategory(cat);
    setProduct({ ...product, category: catId, specifications: [] });
    setVariants([]); // Clear variants when category changes to avoid mismatch
  };

  const updateSpec = (attrId: string, value: string) => {
    const newSpecs = [...product.specifications];
    const index = newSpecs.findIndex(s => s.attributeId === attrId);
    if (index > -1) {
      newSpecs[index].value = value;
    } else {
      newSpecs.push({ attributeId: attrId, value });
    }
    setProduct({ ...product, specifications: newSpecs });
  };

  const addVariant = () => {
    setVariants([...variants, { sku: '', price: 0, stock: 0, attributeValues: [] }]);
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const updateVariant = (index: number, field: string, value: any) => {
    const newVariants = [...variants];
    newVariants[index][field] = value;
    setVariants(newVariants);
  };

  const handleSubmit = async () => {
    if (!product.name || !product.brand || !product.category || variants.length === 0) {
      toast.error('Please fill in all required fields and add at least one variant');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        body: JSON.stringify({ product, variants }),
        headers: { 'Content-Type': 'application/json' }
      });

      if (res.ok) {
        toast.success('Product created successfully');
        router.push('/admin/products');
      } else {
        const error = await res.json();
        toast.error(error.error || 'Failed to create product');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const categoryAttrs = selectedCategory?.categoryAttributes?.map((ca: any) => ca.attribute) || [];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Create New Product</h1>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2 w-4 h-4" />}
          Save Product
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Product Name</label>
                <Input
                  placeholder="e.g. iPhone 15 Pro"
                  value={product.name}
                  onChange={(e) => setProduct({ ...product, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Brand</label>
                  <Select onValueChange={(val) => setProduct({ ...product, brand: val })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Brand" />
                    </SelectTrigger>
                    <SelectContent>
                      {brands.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select onValueChange={handleCategoryChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  placeholder="Enter product details..."
                  className="h-32"
                  value={product.description}
                  onChange={(e) => setProduct({ ...product, description: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>


          {categoryAttrs.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Specifications for {selectedCategory.name}</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                {categoryAttrs.map((attr: any) => (
                  <div key={attr.id} className="space-y-2">
                    <label className="text-sm font-medium">{attr.name}</label>
                    {attr.type === 'select' ? (
                      <Select onValueChange={(val) => updateSpec(attr.id, val)}>
                        <SelectTrigger>
                          <SelectValue placeholder={`Select ${attr.name}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {allAttrValues
                            .filter(v => v.attributeId === attr.id)
                            .map(v => <SelectItem key={v.id} value={v.value}>{v.value}</SelectItem>)
                          }
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        type={attr.type === 'number' ? 'number' : 'text'}
                        placeholder={`Enter ${attr.name}`}
                        onChange={(e) => updateSpec(attr.id, e.target.value)}
                      />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}


          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Variants</CardTitle>
              <Button variant="outline" size="sm" onClick={addVariant} disabled={!product.category}>
                <Plus className="w-4 h-4 mr-2" /> Add Variant
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {variants.map((variant, vIdx) => (
                <div key={vIdx} className="p-4 border rounded-lg space-y-4 relative bg-white/50">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 text-destructive"
                    onClick={() => removeVariant(vIdx)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Price</label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={variant.price}
                        onChange={(e) => updateVariant(vIdx, 'price', parseFloat(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Stock</label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={variant.stock}
                        onChange={(e) => updateVariant(vIdx, 'stock', parseInt(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">SKU</label>
                      <Input
                        placeholder="Auto-generated if empty"
                        value={variant.sku}
                        onChange={(e) => updateVariant(vIdx, 'sku', e.target.value)}
                      />
                    </div>
                  </div>


                  <div className="space-y-2">
                    <label className="text-sm font-medium">Variant Attributes</label>
                    <div className="flex flex-wrap gap-4">
                      {categoryAttrs
                        .filter((attr: any) => attr.type === 'select')
                        .map((attr: any) => (
                          <div key={attr.id} className="space-y-1">
                            <span className="text-xs text-muted-foreground">{attr.name}</span>
                            <Select
                              onValueChange={(val) => {
                                const otherAttrs = variant.attributeValues.filter((vId: string) => {
                                  const valObj = allAttrValues.find(av => av.id === vId);
                                  return valObj?.attributeId !== attr.id;
                                });
                                updateVariant(vIdx, 'attributeValues', [...otherAttrs, val]);
                              }}
                            >
                              <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Choose" />
                              </SelectTrigger>
                              <SelectContent>
                                {allAttrValues
                                  .filter(val => val.attributeId === attr.id)
                                  .map(val => <SelectItem key={val.id} value={val.id}>{val.value}</SelectItem>)
                                }
                              </SelectContent>
                            </Select>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              ))}
              {variants.length === 0 && (
                <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                  {product.category ? 'No variants added. Click "Add Variant" to start.' : 'Please select a category first.'}
                </div>
              )}
            </CardContent>
          </Card>
        </div>


        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Media & Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Thumbnail URL</label>
                <Input
                  placeholder="https://..."
                  value={product.thumbnail}
                  onChange={(e) => setProduct({ ...product, thumbnail: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select defaultValue="active" onValueChange={(val) => setProduct({ ...product, status: val })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
