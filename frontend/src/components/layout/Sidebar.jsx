import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAppStore, useAuthStore } from '@/store';
import { 
  LayoutDashboard, Users, UserCheck, Stethoscope, Pill, 
  ShoppingCart, Calendar, Receipt, FileText, TrendingUp, 
  MessageSquare, Settings, Menu, X, Building2, CreditCard, Shield,
  ChevronLeft, Bell, Search, LogOut, TestTube, DollarSign, AlertCircle
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
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, type: 'appointment', title: 'New Appointment', message: 'Sarah Nakato booked an appointment for tomorrow at 10:00 AM', time: '5 min ago', unread: true },
    { id: 2, type: 'lab', title: 'Lab Results Ready', message: 'Peter Ochieng\'s blood test results are ready for review', time: '1 hour ago', unread: true },
    { id: 3, type: 'payment', title: 'Payment Received', message: 'Invoice #INV-006 of UGX 35,000 has been paid', time: '2 hours ago', unread: true },
    { id: 4, type: 'inventory', title: 'Low Stock Alert', message: 'Amoxicillin 250mg is running low (15 units remaining)', time: '3 hours ago', unread: false },
    { id: 5, type: 'reminder', title: 'Appointment Reminder', message: 'Follow-up with James Wekesa in 30 minutes', time: '30 min ago', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'appointment': return <Calendar size={16} className="text-blue-600" />;
      case 'lab': return <TestTube size={16} className="text-purple-600" />;
      case 'payment': return <DollarSign size={16} className="text-green-600" />;
      case 'inventory': return <AlertCircle size={16} className="text-orange-600" />;
      case 'reminder': return <Bell size={16} className="text-yellow-600" />;
      default: return <Bell size={16} className="text-gray-600" />;
    }
  };

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
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all duration-200 hidden md:block"
            >
              <Bell size={20} className="text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-medium">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                  <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                      {unreadCount > 0 && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer ${
                          notification.unread ? 'bg-blue-50/50' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                            notification.unread ? 'bg-blue-100' : 'bg-gray-100'
                          }`}>
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-gray-900 text-sm">{notification.title}</p>
                              {notification.unread && (
                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                              )}
                            </div>
                            <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">{notification.message}</p>
                            <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 border-t border-gray-100">
                    <button className="w-full text-center text-sm text-blue-600 font-medium hover:text-blue-700">
                      View all notifications
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

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
