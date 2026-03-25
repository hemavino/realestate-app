# Docker Deployment Guide

## Prerequisites
- Docker Desktop installed and running
- Docker Compose installed

## Quick Start

### 1. Build and run all services
```bash
docker-compose up --build
```

### 2. Access the application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Swagger**: http://localhost:5000/swagger
- **Database**: localhost:1433 (SQL Server)

### 3. Database Credentials
- **Server**: localhost,1433
- **User**: sa
- **Password**: YourStrong@Password123
- **Database**: RealEstateDb

## Useful Commands

### Start services (detached mode)
```bash
docker-compose up -d
```

### Stop services
```bash
docker-compose down
```

### Stop and remove volumes (clean database)
```bash
docker-compose down -v
```

### View logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

### Rebuild specific service
```bash
docker-compose up --build backend
```

### Run database migrations
```bash
docker-compose exec backend dotnet ef database update
```

## Troubleshooting

### Database connection issues
- Wait a few seconds after starting - database needs time to initialize
- Check health status: `docker-compose ps`

### Port already in use
- Change ports in docker-compose.yml:
  - Frontend: `3000:80` → `YOUR_PORT:80`
  - Backend: `5000:8080` → `YOUR_PORT:8080`
  - Database: `1433:1433` → `YOUR_PORT:1433`

### Rebuild from scratch
```bash
docker-compose down -v
docker-compose build --no-cache
docker-compose up
```

## Production Notes

**IMPORTANT**: Before deploying to production:
1. Change database password in docker-compose.yml
2. Update JWT key in backend configuration
3. Configure proper HTTPS/SSL certificates
4. Use environment-specific settings
5. Set up proper backup for database volumes
