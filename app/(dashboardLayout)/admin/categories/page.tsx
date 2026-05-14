'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { 
  Plus, Loader2, FolderTree, Edit, Trash2, 
  Image as ImageIcon, Type, Link as LinkIcon, 
  Settings2, Hash, X, Save
} from 'lucide-react';
import { toast } from 'sonner';

export default function CategoryManagement() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    parentId: 'none',
    image: '',
    icon: '',
    isActive: true,
    sortOrder: 0
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : (data.categories || []));
    } catch (error) {
      setCategories([]);
      toast.error('Failed to load categories');
    }
  };

  const handleEdit = (cat: any) => {
    setIsEditing(true);
    setEditingId(cat.id);
    setFormData({
      name: cat.name,
      slug: cat.slug || '',
      parentId: cat.parentId || 'none',
      image: cat.image || '',
      icon: cat.icon || '',
      isActive: cat.isActive ?? true,
      sortOrder: cat.sortOrder || 0
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      name: '',
      slug: '',
      parentId: 'none',
      image: '',
      icon: '',
      isActive: true,
      sortOrder: 0
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
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

  const handleSubmit = async () => {
    if (!formData.name) {
      toast.error('Category name is required');
      return;
    }
    setLoading(true);
    try {
      const method = isEditing ? 'PATCH' : 'POST';
      const payload = isEditing ? { id: editingId, ...formData } : formData;
      
      const res = await fetch('/api/categories', {
        method,
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' }
      });

      if (res.ok) {
        toast.success(isEditing ? 'Category updated' : 'Category added');
        cancelEdit();
        fetchCategories();
      } else {
        const err = await res.json();
        toast.error(err.error || 'Operation failed');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold flex items-center gap-3 text-slate-900">
            <div className="p-2 bg-blue-600 rounded-xl text-white">
              <FolderTree size={28} />
            </div>
            Category Architecture
          </h1>
          <p className="text-slate-500 mt-2">Design and organize your store's navigational structure</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Section */}
        <Card className="lg:col-span-5 border-none shadow-2xl shadow-blue-100/50 overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              {isEditing ? <Edit className="w-5 h-5 text-blue-600" /> : <Plus className="w-5 h-5 text-blue-600" />}
              {isEditing ? 'Modify Category' : 'Architect New Category'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                  <Type size={12} /> Display Name
                </label>
                <Input
                  placeholder="e.g. Laptops & Accessories"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="rounded-xl border-slate-200 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                  <LinkIcon size={12} /> URL Slug
                </label>
                <Input
                  placeholder="laptops-accessories"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="rounded-xl border-slate-200"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                  <Settings2 size={12} /> Hierarchy
                </label>
                <Select value={formData.parentId} onValueChange={(val) => setFormData({ ...formData, parentId: val })}>
                  <SelectTrigger className="rounded-xl border-slate-200">
                    <SelectValue placeholder="Select Parent" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None (Root Level)</SelectItem>
                    {categories
                      .filter(c => c.id !== editingId)
                      .map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                  <ImageIcon size={12} /> Image URL
                </label>
                <Input
                  placeholder="https://..."
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="rounded-xl border-slate-200"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                  <Plus size={12} /> Icon Identifier
                </label>
                <Input
                  placeholder="laptop-icon"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="rounded-xl border-slate-200"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                  <Hash size={12} /> Display Order
                </label>
                <Input
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                  className="rounded-xl border-slate-200"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                <span className="text-sm font-semibold text-slate-600">Active Status</span>
                <Switch 
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              {isEditing && (
                <Button variant="outline" onClick={cancelEdit} className="flex-1 rounded-xl py-6 border-slate-200 hover:bg-slate-50">
                  <X size={18} className="mr-2" /> Cancel
                </Button>
              )}
              <Button onClick={handleSubmit} disabled={loading} className="flex-1 rounded-xl py-6 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200">
                {loading ? <Loader2 className="animate-spin mr-2" /> : (isEditing ? <Save className="mr-2 w-4 h-4" /> : <Plus className="w-4 h-4 mr-2" />)}
                {isEditing ? 'Save Changes' : 'Build Category'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Table Section */}
        <Card className="lg:col-span-7 border-none shadow-xl bg-white overflow-hidden">
          <CardHeader className="p-6">
            <CardTitle className="text-xl font-bold flex items-center gap-2 text-slate-800">
              Navigation Map
              <span className="text-xs font-normal text-slate-400 ml-2 py-1 px-2 bg-slate-100 rounded-full">
                {categories.length} Categories
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/80">
                  <TableRow>
                    <TableHead className="w-16 text-center">Icon</TableHead>
                    <TableHead>Category Entity</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right p-6">Operations</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-64 text-center">
                        <div className="flex flex-col items-center justify-center space-y-3 opacity-30">
                          <FolderTree size={48} />
                          <p className="font-medium">No categories designed yet</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : categories.map((cat) => (
                    <TableRow key={cat.id} className="hover:bg-slate-50/50 transition-colors border-slate-100">
                      <TableCell className="text-center">
                        <div className="w-10 h-10 mx-auto rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                          {cat.image ? (
                            <img src={cat.image} className="w-full h-full object-cover rounded-lg" alt="" />
                          ) : (
                            <FolderTree size={18} />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800">{cat.name}</span>
                          <span className="text-[10px] text-slate-400 uppercase tracking-tighter">slug: {cat.slug}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${cat.parent ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                          {cat.parent ? 'Sub' : 'Root'}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className={`w-2.5 h-2.5 rounded-full mx-auto ${cat.isActive ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-slate-300'}`} />
                      </TableCell>
                      <TableCell className="text-right p-6">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50" 
                            onClick={() => handleEdit(cat)}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50" 
                            onClick={() => handleDelete(cat.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
