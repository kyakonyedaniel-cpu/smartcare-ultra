import React, { useMemo, useState } from 'react';
import { Plus, Trash2, Download, Wallet, TrendingDown, Receipt, X } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

const CATEGORIES = ['Rent', 'Salaries', 'Utilities', 'Supplies', 'Drug Stock', 'Transport', 'Maintenance', 'Other'];

const initialExpenses = [
  { id: '1', date: '2026-04-14', description: 'Monthly clinic rent', category: 'Rent', amount: 350000, paidBy: 'Cash' },
  { id: '2', date: '2026-04-12', description: 'Nurse & reception salaries', category: 'Salaries', amount: 280000, paidBy: 'Bank' },
  { id: '3', date: '2026-04-10', description: 'UMEME electricity bill', category: 'Utilities', amount: 65000, paidBy: 'MTN MoMo' },
  { id: '4', date: '2026-04-09', description: 'Gloves, syringes, cotton', category: 'Supplies', amount: 85000, paidBy: 'Cash' },
  { id: '5', date: '2026-04-07', description: 'Amoxicillin restock (200 units)', category: 'Drug Stock', amount: 140000, paidBy: 'Bank' },
  { id: '6', date: '2026-04-05', description: 'Boda delivery of supplies', category: 'Transport', amount: 25000, paidBy: 'Cash' },
  { id: '7', date: '2026-04-03', description: 'Generator servicing', category: 'Maintenance', amount: 90000, paidBy: 'Cash' },
  { id: '8', date: '2026-03-28', description: 'March clinic rent', category: 'Rent', amount: 350000, paidBy: 'Cash' },
  { id: '9', date: '2026-03-24', description: 'March salaries', category: 'Salaries', amount: 280000, paidBy: 'Bank' },
  { id: '10', date: '2026-03-15', description: 'Water bill', category: 'Utilities', amount: 45000, paidBy: 'Cash' },
];

const formatCurrency = (amount) => `UGX ${Number(amount).toLocaleString()}`;

const formatDate = (value) => {
  const d = new Date(value);
  return isNaN(d) ? value : d.toLocaleDateString();
};

