# Delivery Management System - Full Stack

# Quick start (Docker)
Ensure Docker is installed.

## Setup

1. Copy the example environment file:
```bash
cp backend/.env.example backend/.env
```

2. Update the `.env` file with your actual configuration values (passwords, secrets, etc.)

From project root:
```bash
docker-compose up --build
```

Frontend: http://localhost:5173
Backend: http://localhost:8080
Seeded admin: admin@example.com / adminpass

## Notes
- Postgres initializes tables using backend/sql/init.sql
- Frontend is minimal and uses polling for order updates

## CI

- A GitHub Actions workflow was added at `.github/workflows/ci.yml` to build both backend and frontend and run a minimal `/healthz` smoke test on push/PR.

## Healthcheck

From Windows PowerShell you can verify the backend is healthy with:

```powershell
Invoke-RestMethod http://localhost:8080/healthz
```
