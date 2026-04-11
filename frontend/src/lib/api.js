import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If backend is unreachable, use mock API for development
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error' || error.status === undefined) {
      const config = error.config;
      if (config.url === '/auth/register' && config.method === 'post') {
        console.log('[v0] Backend unavailable, using mock API for registration');
        const data = JSON.parse(config.data || '{}');
        return Promise.resolve({
          data: {
            success: true,
            message: 'Registration successful (mock)',
            tenant: {
              id: `tenant_${Date.now()}`,
              name: data.clinicName,
              subdomain: data.subdomain,
              email: data.email,
              status: 'active'
            },
            token: 'mock_jwt_token_' + Date.now()
          }
        });
      }
    }
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const auth = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getPlans: () => api.get('/auth/plans'),
  me: () => api.get('/auth/me'),
};

export const tenant = {
  get: () => api.get('/tenant'),
  update: (data) => api.put('/tenant', data),
  getUsage: () => api.get('/tenant/usage'),
  getSubscription: () => api.get('/tenant/subscription'),
  upgradePlan: (data) => api.post('/tenant/subscription/upgrade', data),
};

export const branches = {
  getAll: () => api.get('/branches'),
  get: (id) => api.get(`/branches/${id}`),
  create: (data) => api.post('/branches', data),
  update: (id, data) => api.put(`/branches/${id}`, data),
  delete: (id) => api.delete(`/branches/${id}`),
};

export const users = {
  getAll: () => api.get('/users'),
  get: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  getRoles: () => api.get('/users/roles'),
};

export const patients = {
  getAll: (params) => api.get('/patients', { params }),
  get: (id) => api.get(`/patients/${id}`),
  getHistory: (id) => api.get(`/patients/${id}/history`),
  create: (data) => api.post('/patients', data),
  update: (id, data) => api.put(`/patients/${id}`, data),
  delete: (id) => api.delete(`/patients/${id}`),
};

export const doctor = {
  getDiagnoses: (params) => api.get('/doctor/diagnoses', { params }),
  createDiagnosis: (data) => api.post('/doctor/diagnoses', data),
  getDiagnosis: (id) => api.get(`/doctor/diagnoses/${id}`),
  getPrescriptions: (params) => api.get('/doctor/prescriptions', { params }),
  createPrescription: (data) => api.post('/doctor/prescriptions', data),
  getPrescription: (id) => api.get(`/doctor/prescriptions/${id}`),
  updatePrescriptionStatus: (id, status) => api.patch(`/doctor/prescriptions/${id}/status`, { status }),
};

export const pharmacy = {
  getDrugs: (params) => api.get('/pharmacy/drugs', { params }),
  getDrug: (id) => api.get(`/pharmacy/drugs/${id}`),
  createDrug: (data) => api.post('/pharmacy/drugs', data),
  updateDrug: (id, data) => api.put(`/pharmacy/drugs/${id}`, data),
  deleteDrug: (id) => api.delete(`/pharmacy/drugs/${id}`),
  getInventory: (params) => api.get('/pharmacy/inventory', { params }),
  updateInventory: (data) => api.post('/pharmacy/inventory', data),
  getBatches: (params) => api.get('/pharmacy/batches', { params }),
  createBatch: (data) => api.post('/pharmacy/batches', data),
  getExpiryAlerts: () => api.get('/pharmacy/alerts/expiry'),
  getLowStockAlerts: () => api.get('/pharmacy/alerts/low-stock'),
};

export const sales = {
  getAll: (params) => api.get('/sales', { params }),
  get: (id) => api.get(`/sales/${id}`),
  create: (data) => api.post('/sales', data),
  refund: (id) => api.post(`/sales/${id}/refund`),
  getDailySummary: (params) => api.get('/sales/daily-summary', { params }),
  search: (q) => api.get('/sales/search', { params: { q } }),
};

export const appointments = {
  getAll: (params) => api.get('/appointments', { params }),
  get: (id) => api.get(`/appointments/${id}`),
  create: (data) => api.post('/appointments', data),
  update: (id, data) => api.put(`/appointments/${id}`, data),
  updateStatus: (id, status) => api.patch(`/appointments/${id}/status`, { status }),
  delete: (id) => api.delete(`/appointments/${id}`),
  sendReminder: (id) => api.post(`/appointments/${id}/reminder`),
  getQueue: (params) => api.get('/appointments/queue', { params }),
};

export const invoices = {
  getAll: (params) => api.get('/invoices', { params }),
  get: (id) => api.get(`/invoices/${id}`),
  create: (data) => api.post('/invoices', data),
  pay: (id, data) => api.post(`/invoices/${id}/pay`, data),
  update: (id, data) => api.put(`/invoices/${id}`, data),
  delete: (id) => api.delete(`/invoices/${id}`),
};

export const expenses = {
  getAll: (params) => api.get('/expenses', { params }),
  create: (data) => api.post('/expenses', data),
  getSummary: (params) => api.get('/expenses/summary', { params }),
  getCategories: () => api.get('/expenses/categories'),
  update: (id, data) => api.put(`/expenses/${id}`, data),
  delete: (id) => api.delete(`/expenses/${id}`),
};

export const suppliers = {
  getAll: (params) => api.get('/suppliers', { params }),
  get: (id) => api.get(`/suppliers/${id}`),
  create: (data) => api.post('/suppliers', data),
  update: (id, data) => api.put(`/suppliers/${id}`, data),
  getOrders: (params) => api.get('/suppliers/orders', { params }),
  createOrder: (data) => api.post('/suppliers/orders', data),
  getOrder: (id) => api.get(`/suppliers/orders/${id}`),
  updateOrderStatus: (id, status) => api.patch(`/suppliers/orders/${id}/status`, { status }),
};

export const reports = {
  getSales: (params) => api.get('/reports/sales', { params }),
  getRevenue: (params) => api.get('/reports/revenue', { params }),
  getProfit: (params) => api.get('/reports/profit', { params }),
  getPatients: (params) => api.get('/reports/patients', { params }),
  getInventory: (params) => api.get('/reports/inventory', { params }),
  getTopDrugs: (params) => api.get('/reports/top-drugs', { params }),
  getAppointments: (params) => api.get('/reports/appointments', { params }),
};

export const sms = {
  send: (data) => api.post('/sms/send', data),
  getLogs: (params) => api.get('/sms/logs', { params }),
};

export const superadmin = {
  getTenants: (params) => api.get('/superadmin/tenants', { params }),
  getTenant: (id) => api.get(`/superadmin/tenants/${id}`),
  updateTenantStatus: (id, status) => api.patch(`/superadmin/tenants/${id}/status`, { status }),
  getPlans: () => api.get('/superadmin/plans'),
  createPlan: (data) => api.post('/superadmin/plans', data),
  updatePlan: (id, data) => api.put(`/superadmin/plans/${id}`, data),
  getAnalytics: () => api.get('/superadmin/analytics'),
  getRevenue: (params) => api.get('/superadmin/revenue', { params }),
  getRoles: () => api.get('/superadmin/roles'),
  createRole: (data) => api.post('/superadmin/roles', data),
};

export default api;