export function ExpensesPage() {
  const { isDark, card, input, textMuted, tableHead, tableRow, tableCell } = useTheme();
  const [expenses, setExpenses] = useState(initialExpenses);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    description: '',
    category: 'Supplies',
    amount: '',
    paidBy: 'Cash',
  });

  const summary = useMemo(() => {
    const byMonth = (m) =>
      expenses
        .filter((e) => new Date(e.date).getMonth() === m)
        .reduce((sum, e) => sum + Number(e.amount || 0), 0);

    const byCategory = expenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + Number(e.amount || 0);
      return acc;
    }, {});
    const top = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0];

    return {
      total: expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0),
      thisMonth: byMonth(3),
      lastMonth: byMonth(2),
      topCategory: top ? top[0] : '—',
      topCategoryAmount: top ? top[1] : 0,
    };
  }, [expenses]);

  const filtered = expenses
    .filter((e) => category === 'all' || e.category === category)
    .filter(
      (e) =>
        e.description.toLowerCase().includes(search.toLowerCase()) ||
        e.category.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const addExpense = (e) => {
    e.preventDefault();
    if (!form.description.trim() || !form.amount) return;
    setExpenses((prev) => [
      { id: String(Date.now()), ...form, amount: Number(form.amount) },
      ...prev,
    ]);
    setForm({
      date: new Date().toISOString().slice(0, 10),
      description: '',
      category: 'Supplies',
      amount: '',
      paidBy: 'Cash',
    });
    setShowModal(false);
  };

  const removeExpense = (id) => setExpenses((prev) => prev.filter((e) => e.id !== id));

  const exportCsv = () => {
    const rows = [
      ['Date', 'Description', 'Category', 'Paid By', 'Amount (UGX)'],
      ...filtered.map((e) => [e.date, e.description, e.category, e.paidBy, e.amount]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expenses-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={cn('text-2xl md:text-3xl font-bold', isDark ? 'text-white' : 'text-gray-900')}>Expenses</h1>
          <p className={cn('mt-1', textMuted)}>Track business expenses</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={exportCsv}
            className={cn('flex items-center gap-2 px-4 py-2.5 rounded-xl border font-medium', isDark ? 'border-slate-700 text-slate-300' : 'border-gray-200 text-gray-700')}
          >
            <Download size={16} /> Export
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700"
          >
            <Plus size={16} /> Add Expense
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={cn('p-6 border', card)}>
          <div className="flex items-center justify-between">
            <div>
              <p className={cn('text-sm', textMuted)}>This Month</p>
              <p className={cn('text-2xl font-bold', isDark ? 'text-white' : 'text-gray-900')}>{formatCurrency(summary.thisMonth)}</p>
            </div>
            <Wallet className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className={cn('p-6 border', card)}>
          <div className="flex items-center justify-between">
            <div>
              <p className={cn('text-sm', textMuted)}>Last Month</p>
              <p className={cn('text-2xl font-bold', isDark ? 'text-white' : 'text-gray-900')}>{formatCurrency(summary.lastMonth)}</p>
            </div>
            <TrendingDown className="h-8 w-8 text-red-500" />
          </div>
        </div>
        <div className={cn('p-6 border', card)}>
          <div className="flex items-center justify-between">
            <div>
              <p className={cn('text-sm', textMuted)}>Largest Category</p>
              <p className={cn('text-2xl font-bold', isDark ? 'text-white' : 'text-gray-900')}>{summary.topCategory}</p>
              <p className={cn('text-xs mt-1', textMuted)}>{formatCurrency(summary.topCategoryAmount)} in total</p>
            </div>
            <Receipt className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      <div className={cn('border', card)}>
        <div className={cn('p-4 border-b flex flex-col sm:flex-row gap-3', isDark ? 'border-slate-800' : 'border-gray-100')}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search expenses..."
            className={cn('flex-1 px-4 py-2.5 rounded-xl border outline-none', input)}
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={cn('px-4 py-2.5 rounded-xl border outline-none', input)}
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className={tableHead}>
              <tr>
                {['DATE', 'DESCRIPTION', 'CATEGORY', 'PAID BY', 'AMOUNT', 'ACTIONS'].map((h) => (
                  <th key={h} className={cn('text-left px-4 py-3 text-xs font-semibold', textMuted)}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => (
                <tr key={e.id} className={cn('border-t', isDark ? 'border-slate-800' : 'border-gray-100', tableRow)}>
                  <td className={cn('px-4 py-3', tableCell)}>{formatDate(e.date)}</td>
                  <td className={cn('px-4 py-3 font-medium', isDark ? 'text-white' : 'text-gray-900')}>{e.description}</td>
                  <td className={cn('px-4 py-3', tableCell)}>{e.category}</td>
                  <td className={cn('px-4 py-3', tableCell)}>{e.paidBy}</td>
                  <td className={cn('px-4 py-3 font-semibold', isDark ? 'text-white' : 'text-gray-900')}>{formatCurrency(e.amount)}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => removeExpense(e.id)}
                      className="p-2 rounded-lg text-red-600 hover:bg-red-50"
                      title="Delete expense"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className={cn('px-4 py-10 text-center', textMuted)}>
                    No expenses match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowModal(false)}>
          <div className={cn('w-full max-w-lg rounded-2xl p-6', isDark ? 'bg-slate-900' : 'bg-white')} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={cn('text-lg font-bold', isDark ? 'text-white' : 'text-gray-900')}>Add Expense</h2>
              <button onClick={() => setShowModal(false)} className={cn('p-2 rounded-lg', isDark ? 'hover:bg-slate-800' : 'hover:bg-gray-100')}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={addExpense} className="space-y-4">
              <div>
                <label className={cn('block text-sm font-medium mb-1', isDark ? 'text-slate-300' : 'text-gray-700')}>Description</label>
                <input
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="e.g. UMEME electricity bill"
                  className={cn('w-full px-4 py-2.5 rounded-xl border outline-none', input)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={cn('block text-sm font-medium mb-1', isDark ? 'text-slate-300' : 'text-gray-700')}>Amount (UGX)</label>
                  <input
                    required
                    type="number"
                    min="0"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    placeholder="50000"
                    className={cn('w-full px-4 py-2.5 rounded-xl border outline-none', input)}
                  />
                </div>
                <div>
                  <label className={cn('block text-sm font-medium mb-1', isDark ? 'text-slate-300' : 'text-gray-700')}>Date</label>
                  <input
                    required
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className={cn('w-full px-4 py-2.5 rounded-xl border outline-none', input)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={cn('block text-sm font-medium mb-1', isDark ? 'text-slate-300' : 'text-gray-700')}>Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className={cn('w-full px-4 py-2.5 rounded-xl border outline-none', input)}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={cn('block text-sm font-medium mb-1', isDark ? 'text-slate-300' : 'text-gray-700')}>Paid By</label>
                  <select
                    value={form.paidBy}
                    onChange={(e) => setForm({ ...form, paidBy: e.target.value })}
                    className={cn('w-full px-4 py-2.5 rounded-xl border outline-none', input)}
                  >
                    {['Cash', 'Bank', 'MTN MoMo', 'Airtel Money'].map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className={cn('px-4 py-2.5 rounded-xl border font-medium', isDark ? 'border-slate-700 text-slate-300' : 'border-gray-200 text-gray-700')}>
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700">
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
