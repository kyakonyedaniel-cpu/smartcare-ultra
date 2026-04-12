import React, { useState, useEffect } from 'react';

const mockAnalytics = {
  totalTenants: 156,
  activeTenants: 142,
  trialTenants: 23,
  expiredTenants: 8,
  suspendedTenants: 6,
  totalRevenue: 45678000,
  monthlyRevenue: 12500000,
  totalPatients: 45234,
  totalTransactions: 123456
};

const mockTenants = [
  { id: '1', name: 'Demo Clinic', email: 'admin@demo.clinic', status: 'ACTIVE', plan: 'Free Trial', patients: 45, users: 3, createdAt: '2026-01-15' },
  { id: '2', name: 'Health Plus Clinic', email: 'info@healthplus.ug', status: 'ACTIVE', plan: 'Professional', patients: 234, users: 8, createdAt: '2026-02-20' },
  { id: '3', name: 'City Medical Center', email: 'admin@citymedical.ug', status: 'ACTIVE', plan: 'Starter', patients: 89, users: 4, createdAt: '2026-03-10' },
  { id: '4', name: 'Unity Hospital', email: 'info@unityhospital.ug', status: 'TRIAL_EXPIRED', plan: 'Free Trial', patients: 12, users: 2, createdAt: '2026-03-25' },
  { id: '5', name: 'Sunrise Pharmacy', email: 'admin@sunrisepharmacy.ug', status: 'SUSPENDED', plan: 'Enterprise', patients: 567, users: 15, createdAt: '2026-01-05' },
  { id: '6', name: 'Moses Medical', email: 'moses@medical.ug', status: 'ACTIVE', plan: 'Professional', patients: 156, users: 6, createdAt: '2026-03-01' },
  { id: '7', name: 'Kampala Health Center', email: 'info@khc.ug', status: 'ACTIVE', plan: 'Starter', patients: 78, users: 3, createdAt: '2026-02-15' },
  { id: '8', name: 'East Africa Clinic', email: 'admin@eaclinic.ug', status: 'ACTIVE', plan: 'Enterprise', patients: 892, users: 22, createdAt: '2026-01-20' },
];

export function SuperAdminPage() {
  const [tenants, setTenants] = useState([]);
  const [analytics, setAnalytics] = useState(mockAnalytics);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setTimeout(() => {
      setTenants(mockTenants);
      setLoading(false);
    }, 500);
  }, []);

  const filteredTenants = tenants.filter(t => {
    const matchesStatus = selectedStatus === 'ALL' || t.status === selectedStatus;
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         t.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const updateTenantStatus = (id, newStatus) => {
    setTenants(tenants.map(t => t.id === id ? {...t, status: newStatus} : t));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-UG', { style: 'currency', currency: 'UGX', maximumFractionDigits: 0 }).format(amount);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'TRIAL_EXPIRED': return 'bg-orange-100 text-orange-800';
      case 'SUSPENDED': return 'bg-red-100 text-red-800';
      case 'PAST_DUE': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
            <p className="text-gray-500">Manage all tenants and system analytics</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
              Super Admin
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
            <p className="text-blue-100">Total Tenants</p>
            <p className="text-4xl font-bold mt-2">{analytics.totalTenants}</p>
            <p className="text-blue-200 text-sm mt-2">All registered clinics</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
            <p className="text-green-100">Active Tenants</p>
            <p className="text-4xl font-bold mt-2">{analytics.activeTenants}</p>
            <p className="text-green-200 text-sm mt-2">{Math.round(analytics.activeTenants/analytics.totalTenants*100)}% of total</p>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white">
            <p className="text-orange-100">Trial Tenants</p>
            <p className="text-4xl font-bold mt-2">{analytics.trialTenants}</p>
            <p className="text-orange-200 text-sm mt-2">In free trial period</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
            <p className="text-purple-100">Total Revenue</p>
            <p className="text-2xl font-bold mt-2">{formatCurrency(analytics.totalRevenue)}</p>
            <p className="text-purple-200 text-sm mt-2">Lifetime earnings</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border rounded-lg p-6">
            <p className="text-gray-500 text-sm">Monthly Revenue</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{formatCurrency(analytics.monthlyRevenue)}</p>
          </div>
          <div className="bg-white border rounded-lg p-6">
            <p className="text-gray-500 text-sm">Total Patients</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{analytics.totalPatients.toLocaleString()}</p>
          </div>
          <div className="bg-white border rounded-lg p-6">
            <p className="text-gray-500 text-sm">Total Transactions</p>
            <p className="text-2xl font-bold text-purple-600 mt-1">{analytics.totalTransactions.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-bold">All Tenants</h2>
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="Search tenants..."
                className="px-4 py-2 border rounded-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                className="px-4 py-2 border rounded-md"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="TRIAL_EXPIRED">Trial Expired</option>
                <option value="SUSPENDED">Suspended</option>
                <option value="PAST_DUE">Past Due</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3 font-medium">Tenant</th>
                  <th className="text-left p-3 font-medium">Plan</th>
                  <th className="text-left p-3 font-medium">Patients</th>
                  <th className="text-left p-3 font-medium">Users</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium">Joined</th>
                  <th className="text-left p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center p-8">Loading...</td>
                  </tr>
                ) : filteredTenants.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center p-8 text-gray-500">No tenants found</td>
                  </tr>
                ) : (
                  filteredTenants.map((tenant) => (
                    <tr key={tenant.id} className="border-t hover:bg-gray-50">
                      <td className="p-3">
                        <div>
                          <p className="font-medium">{tenant.name}</p>
                          <p className="text-sm text-gray-500">{tenant.email}</p>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                          {tenant.plan}
                        </span>
                      </td>
                      <td className="p-3">{tenant.patients}</td>
                      <td className="p-3">{tenant.users}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(tenant.status)}`}>
                          {tenant.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-3">{new Date(tenant.createdAt).toLocaleDateString()}</td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          {tenant.status === 'ACTIVE' && (
                            <button
                              onClick={() => updateTenantStatus(tenant.id, 'SUSPENDED')}
                              className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                            >
                              Suspend
                            </button>
                          )}
                          {(tenant.status === 'SUSPENDED' || tenant.status === 'TRIAL_EXPIRED') && (
                            <button
                              onClick={() => updateTenantStatus(tenant.id, 'ACTIVE')}
                              className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                            >
                              Activate
                            </button>
                          )}
                          <button className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
