'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AttributeManagement() {
  const [attributes, setAttributes] = useState<any[]>([]);
  const [newAttribute, setNewAttribute] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedAttr, setSelectedAttr] = useState<any>(null);
  const [newValue, setNewValue] = useState('');
  const [values, setValues] = useState<any[]>([]);

  useEffect(() => {
    fetchAttributes();
  }, []);

  useEffect(() => {
    if (selectedAttr) {
      fetchValues(selectedAttr.id);
    }
  }, [selectedAttr]);

  const fetchAttributes = async () => {
    const res = await fetch('/api/attributes');
    const data = await res.json();
    setAttributes(data);
  };

  const fetchValues = async (attrId: string) => {
    const res = await fetch(`/api/attribute-values?attributeId=${attrId}`);
    const data = await res.json();
    setValues(data);
  };

  const handleAddAttribute = async () => {
    if (!newAttribute) return;
    setLoading(true);
    try {
      const res = await fetch('/api/attributes', {
        method: 'POST',
        body: JSON.stringify({ name: newAttribute }),
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        toast.success('Attribute added');
        setNewAttribute('');
        fetchAttributes();
      }
    } catch (error) {
      toast.error('Failed to add attribute');
    } finally {
      setLoading(false);
    }
  };

  const handleAddValue = async () => {
    if (!newValue || !selectedAttr) return;
    setLoading(true);
    try {
      const res = await fetch('/api/attribute-values', {
        method: 'POST',
        body: JSON.stringify({ attributeId: selectedAttr.id, value: newValue }),
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        toast.success('Value added');
        setNewValue('');
        fetchValues(selectedAttr.id);
      }
    } catch (error) {
      toast.error('Failed to add value');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Attribute Management</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Attributes List */}
        <Card>
          <CardHeader>
            <CardTitle>Attributes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input 
                placeholder="New Attribute (e.g. RAM)" 
                value={newAttribute}
                onChange={(e) => setNewAttribute(e.target.value)}
              />
              <Button onClick={handleAddAttribute} disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : <Plus className="w-4 h-4" />}
              </Button>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attributes.map((attr) => (
                  <TableRow 
                    key={attr.id} 
                    className={`cursor-pointer ${selectedAttr?.id === attr.id ? 'bg-muted' : ''}`}
                    onClick={() => setSelectedAttr(attr)}
                  >
                    <TableCell className="font-medium">{attr.name}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">Manage Values</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Attribute Values */}
        {selectedAttr && (
          <Card>
            <CardHeader>
              <CardTitle>Values for {selectedAttr.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input 
                  placeholder="New Value (e.g. 8GB)" 
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                />
                <Button onClick={handleAddValue} disabled={loading}>
                  {loading ? <Loader2 className="animate-spin" /> : <Plus className="w-4 h-4" />}
                </Button>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {values.map((val) => (
                    <TableRow key={val.id}>
                      <TableCell>{val.value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
