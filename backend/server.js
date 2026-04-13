import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 1000 });
app.use('/api/', limiter);

const db = {
  tenants: new Map(),
  users: new Map(),
  patients: new Map(),
  appointments: new Map(),
  prescriptions: new Map(),
  diagnoses: new Map(),
  invoices: new Map(),
  sales: new Map(),
  drugs: new Map(),
  expenses: new Map(),
  smsLogs: new Map(),
  labResults: new Map(),
  notifications: new Map(),
  payments: new Map(),
  branches: new Map(),
};

const plans = [
  { id: 'free', name: 'Free Trial', priceMonthly: 0, maxUsers: 1, maxPatients: 20, features: ['Basic Patient Management', 'Simple POS', '1 Branch'] },
  { id: 'starter', name: 'Starter', priceMonthly: 99000, maxUsers: 3, maxPatients: 200, features: ['All Free features', 'Basic Reports', 'SMS Notifications', '3 Branches'] },
  { id: 'professional', name: 'Professional', priceMonthly: 249000, maxUsers: 10, maxPatients: 1000, features: ['All Starter features', 'Advanced Reports', 'API Access', '10 Branches'] },
  { id: 'enterprise', name: 'Enterprise', priceMonthly: 599000, maxUsers: -1, maxPatients: -1, features: ['Unlimited Everything'] },
];

const demoTenant = {
  id: 'demo-tenant',
  name: 'Demo Clinic',
  slug: 'demo-clinic',
  email: 'admin@demo.clinic',
  status: 'ACTIVE',
  plan: 'free',
  createdAt: new Date().toISOString(),
};

const demoUser = {
  id: 'demo-user',
  tenantId: 'demo-tenant',
  email: 'admin@demo.clinic',
  password: bcrypt.hashSync('demo1234', 10),
  firstName: 'Demo',
  lastName: 'Admin',
  role: 'OWNER',
  isActive: true,
  createdAt: new Date().toISOString(),
};

db.tenants.set(demoTenant.id, demoTenant);
db.users.set(demoUser.id, demoUser);

const seedPatients = [
  { id: 'p1', tenantId: 'demo-tenant', patientNumber: 'PT-001', firstName: 'Sarah', lastName: 'Nakato', gender: 'FEMALE', phone: '+256701234567', email: 'sarah@email.com', address: 'Kampala', bloodType: 'O+', allergies: 'None', notes: '', createdAt: '2026-04-01' },
  { id: 'p2', tenantId: 'demo-tenant', patientNumber: 'PT-002', firstName: 'Peter', lastName: 'Ochieng', gender: 'MALE', phone: '+256702345678', email: 'peter@email.com', address: 'Entebbe', bloodType: 'A+', allergies: 'Penicillin', notes: '', createdAt: '2026-04-02' },
  { id: 'p3', tenantId: 'demo-tenant', patientNumber: 'PT-003', firstName: 'Mary', lastName: 'Kagaba', gender: 'FEMALE', phone: '+256703456789', email: 'mary@email.com', address: 'Jinja', bloodType: 'B+', allergies: '', notes: '', createdAt: '2026-04-03' },
  { id: 'p4', tenantId: 'demo-tenant', patientNumber: 'PT-004', firstName: 'James', lastName: 'Wekesa', gender: 'MALE', phone: '+256704567890', email: 'james@email.com', address: 'Mbarara', bloodType: 'AB+', allergies: 'Sulfa', notes: '', createdAt: '2026-04-04' },
  { id: 'p5', tenantId: 'demo-tenant', patientNumber: 'PT-005', firstName: 'Grace', lastName: 'Nabisere', gender: 'FEMALE', phone: '+256705678901', email: 'grace@email.com', address: 'Gulu', bloodType: 'O-', allergies: '', notes: '', createdAt: '2026-04-05' },
];
seedPatients.forEach(p => db.patients.set(p.id, p));

