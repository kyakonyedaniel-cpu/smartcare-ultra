import React from 'react';
import { Navigate, NavLink } from 'react-router-dom';
import { useAuthStore, useThemeStore } from '@/store';
import { Sidebar, Topbar } from './Sidebar';
import { LayoutDashboard, UserCheck, Pill, ShoppingCart, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MainLayout({ children }) {
  const { user, token } = useAuthStore();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className={cn(
      "flex h-screen overflow-hidden transition-colors duration-300",
      isDark ? "bg-slate-950" : "bg-gray-50"
    )}>
      <Sidebar />
      <div className="flex flex-col flex-1 w-full min-w-0 overflow-hidden">
        <Topbar />
        <main className={cn(
          "flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 pb-20 lg:pb-6 transition-colors duration-300",
          isDark ? "bg-slate-950 text-white" : "bg-gray-50 text-gray-900"
        )}>
          <div className="max-w-screen-2xl mx-auto">
            {children}
          </div>
        </main>
      </div>
      
      <MobileNav isDark={isDark} />
    </div>
  );
}

function MobileNav({ isDark }) {
  const navItems = [
    { icon: LayoutDashboard, label: 'Home', path: '/dashboard' },
    { icon: UserCheck, label: 'Patients', path: '/patients' },
    { icon: Pill, label: 'Pharmacy', path: '/pharmacy' },
    { icon: ShoppingCart, label: 'POS', path: '/pos' },
    { icon: MoreHorizontal, label: 'More', path: '/settings' },
  ];
  
  return (
    <nav className={cn(
      "fixed bottom-0 left-0 right-0 flex justify-around p-2 pb-4 md:hidden z-50 transition-colors duration-300",
      isDark ? "bg-slate-900 border-slate-800" : "bg-white border-gray-200"
    )}>
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => cn(
            "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200",
            isActive 
              ? 'text-blue-600 bg-blue-50' 
              : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-gray-400 hover:text-gray-600'
          )}
        >
          <item.icon size={22} />
          <span className="text-xs font-medium">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
