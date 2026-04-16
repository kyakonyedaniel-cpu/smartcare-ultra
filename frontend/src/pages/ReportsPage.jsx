import React, { useState } from 'react';
import { 
  BarChart3, Download, TrendingUp, Users, DollarSign, 
  Calendar, PieChart, Activity, Filter, FileText,
  ArrowUpRight, ArrowDownRight, ChevronDown, RefreshCw
} from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart as RechartsPie, Pie, Cell, Legend, AreaChart, Area
} from 'recharts';

const revenueData = [
  { month: 'Jan', revenue: 8500000, patients: 125, appointments: 89 },
  { month: 'Feb', revenue: 9200000, patients: 142, appointments: 95 },
  { month: 'Mar', revenue: 10500000, patients: 158, appointments: 112 },
  { month: 'Apr', revenue: 11200000, patients: 167, appointments: 124 },
  { month: 'May', revenue: 9800000, patients: 148, appointments: 98 },
  { month: 'Jun', revenue: 12500000, patients: 185, appointments: 138 },
];

const appointmentTypeData = [
  { name: 'Consultations', value: 45, color: '#3B82F6' },
  { name: 'Checkups', value: 28, color: '#10B981' },
  { name: 'Follow-ups', value: 18, color: '#8B5CF6' },
  { name: 'Lab Tests', value: 9, color: '#F59E0B' },
];

const topDrugsData = [
  { name: 'Paracetamol 500mg', sales: 245, revenue: 6125000 },
  { name: 'Amoxicillin 250mg', sales: 189, revenue: 9450000 },
  { name: 'ORS Sachets', sales: 156, revenue: 1560000 },
  { name: 'Ibuprofen 400mg', sales: 134, revenue: 6700000 },
  { name: 'Metformin 500mg', sales: 98, revenue: 8820000 },
];

const patientFlowData = [
  { time: '8AM', patients: 12 },
  { time: '9AM', patients: 28 },
  { time: '10AM', patients: 45 },
  { time: '11AM', patients: 52 },
  { time: '12PM', patients: 35 },
  { time: '1PM', patients: 22 },
  { time: '2PM', patients: 38 },
  { time: '3PM', patients: 42 },
  { time: '4PM', patients: 48 },
  { time: '5PM', patients: 30 },
];

const weeklyData = [
  { day: 'Mon', revenue: 4200000, appointments: 32 },
  { day: 'Tue', revenue: 3800000, appointments: 28 },
  { day: 'Wed', revenue: 5100000, appointments: 38 },
  { day: 'Thu', revenue: 4600000, appointments: 35 },
  { day: 'Fri', revenue: 5800000, appointments: 42 },
  { day: 'Sat', revenue: 3200000, appointments: 25 },
  { day: 'Sun', revenue: 1800000, appointments: 15 },
];

