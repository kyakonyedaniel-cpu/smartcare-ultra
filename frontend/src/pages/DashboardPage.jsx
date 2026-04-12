import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';

export default function DashboardPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening today.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card rounded-lg border p-5">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Today's Revenue</p>
              <p className="text-2xl font-bold">UGX 413,000</p>
              <p className="text-xs text-green-600">+12% from yesterday</p>
            </div>
          </div>

          <div className="bg-card rounded-lg border p-5">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Patients Today</p>
              <p className="text-2xl font-bold">12</p>
              <p className="text-xs text-muted-foreground">Active consultations</p>
            </div>
          </div>

          <div className="bg-card rounded-lg border p-5">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Appointments</p>
              <p className="text-2xl font-bold">8</p>
              <p className="text-xs text-muted-foreground">Scheduled today</p>
            </div>
          </div>

          <div className="bg-card rounded-lg border p-5">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Low Stock Items</p>
              <p className="text-2xl font-bold">3</p>
              <p className="text-xs text-red-600">Needs reorder</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-card rounded-lg border p-5">
            <h3 className="font-semibold mb-4">Recent Appointments</h3>
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-muted rounded-md">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium">
                      SN
                    </div>
                    <div>
                      <p className="text-sm font-medium">Sarah Nakato</p>
                      <p className="text-xs text-muted-foreground">10:00 AM</p>
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
                <div key={i} className="flex items-center justify-between p-3 bg-muted rounded-md">
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
