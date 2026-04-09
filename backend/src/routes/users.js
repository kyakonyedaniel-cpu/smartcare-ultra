import express from 'express';
import prisma from '../config/database.js';
import bcrypt from 'bcryptjs';
import { authenticate, requireRole } from '../middleware/auth.js';
import { checkTenantLimits } from '../services/tenantService.js';

const router = express.Router();
router.use(authenticate);

router.get('/', async (req, res) => {
  const users = await prisma.user.findMany({
    where: { tenantId: req.tenantId },
    include: { role: true, branch: true },
    orderBy: { createdAt: 'desc' }
  });
  res.json(users);
});

router.post('/', requireRole('OWNER', 'ADMIN'), async (req, res) => {
  const { email, password, firstName, lastName, phone, roleId, branchId } = req.body;

  const count = await prisma.user.count({ where: { tenantId: req.tenantId } });
  const limits = await checkTenantLimits(req.tenantId, 'users', count);
  if (!limits.allowed) {
    return res.status(403).json({ error: limits.reason });
  }

  const existing = await prisma.user.findUnique({
    where: { tenantId_email: { tenantId: req.tenantId, email } }
  });
  if (existing) return res.status(400).json({ error: 'Email already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      tenantId: req.tenantId,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone,
      roleId,
      branchId: branchId || req.user.branchId
    },
    include: { role: true, branch: true }
  });

  res.status(201).json(user);
});

router.get('/:id', async (req, res) => {
  const user = await prisma.user.findFirst({
    where: { id: req.params.id, tenantId: req.tenantId },
    include: { role: true, branch: true }
  });
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

router.put('/:id', async (req, res) => {
  const user = await prisma.user.findFirst({
    where: { id: req.params.id, tenantId: req.tenantId }
  });
  if (!user) return res.status(404).json({ error: 'User not found' });

  const { firstName, lastName, phone, branchId, isActive } = req.body;
  const updated = await prisma.user.update({
    where: { id: req.params.id },
    data: { firstName, lastName, phone, branchId, isActive }
  });
  res.json(updated);
});

router.put('/:id/password', async (req, res) => {
  const user = await prisma.user.findFirst({
    where: { id: req.params.id, tenantId: req.tenantId }
  });
  if (!user) return res.status(404).json({ error: 'User not found' });

  const { currentPassword, newPassword } = req.body;
  if (req.user.id !== user.id && !['OWNER', 'ADMIN'].includes(req.user.role.type)) {
    return res.status(403).json({ error: 'Cannot change other user passwords' });
  }

  if (req.user.id === user.id) {
    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) return res.status(400).json({ error: 'Current password incorrect' });
  }

  const hashed = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: req.params.id },
    data: { password: hashed }
  });

  res.json({ message: 'Password updated' });
});

router.delete('/:id', requireRole('OWNER'), async (req, res) => {
  const user = await prisma.user.findFirst({
    where: { id: req.params.id, tenantId: req.tenantId }
  });
  if (!user) return res.status(404).json({ error: 'User not found' });
  if (user.id === req.user.id) return res.status(400).json({ error: 'Cannot delete yourself' });

  await prisma.user.delete({ where: { id: req.params.id } });
  res.json({ message: 'User deleted' });
});

router.get('/roles', async (req, res) => {
  const roles = await prisma.role.findMany({
    where: { isDefault: true }
  });
  res.json(roles);
});

export default router;