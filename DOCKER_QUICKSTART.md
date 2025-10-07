# Docker Quick Start Guide

## Prerequisites

- Docker Desktop installed and running
- 4GB+ RAM allocated to Docker
- Internet connection for pulling images

## Simple Deployment (H2 Database)

Perfect for quick testing and development:

```bash
# Step 1: Build the application JAR
./mvnw clean package -DskipTests

# Step 2: Start with Docker Compose
docker-compose -f docker-compose-simple.yml up -d

# Step 3: Access the application
open http://localhost:8080
```

**That's it!** Your application is running in a Docker container.

### View Logs

```bash
docker-compose -f docker-compose-simple.yml logs -f
```

### Stop the Application

```bash
docker-compose -f docker-compose-simple.yml down
```

## Production Deployment (PostgreSQL Database)

For production use with persistent data:

```bash
# Step 1: Build the application JAR
./mvnw clean package -DskipTests

# Step 2: Start all services (app + PostgreSQL)
docker-compose up -d

# Step 3: Access the application
open http://localhost:8080
```

**Services Running:**

- Application: http://localhost:8080
- PostgreSQL: localhost:5432

### With pgAdmin (Database UI)

```bash
docker-compose --profile tools up -d
```

Access pgAdmin at: http://localhost:5050

- Email: admin@admin.com
- Password: admin

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f app
docker-compose logs -f postgres
```

### Stop the Application

```bash
# Stop but keep data
docker-compose down

# Stop and remove all data
docker-compose down -v
```

## Rebuild After Code Changes

```bash
# Step 1: Rebuild JAR
./mvnw clean package -DskipTests

# Step 2: Rebuild Docker image
docker-compose build

# Step 3: Restart
docker-compose up -d
```

Or in one command:

```bash
./mvnw clean package -DskipTests && docker-compose up -d --build
```

## Common Commands

### Check Container Status

```bash
docker-compose ps
```

### View Resource Usage

```bash
docker stats spring-boot-react-app
```

### Access Container Shell

```bash
docker exec -it spring-boot-react-app sh
```

### View Database Data (PostgreSQL)

```bash
docker exec -it postgres-db psql -U postgres -d clientdb -c "SELECT * FROM client;"
```

## Troubleshooting

### Port 8080 Already in Use

```bash
# Stop conflicting service or change port in docker-compose.yml
docker-compose -f docker-compose-simple.yml down
```

### Container Won't Start

```bash
# Check logs for errors
docker-compose logs app

# Restart Docker Desktop
# Remove all containers and try again
docker-compose down -v
docker-compose up -d
```

### Fresh Start

```bash
# Remove everything and start clean
docker-compose down -v --rmi all
./mvnw clean package -DskipTests
docker-compose up -d --build
```

## What's Happening?

1. **Build Stage**: Maven builds the Spring Boot + React application into a JAR
2. **Docker Image**: Dockerfile packages the JAR into a minimal container
3. **Container**: Docker runs the application in an isolated environment
4. **Network**: Services communicate through a Docker network
5. **Data**: PostgreSQL data persists in Docker volumes

## File Structure

```
.
├── Dockerfile                  # Multi-stage build (not currently used)
├── Dockerfile.simple          # Simple JAR-based build (recommended)
├── docker-compose.yml         # Production setup with PostgreSQL
├── docker-compose-simple.yml  # Simple setup with H2
└── .dockerignore             # Files to exclude from Docker build
```

## Need More Help?

See [DOCKER.md](DOCKER.md) for comprehensive Docker documentation.
