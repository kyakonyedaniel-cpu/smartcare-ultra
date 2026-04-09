import prisma from '../config/database.js';
import axios from 'axios';

const SMS_CONFIG = {
  mtn: {
    baseUrl: process.env.MTN_API_URL || 'https://api.mtn.co.ug',
    apiKey: process.env.MTN_API_KEY,
    senderId: process.env.MTN_SENDER_ID || 'SmartCare'
  },
  airtel: {
    baseUrl: process.env.AIRTEL_API_URL || 'https://api.airtel.ug',
    apiKey: process.env.AIRTEL_API_KEY,
    senderId: process.env.AIRTEL_SENDER_ID || 'SmartCare'
  }
};

export const sendSms = async (tenantId, phone, message, provider = 'MTN') => {
  const log = await prisma.smsLog.create({
    data: {
      tenantId,
      recipient: phone,
      message,
      status: 'PENDING',
      provider: provider.toUpperCase()
    }
  });

  try {
    const config = SMS_CONFIG[provider.toLowerCase()];
    if (!config) throw new Error('Invalid SMS provider');

    const response = await axios.post(`${config.baseUrl}/sms/send`, {
      to: phone,
      message,
      from: config.senderId
    }, {
      headers: { 'Authorization': `Bearer ${config.apiKey}` }
    });

    await prisma.smsLog.update({
      where: { id: log.id },
      data: { status: 'SENT', messageId: response.data?.messageId, sentAt: new Date() }
    });

    return { success: true, messageId: response.data?.messageId };
  } catch (error) {
    await prisma.smsLog.update({
      where: { id: log.id },
      data: { status: 'FAILED' }
    });
    console.error('SMS sending failed:', error.message);
    return { success: false, error: error.message };
  }
};

export const sendBulkSms = async (tenantId, phones, message) => {
  const results = await Promise.all(
    phones.map(phone => sendSms(tenantId, phone, message))
  );
  return results;
};

export const sendAppointmentReminder = async (appointmentId) => {
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: { patient: true, user: true }
  });

  if (!appointment?.patient?.phone) return;

  const message = `Reminder: You have an appointment at ${appointment.appointmentDate.toLocaleDateString()} ${appointment.appointmentDate.toLocaleTimeString()}. Please arrive 10 minutes early.`;
  
  return sendSms(appointment.tenantId, appointment.patient.phone, message);
};

export const sendPaymentConfirmation = async (tenantId, patientPhone, amount, invoiceNumber) => {
  const message = `Payment of UGX ${(amount / 100).toLocaleString()} received for Invoice ${invoiceNumber}. Thank you!`;
  return sendSms(tenantId, patientPhone, message);
};

export const getSmsLogs = async (tenantId, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  const [logs, total] = await Promise.all([
    prisma.smsLog.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    }),
    prisma.smsLog.count({ where: { tenantId } })
  ]);

  return { logs, total, page, limit };
};