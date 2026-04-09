import express from 'express';
import prisma from '../config/database.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { sendAppointmentReminder } from '../services/smsService.js';

const router = express.Router();
router.use(authenticate);

router.get('/', async (req, res) => {
  const { branchId, doctorId, date, status, page = 1, limit = 20 } = req.query;
  const where = { tenantId: req.tenantId };
  if (branchId) where.branchId = branchId;
  if (doctorId) where.userId = doctorId;
  if (status) where.status = status;
  if (date) {
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);
    where.appointmentDate = { gte: dayStart, lte: dayEnd };
  }

  const skip = (page - 1) * limit;
  const [appointments, total] = await Promise.all([
    prisma.appointment.findMany({
      where,
      include: { patient: true, user: true, branch: true },
      orderBy: { appointmentDate: 'asc' },
      skip,
      take: Math.min(limit, 100)
    }),
    prisma.appointment.count({ where })
  ]);

  res.json({ data: appointments, total, page, limit });
});

router.post('/', async (req, res) => {
  const { patientId, userId, appointmentDate, duration = 30, type = 'CONSULTATION', notes, branchId } = req.body;

  const appointment = await prisma.appointment.create({
    data: {
      tenantId: req.tenantId,
      branchId: branchId || req.user.branchId,
      patientId,
      userId,
      appointmentDate: new Date(appointmentDate),
      duration,
      type,
      notes,
      status: 'SCHEDULED'
    },
    include: { patient: true, user: true }
  });

  res.status(201).json(appointment);
});

router.get('/:id', async (req, res) => {
  const appointment = await prisma.appointment.findFirst({
    where: { id: req.params.id, tenantId: req.tenantId },
    include: { patient: true, user: true, branch: true, diagnosis: true }
  });
  if (!appointment) return res.status(404).json({ error: 'Appointment not found' });
  res.json(appointment);
});

router.put('/:id', async (req, res) => {
  const appointment = await prisma.appointment.findFirst({
    where: { id: req.params.id, tenantId: req.tenantId }
  });
  if (!appointment) return res.status(404).json({ error: 'Appointment not found' });

  const { appointmentDate, duration, type, status, notes } = req.body;
  const updated = await prisma.appointment.update({
    where: { id: req.params.id },
    data: { appointmentDate: appointmentDate ? new Date(appointmentDate) : undefined, duration, type, status, notes }
  });
  res.json(updated);
});

router.patch('/:id/status', async (req, res) => {
  const { status } = req.body;
  const appointment = await prisma.appointment.findFirst({
    where: { id: req.params.id, tenantId: req.tenantId }
  });
  if (!appointment) return res.status(404).json({ error: 'Appointment not found' });

  const updated = await prisma.appointment.update({
    where: { id: req.params.id },
    data: { status }
  });
  res.json(updated);
});

router.delete('/:id', async (req, res) => {
  const appointment = await prisma.appointment.findFirst({
    where: { id: req.params.id, tenantId: req.tenantId }
  });
  if (!appointment) return res.status(404).json({ error: 'Appointment not found' });

  await prisma.appointment.update({
    where: { id: req.params.id },
    data: { status: 'CANCELLED' }
  });
  res.json({ message: 'Appointment cancelled' });
});

router.post('/:id/reminder', requireRole('OWNER', 'ADMIN', 'RECEPTIONIST'), async (req, res) => {
  const result = await sendAppointmentReminder(req.params.id);
  res.json(result);
});

router.get('/queue', async (req, res) => {
  const { branchId, date } = req.query;
  const targetDate = date ? new Date(date) : new Date();
  targetDate.setHours(0, 0, 0, 0);
  const dayEnd = new Date(targetDate);
  dayEnd.setDate(dayEnd.getDate() + 1);

  const where = {
    tenantId: req.tenantId,
    appointmentDate: { gte: targetDate, lt: dayEnd },
    status: { in: ['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS'] }
  };
  if (branchId) where.branchId = branchId;

  const appointments = await prisma.appointment.findMany({
    where,
    include: { patient: true, user: true },
    orderBy: { appointmentDate: 'asc' }
  });

  res.json(appointments);
});

export default router;