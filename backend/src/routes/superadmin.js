import express from 'express';
import prisma from '../config/database.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);
router.use(requireRole('OWNER'));

router.get('/tenants', async (req, res) => {
  const { status, page = 1, limit = 20, search } = req.query;
  const where = {};
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } }
    ];
  }

  const skip = (page - 1) * limit;
  const [tenants, total] = await Promise.all([
    prisma.tenant.findMany({
      where,
      include: { subscription: { include: { plan: true } }, branches: true, _count: { select: { users: true, patients: true } } },
      orderBy: { createdAt: 'desc' },
      skip,
      take: Math.min(limit, 100)
    }),
    prisma.tenant.count({ where })
  ]);

  res.json({ data: tenants, total, page, limit });
});

router.get('/tenants/:id', async (req, res) => {
  const tenant = await prisma.tenant.findUnique({
    where: { id: req.params.id },
    include: { subscription: { include: { plan: true, payments: true } }, branches: true, users: true, patients: true }
  });
  if (!tenant) return res.status(404).json({ error: 'Tenant not found' });
  res.json(tenant);
});

router.patch('/tenants/:id/status', async (req, res) => {
  const { status } = req.body;
  const tenant = await prisma.tenant.findUnique({ where: { id: req.params.id } });
  if (!tenant) return res.status(404).json({ error: 'Tenant not found' });

  await prisma.tenant.update({ where: { id: req.params.id }, data: { status } });
  
  if (status === 'SUSPENDED') {
    await prisma.subscription.updateMany({ where: { tenantId: req.params.id }, data: { status: 'SUSPENDED' } });
  }

  res.json({ message: `Tenant ${status.toLowerCase()}` });
});

router.get('/plans', async (req, res) => {
  const plans = await prisma.plan.findMany({ orderBy: { sortOrder: 'asc' } });
  res.json(plans);
});

router.post('/plans', requireRole('OWNER'), async (req, res) => {
  const { name, description, priceMonthly, priceYearly, maxPatients, maxBranches, maxUsers, maxStorageMB, features, sortOrder } = req.body;
  const plan = await prisma.plan.create({
    data: { name, description, priceMonthly, priceYearly, maxPatients, maxBranches, maxUsers, maxStorageMB, features: features || [], sortOrder: sortOrder || 0 }
  });
  res.status(201).json(plan);
});

router.put('/plans/:id', requireRole('OWNER'), async (req, res) => {
  const plan = await prisma.plan.update({ where: { id: req.params.id }, data: req.body });
  res.json(plan);
});

router.get('/analytics', async (req, res) => {
  const [totalTenants, activeTenants, totalRevenue, totalPatients] = await Promise.all([
    prisma.tenant.count(),
    prisma.tenant.count({ where: { status: 'ACTIVE' } }),
    prisma.payment.aggregate({ where: { status: 'COMPLETED' }, _sum: { amount: true } }),
    prisma.patient.count()
  ]);

  const subscriptions = await prisma.subscription.groupBy({ by: ['status'], _count: true });
  const plans = await prisma.plan.findMany({ include: { _count: { select: { subscriptions: true } } } });

  res.json({
    totalTenants,
    activeTenants,
    totalRevenue: totalRevenue._sum.amount || 0,
    totalPatients,
    bySubscriptionStatus: subscriptions.map(s => ({ status: s.status, count: s._count })),
    byPlan: plans.map(p => ({ plan: p.name, count: p._count.subscriptions }))
  });
});

router.get('/revenue', async (req, res) => {
  const { startDate, endDate, groupBy = 'month' } = req.query;
  const where = { status: 'COMPLETED' };
  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = new Date(startDate);
    if (endDate) where.createdAt.lte = new Date(endDate);
  }

  const payments = await prisma.payment.findMany({
    where,
    include: { subscription: { include: { tenant: true } } },
    orderBy: { createdAt: 'asc' }
  });

  let grouped = {};
  for (const payment of payments) {
    let key;
    const date = payment.createdAt;
    if (groupBy === 'day') key = date.toISOString().slice(0, 10);
    else if (groupBy === 'year') key = date.getFullYear().toString();
    else key = date.toISOString().slice(0, 7);
    grouped[key] = (grouped[key] || 0) + payment.amount;
  }

  res.json(Object.entries(grouped).map(([date, amount]) => ({ date, amount })));
});

router.get('/roles', async (req, res) => {
  const roles = await prisma.role.findMany({ orderBy: { id: 'asc' } });
  res.json(roles);
});

router.post('/roles', requireRole('OWNER'), async (req, res) => {
  const { name, description, type, permissions } = req.body;
  const role = await prisma.role.create({
    data: { name, description, type, permissions: permissions || [], isDefault: false }
  });
  res.status(201).json(role);
});

export default router;