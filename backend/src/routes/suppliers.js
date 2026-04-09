import express from 'express';
import prisma from '../config/database.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticate);

router.get('/suppliers', async (req, res) => {
  const { isActive, page = 1, limit = 20, search } = req.query;
  const where = { tenantId: req.tenantId };
  if (isActive !== undefined) where.isActive = isActive === 'true';
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { phone: { contains: search, mode: 'insensitive' } }
    ];
  }

  const skip = (page - 1) * limit;
  const [suppliers, total] = await Promise.all([
    prisma.supplier.findMany({ where, orderBy: { name: 'asc' }, skip, take: Math.min(limit, 100) }),
    prisma.supplier.count({ where })
  ]);

  res.json({ data: suppliers, total, page, limit });
});

router.post('/suppliers', requireRole('OWNER', 'ADMIN', 'PHARMACIST'), async (req, res) => {
  const { name, contactPerson, email, phone, address, notes } = req.body;
  const supplier = await prisma.supplier.create({
    data: { tenantId: req.tenantId, name, contactPerson, email, phone, address, notes }
  });
  res.status(201).json(supplier);
});

router.get('/suppliers/:id', async (req, res) => {
  const supplier = await prisma.supplier.findFirst({
    where: { id: req.params.id, tenantId: req.tenantId },
    include: { drugBatches: true }
  });
  if (!supplier) return res.status(404).json({ error: 'Supplier not found' });
  res.json(supplier);
});

router.put('/suppliers/:id', requireRole('OWNER', 'ADMIN'), async (req, res) => {
  const supplier = await prisma.supplier.findFirst({ where: { id: req.params.id, tenantId: req.tenantId } });
  if (!supplier) return res.status(404).json({ error: 'Supplier not found' });

  const updated = await prisma.supplier.update({ where: { id: req.params.id }, data: req.body });
  res.json(updated);
});

router.get('/orders', async (req, res) => {
  const { supplierId, status, page = 1, limit = 20 } = req.query;
  const where = { tenantId: req.tenantId };
  if (supplierId) where.supplierId = supplierId;
  if (status) where.status = status;

  const skip = (page - 1) * limit;
  const [orders, total] = await Promise.all([
    prisma.purchaseOrder.findMany({
      where,
      include: { supplier: true, items: { include: { drug: true } } },
      orderBy: { createdAt: 'desc' },
      skip,
      take: Math.min(limit, 100)
    }),
    prisma.purchaseOrder.count({ where })
  ]);

  res.json({ data: orders, total, page, limit });
});

router.post('/orders', requireRole('OWNER', 'ADMIN', 'PHARMACIST'), async (req, res) => {
  const { supplierId, items, expectedDate, notes } = req.body;
  const orderNumber = `PO${Date.now().toString(36).toUpperCase()}`;

  let total = 0;
  for (const item of items) total += item.quantity * item.unitPrice;

  const order = await prisma.$transaction(async (tx) => {
    const newOrder = await tx.purchaseOrder.create({
      data: {
        tenantId: req.tenantId,
        supplierId,
        orderNumber,
        total,
        expectedDate: expectedDate ? new Date(expectedDate) : null,
        notes,
        status: 'PENDING'
      }
    });

    for (const item of items) {
      await tx.purchaseOrderItem.create({
        data: {
          purchaseOrderId: newOrder.id,
          drugId: item.drugId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.quantity * item.unitPrice
        }
      });
    }

    return tx.purchaseOrder.findUnique({
      where: { id: newOrder.id },
      include: { supplier: true, items: { include: { drug: true } } }
    });
  });

  res.status(201).json(order);
});

router.get('/orders/:id', async (req, res) => {
  const order = await prisma.purchaseOrder.findFirst({
    where: { id: req.params.id, tenantId: req.tenantId },
    include: { supplier: true, items: { include: { drug: true } } }
  });
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
});

router.patch('/orders/:id/status', requireRole('OWNER', 'ADMIN', 'PHARMACIST'), async (req, res) => {
  const { status } = req.body;
  const order = await prisma.purchaseOrder.findFirst({
    where: { id: req.params.id, tenantId: req.tenantId }
  });
  if (!order) return res.status(404).json({ error: 'Order not found' });

  const updated = await prisma.purchaseOrder.update({
    where: { id: req.params.id },
    data: { status, receivedDate: status === 'RECEIVED' ? new Date() : undefined }
  });
  res.json(updated);
});

export default router;