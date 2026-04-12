import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, User, FileText, ShoppingCart, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    { label: 'New Patient', icon: User, action: () => navigate('/patients'), color: 'bg-blue-100 text-blue-600' },
    { label: 'New Appointment', icon: Calendar, action: () => navigate('/appointments'), color: 'bg-green-100 text-green-600' },
    { label: 'POS Sale', icon: ShoppingCart, action: () => navigate('/pos'), color: 'bg-amber-100 text-amber-600' },
    { label: 'Generate Report', icon: FileText, action: () => navigate('/reports'), color: 'bg-purple-100 text-purple-600' },
  ];

  return (
    <div className="bg-card rounded-lg border p-5">
      <h3 className="font-semibold mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {actions.map((action, idx) => (
          <button
            key={idx}
            onClick={action.action}
            className="flex flex-col items-center justify-center p-4 rounded-lg border border-dashed hover:border-primary hover:bg-muted transition-all group"
          >
            <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${action.color} mb-2 group-hover:scale-110 transition-transform`}>
              <action.icon size={20} />
            </div>
            <p className="text-xs font-medium text-center">{action.label}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
