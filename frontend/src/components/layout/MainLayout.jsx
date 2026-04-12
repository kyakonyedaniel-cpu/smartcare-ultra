import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function MainLayout({ children }) {
  const { token } = useAuthStore();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
