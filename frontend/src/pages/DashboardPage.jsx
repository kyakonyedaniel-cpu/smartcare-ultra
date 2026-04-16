import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/hooks/useTheme';
import { Building2, Users, Calendar, AlertTriangle, ArrowUpRight, ArrowDownRight, Clock, CheckCircle, Pill, DollarSign, Plus } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';

const stats = [
  { label: 'Today\'s Revenue', value: 'UGX 413,000', change: '+12.5%', trend: 'up', icon: DollarSign, color: 'from-green-500 to-emerald-600' },
  { label: 'Patients Today', value: '12', change: '+3', trend: 'up', icon: Users, color: 'from-blue-500 to-indigo-600' },
  { label: 'Appointments', value: '8', change: '-2', trend: 'down', icon: Calendar, color: 'from-purple-500 to-pink-600' },
  { label: 'Low Stock Items', value: '3', change: 'Critical', trend: 'alert', icon: AlertTriangle, color: 'from-red-500 to-orange-600' },
];

const appointments = [
  { id: 1, patient: 'Sarah Nakato', time: '10:00 AM', type: 'Consultation', status: 'Confirmed', avatar: 'SN' },
  { id: 2, patient: 'Peter Ochieng', time: '10:30 AM', type: 'Follow-up', status: 'Scheduled', avatar: 'PO' },
  { id: 3, patient: 'Mary Kagaba', time: '11:00 AM', type: 'Checkup', status: 'Scheduled', avatar: 'MK' },
  { id: 4, patient: 'James Wekesa', time: '11:30 AM', type: 'Consultation', status: 'In Progress', avatar: 'JW' },
];

const lowStockItems = [
  { name: 'Paracetamol 500mg', quantity: 15, reorderLevel: 100 },
  { name: 'Amoxicillin 250mg', quantity: 8, reorderLevel: 50 },
  { name: 'ORS Sachet', quantity: 45, reorderLevel: 200 },
];

const recentSales = [
  { id: 'INV-001', patient: 'Sarah Nakato', amount: 45000, time: '09:30 AM', status: 'Paid' },
  { id: 'INV-002', patient: 'Peter Ochieng', amount: 28000, time: '09:15 AM', status: 'Paid' },
  { id: 'INV-003', patient: 'Mary Kagaba', amount: 67000, time: '08:45 AM', status: 'Pending' },
];

