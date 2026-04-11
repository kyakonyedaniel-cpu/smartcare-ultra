-- Create required roles
INSERT INTO "Role" (id, type, name, description, "createdAt", "updatedAt")
VALUES 
  ('role-owner', 'OWNER', 'Clinic Owner', 'Clinic owner with full access', NOW(), NOW()),
  ('role-admin', 'ADMIN', 'Administrator', 'Administrative user', NOW(), NOW()),
  ('role-doctor', 'DOCTOR', 'Doctor', 'Doctor user', NOW(), NOW()),
  ('role-staff', 'STAFF', 'Staff', 'Staff member', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Create trial plan
INSERT INTO "Plan" (id, name, "maxUsers", "storageGB", price, "billingCycle", "sortOrder", "isActive", "createdAt", "updatedAt")
VALUES 
  ('plan-trial', 'Trial Plan', 5, 10, 0, 'MONTHLY', 1, true, NOW(), NOW())
ON CONFLICT DO NOTHING;