const seedAppointments = [
  { id: 'a1', tenantId: 'demo-tenant', patientId: 'p1', patientName: 'Sarah Nakato', doctor: 'Dr. Demo', date: '2026-04-13', time: '09:00', type: 'Consultation', status: 'SCHEDULED', notes: '' },
  { id: 'a2', tenantId: 'demo-tenant', patientId: 'p2', patientName: 'Peter Ochieng', doctor: 'Dr. Demo', date: '2026-04-13', time: '09:30', type: 'Follow-up', status: 'CONFIRMED', notes: '' },
  { id: 'a3', tenantId: 'demo-tenant', patientId: 'p3', patientName: 'Mary Kagaba', doctor: 'Dr. Demo', date: '2026-04-13', time: '10:00', type: 'Checkup', status: 'SCHEDULED', notes: '' },
  { id: 'a4', tenantId: 'demo-tenant', patientId: 'p4', patientName: 'James Wekesa', doctor: 'Dr. Demo', date: '2026-04-13', time: '10:30', type: 'Consultation', status: 'IN_PROGRESS', notes: '' },
  { id: 'a5', tenantId: 'demo-tenant', patientId: 'p5', patientName: 'Grace Nabisere', doctor: 'Dr. Demo', date: '2026-04-13', time: '11:00', type: 'Vaccination', status: 'SCHEDULED', notes: '' },
];
seedAppointments.forEach(a => db.appointments.set(a.id, a));

const seedDiagnoses = [
  { id: 'd1', tenantId: 'demo-tenant', patientId: 'p1', diagnosis: 'Common Cold', symptoms: 'Runny nose, sore throat', notes: 'Rest and fluids recommended', createdAt: '2026-04-10' },
  { id: 'd2', tenantId: 'demo-tenant', patientId: 'p2', diagnosis: 'Hypertension', symptoms: 'High blood pressure', notes: 'Diet modification needed', createdAt: '2026-04-08' },
];
seedDiagnoses.forEach(d => db.diagnoses.set(d.id, d));

const seedPrescriptions = [
  { id: 'pr1', tenantId: 'demo-tenant', patientId: 'p1', diagnosis: 'Common Cold', prescription: 'Paracetamol 500mg - 3x daily for 5 days', status: 'PENDING', createdAt: '2026-04-10' },
  { id: 'pr2', tenantId: 'demo-tenant', patientId: 'p2', diagnosis: 'Hypertension', prescription: 'Amlodipine 5mg - Once daily', status: 'DISPENSED', createdAt: '2026-04-08' },
];
seedPrescriptions.forEach(p => db.prescriptions.set(p.id, p));

const seedDrugs = [
  { id: 'dr1', tenantId: 'demo-tenant', name: 'Paracetamol 500mg', genericName: 'Acetaminophen', code: 'PARA500', category: 'Analgesics', unit: 'tablet', price: 500, stock: 250, reorderLevel: 100 },
  { id: 'dr2', tenantId: 'demo-tenant', name: 'Amoxicillin 250mg', genericName: 'Amoxicillin', code: 'AMOX250', category: 'Antibiotics', unit: 'capsule', price: 1200, stock: 80, reorderLevel: 50 },
  { id: 'dr3', tenantId: 'demo-tenant', name: 'ORS Sachet', genericName: 'Oral Rehydration', code: 'ORS001', category: 'Rehydration', unit: 'sachet', price: 800, stock: 450, reorderLevel: 200 },
  { id: 'dr4', tenantId: 'demo-tenant', name: 'Ibuprofen 400mg', genericName: 'Ibuprofen', code: 'IBUP400', category: 'Analgesics', unit: 'tablet', price: 700, stock: 120, reorderLevel: 75 },
  { id: 'dr5', tenantId: 'demo-tenant', name: 'Vitamin C 1000mg', genericName: 'Ascorbic Acid', code: 'VITC1000', category: 'Vitamins', unit: 'tablet', price: 400, stock: 300, reorderLevel: 100 },
  { id: 'dr6', tenantId: 'demo-tenant', name: 'Metformin 500mg', genericName: 'Metformin', code: 'METF500', category: 'Diabetes', unit: 'tablet', price: 600, stock: 45, reorderLevel: 50 },
];
seedDrugs.forEach(d => db.drugs.set(d.id, d));

const seedInvoices = [
  { id: 'inv1', tenantId: 'demo-tenant', patientId: 'p1', patientName: 'Sarah Nakato', items: [{ description: 'Consultation', quantity: 1, price: 30000 }, { description: 'Lab Test', quantity: 1, price: 15000 }], total: 45000, status: 'PAID', date: '2026-04-12' },
  { id: 'inv2', tenantId: 'demo-tenant', patientId: 'p2', patientName: 'Peter Ochieng', items: [{ description: 'Consultation', quantity: 1, price: 30000 }], total: 30000, status: 'PENDING', date: '2026-04-11' },
];
seedInvoices.forEach(i => db.invoices.set(i.id, i));

