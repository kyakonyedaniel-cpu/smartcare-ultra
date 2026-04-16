import React, { useState } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';
import { 
  Pill, Package, AlertTriangle, TrendingUp, Plus, Search, 
  Filter, Download, X, Edit, Trash2, AlertCircle, Clock,
  Calendar, RefreshCw, FileText, ChevronRight
} from 'lucide-react';

const mockDrugs = [
  { id: '1', name: 'Paracetamol 500mg', code: 'PARA500', category: 'Analgesics', unit: 'tablet', quantity: 250, reorderLevel: 100, expiryDate: '2027-06-15', price: 500, supplier: 'Pharma Uganda' },
  { id: '2', name: 'Amoxicillin 250mg', code: 'AMOX250', category: 'Antibiotics', unit: 'capsule', quantity: 45, reorderLevel: 50, expiryDate: '2026-12-01', price: 800, supplier: 'Medical Distributors' },
  { id: '3', name: 'ORS Sachet', code: 'ORS001', category: 'Rehydration', unit: 'sachet', quantity: 450, reorderLevel: 200, expiryDate: '2027-03-20', price: 300, supplier: 'Health Supplies Co' },
  { id: '4', name: 'Ibuprofen 400mg', code: 'IBUP400', category: 'Analgesics', unit: 'tablet', quantity: 120, reorderLevel: 75, expiryDate: '2026-08-30', price: 600, supplier: 'Pharma Uganda' },
  { id: '5', name: 'Vitamin C 1000mg', code: 'VITC1000', category: 'Vitamins', unit: 'tablet', quantity: 300, reorderLevel: 100, expiryDate: '2027-01-10', price: 400, supplier: 'Medical Distributors' },
  { id: '6', name: 'Metformin 500mg', code: 'METF500', category: 'Diabetes', unit: 'tablet', quantity: 45, reorderLevel: 50, expiryDate: '2026-11-25', price: 900, supplier: 'Health Supplies Co' },
  { id: '7', name: 'Omeprazole 20mg', code: 'OMEP20', category: 'Gastro', unit: 'capsule', quantity: 200, reorderLevel: 40, expiryDate: '2027-02-14', price: 1200, supplier: 'Pharma Uganda' },
  { id: '8', name: 'Cough Syrup 100ml', code: 'COUGH100', category: 'Respiratory', unit: 'bottle', quantity: 35, reorderLevel: 20, expiryDate: '2026-07-01', price: 2500, supplier: 'Medical Distributors' },
];

const categories = ['All', 'Analgesics', 'Antibiotics', 'Rehydration', 'Vitamins', 'Diabetes', 'Gastro', 'Respiratory'];

const lowStockItems = mockDrugs.filter(d => d.quantity < d.reorderLevel);
const expiringSoon = mockDrugs.filter(d => {
  const expiry = new Date(d.expiryDate);
  const daysUntilExpiry = (expiry - new Date()) / (1000 * 60 * 60 * 24);
  return daysUntilExpiry <= 90;
});

