import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('[v0] Starting database setup...');
    
    // Create default roles
    const ownerRole = await prisma.role.upsert({
      where: { type: 'OWNER' },
      update: {},
      create: {
        name: 'Owner',
        type: 'OWNER',
        description: 'Clinic owner with full access',
        isDefault: true,
        permissions: [],
      },
    });
    console.log('[v0] Created OWNER role');

    await prisma.role.upsert({
      where: { type: 'ADMIN' },
      update: {},
      create: {
        name: 'Admin',
        type: 'ADMIN',
        description: 'Administrator with full access',
        isDefault: false,
        permissions: [],
      },
    });
    console.log('[v0] Created ADMIN role');

    // Create trial plan
    const trialPlan = await prisma.plan.upsert({
      where: { name: 'Trial' },
      update: {},
      create: {
        name: 'Trial',
        description: 'Free trial plan',
        priceMonthly: 0,
        priceYearly: 0,
        maxPatients: 100,
        maxBranches: 1,
        maxUsers: 3,
        maxStorageMB: 1000,
        features: ['basic_clinic', 'basic_pharmacy', 'limited_support'],
        isActive: true,
        sortOrder: 1,
      },
    });
    console.log('[v0] Created Trial plan');

    console.log('[v0] Database setup completed successfully');
  } catch (error) {
    console.error('[v0] Database setup failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
