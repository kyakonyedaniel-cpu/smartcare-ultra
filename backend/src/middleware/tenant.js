import prisma from '../config/database.js';

export const tenantMiddleware = async (req, res, next) => {
  if (!req.tenantId) {
    return res.status(400).json({ error: 'Tenant ID required' });
  }

  const tenant = await prisma.tenant.findUnique({
    where: { id: req.tenantId }
  });

  if (!tenant) {
    return res.status(404).json({ error: 'Tenant not found' });
  }

  if (tenant.status !== 'ACTIVE') {
    return res.status(403).json({ 
      error: 'Tenant suspended or inactive',
      status: tenant.status 
    });
  }

  req.tenant = tenant;
  next();
};

export const branchScope = async (req, res, next) => {
  req.branchId = req.body.branchId || req.query.branchId || req.user?.branchId;
  next();
};