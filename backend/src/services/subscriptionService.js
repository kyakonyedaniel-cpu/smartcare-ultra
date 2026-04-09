import prisma from '../config/database.js';

export const checkAndUpdateSubscription = async (tenantId) => {
  const subscription = await prisma.subscription.findUnique({
    where: { tenantId },
    include: { plan: true }
  });

  if (!subscription) return;

  const now = new Date();

  if (subscription.status === 'TRIAL' && subscription.trialEndDate && now > subscription.trialEndDate) {
    await prisma.subscription.update({
      where: { tenantId },
      data: { status: 'SUSPENDED' }
    });
    await prisma.tenant.update({
      where: { id: tenantId },
      data: { status: 'TRIAL_EXPIRED' }
    });
    return { expired: true, reason: 'Trial expired' };
  }

  if (subscription.status === 'ACTIVE' && subscription.endDate && now > subscription.endDate) {
    if (!subscription.autoRenew) {
      await prisma.subscription.update({
        where: { tenantId },
        data: { status: 'SUSPENDED' }
      });
      await prisma.tenant.update({
        where: { id: tenantId },
        data: { status: 'PAST_DUE' }
      });
      return { expired: true, reason: 'Subscription expired' };
    }
  }

  return { expired: false };
};

export const createSubscription = async (tenantId, planId, billingCycle = 'MONTHLY') => {
  const plan = await prisma.plan.findUnique({ where: { id: planId } });
  if (!plan) throw new Error('Plan not found');

  const now = new Date();
  let endDate, trialEndDate;

  if (plan.name.toLowerCase().includes('trial')) {
    trialEndDate = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
    endDate = trialEndDate;
  } else if (billingCycle === 'YEARLY') {
    endDate = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
  } else {
    endDate = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
  }

  return prisma.subscription.create({
    data: {
      tenantId,
      planId,
      billingCycle,
      startDate: now,
      endDate,
      trialEndDate,
      status: plan.name.toLowerCase().includes('trial') ? 'TRIAL' : 'ACTIVE'
    }
  });
};

export const upgradePlan = async (tenantId, newPlanId, billingCycle) => {
  const current = await prisma.subscription.findUnique({ where: { tenantId } });
  if (!current) throw new Error('No subscription found');

  return prisma.$transaction(async (tx) => {
    await tx.subscription.update({
      where: { tenantId },
      data: { status: 'CANCELLED' }
    });

    const newSub = await createSubscription(tenantId, newPlanId, billingCycle);
    return newSub;
  });
};

export const recordPayment = async (subscriptionId, amount, method, transactionId) => {
  return prisma.payment.create({
    data: {
      subscriptionId,
      amount,
      paymentMethod: method,
      transactionId,
      status: 'COMPLETED'
    }
  });
};