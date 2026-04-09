import express from 'express';
import prisma from '../config/database.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticate);

router.get('/sales', async (req, res) => {
  const { branchId, startDate, endDate, groupBy = 'day' } = req.query;
  const where = { tenantId: req.tenantId, status: 'COMPLETED' };
  if (branchId) where.branchId = branchId;
  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = new Date(startDate);
    if (endDate) where.createdAt.lte = new Date(endDate);
  }

  const sales = await prisma.sale.findMany({
    where,
    select: { total: true, createdAt: true, branchId: true }
  });

  let grouped = {};
  for (const sale of sales) {
    let key;
    if (groupBy === 'month') key = sale.createdAt.toISOString().slice(0, 7);
    else if (groupBy === 'year') key = sale.createdAt.getFullYear().toString();
    else key = sale.createdAt.toISOString().slice(0, 10);
    grouped[key] = (grouped[key] || 0) + sale.total;
  }

  res.json(Object.entries(grouped).map(([date, total]) => ({ date, total })));
});

router.get('/revenue', async (req, res) => {
  const { branchId, startDate, endDate } = req.query;
  const where = { tenantId: req.tenantId, status: 'COMPLETED' };
  if (branchId) where.branchId = branchId;
  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = new Date(startDate);
    if (endDate) where.createdAt.lte = new Date(endDate);
  }

  const [total, byBranch, byPayment] = await Promise.all([
    prisma.sale.aggregate({ where, _sum: { total: true } }),
    prisma.sale.groupBy({ by: ['branchId'], where, _sum: { total: true } }),
    prisma.sale.groupBy({ by: ['paymentMethod'], where, _sum: { total: true }, _count: true })
  ]);

  const branches = await prisma.branch.findMany({ where: { id: { in: byBranch.map(b => b.branchId) } } });
  const branchMap = Object.fromEntries(branches.map(b => [b.id, b.name]));

  res.json({
    total: total._sum.total || 0,
    byBranch: byBranch.map(b => ({ branch: branchMap[b.branchId] || 'Unknown', revenue: b._sum.total || 0 })),
    byPayment: byPayment.map(p => ({ method: p.paymentMethod, revenue: p._sum.total || 0, count: p._count }))
  });
});

router.get('/profit', async (req, res) => {
  const { branchId, startDate, endDate } = req.query;
  const where = { tenantId: req.tenantId };
  if (branchId) where.branchId = branchId;
  if (startDate || endDate) {
    where.date = {};
    if (startDate) where.date.gte = new Date(startDate);
    if (endDate) where.date.lte = new Date(endDate);
  }

  const [revenue, expenses] = await Promise.all([
    prisma.sale.aggregate({
      where: { tenantId: req.tenantId, status: 'COMPLETED', ...(branchId ? { branchId } : {}) },
      _sum: { total: true }
    }),
    prisma.expense.aggregate({ where, _sum: { amount: true } })
  ]);

  const rev = revenue._sum.total || 0;
  const exp = expenses._sum.amount || 0;
  res.json({ revenue: rev, expenses: exp, profit: rev - exp, margin: rev > 0 ? Math.round((rev - exp) / rev * 100) : 0 });
});

router.get('/patients', async (req, res) => {
  const { branchId, startDate, endDate } = req.query;
  const where = { tenantId: req.tenantId };
  if (branchId) where.branchId = branchId;
  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = new Date(startDate);
    if (endDate) where.createdAt.lte = new Date(endDate);
  }

  const total = await prisma.patient.count({ where });
  const byGender = await prisma.patient.groupBy({ by: ['gender'], where, _count: true });

  res.json({ total, byGender: byGender.map(g => ({ gender: g.gender, count: g._count })) });
});

router.get('/inventory', async (req, res) => {
  const { branchId } = req.query;
  const where = { tenantId: req.tenantId };
  if (branchId) where.branchId = branchId;

  const inventory = await prisma.inventory.findMany({
    where,
    include: { drug: true, branch: true }
  });

  const totalValue = inventory.reduce((sum, inv) => sum + (inv.quantity * (inv.drug.unitPrice || 0)), 0);
  const lowStock = inventory.filter(i => i.quantity <= i.reorderLevel).length;
  const outOfStock = inventory.filter(i => i.quantity === 0).length;

  res.json({ totalItems: inventory.length, totalValue, lowStock, outOfStock, items: inventory });
});

router.get('/top-drugs', async (req, res) => {
  const { branchId, startDate, endDate, limit = 10 } = req.query;
  const where = { sale: { tenantId: req.tenantId, status: 'COMPLETED' } };
  if (branchId) where.sale.branchId = branchId;
  if (startDate || endDate) {
    where.sale.createdAt = {};
    if (startDate) where.sale.createdAt.gte = new Date(startDate);
    if (endDate) where.sale.createdAt.lte = new Date(endDate);
  }

  const topItems = await prisma.saleItem.groupBy({
    by: ['drugId'],
    where,
    _sum: { quantity: true, totalPrice: true },
    orderBy: { _sum: { totalPrice: 'desc' } },
    take: parseInt(limit)
  });

  const drugIds = topItems.map(t => t.drugId);
  const drugs = await prisma.drug.findMany({ where: { id: { in: drugIds } } });
  const drugMap = Object.fromEntries(drugs.map(d => [d.id, d]));

  res.json(topItems.map(t => ({ drug: drugMap[t.drugId], quantity: t._sum.quantity, revenue: t._sum.totalPrice })));
});

router.get('/appointments', async (req, res) => {
  const { branchId, startDate, endDate } = req.query;
  const where = { tenantId: req.tenantId };
  if (branchId) where.branchId = branchId;
  if (startDate || endDate) {
    where.appointmentDate = {};
    if (startDate) where.appointmentDate.gte = new Date(startDate);
    if (endDate) where.appointmentDate.lte = new Date(endDate);
  }

  const [total, byStatus, byType] = await Promise.all([
    prisma.appointment.count({ where }),
    prisma.appointment.groupBy({ by: ['status'], where, _count: true }),
    prisma.appointment.groupBy({ by: ['type'], where, _count: true })
  ]);

  res.json({
    total,
    byStatus: byStatus.map(s => ({ status: s.status, count: s._count })),
    byType: byType.map(t => ({ type: t.type, count: t._count }))
  });
});

export default router;