const seedExpenses = [
  { id: 'e1', tenantId: 'demo-tenant', category: 'Supplies', description: 'Medical supplies purchase', amount: 150000, date: '2026-04-10' },
  { id: 'e2', tenantId: 'demo-tenant', category: 'Utilities', description: 'Electricity bill', amount: 80000, date: '2026-04-08' },
  { id: 'e3', tenantId: 'demo-tenant', category: 'Salary', description: 'Staff salaries', amount: 2000000, date: '2026-04-01' },
];
seedExpenses.forEach(e => db.expenses.set(e.id, e));

const seedLabResults = [
  { id: 'lr1', tenantId: 'demo-tenant', patientId: 'p1', testType: 'Blood Test', results: 'Normal', status: 'COMPLETED', orderedBy: 'Dr. Demo', date: '2026-04-10' },
  { id: 'lr2', tenantId: 'demo-tenant', patientId: 'p2', testType: 'Urinalysis', results: 'Pending', status: 'PENDING', orderedBy: 'Dr. Demo', date: '2026-04-12' },
];
seedLabResults.forEach(l => db.labResults.set(l.id, l));

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });
  try {
    const token = authHeader.split(' ')[1];
    if (token === 'demo_token') {
      req.user = { userId: 'demo-user', tenantId: 'demo-tenant', role: 'OWNER' };
    } else {
      return res.status(401).json({ error: 'Invalid token' });
    }
    next();
  } catch (e) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = Array.from(db.users.values()).find(u => u.email === email);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  res.json({
    token: 'demo_token',
    user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role, tenant: { id: user.tenantId, name: 'Demo Clinic' } }
  });
});

app.post('/api/auth/register', async (req, res) => {
  const { clinicName, email, password } = req.body;
  const tenant = { id: uuidv4(), name: clinicName, slug: clinicName.toLowerCase().replace(/\s+/g, '-'), email, status: 'ACTIVE', plan: 'free', createdAt: new Date().toISOString() };
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { id: uuidv4(), tenantId: tenant.id, email, password: hashedPassword, firstName: 'Admin', lastName: 'User', role: 'OWNER', isActive: true, createdAt: new Date().toISOString() };
  db.tenants.set(tenant.id, tenant);
  db.users.set(user.id, user);
  res.status(201).json({ message: 'Registered successfully', token: 'demo_token', tenant, user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role } });
});

app.get('/api/plans', (req, res) => res.json(plans));

app.get('/api/tenant', authMiddleware, (req, res) => {
  const tenant = db.tenants.get(req.user.tenantId);
  res.json(tenant || { id: req.user.tenantId, name: 'Demo Clinic', status: 'ACTIVE' });
});

app.get('/api/patients', authMiddleware, (req, res) => {
  const patients = Array.from(db.patients.values()).filter(p => p.tenantId === req.user.tenantId);
  res.json(patients);
});

app.post('/api/patients', authMiddleware, (req, res) => {
  const patient = { id: uuidv4(), tenantId: req.user.tenantId, patientNumber: `PT-${String(db.patients.size + 1).padStart(3, '0')}`, ...req.body, createdAt: new Date().toISOString() };
  db.patients.set(patient.id, patient);
  res.status(201).json(patient);
});

app.get('/api/patients/:id', authMiddleware, (req, res) => {
  const patient = db.patients.get(req.params.id);
  if (!patient || patient.tenantId !== req.user.tenantId) return res.status(404).json({ error: 'Not found' });
  const diagnoses = Array.from(db.diagnoses.values()).filter(d => d.patientId === patient.id);
  const prescriptions = Array.from(db.prescriptions.values()).filter(p => p.patientId === patient.id);
  const appointments = Array.from(db.appointments.values()).filter(a => a.patientId === patient.id);
  const labResults = Array.from(db.labResults.values()).filter(l => l.patientId === patient.id);
  res.json({ ...patient, diagnoses, prescriptions, appointments, labResults });
});

app.get('/api/appointments', authMiddleware, (req, res) => {
  const appointments = Array.from(db.appointments.values()).filter(a => a.tenantId === req.user.tenantId);
  res.json(appointments);
});

