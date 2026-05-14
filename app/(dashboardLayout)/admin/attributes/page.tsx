'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  Plus, Loader2, Settings, List, 
  Palette, Type, Globe, Edit, 
  Trash2, X, Check, Layers, ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';

const ATTRIBUTE_TYPES = [
  { value: 'SELECT', label: 'Dropdown Select', icon: List },
  { value: 'RADIO', label: 'Radio Group', icon: Check },
  { value: 'COLOR_SWATCH', label: 'Color Swatch', icon: Palette },
  { value: 'BUTTON', label: 'Button List', icon: Type },
];

export default function AttributeManagement() {
  const [attributes, setAttributes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedAttr, setSelectedAttr] = useState<any>(null);
  const [values, setValues] = useState<any[]>([]);
  
  // Attribute Form State
  const [attrForm, setAttrForm] = useState({
    name: '',
    displayName: '',
    type: 'SELECT',
    isGlobal: true
  });
  const [isEditingAttr, setIsEditingAttr] = useState(false);

  // Value Form State
  const [valueForm, setValueForm] = useState({
    value: '',
    colorCode: '',
    imageUrl: '',
    sortOrder: 0
  });
  const [isEditingValue, setIsEditingValue] = useState(false);
  const [editingValueId, setEditingValueId] = useState<string | null>(null);

  useEffect(() => {
    fetchAttributes();
  }, []);

  useEffect(() => {
    if (selectedAttr) {
      fetchValues(selectedAttr.id);
    } else {
      setValues([]);
    }
  }, [selectedAttr]);

  const fetchAttributes = async () => {
    try {
      const res = await fetch('/api/attributes');
      const data = await res.json();
      setAttributes(Array.isArray(data) ? data : (data.attributes || []));
    } catch (error) {
      toast.error('Failed to load attributes');
    }
  };

  const fetchValues = async (attrId: string) => {
    try {
      const res = await fetch(`/api/attribute-values?attributeId=${attrId}`);
      const data = await res.json();
      setValues(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Failed to load values');
    }
  };

  const handleAttrSubmit = async () => {
    if (!attrForm.name) return toast.error('Name is required');
    setLoading(true);
    try {
      const method = isEditingAttr ? 'PATCH' : 'POST';
      const payload = isEditingAttr ? { id: selectedAttr.id, ...attrForm } : attrForm;
      
      const res = await fetch('/api/attributes', {
        method,
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' }
      });

      if (res.ok) {
        toast.success(isEditingAttr ? 'Attribute updated' : 'Attribute created');
        setAttrForm({ name: '', displayName: '', type: 'SELECT', isGlobal: true });
        setIsEditingAttr(false);
        fetchAttributes();
      }
    } catch (error) {
      toast.error('Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleValueSubmit = async () => {
    if (!valueForm.value || !selectedAttr) return toast.error('Value is required');
    setLoading(true);
    try {
      const method = isEditingValue ? 'PATCH' : 'POST';
      const payload = isEditingValue 
        ? { id: editingValueId, ...valueForm } 
        : { attributeId: selectedAttr.id, ...valueForm };
      
      const res = await fetch('/api/attribute-values', {
        method,
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' }
      });

      if (res.ok) {
        toast.success(isEditingValue ? 'Value updated' : 'Value added');
        setValueForm({ value: '', colorCode: '', imageUrl: '', sortOrder: 0 });
        setIsEditingValue(false);
        setEditingValueId(null);
        fetchValues(selectedAttr.id);
      }
    } catch (error) {
      toast.error('Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAttr = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Delete this attribute and all its values?')) return;
    try {
      const res = await fetch(`/api/attributes?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Attribute deleted');
        if (selectedAttr?.id === id) setSelectedAttr(null);
        fetchAttributes();
      }
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  const handleDeleteValue = async (id: string) => {
    if (!confirm('Delete this value?')) return;
    try {
      const res = await fetch(`/api/attribute-values?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Value deleted');
        fetchValues(selectedAttr.id);
      }
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10 bg-slate-50/30 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 flex items-center gap-3">
            <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-200">
              <Layers size={32} />
            </div>
            Attribute Engine
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Define global product characteristics and variant options</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Attributes Column */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-none shadow-xl shadow-slate-200/50 overflow-hidden">
            <CardHeader className="bg-white border-b p-6">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Settings className="w-5 h-5 text-indigo-600" />
                {isEditingAttr ? 'Edit Attribute' : 'New Attribute Configuration'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Internal Name</label>
                    <Input 
                      placeholder="e.g. storage_capacity"
                      value={attrForm.name}
                      onChange={e => setAttrForm({...attrForm, name: e.target.value})}
                      className="rounded-xl border-slate-200"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Display Label</label>
                    <Input 
                      placeholder="e.g. Storage Size"
                      value={attrForm.displayName}
                      onChange={e => setAttrForm({...attrForm, displayName: e.target.value})}
                      className="rounded-xl border-slate-200"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Input Control Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {ATTRIBUTE_TYPES.map(type => (
                      <button
                        key={type.value}
                        onClick={() => setAttrForm({...attrForm, type: type.value})}
                        className={`flex items-center gap-2 p-3 rounded-xl border transition-all text-sm font-semibold ${
                          attrForm.type === type.value 
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm' 
                          : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200'
                        }`}
                      >
                        <type.icon size={16} />
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg border shadow-sm text-indigo-600">
                      <Globe size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-700">Global Attribute</p>
                      <p className="text-[10px] text-slate-400">Available across all categories</p>
                    </div>
                  </div>
                  <Switch 
                    checked={attrForm.isGlobal}
                    onCheckedChange={val => setAttrForm({...attrForm, isGlobal: val})}
                  />
                </div>

                <div className="flex gap-2">
                  {isEditingAttr && (
                    <Button variant="outline" onClick={() => {
                      setIsEditingAttr(false);
                      setAttrForm({ name: '', displayName: '', type: 'SELECT', isGlobal: true });
                    }} className="flex-1 rounded-xl">Cancel</Button>
                  )}
                  <Button onClick={handleAttrSubmit} disabled={loading} className="flex-1 bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-100">
                    {loading ? <Loader2 className="animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                    {isEditingAttr ? 'Save Configuration' : 'Deploy Attribute'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Active Attributes</h3>
            {attributes.map(attr => (
              <div 
                key={attr.id}
                onClick={() => setSelectedAttr(attr)}
                className={`group p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  selectedAttr?.id === attr.id 
                  ? 'bg-white border-indigo-200 shadow-lg shadow-indigo-100/50 ring-1 ring-indigo-100' 
                  : 'bg-white border-slate-100 hover:border-slate-200 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${selectedAttr?.id === attr.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'}`}>
                    {(() => {
                      const Icon = ATTRIBUTE_TYPES.find(t => t.value === attr.type)?.icon || List;
                      return <Icon size={20} />;
                    })()}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{attr.displayName || attr.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono uppercase">{attr.name} • {attr.options?.length || 0} values</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={(e) => {
                    e.stopPropagation();
                    setSelectedAttr(attr);
                    setIsEditingAttr(true);
                    setAttrForm({
                      name: attr.name,
                      displayName: attr.displayName || '',
                      type: attr.type,
                      isGlobal: attr.isGlobal
                    });
                  }}>
                    <Edit size={14} />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-red-400 hover:text-red-600" onClick={(e) => handleDeleteAttr(attr.id, e)}>
                    <Trash2 size={14} />
                  </Button>
                  <ChevronRight size={16} className="text-slate-300 ml-1" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Values Column */}
        <div className="lg:col-span-7">
          {selectedAttr ? (
            <Card className="border-none shadow-2xl shadow-slate-200/40 min-h-[600px] bg-white rounded-3xl overflow-hidden">
              <CardHeader className="bg-slate-900 text-white p-8">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-black bg-indigo-500 text-white px-2 py-0.5 rounded-full uppercase tracking-tighter">Option Set</span>
                      <span className="text-[10px] font-black bg-white/10 text-white/60 px-2 py-0.5 rounded-full uppercase tracking-tighter">{selectedAttr.type}</span>
                    </div>
                    <CardTitle className="text-2xl font-bold">{selectedAttr.displayName || selectedAttr.name}</CardTitle>
                  </div>
                  <Button variant="ghost" size="icon" className="text-white/40 hover:text-white hover:bg-white/10" onClick={() => setSelectedAttr(null)}>
                    <X size={20} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
                  <h4 className="text-sm font-bold text-slate-800">
                    {isEditingValue ? 'Edit Existing Value' : 'Inject New Option Value'}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input 
                      placeholder="Display Value (e.g. 16GB)"
                      value={valueForm.value}
                      onChange={e => setValueForm({...valueForm, value: e.target.value})}
                      className="rounded-xl border-slate-200 bg-white"
                    />
                    <Input 
                      placeholder="Hex Code (#000000)"
                      value={valueForm.colorCode}
                      onChange={e => setValueForm({...valueForm, colorCode: e.target.value})}
                      className="rounded-xl border-slate-200 bg-white"
                    />
                    <Input 
                      type="number"
                      placeholder="Sort Order"
                      value={valueForm.sortOrder}
                      onChange={e => setValueForm({...valueForm, sortOrder: parseInt(e.target.value) || 0})}
                      className="rounded-xl border-slate-200 bg-white"
                    />
                    <div className="md:col-span-2">
                      <Input 
                        placeholder="Image URL (optional)"
                        value={valueForm.imageUrl}
                        onChange={e => setValueForm({...valueForm, imageUrl: e.target.value})}
                        className="rounded-xl border-slate-200 bg-white"
                      />
                    </div>
                    <div className="flex gap-2">
                      {isEditingValue && (
                        <Button variant="outline" onClick={() => {
                          setIsEditingValue(false);
                          setEditingValueId(null);
                          setValueForm({ value: '', colorCode: '', imageUrl: '', sortOrder: 0 });
                        }} className="rounded-xl px-4">
                          <X size={16} />
                        </Button>
                      )}
                      <Button onClick={handleValueSubmit} disabled={loading} className="flex-1 bg-slate-900 hover:bg-black text-white rounded-xl">
                        {loading ? <Loader2 className="animate-spin" /> : (isEditingValue ? <Check size={16} /> : <Plus size={16} />)}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between px-2">
                    <h3 className="text-sm font-bold text-slate-800">Current Options</h3>
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{values.length} Entries</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {values.length === 0 ? (
                      <div className="col-span-full py-12 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-100">
                        <p className="text-slate-400 font-medium">No values defined for this attribute yet.</p>
                      </div>
                    ) : values.map(val => (
                      <div key={val.id} className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                          {val.colorCode && (
                            <div className="w-8 h-8 rounded-full border shadow-inner" style={{ backgroundColor: val.colorCode }} />
                          )}
                          {val.imageUrl && (
                            <img src={val.imageUrl} className="w-8 h-8 rounded-lg object-cover border" alt="" />
                          )}
                          <div>
                            <p className="font-bold text-slate-800">{val.value}</p>
                            <p className="text-[10px] text-slate-400">Order: {val.sortOrder}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => {
                            setIsEditingValue(true);
                            setEditingValueId(val.id);
                            setValueForm({
                              value: val.value,
                              colorCode: val.colorCode || '',
                              imageUrl: val.imageUrl || '',
                              sortOrder: val.sortOrder
                            });
                          }}>
                            <Edit size={14} />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-red-400 hover:text-red-600" onClick={() => handleDeleteValue(val.id)}>
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-dashed border-slate-200">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-6">
                <Layers size={48} />
              </div>
              <h3 className="text-xl font-bold text-slate-400">No Attribute Selected</h3>
              <p className="text-slate-400 text-center mt-2 max-w-xs">Select an attribute from the sidebar to manage its possible values and configurations.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

