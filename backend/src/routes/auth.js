import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import prisma from '../config/database.js';
import { authenticate } from '../middleware/auth.js';
import { slugify } from '../utils/helpers.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { clinicName, email, password, phone, subdomain } = req.body;

    if (!clinicName || !email || !password) {
      return res.status(400).json({ error: 'Clinic name, email and password required' });
    }

    const existingTenant = await prisma.tenant.findUnique({ where: { email } });
    if (existingTenant) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const slug = slugify(clinicName);
    let trialPlan = await prisma.plan.findFirst({ 
      where: { name: { contains: 'Trial', mode: 'insensitive' } }
    });

    const tenant = await prisma.$transaction(async (tx) => {
      const newTenant = await tx.tenant.create({
        data: {
          name: clinicName,
          slug,
          subdomain: subdomain || `${slug}.smartcare.app`,
          email,
          phone,
          status: 'ACTIVE'
        }
      });

      const defaultBranch = await tx.branch.create({
        data: {
          tenantId: newTenant.id,
          name: 'Main Branch',
          code: 'MAIN',
          isDefault: true,
          address: 'Primary Location'
        }
      });

      let ownerRole = await tx.role.findUnique({ where: { type: 'OWNER' } });
      
      // Create OWNER role if it doesn't exist
      if (!ownerRole) {
        ownerRole = await tx.role.create({
          data: {
            name: 'Owner',
            type: 'OWNER',
            description: 'Clinic owner with full access',
            isDefault: true,
            permissions: []
          }
        });
      }
      
      const hashedPassword = await bcrypt.hash(password, 10);
      await tx.user.create({
        data: {
          tenantId: newTenant.id,
          branchId: defaultBranch.id,
          email,
          password: hashedPassword,
          firstName: 'Admin',
          lastName: 'Owner',
          phone,
          roleId: ownerRole.id,
          isActive: true
        }
      });

      if (trialPlan) {
        const now = new Date();
        const trialEndDate = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
        
        await tx.subscription.create({
          data: {
            tenantId: newTenant.id,
            planId: trialPlan.id,
            billingCycle: 'MONTHLY',
            startDate: now,
            endDate: trialEndDate,
            trialEndDate: trialEndDate,
            status: 'TRIAL'
          }
        });
      } else {
        // Create trial plan if it doesn't exist
        trialPlan = await tx.plan.create({
          data: {
            name: 'Trial Plan',
            description: 'Free trial plan',
            priceMonthly: 0,
            priceYearly: 0,
            maxPatients: 100,
            maxBranches: 1,
            maxUsers: 5,
            maxStorageMB: 1000,
            features: ['basic_clinic', 'basic_pharmacy'],
            isActive: true,
            sortOrder: 1
          }
        });
        
        const now = new Date();
        const trialEndDate = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
        
        await tx.subscription.create({
          data: {
            tenantId: newTenant.id,
            planId: trialPlan.id,
            billingCycle: 'MONTHLY',
            startDate: now,
            endDate: trialEndDate,
            trialEndDate: trialEndDate,
            status: 'TRIAL'
          }
        });
      }

      return newTenant;
    });

    const token = jwt.sign(
      { tenantId: tenant.id, userType: 'owner' },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Clinic registered successfully',
      tenant: { id: tenant.id, name: tenant.name, slug: tenant.slug },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true, tenant: true, branch: true }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: 'Account suspended' });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });

    const token = jwt.sign(
      { userId: user.id, tenantId: user.tenantId },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role.type,
        tenant: { id: user.tenant.id, name: user.tenant.name, status: user.tenant.status },
        branch: user.branch ? { id: user.branch.id, name: user.branch.name } : null
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

router.get('/plans', async (req, res) => {
  const plans = await prisma.plan.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' }
  });
  res.json(plans);
});

router.get('/me', authenticate, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    include: { role: true, tenant: true, branch: true }
  });
  res.json(user);
});

export default router;
