import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShoppingCart, Plus, Minus, Trash2, CheckCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function POSPage() {
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedDrug, setSelectedDrug] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [completedSale, setCompletedSale] = useState(null);

  const drugs = [
    { id: '1', name: 'Paracetamol 500mg', price: 500 },
    { id: '2', name: 'Amoxicillin 250mg', price: 1200 },
    { id: '3', name: 'ORS Sachet', price: 800 },
    { id: '4', name: 'Ibuprofen 400mg', price: 700 },
    { id: '5', name: 'Vitamin C 1000mg', price: 400 },
  ];

  const addToCart = (drug) => {
    const existing = cart.find(item => item.id === drug.id);
    if (existing) {
      setCart(cart.map(item => item.id === drug.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { ...drug, quantity: 1 }]);
    }
  };

  const updateQuantity = (id, delta) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const completeSale = () => {
    if (cart.length === 0) {
      alert('Cart is empty');
      return;
    }
    const receipt = {
      id: `RCP-${Date.now()}`,
      items: cart,
      subtotal,
      tax,
      total,
      paymentMethod,
      timestamp: new Date()
    };
    console.log('[v0] Sale completed:', receipt);
    setCompletedSale(receipt);
    setCart([]);
    setPaymentMethod('CASH');
    setTimeout(() => setCompletedSale(null), 3000);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + tax;

  if (completedSale) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle size={48} className="text-green-600" />
              </div>
              <CardTitle>Sale Completed!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Receipt ID</p>
                <p className="font-mono font-bold text-lg">{completedSale.id}</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Method:</span>
                  <span className="font-medium">{completedSale.paymentMethod}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total Amount:</span>
                  <span>{formatCurrency(completedSale.total)}</span>
                </div>
              </div>
              <Button onClick={() => setCompletedSale(null)} className="w-full">Start New Sale</Button>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Search Drugs</CardTitle>
            </CardHeader>
            <CardContent>
              <Input 
                placeholder="Search by name or barcode..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="mb-4"
              />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {drugs.filter(d => d.name.toLowerCase().includes(search.toLowerCase())).map(drug => (
                  <Button 
                    key={drug.id} 
                    variant="outline" 
                    className="h-20 flex flex-col items-center justify-center gap-1 text-center"
                    onClick={() => addToCart(drug)}
                  >
                    <span className="text-sm font-medium leading-tight">{drug.name}</span>
                    <span className="text-xs text-muted-foreground">{formatCurrency(drug.price)}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Add</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Select onValueChange={(v) => {
                  const drug = drugs.find(d => d.id === v);
                  setSelectedDrug(drug);
                }}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select drug" />
                  </SelectTrigger>
                  <SelectContent>
                    {drugs.map(drug => (
                      <SelectItem key={drug.id} value={drug.id}>{drug.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input 
                  type="number" 
                  className="w-20" 
                  value={quantity} 
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)} 
                  min="1"
                />
                <Button onClick={() => selectedDrug && addToCart({...selectedDrug, quantity})} disabled={!selectedDrug}>
                  <Plus size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart size={20} />
                Cart ({cart.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="max-h-[calc(100vh-350px)] overflow-y-auto">
                {cart.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8 text-sm">Cart is empty</p>
                ) : (
                  <div className="space-y-2">
                    {cart.map(item => (
                      <div key={item.id} className="flex items-center justify-between p-2 bg-muted rounded text-sm">
                        <div className="flex-1">
                          <p className="font-medium text-xs">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{formatCurrency(item.price)}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" className="h-5 w-5 p-0" onClick={() => updateQuantity(item.id, -1)}>
                            <Minus size={12} />
                          </Button>
                          <span className="w-6 text-center text-xs font-medium">{item.quantity}</span>
                          <Button variant="ghost" size="sm" className="h-5 w-5 p-0" onClick={() => updateQuantity(item.id, 1)}>
                            <Plus size={12} />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-5 w-5 p-0 text-red-500" onClick={() => removeFromCart(item.id)}>
                            <Trash2 size={12} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <>
                  <div className="border-t pt-3 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax (18%)</span>
                      <span className="font-medium">{formatCurrency(tax)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-base border-t pt-2">
                      <span>Total</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">Payment Method</Label>
                    <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                      <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CASH">Cash</SelectItem>
                        <SelectItem value="MTN_MOMO">MTN MoMo</SelectItem>
                        <SelectItem value="AIRTEL_MONEY">Airtel Money</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button onClick={completeSale} className="w-full font-bold">
                    Complete Sale - {formatCurrency(total)}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
