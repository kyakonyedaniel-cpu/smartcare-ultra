import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { DollarSign, Users, Calendar, AlertCircle } from 'lucide-react';

export default function DashboardPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening today.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Today's Revenue" 
            value="UGX 413,000" 
            trend="up" 
            trendValue="12%"
            icon={DollarSign}
            color="green"
          />
          <StatCard 
            title="Patients Today" 
            value="12" 
            trend="up" 
            trendValue="8%"
            icon={Users}
            color="blue"
          />
          <StatCard 
            title="Appointments" 
            value="8" 
            trend="up" 
            trendValue="5%"
            icon={Calendar}
            color="purple"
          />
          <StatCard 
            title="Low Stock Items" 
            value="3" 
            trend="down" 
            trendValue="2%"
            icon={AlertCircle}
            color="red"
          />
        </div>

        <QuickActions />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-card rounded-lg border p-5">
            <h3 className="font-semibold mb-4">Recent Appointments</h3>
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-muted rounded-md hover:bg-muted/80 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium">
                      SN
                    </div>
                    <div>
                      <p className="text-sm font-medium">Sarah Nakato</p>
                      <p className="text-xs text-muted-foreground">10:00 AM - Consultation</p>
                    </div>
                  </div>
                  <span className="text-xs text-green-600 font-medium">Confirmed</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-lg border p-5">
            <h3 className="font-semibold mb-4">Low Stock Alerts</h3>
            <div className="space-y-2">
              {['Paracetamol 500mg', 'Amoxicillin 250mg', 'ORS Sachet'].map((drug, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-muted rounded-md hover:bg-muted/80 transition-colors">
                  <span className="text-sm font-medium">{drug}</span>
                  <span className="text-xs text-red-600 font-medium">Reorder</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