app.post('/api/appointments', authMiddleware, (req, res) => {
  const appointment = { id: uuidv4(), tenantId: req.user.tenantId, ...req.body, status: 'SCHEDULED', createdAt: new Date().toISOString() };
  db.appointments.set(appointment.id, appointment);
  res.status(201).json(appointment);
});

app.patch('/api/appointments/:id/status', authMiddleware, (req, res) => {
  const appointment = db.appointments.get(req.params.id);
  if (!appointment) return res.status(404).json({ error: 'Not found' });
  appointment.status = req.body.status;
  db.appointments.set(appointment.id, appointment);
  res.json(appointment);
});

app.get('/api/diagnoses', authMiddleware, (req, res) => {
  const diagnoses = Array.from(db.diagnoses.values()).filter(d => d.tenantId === req.user.tenantId);
  res.json(diagnoses);
});

app.post('/api/diagnoses', authMiddleware, (req, res) => {
  const diagnosis = { id: uuidv4(), tenantId: req.user.tenantId, ...req.body, createdAt: new Date().toISOString() };
  db.diagnoses.set(diagnosis.id, diagnosis);
  res.status(201).json(diagnosis);
});

app.get('/api/prescriptions', authMiddleware, (req, res) => {
  const prescriptions = Array.from(db.prescriptions.values()).filter(p => p.tenantId === req.user.tenantId);
  res.json(prescriptions);
});

app.post('/api/prescriptions', authMiddleware, (req, res) => {
  const prescription = { id: uuidv4(), tenantId: req.user.tenantId, ...req.body, status: 'PENDING', createdAt: new Date().toISOString() };
  db.prescriptions.set(prescription.id, prescription);
  res.status(201).json(prescription);
});

app.patch('/api/prescriptions/:id/status', authMiddleware, (req, res) => {
  const prescription = db.prescriptions.get(req.params.id);
  if (!prescription) return res.status(404).json({ error: 'Not found' });
  prescription.status = req.body.status;
  db.prescriptions.set(prescription.id, prescription);
  res.json(prescription);
});

app.get('/api/drugs', authMiddleware, (req, res) => {
  const drugs = Array.from(db.drugs.values()).filter(d => d.tenantId === req.user.tenantId);
  res.json(drugs);
});

app.post('/api/drugs', authMiddleware, (req, res) => {
  const drug = { id: uuidv4(), tenantId: req.user.tenantId, ...req.body, createdAt: new Date().toISOString() };
  db.drugs.set(drug.id, drug);
  res.status(201).json(drug);
});

app.patch('/api/drugs/:id', authMiddleware, (req, res) => {
  const drug = db.drugs.get(req.params.id);
  if (!drug) return res.status(404).json({ error: 'Not found' });
  Object.assign(drug, req.body);
  db.drugs.set(drug.id, drug);
  res.json(drug);
});

app.get('/api/invoices', authMiddleware, (req, res) => {
  const invoices = Array.from(db.invoices.values()).filter(i => i.tenantId === req.user.tenantId);
  res.json(invoices);
});

app.post('/api/invoices', authMiddleware, (req, res) => {
  const invoice = { id: uuidv4(), tenantId: req.user.tenantId, ...req.body, status: 'PENDING', createdAt: new Date().toISOString() };
  db.invoices.set(invoice.id, invoice);
  res.status(201).json(invoice);
});

app.get('/api/expenses', authMiddleware, (req, res) => {
  const expenses = Array.from(db.expenses.values()).filter(e => e.tenantId === req.user.tenantId);
  res.json(expenses);
});

app.post('/api/expenses', authMiddleware, (req, res) => {
  const expense = { id: uuidv4(), tenantId: req.user.tenantId, ...req.body, createdAt: new Date().toISOString() };
  db.expenses.set(expense.id, expense);
  res.status(201).json(expense);
});

app.get('/api/lab-results', authMiddleware, (req, res) => {
  const results = Array.from(db.labResults.values()).filter(l => l.tenantId === req.user.tenantId);
  res.json(results);
});

app.post('/api/lab-results', authMiddleware, (req, res) => {
  const result = { id: uuidv4(), tenantId: req.user.tenantId, ...req.body, status: 'PENDING', createdAt: new Date().toISOString() };
  db.labResults.set(result.id, result);
  res.status(201).json(result);
});

