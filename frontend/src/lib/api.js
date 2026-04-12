import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || true;

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
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const mockDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

const mockUsers = [
  { id: '1', email: 'admin@demo.clinic', password: 'demo1234', firstName: 'Demo', lastName: 'Admin', role: 'OWNER', tenant: { id: '1', name: 'Demo Clinic', status: 'ACTIVE' } },
  { id: '2', email: 'admin@smartcare.ug', password: 'superadmin123', firstName: 'Super', lastName: 'Admin', role: 'SUPERADMIN', tenant: { id: '0', name: 'SmartCare HQ', status: 'ACTIVE' } },
];

const mockPlans = [
  { id: '1', name: 'Free Trial', priceMonthly: 0, priceYearly: 0, maxPatients: 50, maxBranches: 1, maxUsers: 2 },
  { id: '2', name: 'Starter', priceMonthly: 15000000, priceYearly: 150000000, maxPatients: 200, maxBranches: 2, maxUsers: 5 },
  { id: '3', name: 'Professional', priceMonthly: 35000000, priceYearly: 350000000, maxPatients: 1000, maxBranches: 5, maxUsers: 20 },
  { id: '4', name: 'Enterprise', priceMonthly: 75000000, priceYearly: 750000000, maxPatients: -1, maxBranches: -1, maxUsers: -1 },
];

const mockBranches = [
  { id: '1', name: 'Main Branch', code: 'MAIN', isDefault: true },
];

const mockPatients = [
  { id: '1', patientNumber: 'PT-001', firstName: 'Sarah', lastName: 'Nakato', gender: 'FEMALE', phone: '+256701234567', createdAt: '2026-04-01' },
  { id: '2', patientNumber: 'PT-002', firstName: 'Peter', lastName: 'Ochieng', gender: 'MALE', phone: '+256702345678', createdAt: '2026-04-02' },
  { id: '3', patientNumber: 'PT-003', firstName: 'Mary', lastName: 'Kagaba', gender: 'FEMALE', phone: '+256703456789', createdAt: '2026-04-03' },
  { id: '4', patientNumber: 'PT-004', firstName: 'James', lastName: 'Wekesa', gender: 'MALE', phone: '+256704567890', createdAt: '2026-04-04' },
  { id: '5', patientNumber: 'PT-005', firstName: 'Grace', lastName: 'Nabisere', gender: 'FEMALE', phone: '+256705678901', createdAt: '2026-04-05' },
];

const mockDrugs = [
  { id: '1', name: 'Paracetamol 500mg', code: 'PARA500', category: 'Analgesics', unit: 'tablet', reorderLevel: 100, quantity: 250 },
  { id: '2', name: 'Amoxicillin 250mg', code: 'AMOX250', category: 'Antibiotics', unit: 'capsule', reorderLevel: 50, quantity: 80 },
  { id: '3', name: 'ORS Sachet', code: 'ORS001', category: 'Rehydration', unit: 'sachet', reorderLevel: 200, quantity: 450 },
  { id: '4', name: 'Ibuprofen 400mg', code: 'IBUP400', category: 'Analgesics', unit: 'tablet', reorderLevel: 75, quantity: 120 },
  { id: '5', name: 'Vitamin C 1000mg', code: 'VITC1000', category: 'Vitamins', unit: 'tablet', reorderLevel: 100, quantity: 300 },
  { id: '6', name: 'Metformin 500mg', code: 'METF500', category: 'Diabetes', unit: 'tablet', reorderLevel: 50, quantity: 45 },
  { id: '7', name: 'Omeprazole 20mg', code: 'OMEP20', category: 'Gastro', unit: 'capsule', reorderLevel: 40, quantity: 200 },
  { id: '8', name: 'Cough Syrup 100ml', code: 'COUGH100', category: 'Respiratory', unit: 'bottle', reorderLevel: 20, quantity: 35 },
];

const registeredUsers = [];

export const mockAuth = {
  login: async (data) => {
    await mockDelay();
    const user = mockUsers.find(u => u.email === data.email && u.password === data.password);
    if (user) {
      return { data: { token: 'mock_token_' + user.id, user } };
    }
    const registered = registeredUsers.find(u => u.email === data.email && u.password === data.password);
    if (registered) {
      return { data: { token: 'mock_token_' + registered.id, user: registered } };
    }
    throw { response: { data: { error: 'Invalid credentials' } } };
  },
  register: async (data) => {
    await mockDelay();
    if (mockUsers.find(u => u.email === data.email) || registeredUsers.find(u => u.email === data.email)) {
      throw { response: { data: { error: 'Email already registered' } } };
    }
    const newUser = {
      id: String(registeredUsers.length + 10),
      email: data.email,
      firstName: 'Admin',
      lastName: 'User',
      role: 'OWNER',
      tenant: { id: String(registeredUsers.length + 10), name: data.clinicName, status: 'ACTIVE' }
    };
    registeredUsers.push({ ...newUser, password: data.password });
    return { data: { message: 'Clinic registered successfully', token: 'mock_token_' + newUser.id, tenant: newUser.tenant } };
  },
  getPlans: async () => {
    await mockDelay(300);
    return { data: mockPlans };
  },
  me: async (data) => {
    await mockDelay();
    return { data: mockUsers[0] };
  }
};

