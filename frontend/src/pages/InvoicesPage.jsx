import React, { useState, useEffect, useRef } from 'react';
import { 
  Receipt, DollarSign, Clock, CheckCircle, Plus, 
  Search, Download, Printer, Eye, X, FileText,
  CreditCard, Banknote, TrendingUp
} from 'lucide-react';

const mockInvoices = [
  { id: 'INV-001', invoiceNumber: 'INV-2026-001', patient: 'Sarah Nakato', patientId: '1', amount: 45000, paidAmount: 45000, status: 'paid', date: '2026-04-10', dueDate: '2026-04-17', items: [{ description: 'Consultation', quantity: 1, price: 25000 }, { description: 'Lab Test - CBC', quantity: 1, price: 20000 }] },
  { id: 'INV-002', invoiceNumber: 'INV-2026-002', patient: 'Peter Ochieng', patientId: '2', amount: 28000, paidAmount: 0, status: 'pending', date: '2026-04-09', dueDate: '2026-04-16', items: [{ description: 'Consultation', quantity: 1, price: 25000 }, { description: 'Paracetamol 500mg', quantity: 2, price: 1500 }] },
  { id: 'INV-003', invoiceNumber: 'INV-2026-003', patient: 'Mary Kagaba', patientId: '3', amount: 65000, paidAmount: 30000, status: 'partial', date: '2026-04-08', dueDate: '2026-04-15', items: [{ description: 'X-Ray Chest', quantity: 1, price: 35000 }, { description: 'Consultation', quantity: 1, price: 30000 }] },
  { id: 'INV-004', invoiceNumber: 'INV-2026-004', patient: 'James Wekesa', patientId: '4', amount: 120000, paidAmount: 120000, status: 'paid', date: '2026-04-07', dueDate: '2026-04-14', items: [{ description: 'Minor Surgery', quantity: 1, price: 80000 }, { description: 'Anesthesia', quantity: 1, price: 20000 }, { description: 'Dressings', quantity: 2, price: 10000 }] },
  { id: 'INV-005', invoiceNumber: 'INV-2026-005', patient: 'Grace Nabisere', patientId: '5', amount: 18500, paidAmount: 0, status: 'overdue', date: '2026-04-01', dueDate: '2026-04-08', items: [{ description: 'Consultation', quantity: 1, price: 25000 }, { description: 'ORS Sachets', quantity: 5, price: 700 }] },
  { id: 'INV-006', invoiceNumber: 'INV-2026-006', patient: 'John Sserugo', patientId: '6', amount: 35000, paidAmount: 35000, status: 'paid', date: '2026-04-05', dueDate: '2026-04-12', items: [{ description: 'Dental Checkup', quantity: 1, price: 35000 }] },
];

const formatCurrency = (amount) => {
  return `UGX ${amount.toLocaleString()}`;
};

