import React, { useState } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';
import {
  ShoppingCart, X, Plus, Minus, Printer, Trash2, Search,
  CreditCard, DollarSign, Smartphone, User, Receipt, Package
} from 'lucide-react';

const productCategories = [
  { id: 'all', name: 'All Items', icon: '📦' },
  { id: 'medicines', name: 'Medicines', icon: '💊' },
  { id: 'supplies', name: 'Supplies', icon: '🩺' },
  { id: 'equipment', name: 'Equipment', icon: '🔬' },
  { id: 'consumables', name: 'Consumables', icon: '🧤' },
];

const products = [
  { id: '1', name: 'Paracetamol 500mg', category: 'medicines', price: 500, unit: 'tablet' },
  { id: '2', name: 'Amoxicillin 250mg', category: 'medicines', price: 800, unit: 'capsule' },
  { id: '3', name: 'ORS Sachet', category: 'medicines', price: 300, unit: 'sachet' },
  { id: '4', name: 'Ibuprofen 400mg', category: 'medicines', price: 600, unit: 'tablet' },
  { id: '5', name: 'Vitamin C 1000mg', category: 'medicines', price: 400, unit: 'tablet' },
  { id: '6', name: 'Metformin 500mg', category: 'medicines', price: 900, unit: 'tablet' },
  { id: '7', name: 'Omeprazole 20mg', category: 'medicines', price: 1200, unit: 'capsule' },
  { id: '8', name: 'Cough Syrup 100ml', category: 'medicines', price: 2500, unit: 'bottle' },
  { id: '9', name: 'Syringe 5ml', category: 'supplies', price: 200, unit: 'piece' },
  { id: '10', name: 'Gloves (Box)', category: 'supplies', price: 5000, unit: 'box' },
  { id: '11', name: 'Bandage Roll', category: 'supplies', price: 1500, unit: 'roll' },
  { id: '12', name: 'Cotton Wool 500g', category: 'supplies', price: 2500, unit: 'pack' },
  { id: '13', name: 'Thermometer', category: 'equipment', price: 15000, unit: 'piece' },
  { id: '14', name: 'BP Monitor', category: 'equipment', price: 45000, unit: 'piece' },
  { id: '15', name: 'Stethoscope', category: 'equipment', price: 35000, unit: 'piece' },
  { id: '16', name: 'Face Masks (50)', category: 'consumables', price: 8000, unit: 'pack' },
  { id: '17', name: 'Sanitizer 500ml', category: 'consumables', price: 6000, unit: 'bottle' },
  { id: '18', name: 'Alcohol Swabs (100)', category: 'consumables', price: 3000, unit: 'pack' },
];

const mockPatients = [
  { id: '1', name: 'John Omongin', phone: '+256701234567' },
  { id: '2', name: 'Sarah Nakato', phone: '+256702345678' },
  { id: '3', name: 'Peter Okello', phone: '+256703456789' },
  { id: '4', name: 'Grace Amooti', phone: '+256704567890' },
  { id: '5', name: 'David Mukama', phone: '+256705678901' },
];

const paymentMethods = [
  { id: 'cash', name: 'Cash', icon: DollarSign },
  { id: 'mtn', name: 'MTN Mobile Money', icon: Smartphone },
  { id: 'airtel', name: 'Airtel Money', icon: Smartphone },
  { id: 'card', name: 'Card', icon: CreditCard },
];