export function DashboardPage() {
  const navigate = useNavigate();
  const { isDark, card, input, textMuted, tableRow, tableCell, getBadge } = useTheme();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={cn("text-2xl md:text-3xl font-bold", isDark ? "text-white" : "text-gray-900")}>Dashboard</h1>
          <p className={cn("mt-1", textMuted)}>Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          <select className={cn("px-4 py-2.5 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500", input)}>
            <option>Today</option>
            <option>This Week</option>
            <option>This Month</option>
          </select>
          <button onClick={() => navigate('/patients')} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all duration-200 shadow-lg shadow-blue-600/25">
            <Plus size={18} />
            <span className="hidden sm:inline">Add Patient</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, index) => (
          <div key={index} className={cn("rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 border", card)}>
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-lg`}>
                <stat.icon size={24} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                stat.trend === 'up' ? (isDark ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-600') :
                stat.trend === 'down' ? (isDark ? 'bg-red-900/50 text-red-400' : 'bg-red-100 text-red-600') :
                (isDark ? 'bg-red-900/50 text-red-400' : 'bg-red-100 text-red-600')
              }`}>
                {stat.trend === 'up' ? <ArrowUpRight size={14} /> : stat.trend === 'down' ? <ArrowDownRight size={14} /> : <AlertTriangle size={14} />}
                {stat.change}
              </div>
            </div>
            <div className="mt-4">
              <p className={cn("text-3xl font-bold", isDark ? "text-white" : "text-gray-900")}>{stat.value}</p>
              <p className={cn("text-sm mt-1", textMuted)}>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={cn("lg:col-span-2 rounded-2xl shadow-sm border overflow-hidden", card)}>
          <div className={cn("px-6 py-5 border-b flex items-center justify-between", isDark ? "border-slate-800" : "border-gray-100")}>
            <div>
              <h2 className={cn("text-lg font-bold", isDark ? "text-white" : "text-gray-900")}>Today's Schedule</h2>
              <p className={cn("text-sm mt-0.5", textMuted)}>{appointments.length} appointments</p>
            </div>
            <button onClick={() => navigate('/appointments')} className="text-sm text-blue-600 font-medium hover:text-blue-700 transition-colors">
              View All →
            </button>
          </div>
          <div className="p-6 space-y-3 max-h-[400px] overflow-y-auto">
            {appointments.map((apt) => (
              <div key={apt.id} className={cn("flex items-center gap-4 p-4 rounded-xl transition-colors cursor-pointer", isDark ? "bg-slate-800/50 hover:bg-slate-800" : "bg-gray-50 hover:bg-gray-100")}>
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow">
                  {apt.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn("font-semibold truncate", isDark ? "text-white" : "text-gray-900")}>{apt.patient}</p>
                  <p className={cn("text-sm", textMuted)}>{apt.type}</p>
                </div>
                <div className="text-right">
                  <p className={cn("text-sm font-medium", isDark ? "text-white" : "text-gray-900")}>{apt.time}</p>
                  <span className={`inline-block mt-1 text-xs px-2.5 py-1 rounded-full font-medium ${
                    apt.status === 'Confirmed' ? (isDark ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-700') :
                    apt.status === 'In Progress' ? (isDark ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-100 text-blue-700') :
                    (isDark ? 'bg-yellow-900/50 text-yellow-400' : 'bg-yellow-100 text-yellow-700')
                  }`}>
                    {apt.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className={cn("rounded-2xl shadow-sm border overflow-hidden", card)}>
            <div className={cn("px-6 py-5 border-b", isDark ? "border-slate-800" : "border-gray-100")}>
              <h2 className={cn("text-lg font-bold", isDark ? "text-white" : "text-gray-900")}>Low Stock Alerts</h2>
              <p className={cn("text-sm mt-0.5", isDark ? "text-red-400" : "text-red-500")}>Needs attention</p>
            </div>
            <div className="p-4 space-y-3 max-h-[250px] overflow-y-auto">
              {lowStockItems.map((item, index) => (
                <div className={cn("flex items-center justify-between p-3 rounded-xl", isDark ? "bg-slate-800/50" : "bg-gray-50")}>
                  <div className="flex items-center gap-3">
                    <div className={isDark ? "p-2 bg-red-900/30 rounded-lg" : "p-2 bg-red-100 rounded-lg"}>
                      <Pill size={16} className={isDark ? "text-red-400" : "text-red-600"} />
                    </div>
                    <div>
                      <p className={cn("font-medium text-sm", isDark ? "text-white" : "text-gray-900")}>{item.name}</p>
                      <p className={cn("text-xs", textMuted)}>{item.quantity} in stock</p>
                    </div>
                  </div>
                  <span className={cn("text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap", isDark ? "bg-red-900/50 text-red-400" : "bg-red-100 text-red-600")}>
                    Below reorder
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className={cn("rounded-2xl shadow-sm border overflow-hidden", card)}>
            <div className={cn("px-6 py-5 border-b flex items-center justify-between", isDark ? "border-slate-800" : "border-gray-100")}>
              <h2 className={cn("text-lg font-bold", isDark ? "text-white" : "text-gray-900")}>Recent Sales</h2>
              <button onClick={() => navigate('/invoices')} className="text-sm text-blue-600 font-medium hover:text-blue-700 transition-colors">
                View All →
              </button>
            </div>
            <div className="p-4 space-y-3">
              {recentSales.map((sale) => (
                <div className={cn("flex items-center justify-between p-3 rounded-xl", isDark ? "bg-slate-800/50" : "bg-gray-50")}>
                  <div className="flex items-center gap-3">
                    <div className={isDark ? "p-2 rounded-lg bg-slate-700" : `p-2 rounded-lg ${sale.status === 'Paid' ? 'bg-green-100' : 'bg-yellow-100'}`}>
                      {sale.status === 'Paid' ? <CheckCircle size={16} className={isDark ? "text-green-400" : "text-green-600"} /> : <Clock size={16} className={isDark ? "text-yellow-400" : "text-yellow-600"} />}
                    </div>
                    <div>
                      <p className={cn("font-medium text-sm", isDark ? "text-white" : "text-gray-900")}>{sale.patient}</p>
                      <p className={cn("text-xs", textMuted)}>{sale.time}</p>
                    </div>
                  </div>
                  <p className={cn("font-semibold", isDark ? "text-white" : "text-gray-900")}>{formatCurrency(sale.amount)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}