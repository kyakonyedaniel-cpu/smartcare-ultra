import prisma from '../config/database.js';
import { checkAndUpdateSubscription } from './subscription.js';

export const checkTenantLimits = async (tenantId, resource, currentCount) => {
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    include: {
      subscription: {
        include: { plan: true }
      }
    }
  });

  if (!tenant?.subscription) {
    return { allowed: false, reason: 'No subscription found' };
  }

  await checkAndUpdateSubscription(tenantId);
  const updatedTenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    include: { subscription: { include: { plan: true } } }
  });

  if (!updatedTenant?.subscription || updatedTenant.subscription.status !== 'ACTIVE') {
    return { allowed: false, reason: 'Subscription not active' };
  }

  const limits = updatedTenant.subscription.plan;
  let max;

  switch (resource) {
    case 'patients':
      max = limits.maxPatients;
      break;
    case 'branches':
      max = limits.maxBranches;
      break;
    case 'users':
      max = limits.maxUsers;
      break;
    default:
      return { allowed: true };
  }

  if (max !== -1 && currentCount >= max) {
    return { 
      allowed: false, 
      reason: `${resource} limit reached (${max})`,
      current: currentCount,
      max 
    };
  }

  return { allowed: true };
};

export const getTenantFeatures = async (tenantId) => {
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    include: {
      subscription: {
        include: { plan: true }
      }
    }
  });

  if (!tenant?.subscription) {
    return { plan: null, features: [] };
  }

  return {
    plan: tenant.subscription.plan,
    features: tenant.subscription.plan.features || []
  };
};

export const canAccessFeature = async (tenantId, feature) => => {
  const { features } = await getTenantFeatures(tenantId);
  return features.includes(feature);
};