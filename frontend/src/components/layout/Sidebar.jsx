import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store';
import { 
  LayoutDashboard, Users, UserCheck, Stethoscope, Pill, 
  ShoppingCart, Calendar, Receipt, FileText, TrendingUp, 
  MessageSquare, Settings, Menu, X, Building2
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: UserCheck, label: 'Patients', path: '/patients' },
  { icon: Stethoscope, label: 'Doctor', path: '/doctor' },
  { icon: Pill, label: 'Pharmacy', path: '/pharmacy' },
  { icon: ShoppingCart, label: 'POS', path: '/pos' },
  { icon: Calendar, label: 'Appointments', path: '/appointments' },
  { icon: Receipt, label: 'Invoices', path: '/invoices' },
  { icon: FileText, label: 'Expenses', path: '/expenses' },
  { icon: TrendingUp, label: 'Reports', path: '/reports' },
  { icon: MessageSquare, label: 'SMS', path: '/sms' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useAppStore();

  return (
    <>
      <button 
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-primary text-primary-foreground"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
      
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-card border-r transform transition-transform duration-200 lg:translate-x-0 lg:static",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center gap-2 p-4 border-b">
          <Building2 className="h-8 w-8 text-primary" />
          <div>
            <h1 className="font-bold text-lg">SmartCare</h1>
            <p className="text-xs text-muted-foreground">Ultra SaaS</p>
          </div>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-120px)]">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon size={20} />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
