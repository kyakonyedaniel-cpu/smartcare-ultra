import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3, Download, TrendingUp, Users, DollarSign, Calendar } from 'lucide-react';

export default function ReportsPage() {
  const reportData = {
    revenue: [
      { month: 'Jan', value: 2400 },
      { month: 'Feb', value: 3200 },
      { month: 'Mar', value: 2800 },
      { month: 'Apr', value: 3500 },
      { month: 'May', value: 4200 },
      { month: 'Jun', value: 3800 }
    ],
    topDrugs: [
      { name: 'Paracetamol 500mg', sales: 450 },
      { name: 'Amoxicillin 250mg', sales: 380 },
      { name: 'Ibuprofen 400mg', sales: 320 },
      { name: 'ORS Sachet', sales: 280 },
      { name: 'Vitamin C 1000mg', sales: 200 }
    ],
    patientStats: [
      { category: 'New Patients', value: 156 },
      { category: 'Follow-ups', value: 324 },
      { category: 'Returning', value: 512 }
    ]
  };

  const maxRevenue = Math.max(...reportData.revenue.map(r => r.value));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold">Reports & Analytics</h1>
            <p className="text-muted-foreground mt-1">Business insights and performance metrics</p>
          </div>
          <div className="flex gap-2">
            <Select defaultValue="month">
              <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline"><Download size={16} className="mr-2" /> Export</Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-3xl font-bold">UGX 19.9M</p>
                  <p className="text-xs text-emerald-600 mt-1">+12% from last month</p>
                </div>
                <DollarSign className="h-8 w-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Patients</p>
                  <p className="text-3xl font-bold">992</p>
                  <p className="text-xs text-blue-600 mt-1">+24 this month</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Appointments</p>
                  <p className="text-3xl font-bold">156</p>
                  <p className="text-xs text-primary mt-1">+8% completion rate</p>
                </div>
                <Calendar className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Transaction</p>
                  <p className="text-3xl font-bold">UGX 45K</p>
                  <p className="text-xs text-amber-600 mt-1">-3% from last month</p>
                </div>
                <TrendingUp className="h-8 w-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trend (Last 6 Months)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportData.revenue.map((item) => (
                  <div key={item.month} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{item.month}</span>
                      <span className="font-semibold">UGX {item.value / 100}K</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div 
                        className="bg-emerald-500 h-3 rounded-full transition-all" 
                        style={{ width: `${(item.value / maxRevenue) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Selling Drugs */}
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Drugs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportData.topDrugs.map((item, idx) => (
                  <div key={item.name} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="bg-primary/10 text-primary w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                          {idx + 1}
                        </span>
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <span className="font-semibold">{item.sales} sold</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all" 
                        style={{ width: `${(item.sales / 450) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Patient Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Patient Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {reportData.patientStats.map((item) => {
                const maxValue = Math.max(...reportData.patientStats.map(s => s.value));
                const colors = ['bg-primary', 'bg-emerald-500', 'bg-blue-500'];
                return (
                  <div key={item.category} className="text-center space-y-3">
                    <div className="h-24 flex items-end justify-center gap-2">
                      <div 
                        className={`${colors[reportData.patientStats.indexOf(item)]} rounded-t-lg w-12`}
                        style={{ height: `${(item.value / maxValue) * 100}%` }}
                      ></div>
                    </div>
                    <div>
                      <p className="text-3xl font-bold">{item.value}</p>
                      <p className="text-sm text-muted-foreground">{item.category}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Summary Table */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr className="text-muted-foreground">
                    <th className="text-left py-3 px-4">Month</th>
                    <th className="text-right py-3 px-4">Revenue</th>
                    <th className="text-right py-3 px-4">Expenses</th>
                    <th className="text-right py-3 px-4">Net Profit</th>
                    <th className="text-right py-3 px-4">Patients</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { month: 'January', revenue: 2400000, expenses: 850000, patients: 120 },
                    { month: 'February', revenue: 3200000, expenses: 920000, patients: 145 },
                    { month: 'March', revenue: 2800000, expenses: 780000, patients: 132 },
                    { month: 'April', revenue: 3500000, expenses: 1050000, patients: 156 }
                  ].map((row) => (
                    <tr key={row.month} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">{row.month}</td>
                      <td className="text-right py-3 px-4 text-emerald-600 font-semibold">UGX {(row.revenue / 1000000).toFixed(1)}M</td>
                      <td className="text-right py-3 px-4">UGX {(row.expenses / 1000).toFixed(0)}K</td>
                      <td className="text-right py-3 px-4 font-semibold">UGX {((row.revenue - row.expenses) / 1000000).toFixed(1)}M</td>
                      <td className="text-right py-3 px-4">{row.patients}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
