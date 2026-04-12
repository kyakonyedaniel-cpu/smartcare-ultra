import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { day: 'Mon', revenue: 2400 },
  { day: 'Tue', revenue: 3100 },
  { day: 'Wed', revenue: 2800 },
  { day: 'Thu', revenue: 3900 },
  { day: 'Fri', revenue: 4200 },
  { day: 'Sat', revenue: 2800 },
  { day: 'Sun', revenue: 2100 },
];

export function RevenueChart() {
  return (
    <div className="bg-card rounded-lg border p-5">
      <h3 className="font-semibold mb-4">Revenue This Week</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="day" stroke="var(--muted-foreground)" />
          <YAxis stroke="var(--muted-foreground)" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: '8px'
            }}
          />
          <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