export function PharmacyPage() {
  const { isDark, card, input, textMuted, getBadge } = useTheme();
  const [activeTab, setActiveTab] = useState('inventory');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddStockModal, setShowAddStockModal] = useState(false);
  const [selectedDrug, setSelectedDrug] = useState(null);
  const [formData, setFormData] = useState({
    name: '', code: '', category: 'Analgesics', unit: 'tablet', quantity: '', reorderLevel: '', expiryDate: '', price: '', supplier: ''
  });

  const filteredDrugs = mockDrugs.filter(drug => {
    const matchesSearch = drug.name.toLowerCase().includes(searchTerm.toLowerCase()) || drug.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || drug.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const stats = {
    total: mockDrugs.length,
    totalStock: mockDrugs.reduce((sum, d) => sum + d.quantity, 0),
    lowStock: lowStockItems.length,
    expiringSoon: expiringSoon.length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={cn("text-2xl md:text-3xl font-bold", isDark ? "text-white" : "text-gray-900")}>Pharmacy</h1>
          <p className={cn("mt-1", textMuted)}>Manage drugs and inventory</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowAddStockModal(true)}
            className={cn("flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all", isDark ? "border border-slate-700 text-slate-300 hover:bg-slate-800" : "border border-gray-200 text-gray-700 hover:bg-gray-50")}
          >
            <Package size={18} />
            Add Stock
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/25"
          >
            <Plus size={18} />
            Add Drug
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={cn("rounded-2xl p-5 shadow-sm border", card)}>
          <div className="flex items-center justify-between">
            <div>
              <p className={cn("text-sm font-medium", textMuted)}>Total Drugs</p>
              <p className={cn("text-2xl font-bold mt-1", isDark ? "text-white" : "text-gray-900")}>{stats.total}</p>
            </div>
            <div className={isDark ? "h-12 w-12 rounded-xl bg-blue-900/30 flex items-center justify-center" : "h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center"}>
              <Pill size={24} className="text-blue-600" />
            </div>
          </div>
        </div>
        <div className={cn("rounded-2xl p-5 shadow-sm border", card)}>
          <div className="flex items-center justify-between">
            <div>
              <p className={cn("text-sm font-medium", textMuted)}>Total Stock</p>
              <p className={cn("text-2xl font-bold mt-1", isDark ? "text-white" : "text-gray-900")}>{stats.totalStock.toLocaleString()}</p>
            </div>
            <div className={isDark ? "h-12 w-12 rounded-xl bg-green-900/30 flex items-center justify-center" : "h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center"}>
              <Package size={24} className="text-green-600" />
            </div>
          </div>
        </div>
        <div className={cn("rounded-2xl p-5 shadow-sm border", card)}>
          <div className="flex items-center justify-between">
            <div>
              <p className={cn("text-sm font-medium", textMuted)}>Low Stock</p>
              <p className={cn("text-2xl font-bold mt-1", isDark ? "text-red-400" : "text-red-600")}>{stats.lowStock}</p>
            </div>
            <div className={isDark ? "h-12 w-12 rounded-xl bg-red-900/30 flex items-center justify-center" : "h-12 w-12 rounded-xl bg-red-100 flex items-center justify-center"}>
              <AlertTriangle size={24} className="text-red-600" />
            </div>
          </div>
        </div>
        <div className={cn("rounded-2xl p-5 shadow-sm border", card)}>
          <div className="flex items-center justify-between">
            <div>
              <p className={cn("text-sm font-medium", textMuted)}>Expiring Soon</p>
              <p className={cn("text-2xl font-bold mt-1", isDark ? "text-orange-400" : "text-orange-600")}>{stats.expiringSoon}</p>
            </div>
            <div className={isDark ? "h-12 w-12 rounded-xl bg-orange-900/30 flex items-center justify-center" : "h-12 w-12 rounded-xl bg-orange-100 flex items-center justify-center"}>
              <TrendingUp size={24} className="text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      <div className={cn("rounded-2xl shadow-sm border overflow-hidden", card)}>
        <div className={cn("border-b overflow-x-auto", isDark ? "border-slate-800" : "border-gray-100")}>
          <div className="flex min-w-max">
            {[
              { id: 'inventory', label: 'Inventory', icon: Package },
              { id: 'lowstock', label: 'Low Stock', icon: AlertTriangle },
              { id: 'expiry', label: 'Expiring', icon: Clock },
              { id: 'suppliers', label: 'Suppliers', icon: FileText },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors",
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600 bg-blue-50/50"
                    : "border-transparent",
                  isDark ? "text-slate-400" : "text-gray-500"
                )}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'inventory' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search drugs..."
                    className={cn("w-full pl-12 pr-4 py-3 rounded-xl", input)}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className={cn("px-4 py-3 rounded-xl text-sm", input)}
                >
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <button className={cn("flex items-center gap-2 px-4 py-3 rounded-xl text-sm", isDark ? "border border-slate-700 text-slate-300" : "border border-gray-200 text-gray-700")}>
                  <Download size={18} />
                  Export
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={isDark ? "bg-slate-800" : "bg-gray-50"}>
                      <th className={cn("text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider", textMuted)}>Drug</th>
                      <th className={cn("text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider", textMuted)}>Category</th>
                      <th className={cn("text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider", textMuted)}>Stock</th>
                      <th className={cn("text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider", textMuted)}>Price</th>
                      <th className={cn("text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider", textMuted)}>Expiry</th>
                      <th className={cn("text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider", textMuted)}>Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredDrugs.map((drug) => {
                      const isLowStock = drug.quantity < drug.reorderLevel;
                      const isExpiring = new Date(drug.expiryDate) <= new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
                      return (
                        <tr key={drug.id} className={isDark ? "hover:bg-slate-800" : "hover:bg-gray-50"}>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className={isDark ? "h-8 w-8 rounded-lg bg-purple-900/30 flex items-center justify-center" : "h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center"}>
                                <Pill size={16} className="text-purple-600" />
                              </div>
                              <div>
                                <p className={cn("font-medium", isDark ? "text-white" : "text-gray-900")}>{drug.name}</p>
                                <p className={cn("text-xs", textMuted)}>{drug.code}</p>
                              </div>
                            </div>
                          </td>
                          <td className={cn("px-4 py-3", textMuted)}>{drug.category}</td>
                          <td className="px-4 py-3">
                            <span className={cn("font-medium", isLowStock ? (isDark ? "text-red-400" : "text-red-600") : (isDark ? "text-white" : "text-gray-900"))}>
                              {drug.quantity} {drug.unit}s
                            </span>
                          </td>
                          <td className={cn("px-4 py-3", isDark ? "text-slate-300" : "text-gray-600")}>UGX {drug.price.toLocaleString()}</td>
                          <td className={cn("px-4 py-3", isExpiring ? (isDark ? "text-orange-400" : "text-orange-600") : (isDark ? "text-slate-300" : "text-gray-600"))}>
                            {new Date(drug.expiryDate).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3">
                            <span className={cn("px-2 py-1 rounded-full text-xs font-medium", 
                              isLowStock ? (isDark ? "bg-red-900/50 text-red-400" : "bg-red-100 text-red-700") :
                              isExpiring ? (isDark ? "bg-orange-900/50 text-orange-400" : "bg-orange-100 text-orange-700") :
                              (isDark ? "bg-green-900/50 text-green-400" : "bg-green-100 text-green-700")
                            )}>
                              {isLowStock ? 'Low Stock' : isExpiring ? 'Expiring' : 'In Stock'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'lowstock' && (
            <div className="space-y-3">
              {lowStockItems.map((drug) => (
                <div key={drug.id} className={cn("flex items-center justify-between p-4 rounded-xl border", isDark ? "bg-red-900/10 border-red-900/30" : "bg-red-50 border-red-100")}>
                  <div className="flex items-center gap-4">
                    <div className={isDark ? "h-10 w-10 rounded-lg bg-red-900/30 flex items-center justify-center" : "h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center"}>
                      <AlertTriangle size={20} className="text-red-600" />
                    </div>
                    <div>
                      <p className={cn("font-medium", isDark ? "text-white" : "text-gray-900")}>{drug.name}</p>
                      <p className={cn("text-sm", textMuted)}>Reorder level: {drug.reorderLevel}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={cn("text-lg font-bold", isDark ? "text-red-400" : "text-red-600")}>{drug.quantity} left</p>
                    <button className="text-sm text-blue-600 hover:underline">Reorder</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'expiry' && (
            <div className="space-y-3">
              {expiringSoon.map((drug) => (
                <div key={drug.id} className={cn("flex items-center justify-between p-4 rounded-xl border", isDark ? "bg-orange-900/10 border-orange-900/30" : "bg-orange-50 border-orange-100")}>
                  <div className="flex items-center gap-4">
                    <div className={isDark ? "h-10 w-10 rounded-lg bg-orange-900/30 flex items-center justify-center" : "h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center"}>
                      <Clock size={20} className="text-orange-600" />
                    </div>
                    <div>
                      <p className={cn("font-medium", isDark ? "text-white" : "text-gray-900")}>{drug.name}</p>
                      <p className={cn("text-sm", textMuted)}>{drug.quantity} {drug.unit}s</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={cn("text-lg font-bold", isDark ? "text-orange-400" : "text-orange-600")}>
                      {new Date(drug.expiryDate).toLocaleDateString()}
                    </p>
                    <button className="text-sm text-blue-600 hover:underline">Use First</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'suppliers' && (
            <div className="space-y-3">
              {['Pharma Uganda', 'Medical Distributors', 'Health Supplies Co'].map((supplier, i) => (
                <div key={i} className={cn("flex items-center justify-between p-4 rounded-xl", isDark ? "bg-slate-800/50" : "bg-gray-50")}>
                  <div className="flex items-center gap-4">
                    <div className={isDark ? "h-10 w-10 rounded-lg bg-slate-700 flex items-center justify-center" : "h-10 w-10 rounded-lg bg-white border flex items-center justify-center"}>
                      <Package size={20} className="text-gray-600" />
                    </div>
                    <div>
                      <p className={cn("font-medium", isDark ? "text-white" : "text-gray-900")}>{supplier}</p>
                      <p className={cn("text-sm", textMuted)}>5 products</p>
                    </div>
                  </div>
                  <button className="text-blue-600 hover:underline text-sm">View Products</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowAddModal(false)}>
          <div className={cn("rounded-2xl p-6 md:p-8 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto", isDark ? "bg-slate-900" : "bg-white")} onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className={cn("text-xl font-bold", isDark ? "text-white" : "text-gray-900")}>Add New Drug</h2>
              <button onClick={() => setShowAddModal(false)} className={cn("p-2 rounded-xl", isDark ? "hover:bg-slate-800" : "hover:bg-gray-100")}>
                <X size={20} className={textMuted} />
              </button>
            </div>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className={cn("text-sm font-medium", isDark ? "text-slate-300" : "text-gray-700")}>Drug Name</label>
                  <input type="text" className={cn("w-full px-4 py-3 rounded-xl", input)} placeholder="e.g. Paracetamol 500mg" />
                </div>
                <div className="space-y-2">
                  <label className={cn("text-sm font-medium", isDark ? "text-slate-300" : "text-gray-700")}>Code</label>
                  <input type="text" className={cn("w-full px-4 py-3 rounded-xl", input)} placeholder="e.g. PARA500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className={cn("text-sm font-medium", isDark ? "text-slate-300" : "text-gray-700")}>Category</label>
                  <select className={cn("w-full px-4 py-3 rounded-xl", input)}>
                    {categories.filter(c => c !== 'All').map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className={cn("text-sm font-medium", isDark ? "text-slate-300" : "text-gray-700")}>Unit</label>
                  <select className={cn("w-full px-4 py-3 rounded-xl", input)}>
                    <option>tablet</option>
                    <option>capsule</option>
                    <option>sachet</option>
                    <option>bottle</option>
                    <option>injection</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className={cn("text-sm font-medium", isDark ? "text-slate-300" : "text-gray-700")}>Price (UGX)</label>
                  <input type="number" className={cn("w-full px-4 py-3 rounded-xl", input)} placeholder="500" />
                </div>
                <div className="space-y-2">
                  <label className={cn("text-sm font-medium", isDark ? "text-slate-300" : "text-gray-700")}>Reorder Level</label>
                  <input type="number" className={cn("w-full px-4 py-3 rounded-xl", input)} placeholder="50" />
                </div>
              </div>
              <div className="space-y-2">
                <label className={cn("text-sm font-medium", isDark ? "text-slate-300" : "text-gray-700")}>Expiry Date</label>
                <input type="date" className={cn("w-full px-4 py-3 rounded-xl", input)} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700">Add Drug</button>
                <button type="button" onClick={() => setShowAddModal(false)} className={cn("flex-1 px-4 py-3 rounded-xl font-medium border", isDark ? "border-slate-700 text-slate-300" : "border-gray-200 text-gray-700")}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}