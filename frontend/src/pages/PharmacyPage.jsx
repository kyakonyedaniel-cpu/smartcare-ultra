import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Pill, Package, AlertTriangle, TrendingUp, Plus, Edit, Trash2, Search } from 'lucide-react';

export default function PharmacyPage() {
  const [drugs, setDrugs] = useState([
    { id: 1, name: 'Paracetamol 500mg', category: 'Pain Relief', quantity: 450, reorderLevel: 100, price: 500, expiryDate: '2025-12-31' },
    { id: 2, name: 'Amoxicillin 250mg', category: 'Antibiotics', quantity: 230, reorderLevel: 100, price: 1200, expiryDate: '2025-06-15' },
    { id: 3, name: 'ORS Sachet', category: 'Electrolytes', quantity: 45, reorderLevel: 200, price: 800, expiryDate: '2026-03-20' },
    { id: 4, name: 'Ibuprofen 400mg', category: 'Pain Relief', quantity: 320, reorderLevel: 150, price: 700, expiryDate: '2025-09-10' },
    { id: 5, name: 'Vitamin C 1000mg', category: 'Vitamins', quantity: 150, reorderLevel: 100, price: 400, expiryDate: '2026-01-15' }
  ]);

  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '', category: '', quantity: '', reorderLevel: '', price: '', expiryDate: ''
  });

  const filteredDrugs = drugs.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.category.toLowerCase().includes(search.toLowerCase())
  );

  const lowStockCount = drugs.filter(d => d.quantity <= d.reorderLevel).length;
  const expiringCount = drugs.filter(d => {
    const expiryDate = new Date(d.expiryDate);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return expiryDate <= thirtyDaysFromNow && expiryDate > new Date();
  }).length;
  const totalValue = drugs.reduce((sum, d) => sum + (d.quantity * d.price), 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    setDrugs([...drugs, {
      id: Date.now(),
      ...formData,
      quantity: parseInt(formData.quantity),
      reorderLevel: parseInt(formData.reorderLevel),
      price: parseInt(formData.price)
    }]);
    setShowModal(false);
    setFormData({ name: '', category: '', quantity: '', reorderLevel: '', price: '', expiryDate: '' });
  };

  const deleteDrug = (id) => {
    setDrugs(drugs.filter(d => d.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold">Pharmacy</h1>
          <p className="text-muted-foreground mt-1">Manage inventory and drug stock</p>
        </div>
        <Dialog open={showModal} onOpenChange={setShowModal}>
            <DialogTrigger asChild>
              <Button><Plus size={16} className="mr-2" /> Add Drug</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Add New Drug</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Drug Name *</Label>
                    <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Input value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Quantity *</Label>
                    <Input type="number" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Price (per unit)</Label>
                    <Input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Reorder Level</Label>
                    <Input type="number" value={formData.reorderLevel} onChange={e => setFormData({...formData, reorderLevel: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Expiry Date</Label>
                    <Input type="date" value={formData.expiryDate} onChange={e => setFormData({...formData, expiryDate: e.target.value})} />
                  </div>
                </div>
                <Button type="submit" className="w-full">Add Drug</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

      {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Drugs</p>
                  <p className="text-3xl font-bold">{drugs.length}</p>
                </div>
                <Pill className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Stock Value</p>
                  <p className="text-3xl font-bold">UGX {(totalValue / 1000000).toFixed(1)}M</p>
                </div>
                <Package className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Low Stock</p>
                  <p className="text-3xl font-bold text-red-600">{lowStockCount}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Expiring Soon</p>
                  <p className="text-3xl font-bold text-orange-600">{expiringCount}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by drug name or category..." 
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Drugs Table */}
        <Card>
          <CardHeader>
            <CardTitle>Drug Inventory ({filteredDrugs.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Drug Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Stock Value</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDrugs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        {search ? 'No drugs found matching your search' : 'No drugs in inventory'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDrugs.map((drug) => {
                      const isLowStock = drug.quantity <= drug.reorderLevel;
                      const isExpiring = new Date(drug.expiryDate) <= new Date(new Date().setDate(new Date().getDate() + 30));
                      return (
                        <TableRow key={drug.id} className={`hover:bg-muted/50 ${isLowStock || isExpiring ? 'bg-red-50' : ''}`}>
                          <TableCell className="font-medium">{drug.name}</TableCell>
                          <TableCell>{drug.category}</TableCell>
                          <TableCell>
                            <span className={isLowStock ? 'font-bold text-red-600' : ''}>
                              {drug.quantity} {isLowStock && <span className="text-xs bg-red-100 px-2 py-1 rounded ml-2">Low</span>}
                            </span>
                          </TableCell>
                          <TableCell>UGX {drug.price.toLocaleString()}</TableCell>
                          <TableCell>UGX {(drug.quantity * drug.price).toLocaleString()}</TableCell>
                          <TableCell>
                            <span className={isExpiring ? 'font-bold text-orange-600' : ''}>
                              {drug.expiryDate} {isExpiring && <span className="text-xs bg-orange-100 px-2 py-1 rounded ml-2">Expiring</span>}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => deleteDrug(drug.id)}>
                              <Trash2 size={16} />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
