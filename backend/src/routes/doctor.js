import express from 'express';
import prisma from '../config/database.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticate);

router.get('/diagnoses', async (req, res) => {
  const { patientId, page = 1, limit = 20 } = req.query;
  const where = { tenantId: req.tenantId };
  if (patientId) where.patientId = patientId;

  const skip = (page - 1) * limit;
  const [diagnoses, total] = await Promise.all([
    prisma.diagnosis.findMany({
      where,
      include: { patient: true, user: { select: { firstName: true, lastName: true } }, branch: true },
      orderBy: { createdAt: 'desc' },
      skip,
      take: Math.min(limit, 100)
    }),
    prisma.diagnosis.count({ where })
  ]);

  res.json({ data: diagnoses, total, page, limit });
});

router.post('/diagnoses', requireRole('OWNER', 'ADMIN', 'DOCTOR'), async (req, res) => {
  const { patientId, diagnosis, symptoms, notes, appointmentId, branchId } = req.body;

  const diagnosisRecord = await prisma.diagnosis.create({
    data: {
      tenantId: req.tenantId,
      patientId,
      userId: req.user.id,
      branchId: branchId || req.user.branchId,
      appointmentId,
      diagnosis,
      symptoms,
      notes
    },
    include: { patient: true, user: { select: { firstName: true, lastName: true } } }
  });

  res.status(201).json(diagnosisRecord);
});

router.get('/diagnoses/:id', async (req, res) => {
  const diagnosis = await prisma.diagnosis.findFirst({
    where: { id: req.params.id, tenantId: req.tenantId },
    include: { patient: true, user: true, branch: true, prescriptions: true }
  });
  if (!diagnosis) return res.status(404).json({ error: 'Diagnosis not found' });
  res.json(diagnosis);
});

router.get('/prescriptions', async (req, res) => {
  const { patientId, status, page = 1, limit = 20 } = req.query;
  const where = { tenantId: req.tenantId };
  if (patientId) where.patientId = patientId;
  if (status) where.status = status;

  const skip = (page - 1) * limit;
  const [prescriptions, total] = await Promise.all([
    prisma.prescription.findMany({
      where,
      include: { patient: true, user: { select: { firstName: true, lastName: true } }, items: { include: { drug: true } } },
      orderBy: { createdAt: 'desc' },
      skip,
      take: Math.min(limit, 100)
    }),
    prisma.prescription.count({ where })
  ]);

  res.json({ data: prescriptions, total, page, limit });
});

router.post('/prescriptions', requireRole('OWNER', 'ADMIN', 'DOCTOR'), async (req, res) => {
  const { patientId, diagnosisId, prescription: prescriptionText, notes, items, branchId } = req.body;

  const prescriptionRecord = await prisma.prescription.create({
    data: {
      tenantId: req.tenantId,
      patientId,
      diagnosisId,
      userId: req.user.id,
      branchId: branchId || req.user.branchId,
      prescription: prescriptionText,
      notes,
      items: {
        create: items?.map(item => ({
          drugId: item.drugId,
          quantity: item.quantity,
          dosage: item.dosage,
          instructions: item.instructions,
          price: item.price || 0
        })) || []
      }
    },
    include: { patient: true, items: { include: { drug: true } } }
  });

  res.status(201).json(prescriptionRecord);
});

router.get('/prescriptions/:id', async (req, res) => {
  const prescription = await prisma.prescription.findFirst({
    where: { id: req.params.id, tenantId: req.tenantId },
    include: { patient: true, user: true, items: { include: { drug: true } }, diagnosis: true }
  });
  if (!prescription) return res.status(404).json({ error: 'Prescription not found' });
  res.json(prescription);
});

router.patch('/prescriptions/:id/status', requireRole('OWNER', 'ADMIN', 'PHARMACIST'), async (req, res) => {
  const { status } = req.body;
  const prescription = await prisma.prescription.findFirst({
    where: { id: req.params.id, tenantId: req.tenantId }
  });
  if (!prescription) return res.status(404).json({ error: 'Prescription not found' });

  const updated = await prisma.prescription.update({
    where: { id: req.params.id },
    data: { status }
  });
  res.json(updated);
});

export default router;