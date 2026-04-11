import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { TrendingUp, Users, Calendar, AlertCircle, DollarSign, Pill, Clock, CheckCircle } from 'lucide-react';

export default function DashboardPage() {
  const metrics = [
    {
      icon: DollarSign,
      label: "Today's Revenue",
      value: 'UGX 413,000',
      trend: '+12.5%',
      trendUp: true,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      icon: Users,
      label: 'Patients Today',
      value: '12',
      trend: '+3 from yesterday',
      trendUp: true,
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600'
    },
    {
      icon: Calendar,
      label: 'Appointments',
      value: '8',
      trend: '4 completed',
      trendUp: true,
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      icon: AlertCircle,
      label: 'Low Stock Items',
      value: '3',
      trend: 'Action required',
      trendUp: false,
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600'
    }
  ];

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome back! Here's your clinic overview.</p>
          </div>
          <div className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, i) => {
            const Icon = metric.icon;
            return (
              <div key={i} className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
                    <p className="text-3xl font-bold text-foreground mt-2">{metric.value}</p>
                    <p className={`text-xs font-medium mt-2 ${metric.trendUp ? 'text-emerald-600' : 'text-red-600'}`}>
                      {metric.trend}
                    </p>
                  </div>
                  <div className={`${metric.bgColor} p-3 rounded-lg`}>
                    <Icon className={`w-6 h-6 ${metric.iconColor}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Appointments */}
          <div className="lg:col-span-2 bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">Recent Appointments</h2>
              <a href="/appointments" className="text-sm text-primary hover:underline">View all</a>
            </div>
            <div className="space-y-4">
              {[
                { name: 'Sarah Nakato', time: '10:00 AM', type: 'Consultation', status: 'confirmed' },
                { name: 'John Ochieng', time: '11:30 AM', type: 'Follow-up', status: 'confirmed' },
                { name: 'Maria Ssali', time: '2:00 PM', type: 'Lab Test', status: 'pending' }
              ].map((apt, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted/80 transition-colors">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">{apt.name.charAt(0)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{apt.name}</p>
                      <p className="text-sm text-muted-foreground">{apt.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">{apt.time}</span>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      apt.status === 'confirmed' 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {apt.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-6">
            {/* Revenue Overview */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Revenue Overview</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">This Week</span>
                    <span className="font-semibold text-foreground">UGX 2.8M</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">This Month</span>
                    <span className="font-semibold text-foreground">UGX 9.2M</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                  + New Appointment
                </button>
                <button className="w-full px-4 py-2 border border-border text-foreground rounded-lg text-sm font-medium hover:bg-muted transition-colors">
                  + Add Patient
                </button>
                <button className="w-full px-4 py-2 border border-border text-foreground rounded-lg text-sm font-medium hover:bg-muted transition-colors">
                  View Reports
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <h2 className="text-lg font-semibold text-foreground">Low Stock Alerts</h2>
            </div>
            <a href="/pharmacy" className="text-sm text-primary hover:underline">Manage Inventory</a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['Paracetamol 500mg', 'Amoxicillin 250mg', 'ORS Sachet'].map((drug, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-100">
                <div className="flex items-center gap-3">
                  <Pill className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="font-medium text-foreground">{drug}</p>
                    <p className="text-xs text-red-600 mt-1">Below reorder level</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
