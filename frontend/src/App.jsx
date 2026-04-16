import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { useAuthStore } from '@/store';
import { MainLayout } from '@/components/layout/MainLayout';
import { ThemeWrapper } from '@/components/ThemeWrapper';

import { LandingPage } from '@/pages/LandingPage';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { PatientsPage } from '@/pages/PatientsPage';
import { PatientProfilePage } from '@/pages/PatientProfilePage';
import { DoctorPage } from '@/pages/DoctorPage';
import { PharmacyPage } from '@/pages/PharmacyPage';
import { POSPage } from '@/pages/POSPage';
import { AppointmentsPage } from '@/pages/AppointmentsPage';
import { InvoicesPage } from '@/pages/InvoicesPage';
import { ExpensesPage } from '@/pages/ExpensesPage';
import { ReportsPage } from '@/pages/ReportsPage';
import { SMSPage } from '@/pages/SMSPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { SuperAdminPage } from '@/pages/SuperAdminPage';
import { BillingPage } from '@/pages/BillingPage';
import { UsersPage } from '@/pages/UsersPage';

const queryClient = new QueryClient();

function PrivateRoute({ children }) {
  const { token } = useAuthStore();
  return token ? <MainLayout>{children}</MainLayout> : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
  const { token, user } = useAuthStore();
  if (!token) return <Navigate to="/login" />;
  if (user?.role !== 'SUPERADMIN' && user?.role !== 'OWNER') return <Navigate to="/dashboard" />;
  return <MainLayout>{children}</MainLayout>;
}

function App() {
  return (
    <ThemeWrapper>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<LoginPage />} />
            <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
            <Route path="/patients" element={<PrivateRoute><PatientsPage /></PrivateRoute>} />
            <Route path="/patients/:id" element={<PrivateRoute><PatientProfilePage /></PrivateRoute>} />
            <Route path="/doctor" element={<PrivateRoute><DoctorPage /></PrivateRoute>} />
            <Route path="/pharmacy" element={<PrivateRoute><PharmacyPage /></PrivateRoute>} />
            <Route path="/pos" element={<PrivateRoute><POSPage /></PrivateRoute>} />
            <Route path="/appointments" element={<PrivateRoute><AppointmentsPage /></PrivateRoute>} />
            <Route path="/invoices" element={<PrivateRoute><InvoicesPage /></PrivateRoute>} />
            <Route path="/expenses" element={<PrivateRoute><ExpensesPage /></PrivateRoute>} />
            <Route path="/reports" element={<PrivateRoute><ReportsPage /></PrivateRoute>} />
            <Route path="/sms" element={<PrivateRoute><SMSPage /></PrivateRoute>} />
            <Route path="/settings" element={<PrivateRoute><SettingsPage /></PrivateRoute>} />
            <Route path="/billing" element={<PrivateRoute><BillingPage /></PrivateRoute>} />
            <Route path="/users" element={<AdminRoute><UsersPage /></AdminRoute>} />
            <Route path="/superadmin" element={<AdminRoute><SuperAdminPage /></AdminRoute>} />
          </Routes>
        </BrowserRouter>
        <Toaster />
      </QueryClientProvider>
    </ThemeWrapper>
  );
}

export default App;
