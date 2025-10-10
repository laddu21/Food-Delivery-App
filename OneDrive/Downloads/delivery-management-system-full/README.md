# Delivery Management System - Full Stack

# Quick start (Docker)
Ensure Docker is installed.

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
