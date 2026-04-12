import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAppStore, useAuthStore } from '@/store';
import { 
  LayoutDashboard, Users, UserCheck, Stethoscope, Pill, 
  ShoppingCart, Calendar, Receipt, FileText, TrendingUp, 
  MessageSquare, Settings, Menu, X, Building2, CreditCard, Shield
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
];

const adminItems = [
  { icon: CreditCard, label: 'Billing', path: '/billing' },
  { icon: Users, label: 'Users', path: '/users' },
];

const superAdminItems = [
  { icon: Shield, label: 'Super Admin', path: '/superadmin' },
];

export function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useAppStore();
  const { user } = useAuthStore();
  const isOwner = user?.role === 'OWNER';
  const isSuperAdmin = user?.role === 'SUPERADMIN';

  return (
    <>
      <button 
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-blue-600 text-white"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
      
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-gray-900 text-white transform transition-transform duration-200",
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex items-center gap-2 p-4 border-b border-gray-700">
          <Building2 className="h-8 w-8 text-blue-400" />
          <div>
            <h1 className="font-bold text-lg">SmartCare</h1>
            <p className="text-xs text-gray-400">Ultra SaaS</p>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Main Menu</p>
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive 
                  ? "bg-blue-600 text-white" 
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              )}
            >
              <item.icon size={20} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {isOwner && (
          <nav className="p-4 space-y-1 border-t border-gray-700">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Management</p>
            {adminItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-blue-600 text-white" 
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                )}
              >
                <item.icon size={20} />
                {item.label}
              </NavLink>
            ))}
          </nav>
        )}

        {isSuperAdmin && (
          <nav className="p-4 space-y-1 border-t border-gray-700">
            <p className="text-xs text-purple-400 uppercase tracking-wider mb-2">Super Admin</p>
            {superAdminItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-purple-600 text-white" 
                    : "text-purple-300 hover:bg-gray-800 hover:text-white"
                )}
              >
                <item.icon size={20} />
                {item.label}
              </NavLink>
            ))}
          </nav>
        )}

        <nav className="p-4 space-y-1 border-t border-gray-700 absolute bottom-0 w-full">
          <NavLink
            to="/settings"
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              isActive 
                ? "bg-blue-600 text-white" 
                : "text-gray-300 hover:bg-gray-800 hover:text-white"
            )}
          >
            <Settings size={20} />
            Settings
          </NavLink>
        </nav>
      </aside>
    </>
  );
}
