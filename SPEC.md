# SmartCare Ultra SaaS - Technical Specification

## Project Overview
- **Name**: SmartCare Ultra SaaS
- **Type**: Enterprise Multi-Tenant SaaS Platform
- **Core Functionality**: Clinic & Drug Shop Management System
- **Target Users**: Clinics, Pharmacies, Healthcare Businesses

## Tech Stack
- **Frontend**: React 18 + Vite + Tailwind CSS + ShadCN UI + React Query + Zustand
- **Backend**: Node.js + Express + Prisma ORM + PostgreSQL
- **Infrastructure**: Docker + Docker Compose + Nginx + Redis
- **Features**: JWT Auth, WebSocket, PDF Generation, CSV Export, Background Jobs

## Multi-Tenant Architecture
- Single database with tenant_id column
- Tenant-scoped queries on every model
- Schema isolation via middleware
- Subdomain routing support

## SaaS Monetization Plans
| Plan | Price (UGX/mo) | Patients | Branches | Users |
|------|---------------|----------|----------|-------|
| Trial | Free (14 days) | 50 | 1 | 2 |
| Starter | 150,000 | 200 | 2 | 5 |
| Professional | 350,000 | 1000 | 5 | 20 |
| Enterprise | 750,000 | Unlimited | Unlimited | Unlimited |

## Database Schema
- tenants, branches, users, roles, permissions
- subscriptions, payments, plans
- patients, prescriptions, diagnoses
- drugs, inventory, batches
- sales, sales_items, invoices
- appointments, queues
- expenses, suppliers, purchases
- sms_logs, audit_logs

## Features by Module
1. **Auth & RBAC**: JWT, Roles (Owner/Admin, Doctor, Pharmacist, Receptionist)
2. **Patient Management**: Registration, history, attachments
3. **Doctor Module**: Diagnosis, notes, prescriptions, timeline
4. **Pharmacy**: Inventory, batches, expiry alerts, barcode
5. **POS**: Fast sales, receipts, discounts, taxes
6. **Appointments**: Booking, calendar, queue
7. **Billing**: Invoices, payments, multi-method
8. **Reports**: Sales, profit, inventory, export
9. **Finance**: Expenses, suppliers, P&L
10. **SMS**: MTN/Airtel integration
11. **Super Admin**: Tenant management, analytics, system health

## Security
- bcrypt password hashing
- Rate limiting
- Input validation (Joi/Zod)
- Tenant isolation middleware
- XSS/SQL injection protection

## Acceptance Criteria
- [x] Multi-tenant with strict data isolation
- [x] 4 subscription plans with feature gating
- [x] Complete patient-doctor-pharmacy workflow
- [x] POS with receipt generation
- [x] Reports with PDF/CSV export
- [x] SMS notification system
- [x] Super admin dashboard
- [x] Marketing landing page
- [x] Docker deployment ready
- [x] Demo tenant with seed data