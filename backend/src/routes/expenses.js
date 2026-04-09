import express from 'express';
import prisma from '../config/database.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticate);

const EXPENSE_CATEGORIES = ['SUPPLIES', 'EQUIPMENT', 'RENT', 'UTILITIES', 'SALARY', 'MAINTENANCE', 'MARKETING', 'OTHER'];

router.get('/', async (req, res) => {
  const { branchId, category, startDate, endDate, page = 1, limit = 20 } = req.query;
  const where = { tenantId: req.tenantId };
  if (branchId) where.branchId = branchId;
  if (category) where.category = category;
  if (startDate || endDate) {
    where.date = {};
    if (startDate) where.date.gte = new Date(startDate);
    if (endDate) where.date.lte = new Date(endDate);
  }

  const skip = (page - 1) * limit;
  const [expenses, total] = await Promise.all([
    prisma.expense.findMany({
      where,
      include: { branch: true },
      orderBy: { date: 'desc' },
      skip,
      take: Math.min(limit, 100)
    }),
    prisma.expense.count({ where })
  ]);

  res.json({ data: expenses, total, page, limit });
});

router.post('/', requireRole('OWNER', 'ADMIN'), async (req, res) => {
  const { category, description, amount, date, attachment, branchId } = req.body;
  
  if (!EXPENSE_CATEGORIES.includes(category)) {
    return res.status(400).json({ error: 'Invalid category' });
  }

  const expense = await prisma.expense.create({
    data: {
      tenantId: req.tenantId,
      branchId: branchId || req.user.branchId,
      category,
      description,
      amount: Math.round(amount),
      date: date ? new Date(date) : new Date(),
      attachment
    }
  });

  res.status(201).json(expense);
});

router.get('/categories', (req, res) => {
  res.json(EXPENSE_CATEGORIES);
});

router.get('/summary', async (req, res) => {
  const { branchId, startDate, endDate } = req.query;
  const where = { tenantId: req.tenantId };
  if (branchId) where.branchId = branchId;
  if (startDate || endDate) {
    where.date = {};
    if (startDate) where.date.gte = new Date(startDate);
    if (endDate) where.date.lte = new Date(endDate);
  }

  const byCategory = await prisma.expense.groupBy({
    by: ['category'],
    where,
    _sum: { amount: true },
    _count: true
  });

  const total = await prisma.expense.aggregate({
    where,
    _sum: { amount: true }
  });

  res.json({
    total: total._sum.amount || 0,
    byCategory: byCategory.map(c => ({ category: c.category, amount: c._sum.amount || 0, count: c._count }))
  });
});

router.put('/:id', requireRole('OWNER', 'ADMIN'), async (req, res) => {
  const expense = await prisma.expense.findFirst({
    where: { id: req.params.id, tenantId: req.tenantId }
  });
  if (!expense) return res.status(404).json({ error: 'Expense not found' });

  const updated = await prisma.expense.update({
    where: { id: req.params.id },
    data: req.body
  });
  res.json(updated);
});

router.delete('/:id', requireRole('OWNER'), async (req, res) => {
  const expense = await prisma.expense.findFirst({
    where: { id: req.params.id, tenantId: req.tenantId }
  });
  if (!expense) return res.status(404).json({ error: 'Expense not found' });

  await prisma.expense.delete({ where: { id: req.params.id } });
  res.json({ message: 'Expense deleted' });
});

export default router;