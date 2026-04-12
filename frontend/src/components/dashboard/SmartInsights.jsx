import React from 'react';
import { AlertCircle, TrendingUp, Activity, AlertTriangle } from 'lucide-react';

export function SmartInsights() {
  const insights = [
    {
      type: 'success',
      icon: TrendingUp,
      title: 'Revenue Up',
      description: 'Revenue increased by 23% compared to last week',
      color: 'bg-green-50 text-green-700 border-green-200'
    },
    {
      type: 'warning',
      icon: AlertTriangle,
      title: 'Low Stock Alert',
      description: '3 drugs are below reorder level',
      color: 'bg-amber-50 text-amber-700 border-amber-200',
      action: 'Reorder Now'
    },
    {
      type: 'info',
      icon: Activity,
      title: 'High Activity',
      description: 'Patient consultations are 15% higher today',
      color: 'bg-blue-50 text-blue-700 border-blue-200'
    },
  ];

  return (
    <div className="bg-card rounded-lg border p-5">
      <h3 className="font-semibold mb-4">Smart Insights</h3>
      <div className="space-y-3">
        {insights.map((insight, idx) => {
          const Icon = insight.icon;
          return (
            <div key={idx} className={`rounded-lg border p-4 ${insight.color}`}>
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <Icon size={20} />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{insight.title}</p>
                  <p className="text-sm opacity-90">{insight.description}</p>
                </div>
                {insight.action && (
                  <button className="text-xs font-medium hover:underline whitespace-nowrap">
                    {insight.action}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
