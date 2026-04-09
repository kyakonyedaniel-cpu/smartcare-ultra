import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import prisma from './config/database.js';
import redis from './config/redis.js';

import authRoutes from './routes/auth.js';
import tenantRoutes from './routes/tenant.js';
import branchRoutes from './routes/branches.js';
import userRoutes from './routes/users.js';
import patientRoutes from './routes/patients.js';
import doctorRoutes from './routes/doctor.js';
import pharmacyRoutes from './routes/pharmacy.js';
import salesRoutes from './routes/sales.js';
import appointmentRoutes from './routes/appointments.js';
import invoiceRoutes from './routes/invoices.js';
import expenseRoutes from './routes/expenses.js';
import supplierRoutes from './routes/suppliers.js';
import reportRoutes from './routes/reports.js';
import smsRoutes from './routes/sms.js';
import superadminRoutes from './routes/superadmin.js';

import { authenticate } from './middleware/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/tenant', authenticate, tenantRoutes);
app.use('/api/branches', authenticate, branchRoutes);
app.use('/api/users', authenticate, userRoutes);
app.use('/api/patients', authenticate, patientRoutes);
app.use('/api/doctor', authenticate, doctorRoutes);
app.use('/api/pharmacy', authenticate, pharmacyRoutes);
app.use('/api/sales', authenticate, salesRoutes);
app.use('/api/appointments', authenticate, appointmentRoutes);
app.use('/api/invoices', authenticate, invoiceRoutes);
app.use('/api/expenses', authenticate, expenseRoutes);
app.use('/api/suppliers', authenticate, supplierRoutes);
app.use('/api/reports', authenticate, reportRoutes);
app.use('/api/sms', authenticate, smsRoutes);
app.use('/api/superadmin', authenticate, superadminRoutes);

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.statusCode || 500).json({ error: err.message || 'Internal server error' });
});

const start = async () => {
  try {
    await prisma.$connect();
    console.log('✅ Database connected');

    try {
      await redis.ping();
      console.log('✅ Redis connected');
    } catch (e) {
      console.warn('⚠️ Redis not available, continuing without cache');
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

start();

export default app;