export function InvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const printRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      setInvoices(mockInvoices);
      setLoading(false);
    }, 300);
  }, []);

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = 
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.patient.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: invoices.reduce((sum, inv) => sum + inv.amount, 0),
    paid: invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.paidAmount, 0),
    pending: invoices.filter(inv => inv.status === 'pending' || inv.status === 'partial').reduce((sum, inv) => sum + (inv.amount - inv.paidAmount), 0),
    overdue: invoices.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + inv.amount, 0),
  };

  const getStatusBadge = (status) => {
    const styles = {
      paid: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      partial: 'bg-blue-100 text-blue-700',
      overdue: 'bg-red-100 text-red-700',
      cancelled: 'bg-gray-100 text-gray-700',
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  const handlePrint = () => {
    const printContent = printRef.current;
    const win = window.open('', '_blank');
    win.document.write(`
      <html>
        <head>
          <title>Invoice ${selectedInvoice.invoiceNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            .header { display: flex; justify-content: space-between; margin-bottom: 30px; }
            .clinic-name { font-size: 24px; font-weight: bold; color: #2563eb; }
            .invoice-info { text-align: right; }
            .invoice-number { font-size: 18px; font-weight: bold; }
            .patient-info { margin-bottom: 30px; padding: 20px; background: #f9fafb; border-radius: 8px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
            th { background: #f3f4f6; }
            .totals { text-align: right; }
            .total-row { font-size: 18px; font-weight: bold; }
            .footer { margin-top: 50px; text-align: center; color: #6b7280; }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    win.document.close();
    win.print();
  };

  const handleDownload = () => {
    const printContent = printRef.current.innerHTML;
    const blob = new Blob([`
      <html>
        <head>
          <title>Invoice ${selectedInvoice.invoiceNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            .header { display: flex; justify-content: space-between; margin-bottom: 30px; }
            .clinic-name { font-size: 24px; font-weight: bold; color: #2563eb; }
            .invoice-info { text-align: right; }
            .invoice-number { font-size: 18px; font-weight: bold; }
            .patient-info { margin-bottom: 30px; padding: 20px; background: #f9fafb; border-radius: 8px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
            th { background: #f3f4f6; }
            .totals { text-align: right; }
            .total-row { font-size: 18px; font-weight: bold; }
          </style>
        </head>
        <body>${printContent}</body>
      </html>
    `], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedInvoice.invoiceNumber}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Invoices</h1>
          <p className="text-gray-500 mt-1">Manage invoices and track payments</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/25"
        >
          <Plus size={20} />
          Create Invoice
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Revenue</p>
              <p className="text-2xl font-bold text-blue-700 mt-1">{formatCurrency(stats.total)}</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-blue-200/50 flex items-center justify-center">
              <Receipt size={24} className="text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Paid</p>
              <p className="text-2xl font-bold text-green-700 mt-1">{formatCurrency(stats.paid)}</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-green-200/50 flex items-center justify-center">
              <CheckCircle size={24} className="text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600 font-medium">Pending</p>
              <p className="text-2xl font-bold text-yellow-700 mt-1">{formatCurrency(stats.pending)}</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-yellow-200/50 flex items-center justify-center">
              <Clock size={24} className="text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 font-medium">Overdue</p>
              <p className="text-2xl font-bold text-red-700 mt-1">{formatCurrency(stats.overdue)}</p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-red-200/50 flex items-center justify-center">
              <TrendingUp size={24} className="text-red-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 md:p-6 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by invoice # or patient..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="partial">Partial</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Invoice</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Patient</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Due Date</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-12">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  </td>
                </tr>
              ) : filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-gray-500">
                    {searchTerm ? 'No invoices match your search.' : 'No invoices found.'}
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">{inv.invoiceNumber}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 font-semibold text-sm">
                            {inv.patient.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <span className="font-medium text-gray-900">{inv.patient}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{new Date(inv.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-gray-600">{new Date(inv.dueDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">{formatCurrency(inv.amount)}</p>
                      {inv.paidAmount > 0 && inv.paidAmount < inv.amount && (
                        <p className="text-xs text-gray-500">Paid: {formatCurrency(inv.paidAmount)}</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadge(inv.status)}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedInvoice(inv)}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Invoice"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => { setSelectedInvoice(inv); setTimeout(handlePrint, 100); }}
                          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Print"
                        >
                          <Printer size={18} />
                        </button>
                        <button
                          onClick={() => { setSelectedInvoice(inv); setTimeout(handleDownload, 100); }}
                          className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Download"
                        >
                          <Download size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedInvoice && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto" onClick={() => setSelectedInvoice(null)}>
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl my-8" onClick={e => e.stopPropagation()}>
            <div ref={printRef} className="p-8">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h1 className="text-2xl font-bold text-blue-600">SmartCare Clinic</h1>
                  <p className="text-gray-500 text-sm mt-1">Kampala, Uganda</p>
                  <p className="text-gray-500 text-sm">+256 700 123 456</p>
                </div>
                <div className="text-right">
                  <h2 className="text-xl font-bold text-gray-900">INVOICE</h2>
                  <p className="text-gray-600 mt-1">{selectedInvoice.invoiceNumber}</p>
                  <p className="text-sm text-gray-500">Date: {new Date(selectedInvoice.date).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-500">Due: {new Date(selectedInvoice.dueDate).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Bill To</p>
                <p className="font-semibold text-gray-900">{selectedInvoice.patient}</p>
                <p className="text-sm text-gray-600">Patient ID: {selectedInvoice.patientId}</p>
              </div>

              <table className="w-full mb-6">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 text-xs font-semibold text-gray-500 uppercase">Description</th>
                    <th className="text-center py-3 text-xs font-semibold text-gray-500 uppercase">Qty</th>
                    <th className="text-right py-3 text-xs font-semibold text-gray-500 uppercase">Price</th>
                    <th className="text-right py-3 text-xs font-semibold text-gray-500 uppercase">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedInvoice.items.map((item, i) => (
                    <tr key={i} className="border-b border-gray-100">
                      <td className="py-3 text-gray-900">{item.description}</td>
                      <td className="py-3 text-center text-gray-600">{item.quantity}</td>
                      <td className="py-3 text-right text-gray-600">{formatCurrency(item.price)}</td>
                      <td className="py-3 text-right font-medium text-gray-900">{formatCurrency(item.price * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-end mb-8">
                <div className="w-64">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-gray-900">{formatCurrency(selectedInvoice.amount)}</span>
                  </div>
                  {selectedInvoice.paidAmount > 0 && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Paid</span>
                      <span className="font-medium text-green-600">-{formatCurrency(selectedInvoice.paidAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-3 text-lg font-bold">
                    <span>Balance</span>
                    <span className={selectedInvoice.amount - selectedInvoice.paidAmount > 0 ? 'text-red-600' : 'text-green-600'}>
                      {formatCurrency(selectedInvoice.amount - selectedInvoice.paidAmount)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-4 text-center">
                <p className="text-sm text-blue-800">
                  Payment accepted via Cash, Mobile Money (MTN/Airtel), or Credit Card
                </p>
                <p className="text-xs text-blue-600 mt-1">Thank you for choosing SmartCare Clinic</p>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button
                onClick={handlePrint}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all"
              >
                <Printer size={18} />
                Print Invoice
              </button>
              <button
                onClick={handleDownload}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all"
              >
                <Download size={18} />
                Download
              </button>
              {selectedInvoice.status !== 'paid' && (
                <button
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-all"
                >
                  <CreditCard size={18} />
                  Record Payment
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowCreateModal(false)}>
          <div className="bg-white rounded-2xl p-6 md:p-8 w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Create Invoice</h2>
                <p className="text-sm text-gray-500 mt-1">Generate a new invoice for a patient</p>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <form className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Patient</label>
                <input
                  type="text"
                  placeholder="Search patient..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Services/Items</label>
                <textarea
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                  rows={4}
                  placeholder="List services or items..."
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all">
                  Create Invoice
                </button>
                <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