export const mockApi = {
  branches: { getAll: async () => ({ data: mockBranches }) },
  patients: { 
    getAll: async (params) => {
      await mockDelay();
      let filtered = [...mockPatients];
      if (params?.search) {
        const s = params.search.toLowerCase();
        filtered = filtered.filter(p => 
          p.firstName.toLowerCase().includes(s) || 
          p.lastName.toLowerCase().includes(s) ||
          p.phone?.includes(s)
        );
      }
      return { data: filtered };
    },
    create: async (data) => {
      await mockDelay();
      const newPatient = {
        id: String(mockPatients.length + 1),
        patientNumber: `PT-${String(mockPatients.length + 1).padStart(3, '0')}`,
        ...data,
        createdAt: new Date().toISOString()
      };
      mockPatients.push(newPatient);
      return { data: newPatient };
    }
  },
  pharmacy: {
    getDrugs: async () => ({ data: mockDrugs }),
    getInventory: async () => ({ data: mockDrugs }),
    getLowStockAlerts: async () => ({ data: mockDrugs.filter(d => d.quantity < d.reorderLevel) }),
    getExpiryAlerts: async () => ({ data: [] }),
  },
  sales: {
    getAll: async () => ({ data: [] }),
    create: async (data) => ({ data: { id: '1', ...data } }),
  },
  appointments: {
    getAll: async () => ({ 
      data: [
        { id: '1', patient: 'Sarah Nakato', time: '10:00 AM', type: 'Consultation', status: 'Confirmed' },
        { id: '2', patient: 'Peter Ochieng', time: '10:30 AM', type: 'Follow-up', status: 'Scheduled' },
        { id: '3', patient: 'Mary Kagaba', time: '11:00 AM', type: 'Checkup', status: 'Scheduled' },
        { id: '4', patient: 'James Wekesa', time: '11:30 AM', type: 'Consultation', status: 'In Progress' },
      ]
    }),
    create: async (data) => ({ data: { id: '5', ...data } }),
  },
  invoices: {
    getAll: async () => ({ data: [
      { id: 'INV-001', patient: 'Sarah Nakato', amount: 45000, status: 'Paid', date: '2026-04-10' },
      { id: 'INV-002', patient: 'Peter Ochieng', amount: 28000, status: 'Pending', date: '2026-04-09' },
    ]}),
  },
  expenses: {
    getAll: async () => ({ data: [] }),
    getSummary: async () => ({ data: { thisMonth: 850000, lastMonth: 720000 } }),
  },
  reports: {
    getSales: async () => ({ data: [] }),
    getRevenue: async () => ({ data: { total: 12500000, patients: 856, sales: 324, appointments: 156 } }),
  },
  sms: {
    getLogs: async () => ({ data: [] }),
  },
  tenant: {
    get: async () => ({ data: { id: '1', name: 'Demo Clinic' } }),
    getUsage: async () => ({ data: { patients: 45, branches: 1, users: 3 } }),
    getSubscription: async () => ({ data: { plan: mockPlans[0] } }),
  },
  users: { getAll: async () => ({ data: [] }) },
  doctor: { getDiagnoses: async () => ({ data: [] }), getPrescriptions: async () => ({ data: [] }) },
  suppliers: { getAll: async () => ({ data: [] }) },
  superadmin: { getTenants: async () => ({ data: [] }), getAnalytics: async () => ({ data: {} }) },
};

export const auth = {
  login: async (data) => {
    try {
      return await api.post('/auth/login', data);
    } catch (e) {
      return mockAuth.login(data);
    }
  },
  register: async (data) => {
    try {
      return await api.post('/auth/register', data);
    } catch (e) {
      return mockAuth.register(data);
    }
  },
  getPlans: async () => {
    try {
      return await api.get('/auth/plans');
    } catch (e) {
      return mockAuth.getPlans();
    }
  },
  me: async () => {
    try {
      return await api.get('/auth/me');
    } catch (e) {
      return mockAuth.me();
    }
  }
};

