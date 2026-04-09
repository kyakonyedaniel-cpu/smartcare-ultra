import express from 'express';
import prisma from '../config/database.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { sendSms, getSmsLogs } from '../services/smsService.js';

const router = express.Router();
router.use(authenticate);

router.post('/send', requireRole('OWNER', 'ADMIN', 'RECEPTIONIST'), async (req, res) => {
  const { phone, message, provider } = req.body;
  
  if (!phone || !message) {
    return res.status(400).json({ error: 'Phone and message required' });
  }

  const result = await sendSms(req.tenantId, phone, message, provider);
  res.json(result);
});

router.get('/logs', async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const result = await getSmsLogs(req.tenantId, parseInt(page), parseInt(limit));
  res.json(result);
});

export default router;