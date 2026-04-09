import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create roles
  const roles = [
    { id: 'role-owner', name: 'Owner', type: 'OWNER', description: 'Full system access', isDefault: true, permissions: JSON.stringify(['*']) },
    { id: 'role-admin', name: 'Administrator', type: 'ADMIN', description: 'Administrative access', isDefault: true, permissions: JSON.stringify(['manage_users', 'manage_settings', 'view_reports']) },
    { id: 'role-doctor', name: 'Doctor', type: 'DOCTOR', description: 'Medical professional', isDefault: true, permissions: JSON.stringify(['view_patients', 'manage_diagnoses', 'prescribe']) },
    { id: 'role-pharmacist', name: 'Pharmacist', type: 'PHARMACIST', description: 'Pharmacy management', isDefault: true, permissions: JSON.stringify(['view_inventory', 'dispense', 'manage_drugs']) },
    { id: 'role-receptionist', name: 'Receptionist', type: 'RECEPTIONIST', description: 'Front desk operations', isDefault: true, permissions: JSON.stringify(['view_patients', 'manage_appointments', 'create_sales']) }
  ];

  for (const role of roles) {
    await prisma.role.upsert({ where: { id: role.id }, update: {}, create: role });
  }
  console.log('✅ Roles created');

  // Create plans
  const plans = [
    { 
      id: 'plan-trial', 
      name: 'Free Trial', 
      description: '14-day free trial with full features',
      priceMonthly: 0,
      priceYearly: 0,
      maxPatients: 50,
      maxBranches: 1,
      maxUsers: 2,
      maxStorageMB: 500,
      features: JSON.stringify(['all']),
      sortOrder: 0
    },
    {
      id: 'plan-starter',
      name: 'Starter',
      description: 'Perfect for small clinics',
      priceMonthly: 150000,
      priceYearly: 1500000,
      maxPatients: 200,
      maxBranches: 2,
      maxUsers: 5,
      maxStorageMB: 2000,
      features: JSON.stringify(['patients', 'appointments', 'basic_reports']),
      sortOrder: 1
    },
    {
      id: 'plan-professional',
      name: 'Professional',
      description: 'For growing practices',
      priceMonthly: 350000,
      priceYearly: 3500000,
      maxPatients: 1000,
      maxBranches: 5,
      maxUsers: 20,
      maxStorageMB: 10000,
      features: JSON.stringify(['patients', 'appointments', 'inventory', 'reports', 'sms']),
      sortOrder: 2
    },
    {
      id: 'plan-enterprise',
      name: 'Enterprise',
      description: 'Unlimited everything',
      priceMonthly: 750000,
      priceYearly: 7500000,
      maxPatients: -1,
      maxBranches: -1,
      maxUsers: -1,
      maxStorageMB: 100000,
      features: JSON.stringify(['*']),
      sortOrder: 3
    }
  ];

  for (const plan of plans) {
    await prisma.plan.upsert({ where: { id: plan.id }, update: {}, create: plan });
  }
  console.log('✅ Plans created');

  // Create super admin user
  const superAdminPassword = await bcrypt.hash('superadmin123', 10);
  const superAdminRole = await prisma.role.findUnique({ where: { type: 'OWNER' } });
  
  const superAdminTenant = await prisma.tenant.upsert({
    where: { slug: 'smartcare-platform' },
    update: {},
    create: {
      id: 'tenant-superadmin',
      name: 'SmartCare Platform',
      slug: 'smartcare-platform',
      email: 'admin@smartcare.ug',
      phone: '+256700000000',
      address: 'Kampala, Uganda',
      status: 'ACTIVE'
    }
  });

  await prisma.user.upsert({
    where: { tenantId_email: { tenantId: superAdminTenant.id, email: 'admin@smartcare.ug' } },
    update: {},
    create: {
      tenantId: superAdminTenant.id,
      email: 'admin@smartcare.ug',
      password: superAdminPassword,
      firstName: 'Super',
      lastName: 'Admin',
      phone: '+256700000000',
      roleId: superAdminRole.id,
      isActive: true
    }
  });
  console.log('✅ Super admin created');

  // Create demo tenant (Demo Clinic)
  const demoTenant = await prisma.tenant.upsert({
    where: { slug: 'demo-clinic' },
    update: {},
    create: {
      id: 'tenant-demo',
      name: 'Demo Health Center',
      slug: 'demo-clinic',
      subdomain: 'demo.smartcare.app',
      email: 'demo@clinic.com',
      phone: '+256701234567',
      address: 'Kampala Road, Kampala',
      status: 'ACTIVE'
    }
  });

  // Create demo subscription
  await prisma.subscription.upsert({
    where: { tenantId: demoTenant.id },
    update: {},
    create: {
      tenantId: demoTenant.id,
      planId: 'plan-professional',
      status: 'ACTIVE',
      billingCycle: 'MONTHLY',
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    }
  });

  // Create default branch
  const demoBranch = await prisma.branch.upsert({
    where: { tenantId_branchCode: { tenantId: demoTenant.id, code: 'MAIN' } },
    update: {},
    create: {
      tenantId: demoTenant.id,
      name: 'Main Branch',
      code: 'MAIN',
      address: 'Kampala Road, Kampala',
      phone: '+256701234567',
      isDefault: true,
      isActive: true
    }
  });

  // Create demo admin user
  const demoAdminPassword = await bcrypt.hash('demo1234', 10);
  const adminRole = await prisma.role.findUnique({ where: { type: 'OWNER' } });
  
  await prisma.user.upsert({
    where: { tenantId_email: { tenantId: demoTenant.id, email: 'admin@demo.clinic' } },
    update: {},
    create: {
      tenantId: demoTenant.id,
      branchId: demoBranch.id,
      email: 'admin@demo.clinic',
      password: demoAdminPassword,
      firstName: 'Demo',
      lastName: 'Admin',
      phone: '+256701234567',
      roleId: adminRole.id,
      isActive: true
    }
  });

  // Create demo doctor
  const doctorRole = await prisma.role.findUnique({ where: { type: 'DOCTOR' } });
  const doctorPassword = await bcrypt.hash('doctor123', 10);
  
  await prisma.user.upsert({
    where: { tenantId_email: { tenantId: demoTenant.id, email: 'doctor@demo.clinic' } },
    update: {},
    create: {
      tenantId: demoTenant.id,
      branchId: demoBranch.id,
      email: 'doctor@demo.clinic',
      password: doctorPassword,
      firstName: 'John',
      lastName: 'Mukama',
      phone: '+256701234568',
      roleId: doctorRole.id,
      isActive: true
    }
  });

  // Create demo patients
  const patients = [
    { patientNumber: 'P001', firstName: 'Sarah', lastName: 'Nakato', gender: 'FEMALE', phone: '+256701111111', dateOfBirth: new Date('1990-05-15') },
    { patientNumber: 'P002', firstName: 'Peter', lastName: 'Ochieng', gender: 'MALE', phone: '+256702222222', dateOfBirth: new Date('1985-08-20') },
    { patientNumber: 'P003', firstName: 'Mary', lastName: 'Kagaba', gender: 'FEMALE', phone: '+256703333333', dateOfBirth: new Date('1978-12-10') },
    { patientNumber: 'P004', firstName: 'James', lastName: 'Wekesa', gender: 'MALE', phone: '+256704444444', dateOfBirth: new Date('1995-03-25') },
    { patientNumber: 'P005', firstName: 'Grace', lastName: 'Amumpaire', gender: 'FEMALE', phone: '+256705555555', dateOfBirth: new Date('2000-07-08') }
  ];

  for (const patient of patients) {
    await prisma.patient.upsert({
      where: { tenantId_patientNumber: { tenantId: demoTenant.id, patientNumber: patient.patientNumber } },
      update: {},
      create: { ...patient, tenantId: demoTenant.id, branchId: demoBranch.id }
    });
  }
  console.log('✅ Demo patients created');

  // Create demo drugs
  const drugs = [
    { code: 'DRG001', name: 'Paracetamol 500mg', genericName: 'Acetaminophen', category: 'Pain Relief', unit: 'tablet', unitPrice: 500, barcode: '1234567890123', reorderLevel: 50 },
    { code: 'DRG002', name: 'Amoxicillin 250mg', genericName: 'Amoxicillin', category: 'Antibiotics', unit: 'capsule', unitPrice: 1200, barcode: '1234567890124', reorderLevel: 30 },
    { code: 'DRG003', name: 'ORS Sachet', genericName: 'Oral Rehydration Salt', category: 'Electrolytes', unit: 'sachet', unitPrice: 800, barcode: '1234567890125', reorderLevel: 100 },
    { code: 'DRG004', name: 'Ibuprofen 400mg', genericName: 'Ibuprofen', category: 'Pain Relief', unit: 'tablet', unitPrice: 700, barcode: '1234567890126', reorderLevel: 40 },
    { code: 'DRG005', name: 'Ciprofloxacin 500mg', genericName: 'Ciprofloxacin', category: 'Antibiotics', unit: 'tablet', unitPrice: 2500, barcode: '1234567890127', reorderLevel: 20 },
    { code: 'DRG006', name: 'Vitamin C 1000mg', genericName: 'Ascorbic Acid', category: 'Vitamins', unit: 'tablet', unitPrice: 400, barcode: '1234567890128', reorderLevel: 50 },
    { code: 'DRG007', name: 'Chlorpheniramine 4mg', genericName: 'Chlorpheniramine', category: 'Antihistamines', unit: 'tablet', unitPrice: 300, barcode: '1234567890129', reorderLevel: 30 },
    { code: 'DRG008', name: 'Metronidazole 400mg', genericName: 'Metronidazole', category: 'Antibiotics', unit: 'tablet', unitPrice: 1800, barcode: '1234567890130', reorderLevel: 25 }
  ];

  for (const drug of drugs) {
    await prisma.drug.upsert({
      where: { tenantId_code: { tenantId: demoTenant.id, code: drug.code } },
      update: {},
      create: { ...drug, tenantId: demoTenant.id }
    });
  }

  // Create inventory for drugs
  const allDrugs = await prisma.drug.findMany({ where: { tenantId: demoTenant.id } });
  for (const drug of allDrugs) {
    await prisma.inventory.upsert({
      where: { tenantId_branchId_drugId: { tenantId: demoTenant.id, branchId: demoBranch.id, drugId: drug.id } },
      update: {},
      create: { tenantId: demoTenant.id, branchId: demoBranch.id, drugId: drug.id, quantity: Math.floor(Math.random() * 100) + 50, reorderLevel: drug.reorderLevel }
    });
  }
  console.log('✅ Demo drugs and inventory created');

  // Create drug batches
  const batches = [
    { drugId: allDrugs[0].id, batchNumber: 'BATCH001', expiryDate: new Date('2026-12-31'), purchasePrice: 300, quantity: 500 },
    { drugId: allDrugs[1].id, batchNumber: 'BATCH002', expiryDate: new Date('2026-06-30'), purchasePrice: 800, quantity: 200 },
    { drugId: allDrugs[2].id, batchNumber: 'BATCH003', expiryDate: new Date('2027-03-31'), purchasePrice: 500, quantity: 1000 }
  ];

  for (const batch of batches) {
    await prisma.drugBatch.create({ data: { ...batch, remainingQty: batch.quantity } });
  }

  // Create demo appointments
  const allPatients = await prisma.patient.findMany({ where: { tenantId: demoTenant.id } });
  const allUsers = await prisma.user.findMany({ where: { tenantId: demoTenant.id, role: { type: 'DOCTOR' } } });
  
  if (allPatients.length > 0 && allUsers.length > 0) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);

    await prisma.appointment.create({
      data: {
        tenantId: demoTenant.id,
        branchId: demoBranch.id,
        patientId: allPatients[0].id,
        userId: allUsers[0].id,
        appointmentDate: tomorrow,
        duration: 30,
        type: 'CONSULTATION',
        status: 'SCHEDULED'
      }
    });

    const today = new Date();
    today.setHours(10, 30, 0, 0);
    
    await prisma.appointment.create({
      data: {
        tenantId: demoTenant.id,
        branchId: demoBranch.id,
        patientId: allPatients[1].id,
        userId: allUsers[0].id,
        appointmentDate: today,
        duration: 30,
        type: 'FOLLOW_UP',
        status: 'COMPLETED'
      }
    });
  }
  console.log('✅ Demo appointments created');

  // Create demo sales
  if (allDrugs.length > 0) {
    const sale = await prisma.sale.create({
      data: {
        tenantId: demoTenant.id,
        branchId: demoBranch.id,
        userId: demoBranch.id,
        patientId: allPatients[0]?.id,
        invoiceNumber: 'SAL-2026-001',
        subtotal: 3500,
        discount: 0,
        tax: 630,
        total: 4130,
        paymentMethod: 'CASH',
        amountPaid: 4130,
        status: 'COMPLETED'
      }
    });

    await prisma.saleItem.create({
      data: {
        saleId: sale.id,
        drugId: allDrugs[0].id,
        quantity: 5,
        unitPrice: 500,
        totalPrice: 2500
      }
    });

    await prisma.saleItem.create({
      data: {
        saleId: sale.id,
        drugId: allDrugs[2].id,
        quantity: 1,
        unitPrice: 800,
        totalPrice: 800
      }
    });
  }
  console.log('✅ Demo sales created');

  console.log('🎉 Database seeded successfully!');
  console.log('\n📋 Login credentials:');
  console.log('Super Admin: admin@smartcare.ug / superadmin123');
  console.log('Demo Tenant: admin@demo.clinic / demo1234');
  console.log('Demo Doctor: doctor@demo.clinic / doctor123');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());