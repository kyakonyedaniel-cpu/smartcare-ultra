# SmartCare Ultra SaaS - Clinic & Pharmacy Management Platform

A complete, production-ready multi-tenant SaaS platform for clinics and drug shops in Uganda.

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 20+ (for local development)
- PostgreSQL 15+ (optional, can use Docker)
- Redis 7+ (optional, can use Docker)

### Development Setup

1. **Clone and start infrastructure:**
```bash
cd smartcare-ultra
docker-compose up -d postgres redis
```

2. **Backend setup:**
```bash
cd backend
npm install
cp .env.example .env
npx prisma generate
npx prisma db push
node src/seed.js  # Seed demo data
npm run dev
```

3. **Frontend setup:**
```bash
cd frontend
npm install
npm run dev
```

### Production with Docker

```bash
docker-compose up -d --build
```

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@smartcare.ug | superadmin123 |
| Tenant Admin | admin@demo.clinic | demo1234 |
| Doctor | doctor@demo.clinic | doctor123 |

## Features

- **Multi-tenant architecture** with strict data isolation
- **SaaS monetization** with 4 subscription plans
- **Patient management** with full medical history
- **Doctor module** for diagnoses and prescriptions
- **Pharmacy module** with inventory and batch tracking
- **POS system** with receipts
- **Appointments** with queue management
- **Invoices** with payment tracking
- **Expenses** and financial tracking
- **Reports & Analytics**
- **SMS notifications** (MTN/Airtel)
- **Role-based access control**

## Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, ShadCN UI, Zustand, React Query
- **Backend:** Node.js, Express, Prisma ORM, PostgreSQL
- **Infrastructure:** Docker, Redis, Nginx

## API Endpoints

- `POST /api/auth/register` - Register new tenant
- `POST /api/auth/login` - Login
- `/api/patients` - Patient management
- `/api/doctor` - Diagnoses & prescriptions
- `/api/pharmacy` - Drug inventory
- `/api/sales` - POS & sales
- `/api/appointments` - Scheduling
- `/api/invoices` - Billing
- `/api/reports` - Analytics
- `/api/superadmin` - Platform admin

## Environment Variables

See `.env` file in backend folder for configuration.

## License

Proprietary - SmartCare Ultra