import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store';
import { LogOut, User, Settings, ChevronDown } from 'lucide-react';

export function Header() {
  const { user, tenant, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-200 px-4 md:px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
            {tenant?.name?.[0] || 'S'}
          </div>
          <div className="hidden sm:block">
            <p className="font-semibold text-gray-900">{tenant?.name || 'Clinic'}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role?.toLowerCase()}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-gray-900">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="p-2.5 rounded-xl hover:bg-gray-100 transition-all duration-200 text-gray-500 hover:text-gray-700"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
