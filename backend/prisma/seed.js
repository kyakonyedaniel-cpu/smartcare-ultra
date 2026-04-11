import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data (optional, for development)
  // await prisma.$executeRawUnsafe('TRUNCATE TABLE "Role" CASCADE;');

  // Create default roles
  const roles = [
    { name: 'Owner', type: 'OWNER', description: 'Clinic owner with full access' },
    { name: 'Admin', type: 'ADMIN', description: 'Administrator with full access' },
    { name: 'Doctor', type: 'DOCTOR', description: 'Doctor with clinical access' },
    { name: 'Pharmacist', type: 'PHARMACIST', description: 'Pharmacist with pharmacy access' },
    { name: 'Receptionist', type: 'RECEPTIONIST', description: 'Receptionist with limited access' },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: {
        name: role.name,
        type: role.type,
        description: role.description,
        isDefault: role.type === 'OWNER',
        permissions: [],
      },
    });
  }

  // Create trial plan
  await prisma.plan.upsert({
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

  console.log('Seeding completed successfully');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
