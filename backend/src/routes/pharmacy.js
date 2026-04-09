import express from 'express';
import prisma from '../config/database.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticate);

router.get('/drugs', async (req, res) => {
  const { page = 1, limit = 20, search, category } = req.query;
  const where = { tenantId: req.tenantId, isActive: true };
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { code: { contains: search, mode: 'insensitive' } },
      { barcode: { contains: search, mode: 'insensitive' } }
    ];
  }
  if (category) where.category = category;

  const skip = (page - 1) * limit;
  const [drugs, total] = await Promise.all([
    prisma.drug.findMany({
      where,
      include: { inventory: true },
      orderBy: { name: 'asc' },
      skip,
      take: Math.min(limit, 100)
    }),
    prisma.drug.count({ where })
  ]);

  res.json({ data: drugs, total, page, limit });
});

router.post('/drugs', requireRole('OWNER', 'ADMIN', 'PHARMACIST'), async (req, res) => {
  const { name, genericName, code, category, description, unit, barcode, reorderLevel } = req.body;
  
  const existing = await prisma.drug.findFirst({
    where: { tenantId: req.tenantId, code }
  });
  if (existing) return res.status(400).json({ error: 'Drug code already exists' });

  const drug = await prisma.drug.create({
    data: { tenantId: req.tenantId, name, genericName, code, category, description, unit, barcode, reorderLevel }
  });

  res.status(201).json(drug);
});

router.get('/drugs/:id', async (req, res) => {
  const drug = await prisma.drug.findFirst({
    where: { id: req.params.id, tenantId: req.tenantId },
    include: { inventory: { include: { branch: true } }, batches: { where: { remainingQty: { gt: 0 } } } }
  });
  if (!drug) return res.status(404).json({ error: 'Drug not found' });
  res.json(drug);
});

router.put('/drugs/:id', requireRole('OWNER', 'ADMIN', 'PHARMACIST'), async (req, res) => {
  const drug = await prisma.drug.findFirst({ where: { id: req.params.id, tenantId: req.tenantId } });
  if (!drug) return res.status(404).json({ error: 'Drug not found' });

  const updated = await prisma.drug.update({ where: { id: req.params.id }, data: req.body });
  res.json(updated);
});

router.delete('/drugs/:id', requireRole('OWNER', 'ADMIN'), async (req, res) => {
  await prisma.drug.update({ where: { id: req.params.id }, data: { isActive: false } });
  res.json({ message: 'Drug deactivated' });
});

router.get('/inventory', async (req, res) => {
  const { branchId } = req.query;
  const where = { tenantId: req.tenantId };
  if (branchId) where.branchId = branchId;
  else where.branchId = req.user.branchId;

  const inventory = await prisma.inventory.findMany({
    where,
    include: { drug: true, branch: true },
    orderBy: { drug: { name: 'asc' } }
  });
  res.json(inventory);
});

router.post('/inventory', requireRole('OWNER', 'ADMIN', 'PHARMACIST'), async (req, res) => {
  const { drugId, branchId, quantity, minQuantity, reorderLevel } = req.body;
  const branch = branchId || req.user.branchId;

  const existing = await prisma.inventory.findFirst({
    where: { tenantId: req.tenantId, branchId: branch, drugId }
  });

  if (existing) {
    const updated = await prisma.inventory.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + quantity, lastRestocked: new Date() }
    });
    return res.json(updated);
  }

  const inventory = await prisma.inventory.create({
    data: { tenantId: req.tenantId, branchId: branch, drugId, quantity, minQuantity, reorderLevel }
  });
  res.status(201).json(inventory);
});

router.get('/batches', async (req, res) => {
  const { drugId, expiring } = req.query;
  const where = { drug: { tenantId: req.tenantId } };
  if (drugId) where.drugId = drugId;
  if (expiring === 'true') {
    where.expiryDate = { lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) };
    where.remainingQty = { gt: 0 };
  }

  const batches = await prisma.drugBatch.findMany({
    where,
    include: { drug: true, supplier: true },
    orderBy: { expiryDate: 'asc' }
  });
  res.json(batches);
});

router.post('/batches', requireRole('OWNER', 'ADMIN', 'PHARMACIST'), async (req, res) => {
  const { drugId, batchNumber, expiryDate, purchasePrice, quantity, supplierId } = req.body;

  const existing = await prisma.drugBatch.findFirst({
    where: { drugId, batchNumber }
  });

  if (existing) {
    const updated = await prisma.drugBatch.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + quantity, remainingQty: existing.remainingQty + quantity }
    });
    return res.json(updated);
  }

  const batch = await prisma.drugBatch.create({
    data: {
      drugId, batchNumber, expiryDate: new Date(expiryDate),
      purchasePrice, quantity, remainingQty: quantity, supplierId
    }
  });

  res.status(201).json(batch);
});

router.get('/alerts/expiry', async (req, res) => {
  const thirtyDays = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  const batches = await prisma.drugBatch.findMany({
    where: {
      drug: { tenantId: req.tenantId },
      expiryDate: { lte: thirtyDays },
      remainingQty: { gt: 0 }
    },
    include: { drug: true },
    orderBy: { expiryDate: 'asc' }
  });
  res.json(batches);
});

router.get('/alerts/low-stock', async (req, res) => {
  const inventory = await prisma.inventory.findMany({
    where: { tenantId: req.tenantId },
    include: { drug: true, branch: true }
  });
  const lowStock = inventory.filter(inv => inv.quantity <= inv.reorderLevel);
  res.json(lowStock);
});

export default router;