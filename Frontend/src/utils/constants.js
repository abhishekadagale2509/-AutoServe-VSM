export const API_BASE_URL = 'http://localhost:8080/api';

export const ROLES = {
  ADMIN: 'ADMIN',
  CUSTOMER: 'CUSTOMER',
  MECHANIC: 'MECHANIC',
};

export const APPOINTMENT_STATUS = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
};

export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  FAILED: 'FAILED',
};

export const PAYMENT_MODES = [
  { value: 'CARD', label: 'Credit / Debit Card' },
  { value: 'UPI', label: 'UPI / NetBanking' },
  { value: 'CASH', label: 'Cash on Delivery / Service Desk' },
];

export const SERVICE_TYPES = [
  'General Maintenance Service',
  'Oil Change & Filter Replacement',
  'Brake Inspection & Repair',
  'Engine Diagnostic & Tuning',
  'Transmission Repair',
  'AC Repair & Refill',
  'Wheel Alignment & Balancing',
  'Battery Replacement',
  'Body Paint & Detail',
];