app.get('/api/sms/logs', authMiddleware, (req, res) => {
  const logs = Array.from(db.smsLogs.values()).filter(l => l.tenantId === req.user.tenantId);
  res.json(logs);
});

app.post('/api/sms/send', authMiddleware, (req, res) => {
  const log = { id: uuidv4(), tenantId: req.user.tenantId, ...req.body, status: 'SENT', createdAt: new Date().toISOString() };
  db.smsLogs.set(log.id, log);
  res.status(201).json({ message: 'SMS sent successfully', log });
});

app.get('/api/notifications', authMiddleware, (req, res) => {
  const notifications = Array.from(db.notifications.values()).filter(n => n.userId === req.user.userId);
  res.json(notifications);
});

app.post('/api/notifications/mark-read', authMiddleware, (req, res) => {
  const notifications = Array.from(db.notifications.values()).filter(n => n.userId === req.user.userId);
  notifications.forEach(n => { n.read = true; db.notifications.set(n.id, n); });
  res.json({ success: true });
});

app.get('/api/reports/dashboard', authMiddleware, (req, res) => {
  const patients = Array.from(db.patients.values()).filter(p => p.tenantId === req.user.tenantId);
  const appointments = Array.from(db.appointments.values()).filter(a => a.tenantId === req.user.tenantId);
  const invoices = Array.from(db.invoices.values()).filter(i => i.tenantId === req.user.tenantId);
  const drugs = Array.from(db.drugs.values()).filter(d => d.tenantId === req.user.tenantId);
  const lowStock = drugs.filter(d => d.stock < d.reorderLevel);
  const totalRevenue = invoices.filter(i => i.status === 'PAID').reduce((sum, i) => sum + i.total, 0);
  const todayRevenue = invoices.filter(i => i.status === 'PAID' && i.date === new Date().toISOString().split('T')[0]).reduce((sum, i) => sum + i.total, 0);
  res.json({
    totalPatients: patients.length,
    todayPatients: appointments.length,
    totalRevenue,
    todayRevenue,
    lowStockCount: lowStock.length,
    pendingPrescriptions: 3,
    todayAppointments: appointments.filter(a => a.date === new Date().toISOString().split('T')[0]).length,
    monthlyData: [
      { month: 'Jan', patients: 45, revenue: 2500000 },
      { month: 'Feb', patients: 52, revenue: 3100000 },
      { month: 'Mar', patients: 48, revenue: 2800000 },
      { month: 'Apr', patients: 65, revenue: 3500000 },
    ],
    topDrugs: drugs.sort((a, b) => b.stock - a.stock).slice(0, 5),
    lowStock,
  });
});

app.get('/api/reports/revenue', authMiddleware, (req, res) => {
  const invoices = Array.from(db.invoices.values()).filter(i => i.tenantId === req.user.tenantId);
  res.json({
    total: invoices.filter(i => i.status === 'PAID').reduce((sum, i) => sum + i.total, 0),
    pending: invoices.filter(i => i.status === 'PENDING').reduce((sum, i) => sum + i.total, 0),
    byMonth: [
      { month: 'Jan', amount: 2500000 },
      { month: 'Feb', amount: 3100000 },
      { month: 'Mar', amount: 2800000 },
      { month: 'Apr', amount: 3500000 },
    ],
  });
});

app.get('/api/payments/initiate', authMiddleware, (req, res) => {
  const { planId, method } = req.query;
  const plan = plans.find(p => p.id === planId);
  if (!plan) return res.status(404).json({ error: 'Plan not found' });
  const ref = `PAY-${Date.now().toString(36).toUpperCase()}`;
  res.json({
    ref,
    amount: plan.priceMonthly,
    plan: plan.name,
    instructions: method === 'MTN_MOMO' ? 'Dial *165# and enter ' + ref : 'Dial *185# and enter ' + ref,
  });
});

app.get('/api/superadmin/analytics', authMiddleware, (req, res) => {
  if (req.user.role !== 'OWNER') return res.status(403).json({ error: 'Access denied' });
  res.json({
    totalTenants: 156,
    activeTenants: 142,
    trialTenants: 23,
    totalRevenue: 45678000,
    monthlyRevenue: 12500000,
  });
});

app.listen(PORT, () => console.log(`🚀 SmartCare API running on port ${PORT}`));

export default app;