export const tenant = {
  get: async () => { try { return await api.get('/tenant'); } catch { return mockApi.tenant.get(); } },
  update: (data) => api.put('/tenant', data),
  getUsage: async () => { try { return await api.get('/tenant/usage'); } catch { return mockApi.tenant.getUsage(); } },
  getSubscription: async () => { try { return await api.get('/tenant/subscription'); } catch { return mockApi.tenant.getSubscription(); } },
  upgradePlan: (data) => api.post('/tenant/subscription/upgrade', data),
};

export const branches = {
  getAll: async () => { try { return await api.get('/branches'); } catch { return mockApi.branches.getAll(); } },
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
  getAll: async (params) => { try { return await api.get('/patients', { params }); } catch { return mockApi.patients.getAll(params); } },
  get: (id) => api.get(`/patients/${id}`),
  getHistory: (id) => api.get(`/patients/${id}/history`),
  create: async (data) => { try { return await api.post('/patients', data); } catch { return mockApi.patients.create(data); } },
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
  getDrugs: async () => { try { return await api.get('/pharmacy/drugs'); } catch { return mockApi.pharmacy.getDrugs(); } },
  getDrug: (id) => api.get(`/pharmacy/drugs/${id}`),
  createDrug: (data) => api.post('/pharmacy/drugs', data),
  updateDrug: (id, data) => api.put(`/pharmacy/drugs/${id}`, data),
  deleteDrug: (id) => api.delete(`/pharmacy/drugs/${id}`),
  getInventory: async () => { try { return await api.get('/pharmacy/inventory'); } catch { return mockApi.pharmacy.getInventory(); } },
  updateInventory: (data) => api.post('/pharmacy/inventory', data),
  getBatches: (params) => api.get('/pharmacy/batches', { params }),
  createBatch: (data) => api.post('/pharmacy/batches', data),
  getExpiryAlerts: async () => { try { return await api.get('/pharmacy/alerts/expiry'); } catch { return mockApi.pharmacy.getExpiryAlerts(); } },
  getLowStockAlerts: async () => { try { return await api.get('/pharmacy/alerts/low-stock'); } catch { return mockApi.pharmacy.getLowStockAlerts(); } },
};

export const sales = {
  getAll: async () => { try { return await api.get('/sales'); } catch { return mockApi.sales.getAll(); } },
  get: (id) => api.get(`/sales/${id}`),
  create: async (data) => { try { return await api.post('/sales', data); } catch { return mockApi.sales.create(data); } },
  refund: (id) => api.post(`/sales/${id}/refund`),
  getDailySummary: (params) => api.get('/sales/daily-summary', { params }),
  search: (q) => api.get('/sales/search', { params: { q } }),
};

export const appointments = {
  getAll: async () => { try { return await api.get('/appointments'); } catch { return mockApi.appointments.getAll(); } },
  get: (id) => api.get(`/appointments/${id}`),
  create: async (data) => { try { return await api.post('/appointments', data); } catch { return mockApi.appointments.create(data); } },
  update: (id, data) => api.put(`/appointments/${id}`, data),
  updateStatus: (id, status) => api.patch(`/appointments/${id}/status`, { status }),
  delete: (id) => api.delete(`/appointments/${id}`),
  sendReminder: (id) => api.post(`/appointments/${id}/reminder`),
  getQueue: (params) => api.get('/appointments/queue', { params }),
};

export const invoices = {
  getAll: async () => { try { return await api.get('/invoices'); } catch { return mockApi.invoices.getAll(); } },
  get: (id) => api.get(`/invoices/${id}`),
  create: (data) => api.post('/invoices', data),
  pay: (id, data) => api.post(`/invoices/${id}/pay`, data),
  update: (id, data) => api.put(`/invoices/${id}`, data),
  delete: (id) => api.delete(`/invoices/${id}`),
};

export const expenses = {
  getAll: async () => { try { return await api.get('/expenses'); } catch { return mockApi.expenses.getAll(); } },
  create: (data) => api.post('/expenses', data),
  getSummary: async () => { try { return await api.get('/expenses/summary'); } catch { return mockApi.expenses.getSummary(); } },
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
  getSales: async () => { try { return await api.get('/reports/sales'); } catch { return mockApi.reports.getSales(); } },
  getRevenue: async () => { try { return await api.get('/reports/revenue'); } catch { return mockApi.reports.getRevenue(); } },
  getProfit: (params) => api.get('/reports/profit', { params }),
  getPatients: (params) => api.get('/reports/patients', { params }),
  getInventory: (params) => api.get('/reports/inventory', { params }),
  getTopDrugs: (params) => api.get('/reports/top-drugs', { params }),
  getAppointments: (params) => api.get('/reports/appointments', { params }),
};

export const sms = {
  send: (data) => api.post('/sms/send', data),
  getLogs: async () => { try { return await api.get('/sms/logs'); } catch { return mockApi.sms.getLogs(); } },
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