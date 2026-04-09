import express from 'express';
import prisma from '../config/database.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { checkTenantLimits } from '../services/tenantService.js';

const router = express.Router();

router.use(authenticate);

router.get('/', async (req, res) => {
  const tenant = await prisma.tenant.findUnique({
    where: { id: req.tenantId },
    include: {
      subscription: { include: { plan: true } },
      branches: true
    }
  });
  res.json(tenant);
});

router.put('/', async (req, res) => {
  const { name, phone, address } = req.body;
  const tenant = await prisma.tenant.update({
    where: { id: req.tenantId },
    data: { name, phone, address }
  });
  res.json(tenant);
});

router.get('/usage', async (req, res) => {
  const [patientCount, branchCount, userCount] = await Promise.all([
    prisma.patient.count({ where: { tenantId: req.tenantId } }),
    prisma.branch.count({ where: { tenantId: req.tenantId } }),
    prisma.user.count({ where: { tenantId: req.tenantId } })
  ]);

  const subscription = await prisma.subscription.findUnique({
    where: { tenantId: req.tenantId },
    include: { plan: true }
  });

  res.json({
    patients: { current: patientCount, max: subscription?.plan?.maxPatients || 0 },
    branches: { current: branchCount, max: subscription?.plan?.maxBranches || 0 },
    users: { current: userCount, max: subscription?.plan?.maxUsers || 0 },
    subscription: subscription ? { status: subscription.status, plan: subscription.plan.name } : null
  });
});

router.get('/subscription', async (req, res) => {
  const subscription = await prisma.subscription.findUnique({
    where: { tenantId: req.tenantId },
    include: { plan: true, payments: { orderBy: { createdAt: 'desc' }, take: 10 } }
  });
  res.json(subscription);
});

router.post('/subscription/upgrade', async (req, res) => {
  const { planId, billingCycle } = req.body;
  const current = await prisma.subscription.findUnique({ where: { tenantId: req.tenantId } });
  
  const newSub = await prisma.$transaction(async (tx) => {
    await tx.subscription.update({ where: { tenantId: req.tenantId }, data: { status: 'CANCELLED' } });
    return tx.subscription.create({
      data: {
        tenantId: req.tenantId,
        planId,
        billingCycle,
        status: 'ACTIVE',
        startDate: new Date(),
        endDate: billingCycle === 'YEARLY' 
          ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    });
  });

  res.json(newSub);
});

export default router;