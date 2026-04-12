import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAppStore, useAuthStore } from '@/store';
import { 
  LayoutDashboard, Users, UserCheck, Stethoscope, Pill, 
  ShoppingCart, Calendar, Receipt, FileText, TrendingUp, 
  MessageSquare, Settings, Menu, X, Building2, CreditCard, Shield,
  ChevronLeft, Bell, Search, LogOut
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
  const { token, logout } = useAuthStore();
  const isOwner = user?.role === 'OWNER';
  const isSuperAdmin = user?.role === 'SUPERADMIN';

  return (
    <>
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      <aside className={cn(
        "fixed lg:relative inset-y-0 left-0 z-40 bg-slate-900 text-white transition-all duration-300 flex flex-col",
        sidebarOpen ? "w-64" : "w-0 lg:w-20 -translate-x-full lg:translate-x-0 overflow-hidden"
      )}>
        <div className={cn(
          "flex items-center gap-3 p-5 border-b border-slate-700",
          !sidebarOpen && "lg:w-20 justify-center p-3"
        )}>
          <Building2 className="h-9 w-9 text-blue-400 flex-shrink-0" />
          <div className={cn(
            "transition-all duration-300",
            !sidebarOpen && "lg:opacity-0 lg:w-0 overflow-hidden"
          )}>
            <h1 className="font-bold text-lg tracking-tight">SmartCare</h1>
            <p className="text-xs text-slate-400">Healthcare Platform</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4 scrollbar-thin">
          <div className="px-3 mb-4">
            <p className={cn(
              "text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 transition-all duration-300",
              !sidebarOpen && "lg:text-center lg:w-20"
            )}>
              {sidebarOpen ? "Main Menu" : "..."}
            </p>
            <nav className="space-y-1">
              {menuItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                  className={({ isActive }) => cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                    isActive 
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25" 
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  )}
                >
                  <item.icon size={20} className="flex-shrink-0" />
                  <span className={cn(
                    "transition-all duration-300",
                    !sidebarOpen && "lg:hidden"
                  )}>
                    {item.label}
                  </span>
                </NavLink>
              ))}
            </nav>
          </div>

          {isOwner && (
            <div className="px-3 py-4 border-t border-slate-800">
              <p className={cn(
                "text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 transition-all duration-300",
                !sidebarOpen && "lg:text-center lg:w-20"
              )}>
                {sidebarOpen ? "Management" : "..."}
              </p>
              <nav className="space-y-1">
                {adminItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                    className={({ isActive }) => cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                      isActive 
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25" 
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    )}
                  >
                    <item.icon size={20} className="flex-shrink-0" />
                    <span className={cn(
                      "transition-all duration-300",
                      !sidebarOpen && "lg:hidden"
                    )}>
                      {item.label}
                    </span>
                  </NavLink>
                ))}
              </nav>
            </div>
          )}

          {isSuperAdmin && (
            <div className="px-3 py-4 border-t border-slate-800">
              <p className={cn(
                "text-xs font-semibold text-purple-400 uppercase tracking-wider mb-3 transition-all duration-300",
                !sidebarOpen && "lg:text-center lg:w-20"
              )}>
                {sidebarOpen ? "Super Admin" : "..."}
              </p>
              <nav className="space-y-1">
                {superAdminItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                    className={({ isActive }) => cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                      isActive 
                        ? "bg-purple-600 text-white shadow-lg shadow-purple-600/25" 
                        : "text-purple-300 hover:bg-slate-800 hover:text-white"
                    )}
                  >
                    <item.icon size={20} className="flex-shrink-0" />
                    <span className={cn(
                      "transition-all duration-300",
                      !sidebarOpen && "lg:hidden"
                    )}>
                      {item.label}
                    </span>
                  </NavLink>
                ))}
              </nav>
            </div>
          )}
        </div>

        <div className={cn(
          "p-3 border-t border-slate-700",
          !sidebarOpen && "lg:hidden"
        )}>
          <NavLink
            to="/settings"
            onClick={() => window.innerWidth < 1024 && toggleSidebar()}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
              isActive 
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25" 
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            )}
          >
            <Settings size={20} className="flex-shrink-0" />
            <span>Settings</span>
          </NavLink>
        </div>
      </aside>
    </>
  );
}

export function Topbar() {
  const { sidebarOpen, toggleSidebar } = useAppStore();
  const { user, tenant, logout } = useAuthStore();

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-200 px-4 md:px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all duration-200 lg:hidden"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          <div className="hidden md:flex items-center gap-3 bg-gray-100 rounded-xl px-4 py-2.5 flex-1 max-w-md">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search anything..."
              className="bg-transparent outline-none text-sm w-full placeholder:text-gray-400"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="relative p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all duration-200 hidden md:block">
            <Bell size={20} className="text-gray-600" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-gray-900">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-gray-500">{tenant?.name}</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
