import express from 'express';
import prisma from '../config/database.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { generateInvoiceNumber } from '../utils/helpers.js';

const router = express.Router();
router.use(authenticate);

router.get('/', async (req, res) => {
  const { branchId, patientId, status, page = 1, limit = 20 } = req.query;
  const where = { tenantId: req.tenantId };
  if (branchId) where.branchId = branchId;
  if (patientId) where.patientId = patientId;
  if (status) where.status = status;

  const skip = (page - 1) * limit;
  const [invoices, total] = await Promise.all([
    prisma.invoice.findMany({
      where,
      include: { patient: true, branch: true, payments: true },
      orderBy: { createdAt: 'desc' },
      skip,
      take: Math.min(limit, 100)
    }),
    prisma.invoice.count({ where })
  ]);

  res.json({ data: invoices, total, page, limit });
});

router.post('/', async (req, res) => {
  const { patientId, type = 'SALE', items, subtotal, tax = 0, discount = 0, dueDate, notes, branchId } = req.body;
  const branch = branchId || req.user.branchId;

  const invoiceNumber = generateInvoiceNumber('INV');
  const total = subtotal + tax - discount;

  const invoice = await prisma.$transaction(async (tx) => {
    const newInvoice = await tx.invoice.create({
      data: {
        tenantId: req.tenantId,
        branchId: branch,
        patientId,
        invoiceNumber,
        type,
        subtotal,
        tax,
        discount,
        total,
        status: 'PENDING',
        dueDate: dueDate ? new Date(dueDate) : null,
        notes
      }
    });

    if (items?.length) {
      for (const item of items) {
        await tx.invoiceItem.create({
          data: {
            invoiceId: newInvoice.id,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.unitPrice * item.quantity
          }
        });
      }
    }

    return tx.invoice.findUnique({
      where: { id: newInvoice.id },
      include: { patient: true, items: true }
    });
  });

  res.status(201).json(invoice);
});

router.get('/:id', async (req, res) => {
  const invoice = await prisma.invoice.findFirst({
    where: { id: req.params.id, tenantId: req.tenantId },
    include: { patient: true, branch: true, items: true, payments: true }
  });
  if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
  res.json(invoice);
});

router.post('/:id/pay', async (req, res) => {
  const { amount, paymentMethod, reference } = req.body;
  const invoice = await prisma.invoice.findFirst({
    where: { id: req.params.id, tenantId: req.tenantId }
  });
  if (!invoice) return res.status(404).json({ error: 'Invoice not found' });

  const payment = await prisma.invoicePayment.create({
    data: {
      invoiceId: invoice.id,
      amount,
      paymentMethod,
      reference
    }
  });

  const payments = await prisma.invoicePayment.findMany({
    where: { invoiceId: invoice.id }
  });
  const paidTotal = payments.reduce((sum, p) => sum + p.amount, 0);

  let status = invoice.status;
  if (paidTotal >= invoice.total) status = 'PAID';
  else if (paidTotal > 0) status = 'PARTIAL';

  await prisma.invoice.update({
    where: { id: invoice.id },
    data: { status, paidAt: status === 'PAID' ? new Date() : null }
  });

  res.json({ payment, invoice: await prisma.invoice.findUnique({ where: { id: invoice.id } }) });
});

router.put('/:id', requireRole('OWNER', 'ADMIN'), async (req, res) => {
  const invoice = await prisma.invoice.findFirst({
    where: { id: req.params.id, tenantId: req.tenantId }
  });
  if (!invoice) return res.status(404).json({ error: 'Invoice not found' });

  const updated = await prisma.invoice.update({
    where: { id: req.params.id },
    data: req.body
  });
  res.json(updated);
});

router.delete('/:id', requireRole('OWNER', 'ADMIN'), async (req, res) => {
  await prisma.invoice.update({
    where: { id: req.params.id },
    data: { status: 'CANCELLED' }
  });
  res.json({ message: 'Invoice cancelled' });
});

export default router;