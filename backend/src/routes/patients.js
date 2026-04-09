import express from 'express';
import prisma from '../config/database.js';
import { authenticate } from '../middleware/auth.js';
import { checkTenantLimits } from '../services/tenantService.js';
import { paginatedResponse, generateInvoiceNumber } from '../utils/helpers.js';

const router = express.Router();
router.use(authenticate);

router.get('/', async (req, res) => {
  const { page = 1, limit = 20, search, branchId, isActive } = req.query;
  const where = { tenantId: req.tenantId };
  
  if (search) {
    where.OR = [
      { firstName: { contains: search, mode: 'insensitive' } },
      { lastName: { contains: search, mode: 'insensitive' } },
      { phone: { contains: search, mode: 'insensitive' } },
      { patientNumber: { contains: search, mode: 'insensitive' } }
    ];
  }
  if (branchId) where.branchId = branchId;
  if (isActive !== undefined) where.isActive = isActive === 'true';

  const skip = (page - 1) * limit;
  const [patients, total] = await Promise.all([
    prisma.patient.findMany({
      where,
      include: { branch: true },
      orderBy: { createdAt: 'desc' },
      skip,
      take: Math.min(limit, 100)
    }),
    prisma.patient.count({ where })
  ]);

  res.json(paginatedResponse(patients, total, page, limit));
});

router.post('/', async (req, res) => {
  const count = await prisma.patient.count({ where: { tenantId: req.tenantId } });
  const limits = await checkTenantLimits(req.tenantId, 'patients', count);
  if (!limits.allowed) return res.status(403).json({ error: limits.reason });

  const { firstName, lastName, gender, dateOfBirth, phone, email, address, emergencyContact, emergencyPhone, bloodType, allergies, notes, branchId } = req.body;
  
  const patientNumber = `P${Date.now().toString(36).toUpperCase()}`;
  
  const patient = await prisma.patient.create({
    data: {
      tenantId: req.tenantId,
      branchId: branchId || req.user.branchId,
      patientNumber,
      firstName, lastName, gender, dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      phone, email, address, emergencyContact, emergencyPhone, bloodType, allergies, notes
    }
  });

  res.status(201).json(patient);
});

router.get('/:id', async (req, res) => {
  const patient = await prisma.patient.findFirst({
    where: { id: req.params.id, tenantId: req.tenantId },
    include: { branch: true }
  });
  if (!patient) return res.status(404).json({ error: 'Patient not found' });
  res.json(patient);
});

router.get('/:id/history', async (req, res) => {
  const [diagnoses, prescriptions, appointments, invoices] = await Promise.all([
    prisma.diagnosis.findMany({
      where: { patientId: req.params.id, tenantId: req.tenantId },
      include: { user: { select: { firstName: true, lastName: true } }, branch: true },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.prescription.findMany({
      where: { patientId: req.params.id, tenantId: req.tenantId },
      include: { items: { include: { drug: true } }, user: true },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.appointment.findMany({
      where: { patientId: req.params.id, tenantId: req.tenantId },
      include: { user: true, branch: true },
      orderBy: { appointmentDate: 'desc' }
    }),
    prisma.invoice.findMany({
      where: { patientId: req.params.id, tenantId: req.tenantId },
      orderBy: { createdAt: 'desc' }
    })
  ]);

  res.json({ diagnoses, prescriptions, appointments, invoices });
});

router.put('/:id', async (req, res) => {
  const patient = await prisma.patient.findFirst({
    where: { id: req.params.id, tenantId: req.tenantId }
  });
  if (!patient) return res.status(404).json({ error: 'Patient not found' });

  const updated = await prisma.patient.update({
    where: { id: req.params.id },
    data: req.body
  });
  res.json(updated);
});

router.delete('/:id', async (req, res) => {
  const patient = await prisma.patient.findFirst({
    where: { id: req.params.id, tenantId: req.tenantId }
  });
  if (!patient) return res.status(404).json({ error: 'Patient not found' });

  await prisma.patient.update({
    where: { id: req.params.id },
    data: { isActive: false }
  });
  res.json({ message: 'Patient deactivated' });
});

export default router;