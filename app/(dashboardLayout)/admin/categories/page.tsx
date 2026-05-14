'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Loader2, FolderTree } from 'lucide-react';
import { toast } from 'sonner';

export default function CategoryManagement() {
  const [categories, setCategories] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [parent, setParent] = useState<string>('none');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const res = await fetch('/api/categories');
    const data = await res.json();
    setCategories(data);
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/categories?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Category deleted successfully');
        fetchCategories();
      } else {
        const error = await res.json();
        toast.error(error.error || 'Failed to delete category');
      }
    } catch (error) {
      toast.error('Failed to delete category');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!name) return;
    setLoading(true);
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        body: JSON.stringify({
          name,
          parent: parent === 'none' ? null : parent
        }),
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        toast.success('Category added');
        setName('');
        setParent('none');
        fetchCategories();
      }
    } catch (error) {
      toast.error('Failed to add category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <FolderTree /> Category Management
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Add Category</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Category Name</label>
              <Input
                placeholder="e.g. Laptops"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Parent Category</label>
              <Select value={parent} onValueChange={setParent}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Parent" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None (Root)</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAddCategory} disabled={loading} className="w-full">
              {loading ? <Loader2 className="animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
              Create Category
            </Button>
          </CardContent>
        </Card>


        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>All Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Parent</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((cat) => (
                  <TableRow key={cat.id}>
                    <TableCell className="font-medium">{cat.name}</TableCell>
                    <TableCell>{cat.parent?.name || '-'}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(cat.id)}>Delete</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