export function POSPage() {
  const { isDark, card, input, textMuted, getBadge } = useTheme();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [showReceipt, setShowReceipt] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = cartTotal * 0.0;
  const grandTotal = cartTotal + tax;

  const handleCheckout = () => {
    if (!selectedPatient) {
      alert('Please select a patient');
      return;
    }
    if (cart.length === 0) {
      alert('Cart is empty');
      return;
    }
    setShowReceipt(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleNewSale = () => {
    setCart([]);
    setSelectedPatient('');
    setPaymentMethod('cash');
    setShowReceipt(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const selectedPatientObj = mockPatients.find(p => p.id === selectedPatient);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={cn("text-2xl md:text-3xl font-bold", isDark ? "text-white" : "text-gray-900")}>Point of Sale</h1>
          <p className={cn("mt-1", textMuted)}>Process sales and manage transactions</p>
        </div>
      </div>

      {showSuccess && (
        <div className={cn("fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-pulse", isDark ? "bg-green-900 text-green-400" : "bg-green-100 text-green-700")}>
          <Receipt size={20} />
          <span className="font-medium">Sale completed successfully!</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className={cn("rounded-2xl p-6 shadow-sm border", card)}>
            <div className="flex flex-wrap gap-2 mb-4">
              {productCategories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                    activeCategory === category.id
                      ? "bg-blue-600 text-white"
                      : isDark
                        ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  )}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search products..."
                className={cn("w-full pl-12 pr-4 py-3 rounded-xl", input)}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filteredProducts.map(product => (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                className={cn(
                  "p-4 rounded-xl border transition-all hover:scale-105 hover:shadow-lg",
                  card
                )}
              >
                <div className={cn("h-10 w-10 rounded-lg mb-3 flex items-center justify-center", isDark ? "bg-blue-900/30" : "bg-blue-100")}>
                  <span className="text-xl">💊</span>
                </div>
                <p className={cn("font-medium text-sm mb-1", isDark ? "text-white" : "text-gray-900")} style={{ textAlign: 'left' }}>
                  {product.name}
                </p>
                <p className={cn("text-sm font-bold", isDark ? "text-blue-400" : "text-blue-600")}>
                  {formatCurrency(product.price)}
                </p>
                <p className={cn("text-xs mt-1", textMuted)}>/ {product.unit}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className={cn("rounded-2xl shadow-sm border overflow-hidden", card)}>
            <div className={cn("p-4 border-b", isDark ? "border-slate-800" : "border-gray-100")}>
              <div className="flex items-center justify-between">
                <h2 className={cn("text-lg font-bold flex items-center gap-2", isDark ? "text-white" : "text-gray-900")}>
                  <ShoppingCart size={20} />
                  Cart ({cart.length})
                </h2>
                {cart.length > 0 && (
                  <button
                    onClick={() => setCart([])}
                    className={cn("text-sm", isDark ? "text-red-400" : "text-red-600")}
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>
            
            <div className="p-4 space-y-3 max-h-[300px] overflow-y-auto">
              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart size={40} className={cn("mx-auto mb-2", textMuted)} />
                  <p className={cn(textMuted)}>Cart is empty</p>
                  <p className={cn("text-sm", textMuted)}>Add products to get started</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className={cn("flex items-center justify-between p-3 rounded-lg", isDark ? "bg-slate-800/50" : "bg-gray-50")}>
                    <div className="flex-1">
                      <p className={cn("font-medium text-sm", isDark ? "text-white" : "text-gray-900")}>{item.name}</p>
                      <p className={cn("text-xs", textMuted)}>{formatCurrency(item.price)} each</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className={cn("p-1 rounded", isDark ? "bg-slate-700 hover:bg-slate-600" : "bg-gray-200 hover:bg-gray-300")}
                      >
                        <Minus size={14} />
                      </button>
                      <span className={cn("font-medium w-8 text-center", isDark ? "text-white" : "text-gray-900")}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className={cn("p-1 rounded", isDark ? "bg-slate-700 hover:bg-slate-600" : "bg-gray-200 hover:bg-gray-300")}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className={cn("p-1 ml-2", isDark ? "text-red-400 hover:text-red-300" : "text-red-600 hover:text-red-500")}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className={cn("p-4 border-t", isDark ? "border-slate-800" : "border-gray-100")}>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className={cn(textMuted)}>Subtotal</span>
                    <span className={cn("font-medium", isDark ? "text-white" : "text-gray-900")}>{formatCurrency(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={cn(textMuted)}>Tax</span>
                    <span className={cn("font-medium", isDark ? "text-white" : "text-gray-900")}>{formatCurrency(tax)}</span>
                  </div>
                  <div className={cn("flex justify-between text-lg font-bold pt-2 border-t", isDark ? "border-slate-700 text-white" : "border-gray-200 text-gray-900")}>
                    <span>Total</span>
                    <span className={isDark ? "text-green-400" : "text-green-600"}>{formatCurrency(grandTotal)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className={cn("rounded-2xl p-6 shadow-sm border", card)}>
            <h3 className={cn("font-bold mb-4 flex items-center gap-2", isDark ? "text-white" : "text-gray-900")}>
              <User size={18} />
              Select Patient
            </h3>
            <select
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(e.target.value)}
              className={cn("w-full px-4 py-3 rounded-xl", input)}
            >
              <option value="">Choose patient...</option>
              {mockPatients.map(patient => (
                <option key={patient.id} value={patient.id}>
                  {patient.name} ({patient.phone})
                </option>
              ))}
            </select>
          </div>

          <div className={cn("rounded-2xl p-6 shadow-sm border", card)}>
            <h3 className={cn("font-bold mb-4 flex items-center gap-2", isDark ? "text-white" : "text-gray-900")}>
              <CreditCard size={18} />
              Payment Method
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {paymentMethods.map(method => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={cn(
                    "flex items-center gap-2 p-3 rounded-xl border transition-all",
                    paymentMethod === method.id
                      ? "border-blue-600 bg-blue-50"
                      : isDark
                        ? "border-slate-700 hover:bg-slate-800"
                        : "border-gray-200 hover:bg-gray-50"
                  )}
                >
                  <method.icon size={18} className={paymentMethod === method.id ? "text-blue-600" : (isDark ? "text-slate-400" : "text-gray-500")} />
                  <span className={cn("text-sm font-medium", paymentMethod === method.id ? "text-blue-600" : (isDark ? "text-slate-300" : "text-gray-700"))}>
                    {method.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={cart.length === 0 || !selectedPatient}
            className={cn(
              "w-full py-4 rounded-xl font-bold text-lg transition-all",
              cart.length > 0 && selectedPatient
                ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/25"
                : isDark
                  ? "bg-slate-800 text-slate-500"
                  : "bg-gray-200 text-gray-500"
            )}
          >
            Complete Sale - {formatCurrency(grandTotal)}
          </button>
        </div>
      </div>

      {showReceipt && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={cn("rounded-2xl w-full max-w-md shadow-2xl overflow-hidden", isDark ? "bg-slate-900" : "bg-white")}>
            <div className={cn("p-6 border-b", isDark ? "border-slate-800" : "border-gray-100")}>
              <div className="flex items-center justify-between">
                <h2 className={cn("text-xl font-bold flex items-center gap-2", isDark ? "text-white" : "text-gray-900")}>
                  <Receipt size={24} />
                  Receipt
                </h2>
                <button onClick={() => setShowReceipt(false)} className={cn("p-2 rounded-lg", isDark ? "hover:bg-slate-800" : "hover:bg-gray-100")}>
                  <X size={20} className={textMuted} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="text-center border-b pb-4">
                <h3 className={cn("text-xl font-bold", isDark ? "text-white" : "text-gray-900")}>SmartCare Clinic</h3>
                <p className={cn("text-sm", textMuted)}>Kampala Road, Kampala</p>
                <p className={cn("text-sm", textMuted)}>+256 700 123 456</p>
              </div>

              <div className="border-b pb-4">
                <div className="flex justify-between mb-2">
                  <span className={cn(textMuted)}>Date:</span>
                  <span className={isDark ? "text-white" : "text-gray-900"}>{new Date().toLocaleString()}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className={cn(textMuted)}>Patient:</span>
                  <span className={isDark ? "text-white" : "text-gray-900"}>{selectedPatientObj?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className={cn(textMuted)}>Payment:</span>
                  <span className={isDark ? "text-white" : "text-gray-900"}>{paymentMethods.find(m => m.id === paymentMethod)?.name}</span>
                </div>
              </div>

              <div className="space-y-2 border-b pb-4">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between">
                    <div>
                      <span className={isDark ? "text-slate-300" : "text-gray-600"}>{item.name}</span>
                      <span className={cn(" text-sm ml-2", textMuted)}>x{item.quantity}</span>
                    </div>
                    <span className={isDark ? "text-white" : "text-gray-900"}>{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex justify-between">
                  <span className={cn(textMuted)}>Subtotal</span>
                  <span className={isDark ? "text-white" : "text-gray-900"}>{formatCurrency(cartTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className={cn(textMuted)}>Tax</span>
                  <span className={isDark ? "text-white" : "text-gray-900"}>{formatCurrency(tax)}</span>
                </div>
                <div className={cn("flex justify-between text-xl font-bold", isDark ? "text-white" : "text-gray-900")}>
                  <span>Total</span>
                  <span className={isDark ? "text-green-400" : "text-green-600"}>{formatCurrency(grandTotal)}</span>
                </div>
              </div>

              <div className="text-center pt-4">
                <p className={cn("text-sm italic", textMuted)}>Thank you for your purchase!</p>
              </div>
            </div>

            <div className={cn("p-6 border-t flex gap-3", isDark ? "border-slate-800" : "border-gray-100")}>
              <button
                onClick={handlePrint}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all"
              >
                <Printer size={18} />
                Print Receipt
              </button>
              <button
                onClick={handleNewSale}
                className={cn("flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium border", isDark ? "border-slate-700 text-slate-300 hover:bg-slate-800" : "border-gray-200 text-gray-700 hover:bg-gray-50")}
              >
                New Sale
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}