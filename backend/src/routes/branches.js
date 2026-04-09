import express from 'express';
import prisma from '../config/database.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { checkTenantLimits } from '../services/tenantService.js';

const router = express.Router();
router.use(authenticate);

router.get('/', async (req, res) => {
  const branches = await prisma.branch.findMany({
    where: { tenantId: req.tenantId },
    orderBy: { isDefault: 'desc' }
  });
  res.json(branches);
});

router.post('/', requireRole('OWNER', 'ADMIN'), async (req, res) => {
  const { name, code, address, phone, email } = req.body;
  
  const count = await prisma.branch.count({ where: { tenantId: req.tenantId } });
  const limits = await checkTenantLimits(req.tenantId, 'branches', count);
  if (!limits.allowed) {
    return res.status(403).json({ error: limits.reason });
  }

  const branch = await prisma.branch.create({
    data: { tenantId: req.tenantId, name, code, address, phone, email }
  });
  res.status(201).json(branch);
});

router.get('/:id', async (req, res) => {
  const branch = await prisma.branch.findFirst({
    where: { id: req.params.id, tenantId: req.tenantId }
  });
  if (!branch) return res.status(404).json({ error: 'Branch not found' });
  res.json(branch);
});

router.put('/:id', requireRole('OWNER', 'ADMIN'), async (req, res) => {
  const branch = await prisma.branch.findFirst({
    where: { id: req.params.id, tenantId: req.tenantId }
  });
  if (!branch) return res.status(404).json({ error: 'Branch not found' });

  const updated = await prisma.branch.update({
    where: { id: req.params.id },
    data: req.body
  });
  res.json(updated);
});

router.delete('/:id', requireRole('OWNER'), async (req, res) => {
  const branch = await prisma.branch.findFirst({
    where: { id: req.params.id, tenantId: req.tenantId }
  });
  if (!branch) return res.status(404).json({ error: 'Branch not found' });
  if (branch.isDefault) return res.status(400).json({ error: 'Cannot delete default branch' });

  await prisma.branch.delete({ where: { id: req.params.id } });
  res.json({ message: 'Branch deleted' });
});

export default router;