const formatCurrency = (value) => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
  return value.toString();
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className={cn("p-3 rounded-lg shadow-lg", isDark ? "bg-slate-800 border border-slate-700" : "bg-white border-gray-100")}>
        <p className={cn("font-semibold mb-1", isDark ? "text-white" : "text-gray-900")}>{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name.includes('revenue') || entry.name.includes('Revenue') 
              ? `UGX ${formatCurrency(entry.value)}` 
              : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function ReportsPage() {
  const { isDark, input, textMuted } = useTheme();
  const [dateRange, setDateRange] = useState('this-month');
  const [loading, setLoading] = useState(false);

  const stats = {
    totalRevenue: 12500000,
    totalPatients: 856,
    totalAppointments: 156,
    avgPerPatient: 14600,
    revenueGrowth: 12.5,
    patientGrowth: 8.2,
  };

  const refreshData = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={cn("text-2xl md:text-3xl font-bold", isDark ? "text-white" : "text-gray-900")}>Reports & Analytics</h1>
          <p className={cn(textMuted, "mt-1")}>Business insights and performance metrics</p>
        </div>
        <div className="flex gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className={cn("px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500", isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-gray-200")}
          >
            <option value="today">Today</option>
            <option value="this-week">This Week</option>
            <option value="this-month">This Month</option>
            <option value="last-month">Last Month</option>
            <option value="this-year">This Year</option>
          </select>
          <button
            onClick={refreshData}
            className={cn("flex items-center gap-2 px-4 py-2.5 rounded-xl transition-colors", isDark ? "border border-slate-700 text-slate-300 hover:bg-slate-800" : "border border-gray-200 text-gray-700 hover:bg-gray-50")}
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/25">
            <Download size={18} />
            Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Total Revenue</p>
              <p className="text-2xl font-bold text-green-700 mt-1">UGX {formatCurrency(stats.totalRevenue)}</p>
              <div className="flex items-center gap-1 mt-2">
                <ArrowUpRight size={16} className="text-green-600" />
                <span className="text-sm font-medium text-green-600">+{stats.revenueGrowth}%</span>
                <span className="text-xs text-green-600/70">vs last period</span>
              </div>
            </div>
            <div className="h-12 w-12 rounded-xl bg-green-200/50 flex items-center justify-center">
              <DollarSign size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Patients</p>
              <p className="text-2xl font-bold text-blue-700 mt-1">{stats.totalPatients.toLocaleString()}</p>
              <div className="flex items-center gap-1 mt-2">
                <ArrowUpRight size={16} className="text-blue-600" />
                <span className="text-sm font-medium text-blue-600">+{stats.patientGrowth}%</span>
                <span className="text-xs text-blue-600/70">vs last period</span>
              </div>
            </div>
            <div className="h-12 w-12 rounded-xl bg-blue-200/50 flex items-center justify-center">
              <Users size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Appointments</p>
              <p className="text-2xl font-bold text-purple-700 mt-1">{stats.totalAppointments}</p>
              <div className="flex items-center gap-1 mt-2">
                <ArrowDownRight size={16} className="text-red-500" />
                <span className="text-sm font-medium text-red-500">-3.2%</span>
                <span className="text-xs text-purple-600/70">vs last period</span>
              </div>
            </div>
            <div className="h-12 w-12 rounded-xl bg-purple-200/50 flex items-center justify-center">
              <Calendar size={24} className="text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium">Avg. per Patient</p>
              <p className="text-2xl font-bold text-orange-700 mt-1">UGX {formatCurrency(stats.avgPerPatient)}</p>
              <div className="flex items-center gap-1 mt-2">
                <ArrowUpRight size={16} className="text-green-600" />
                <span className="text-sm font-medium text-green-600">+5.8%</span>
                <span className="text-xs text-orange-600/70">vs last period</span>
              </div>
            </div>
            <div className="h-12 w-12 rounded-xl bg-orange-200/50 flex items-center justify-center">
              <Activity size={24} className="text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={cn("lg:col-span-2 rounded-2xl shadow-sm p-6", isDark ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100")}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className={cn("font-semibold", isDark ? "text-white" : "text-gray-900")}>Revenue Trend</h3>
              <p className={cn("text-sm", textMuted)}>Monthly revenue over time</p>
            </div>
            <div className="flex gap-2">
              <button className={cn("px-3 py-1.5 text-xs font-medium rounded-lg", isDark ? "bg-blue-900/50 text-blue-400" : "bg-blue-100 text-blue-700")}>Monthly</button>
              <button className={cn("px-3 py-1.5 text-xs font-medium rounded-lg transition-colors", isDark ? "text-slate-400 hover:bg-slate-800" : "text-gray-600 hover:bg-gray-100")}>Weekly</button>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#334155" : "#E5E7EB"} />
                <XAxis dataKey="month" stroke={isDark ? "#64748b" : "#9CA3AF"} fontSize={12} />
                <YAxis stroke={isDark ? "#64748b" : "#9CA3AF"} fontSize={12} tickFormatter={formatCurrency} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} fill="url(#colorRevenue)" name="Revenue" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={cn("rounded-2xl shadow-sm p-6", isDark ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100")}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className={cn("font-semibold", isDark ? "text-white" : "text-gray-900")}>Appointment Types</h3>
              <p className={cn("text-sm", textMuted)}>Distribution by category</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPie>
                <Pie
                  data={appointmentTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {appointmentTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value) => <span className={cn("text-sm", isDark ? "text-slate-400" : "text-gray-600")}>{value}</span>}
                />
              </RechartsPie>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={cn("rounded-2xl shadow-sm p-6", isDark ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100")}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className={cn("font-semibold", isDark ? "text-white" : "text-gray-900")}>Patient Flow</h3>
              <p className={cn("text-sm", textMuted)}>Daily patient visits by hour</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={patientFlowData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#334155" : "#E5E7EB"} />
                <XAxis dataKey="time" stroke={isDark ? "#64748b" : "#9CA3AF"} fontSize={12} />
                <YAxis stroke={isDark ? "#64748b" : "#9CA3AF"} fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="patients" fill="#8B5CF6" radius={[4, 4, 0, 0]} name="Patients" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={cn("rounded-2xl shadow-sm p-6", isDark ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100")}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className={cn("font-semibold", isDark ? "text-white" : "text-gray-900")}>Top Selling Drugs</h3>
              <p className={cn("text-sm", textMuted)}>Best performing medications</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topDrugsData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#334155" : "#E5E7EB"} />
                <XAxis type="number" stroke={isDark ? "#64748b" : "#9CA3AF"} fontSize={12} />
                <YAxis dataKey="name" type="category" stroke={isDark ? "#64748b" : "#9CA3AF"} fontSize={11} width={120} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="sales" fill="#10B981" radius={[0, 4, 4, 0]} name="Units Sold" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className={cn("rounded-2xl shadow-sm p-6", isDark ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100")}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className={cn("font-semibold", isDark ? "text-white" : "text-gray-900")}>Weekly Performance</h3>
            <p className={cn("text-sm", textMuted)}>Revenue and appointments by day</p>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#334155" : "#E5E7EB"} />
              <XAxis dataKey="day" stroke={isDark ? "#64748b" : "#9CA3AF"} fontSize={12} />
              <YAxis yAxisId="left" stroke={isDark ? "#64748b" : "#9CA3AF"} fontSize={12} tickFormatter={formatCurrency} />
              <YAxis yAxisId="right" orientation="right" stroke={isDark ? "#64748b" : "#9CA3AF"} fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} dot={{ fill: '#3B82F6' }} name="Revenue" />
              <Line yAxisId="right" type="monotone" dataKey="appointments" stroke="#10B981" strokeWidth={2} dot={{ fill: '#10B981' }} name="Appointments" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button className={cn("rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow text-left", isDark ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100")}>
          <div className="flex items-center gap-4">
            <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center", isDark ? "bg-blue-900/50" : "bg-blue-100")}>
              <FileText size={24} className={isDark ? "text-blue-400" : "text-blue-600"} />
            </div>
            <div>
              <h3 className={cn("font-semibold", isDark ? "text-white" : "text-gray-900")}>Financial Report</h3>
              <p className={cn("text-sm", textMuted)}>Complete financial overview</p>
            </div>
          </div>
        </button>
        <button className={cn("rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow text-left", isDark ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100")}>
          <div className="flex items-center gap-4">
            <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center", isDark ? "bg-green-900/50" : "bg-green-100")}>
              <Users size={24} className={isDark ? "text-green-400" : "text-green-600"} />
            </div>
            <div>
              <h3 className={cn("font-semibold", isDark ? "text-white" : "text-gray-900")}>Patient Report</h3>
              <p className={cn("text-sm", textMuted)}>Patient demographics & trends</p>
            </div>
          </div>
        </button>
        <button className={cn("rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow text-left", isDark ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100")}>
          <div className="flex items-center gap-4">
            <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center", isDark ? "bg-purple-900/50" : "bg-purple-100")}>
              <BarChart3 size={24} className={isDark ? "text-purple-400" : "text-purple-600"} />
            </div>
            <div>
              <h3 className={cn("font-semibold", isDark ? "text-white" : "text-gray-900")}>Inventory Report</h3>
              <p className={cn("text-sm", textMuted)}>Stock & pharmacy analytics</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
