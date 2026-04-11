import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Wallet, TrendingDown, Plus, Trash2 } from 'lucide-react';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([
    { id: 1, description: 'Staff Salaries', category: 'Payroll', amount: 450000, date: '2024-04-01' },
    { id: 2, description: 'Rent Payment', category: 'Facility', amount: 200000, date: '2024-04-01' },
    { id: 3, description: 'Medical Supplies', category: 'Supplies', amount: 85000, date: '2024-04-10' },
    { id: 4, description: 'Utilities Bill', category: 'Utilities', amount: 45000, date: '2024-04-12' },
    { id: 5, description: 'Equipment Maintenance', category: 'Maintenance', amount: 30000, date: '2024-04-15' }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({
    description: '', category: '', amount: '', date: ''
  });

  const categories = ['Payroll', 'Facility', 'Supplies', 'Utilities', 'Maintenance', 'Equipment', 'Other'];

  const filteredExpenses = expenses.filter(e =>
    e.description.toLowerCase().includes(search.toLowerCase()) ||
    e.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    setExpenses([...expenses, {
      id: Date.now(),
      ...formData,
      amount: parseInt(formData.amount)
    }]);
    setShowModal(false);
    setFormData({ description: '', category: '', amount: '', date: '' });
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  const currentMonthExpenses = expenses.filter(e => {
    const date = new Date(e.date);
    return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
  }).reduce((sum, e) => sum + e.amount, 0);

  const lastMonthExpenses = expenses.filter(e => {
    const date = new Date(e.date);
    const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
    const lastYear = thisMonth === 0 ? thisYear - 1 : thisYear;
    return date.getMonth() === lastMonth && date.getFullYear() === lastYear;
  }).reduce((sum, e) => sum + e.amount, 0);

  const expensesByCategory = categories.map(cat => ({
    category: cat,
    amount: expenses.filter(e => e.category === cat).reduce((sum, e) => sum + e.amount, 0)
  })).filter(e => e.amount > 0);

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold">Expenses</h1>
            <p className="text-muted-foreground mt-1">Track and manage business expenses</p>
          </div>
          <Dialog open={showModal} onOpenChange={setShowModal}>
            <DialogTrigger asChild>
              <Button><Plus size={16} className="mr-2" /> Add Expense</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Record New Expense</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Description *</Label>
                  <Input value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="e.g., Staff salaries" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Category *</Label>
                    <Select value={formData.category} onValueChange={v => setFormData({...formData, category: v})}>
                      <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Amount *</Label>
                    <Input type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} placeholder="Amount in UGX" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Date *</Label>
                  <Input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required />
                </div>
                <Button type="submit" className="w-full">Add Expense</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <p className="text-3xl font-bold">UGX {(currentMonthExpenses / 1000).toFixed(0)}K</p>
                </div>
                <Wallet className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Last Month</p>
                  <p className="text-3xl font-bold">UGX {(lastMonthExpenses / 1000).toFixed(0)}K</p>
                </div>
                <TrendingDown className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Expenses</p>
                  <p className="text-3xl font-bold">{expenses.length}</p>
                </div>
                <TrendingDown className="h-8 w-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative">
          <Input 
            placeholder="Search expenses..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Expenses Table */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>All Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Description</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredExpenses.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                            No expenses found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredExpenses.map((exp) => (
                          <TableRow key={exp.id} className="hover:bg-muted/50">
                            <TableCell className="font-medium">{exp.description}</TableCell>
                            <TableCell><span className="bg-muted px-2 py-1 rounded text-xs">{exp.category}</span></TableCell>
                            <TableCell className="font-semibold">UGX {exp.amount.toLocaleString()}</TableCell>
                            <TableCell className="text-sm">{exp.date}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => deleteExpense(exp.id)}>
                                <Trash2 size={16} />
                              </Button>
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

          {/* Category Breakdown */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">By Category</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {expensesByCategory.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No expenses recorded</p>
                ) : (
                  expensesByCategory.map((item) => (
                    <div key={item.category} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{item.category}</span>
                        <span className="text-right">UGX {(item.amount / 1000).toFixed(0)}K</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${Math.min(item.amount / 500000 * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
