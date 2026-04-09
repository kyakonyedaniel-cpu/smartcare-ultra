import express from 'express';
import prisma from '../config/database.js';
import { authenticate } from '../middleware/auth.js';
import { generateInvoiceNumber } from '../utils/helpers.js';

const router = express.Router();
router.use(authenticate);

router.get('/sales', async (req, res) => {
  const { branchId, startDate, endDate, page = 1, limit = 20, status } = req.query;
  const where = { tenantId: req.tenantId };
  if (branchId) where.branchId = branchId;
  if (status) where.status = status;
  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = new Date(startDate);
    if (endDate) where.createdAt.lte = new Date(endDate);
  }

  const skip = (page - 1) * limit;
  const [sales, total] = await Promise.all([
    prisma.sale.findMany({
      where,
      include: { patient: true, user: true, branch: true, items: { include: { drug: true } } },
      orderBy: { createdAt: 'desc' },
      skip,
      take: Math.min(limit, 100)
    }),
    prisma.sale.count({ where })
  ]);

  res.json({ data: sales, total, page, limit });
});

router.post('/sales', async (req, res) => {
  const { patientId, items, paymentMethod, discount = 0, notes, branchId } = req.body;
  const branch = branchId || req.user.branchId;

  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'No items provided' });
  }

  const invoiceNumber = generateInvoiceNumber('SAL');
  let subtotal = 0;

  for (const item of items) {
    const price = item.unitPrice || 0;
    subtotal += price * item.quantity;
  }

  const tax = Math.round(subtotal * 0.18); // 18% VAT
  const total = subtotal + tax - discount;

  const sale = await prisma.$transaction(async (tx) => {
    const newSale = await tx.sale.create({
      data: {
        tenantId: req.tenantId,
        branchId: branch,
        userId: req.user.id,
        patientId,
        invoiceNumber,
        subtotal,
        discount,
        tax,
        total,
        paymentMethod,
        amountPaid: total,
        changeGiven: 0,
        status: 'COMPLETED',
        notes
      }
    });

    for (const item of items) {
      await tx.saleItem.create({
        data: {
          saleId: newSale.id,
          drugId: item.drugId,
          batchId: item.batchId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.unitPrice * item.quantity,
          discount: item.discount || 0
        });
    }

    for (const item of items) {
      if (item.batchId) {
        await tx.drugBatch.update({
          where: { id: item.batchId },
          data: { remainingQty: { decrement: item.quantity } }
        });
      }

      const inventory = await tx.inventory.findFirst({
        where: { tenantId: req.tenantId, branchId: branch, drugId: item.drugId }
      });
      if (inventory) {
        await tx.inventory.update({
          where: { id: inventory.id },
          data: { quantity: { decrement: item.quantity } }
        });
      }
    }

    return tx.sale.findUnique({
      where: { id: newSale.id },
      include: { patient: true, user: true, items: { include: { drug: true } } }
    });
  });

  res.status(201).json(sale);
});

router.get('/sales/:id', async (req, res) => {
  const sale = await prisma.sale.findFirst({
    where: { id: req.params.id, tenantId: req.tenantId },
    include: { patient: true, user: true, branch: true, items: { include: { drug: true, batch: true } } }
  });
  if (!sale) return res.status(404).json({ error: 'Sale not found' });
  res.json(sale);
});

router.post('/sales/:id/refund', async (req, res) => {
  const sale = await prisma.sale.findFirst({
    where: { id: req.params.id, tenantId: req.tenantId }
  });
  if (!sale) return res.status(404).json({ error: 'Sale not found' });

  const refunded = await prisma.$transaction(async (tx) => {
    await tx.sale.update({ where: { id: sale.id }, data: { status: 'REFUNDED' } });

    const items = await tx.saleItem.findMany({ where: { saleId: sale.id } });
    for (const item of items) {
      if (item.batchId) {
        await tx.drugBatch.update({
          where: { id: item.batchId },
          data: { remainingQty: { increment: item.quantity } }
        });
      }
      const inv = await tx.inventory.findFirst({
        where: { tenantId: req.tenantId, branchId: sale.branchId, drugId: item.drugId }
      });
      if (inv) {
        await tx.inventory.update({
          where: { id: inv.id },
          data: { quantity: { increment: item.quantity } }
        });
      }
    }

    return tx.sale.findUnique({ where: { id: sale.id }, include: { items: { include: { drug: true } } } });
  });

  res.json(refunded);
});

router.get('/daily-summary', async (req, res) => {
  const { branchId } = req.query;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const where = {
    tenantId: req.tenantId,
    createdAt: { gte: today, lt: tomorrow },
    status: 'COMPLETED'
  };
  if (branchId) where.branchId = branchId;

  const [sales, totalRevenue, transactionCount] = await Promise.all([
    prisma.sale.findMany({ where, include: { items: true } }),
    prisma.sale.aggregate({ where, _sum: { total: true } }),
    prisma.sale.count({ where })
  ]);

  const byPayment = await prisma.sale.groupBy({
    by: ['paymentMethod'],
    where,
    _sum: { total: true },
    _count: true
  });

  res.json({
    date: today.toISOString().split('T')[0],
    totalRevenue: totalRevenue._sum.total || 0,
    transactionCount,
    sales: sales.slice(0, 10),
    byPaymentMethod: byPayment
  });
});

router.get('/search', async (req, res) => {
  const { q } = req.query;
  if (!q || q.length < 2) return res.json([]);

  const drugs = await prisma.drug.findMany({
    where: {
      tenantId: req.tenantId,
      isActive: true,
      OR: [
        { name: { contains: q, mode: 'insensitive' } },
        { code: { contains: q, mode: 'insensitive' } },
        { barcode: { contains: q, mode: 'insensitive' } }
      ]
    },
    include: { inventory: { where: { branchId: req.user.branchId } } },
    take: 20
  });

  res.json(drugs);
});

export default router;