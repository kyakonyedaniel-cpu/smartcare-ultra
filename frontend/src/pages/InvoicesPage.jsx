import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Receipt, DollarSign, Clock, CheckCircle, Plus, Trash2, Download, Eye } from 'lucide-react';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState([
    { id: 'INV-001', patient: 'Sarah Nakato', amount: 45000, status: 'Paid', date: '2024-04-10', items: 3, dueDate: '2024-04-17' },
    { id: 'INV-002', patient: 'Peter Ochieng', amount: 28000, status: 'Pending', date: '2024-04-09', items: 2, dueDate: '2024-04-16' },
    { id: 'INV-003', patient: 'Mary Kagaba', amount: 156000, status: 'Paid', date: '2024-04-08', items: 5, dueDate: '2024-04-15' },
    { id: 'INV-004', patient: 'James Wekesa', amount: 32000, status: 'Overdue', date: '2024-03-25', items: 2, dueDate: '2024-04-01' }
  ]);

  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    patient: '', amount: '', status: '', dueDate: ''
  });

  const filteredInvoices = invoices.filter(inv =>
    inv.id.toLowerCase().includes(search.toLowerCase()) ||
    inv.patient.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    setInvoices([...invoices, {
      id: `INV-${String(invoices.length + 1).padStart(3, '0')}`,
      ...formData,
      amount: parseInt(formData.amount),
      items: 1,
      date: new Date().toISOString().split('T')[0]
    }]);
    setShowModal(false);
    setFormData({ patient: '', amount: '', status: 'Pending', dueDate: '' });
  };

  const updateStatus = (id, status) => {
    setInvoices(invoices.map(inv => inv.id === id ? {...inv, status} : inv));
  };

  const deleteInvoice = (id) => {
    setInvoices(invoices.filter(inv => inv.id !== id));
  };

  const totalPaid = invoices.filter(i => i.status === 'Paid').reduce((sum, i) => sum + i.amount, 0);
  const totalPending = invoices.filter(i => i.status === 'Pending' || i.status === 'Overdue').reduce((sum, i) => sum + i.amount, 0);
  const paidCount = invoices.filter(i => i.status === 'Paid').length;
  const pendingCount = invoices.filter(i => i.status === 'Pending' || i.status === 'Overdue').length;

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold">Invoices</h1>
            <p className="text-muted-foreground mt-1">Manage invoices and payment tracking</p>
          </div>
          <Dialog open={showModal} onOpenChange={setShowModal}>
            <DialogTrigger asChild>
              <Button><Plus size={16} className="mr-2" /> Create Invoice</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Create New Invoice</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Patient Name *</Label>
                  <Input value={formData.patient} onChange={e => setFormData({...formData, patient: e.target.value})} placeholder="Select patient" required />
                </div>
                <div className="space-y-2">
                  <Label>Amount *</Label>
                  <Input type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} placeholder="Amount in UGX" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={formData.status} onValueChange={v => setFormData({...formData, status: v})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Paid">Paid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Due Date</Label>
                    <Input type="date" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} required />
                  </div>
                </div>
                <Button type="submit" className="w-full">Create Invoice</Button>
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
                  <p className="text-sm text-muted-foreground">Total Invoices</p>
                  <p className="text-3xl font-bold">{invoices.length}</p>
                </div>
                <Receipt className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Paid ({paidCount})</p>
                  <p className="text-3xl font-bold text-emerald-600">UGX {(totalPaid / 1000).toFixed(0)}K</p>
                </div>
                <CheckCircle className="h-8 w-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending ({pendingCount})</p>
                  <p className="text-3xl font-bold text-amber-600">UGX {(totalPending / 1000).toFixed(0)}K</p>
                </div>
                <Clock className="h-8 w-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-3xl font-bold">UGX {((totalPaid + totalPending) / 1000000).toFixed(1)}M</p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative">
          <Input 
            placeholder="Search by invoice # or patient name..." 
            className="pl-4"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Invoices Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        {search ? 'No invoices found matching your search' : 'No invoices yet'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredInvoices.map((inv) => (
                      <TableRow key={inv.id} className="hover:bg-muted/50">
                        <TableCell className="font-mono font-semibold">{inv.id}</TableCell>
                        <TableCell className="font-medium">{inv.patient}</TableCell>
                        <TableCell className="font-semibold">UGX {inv.amount.toLocaleString()}</TableCell>
                        <TableCell>{inv.items}</TableCell>
                        <TableCell className="text-sm">{inv.date}</TableCell>
                        <TableCell className="text-sm">{inv.dueDate}</TableCell>
                        <TableCell>
                          <Select value={inv.status} onValueChange={v => updateStatus(inv.id, v)}>
                            <SelectTrigger className="w-32 h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Pending">Pending</SelectItem>
                              <SelectItem value="Paid">Paid</SelectItem>
                              <SelectItem value="Overdue">Overdue</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-1 justify-end">
                            <Button variant="ghost" size="sm" title="View"><Eye size={16} /></Button>
                            <Button variant="ghost" size="sm" title="Download"><Download size={16} /></Button>
                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => deleteInvoice(inv.id)}>
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
