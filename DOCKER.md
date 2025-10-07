# Docker Deployment Guide

This guide explains how to run the Spring Boot React App using Docker and Docker Compose.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+

Check your versions:

```bash
docker --version
docker-compose --version
```

## Quick Start

### Option 1: Simple Deployment (H2 Database)

For quick testing with in-memory H2 database:

```bash
# Build and run
docker-compose -f docker-compose-simple.yml up --build

# Or run in detached mode
docker-compose -f docker-compose-simple.yml up -d --build
```

**Access the application**: http://localhost:8080

**Stop the application**:

```bash
docker-compose -f docker-compose-simple.yml down
```

### Option 2: Production Deployment (PostgreSQL Database)

For production with persistent PostgreSQL database:

```bash
# Build and run
docker-compose up --build

# Or run in detached mode
docker-compose up -d --build
```

**Services Available**:

- **Application**: http://localhost:8080
- **PostgreSQL**: localhost:5432
- **pgAdmin** (optional): http://localhost:5050

**Stop the application**:

```bash
# Stop but keep data
docker-compose down

# Stop and remove data volumes
docker-compose down -v
```

### Option 3: With pgAdmin (Database Management UI)

To include pgAdmin for database management:

```bash
docker-compose --profile tools up -d --build
```

**pgAdmin Login**:

- URL: http://localhost:5050
- Email: admin@admin.com
- Password: admin

**Add PostgreSQL Server in pgAdmin**:

1. Right-click "Servers" → "Create" → "Server"
2. General tab:
    - Name: `ClientDB`
3. Connection tab:
    - Host: `postgres`
    - Port: `5432`
    - Database: `clientdb`
    - Username: `postgres`
    - Password: `postgres`

## Docker Commands

### Build Image Only

```bash
docker build -t spring-boot-react-app .
```

### Run Container Manually

```bash
# With H2 Database
docker run -p 8080:8080 spring-boot-react-app

# With PostgreSQL (requires postgres container)
docker run -p 8080:8080 \
  -e SPRING_PROFILES_ACTIVE=docker \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/clientdb \
  --network app-network \
  spring-boot-react-app
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f app
docker-compose logs -f postgres

# Simple deployment
docker-compose -f docker-compose-simple.yml logs -f
```

### Check Container Status

```bash
docker-compose ps
```

### Access Container Shell

```bash
# Application container
docker-compose exec app sh

# PostgreSQL container
docker-compose exec postgres psql -U postgres -d clientdb
```

## Architecture

### Multi-Stage Build

The Dockerfile uses a multi-stage build for optimization:

1. **Build Stage**: Uses Maven with JDK 21 to build the application
2. **Runtime Stage**: Uses lightweight JRE 21 to run the application

**Benefits**:

- Smaller final image (~250MB vs ~800MB)
- No build tools in production image
- Better security (minimal attack surface)

### Services Overview

**docker-compose.yml** (Production):

- **app**: Spring Boot + React application
- **postgres**: PostgreSQL 16 database
- **pgadmin**: Database management UI (optional)

**docker-compose-simple.yml** (Development):

- **app**: Spring Boot + React with H2 in-memory database

## Configuration

### Environment Variables

The application can be configured using environment variables in `docker-compose.yml`:

```yaml
environment:
  - SPRING_PROFILES_ACTIVE=docker
  - SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/clientdb
  - SPRING_DATASOURCE_USERNAME=postgres
  - SPRING_DATASOURCE_PASSWORD=postgres
  - SPRING_JPA_HIBERNATE_DDL_AUTO=update
```

### Profiles

- **default**: H2 in-memory database (development)
- **docker**: PostgreSQL database (production)

## Data Persistence

### PostgreSQL Data

Data is persisted in Docker volumes:

```bash
# List volumes
docker volume ls

# Inspect volume
docker volume inspect spring-boot-react-app_postgres-data

# Backup data
docker run --rm \
  -v spring-boot-react-app_postgres-data:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/postgres-backup.tar.gz /data

# Restore data
docker run --rm \
  -v spring-boot-react-app_postgres-data:/data \
  -v $(pwd):/backup \
  alpine tar xzf /backup/postgres-backup.tar.gz -C /
```

### Remove All Data

```bash
# Remove containers, networks, and volumes
docker-compose down -v

# Remove images as well
docker-compose down -v --rmi all
```

## Health Checks

The application includes health checks:

```bash
# Check application health
curl http://localhost:8080/clients

# View health check status
docker inspect --format='{{json .State.Health}}' spring-boot-react-app | jq
```

## Troubleshooting

### Application Not Starting

**Check logs**:

```bash
docker-compose logs -f app
```

**Common issues**:

1. PostgreSQL not ready: Wait for health check to pass
2. Port 8080 already in use: Stop conflicting service or change port
3. Build failed: Check Docker has enough resources (4GB+ RAM recommended)

### Database Connection Issues

**Test PostgreSQL connection**:

```bash
docker-compose exec postgres psql -U postgres -d clientdb
```

**Reset database**:

```bash
docker-compose down -v
docker-compose up -d
```

### Container Resource Issues

**Increase Docker resources**:

- Docker Desktop → Settings → Resources
- Recommended: 4GB RAM, 2 CPUs

**Clean up Docker**:

```bash
# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune

# Remove all unused data
docker system prune -a --volumes
```

## Production Considerations

### Security

1. **Change default passwords** in `docker-compose.yml`:
   ```yaml
   environment:
     - POSTGRES_PASSWORD=your_strong_password
     - PGADMIN_DEFAULT_PASSWORD=your_admin_password
   ```

2. **Use secrets** instead of environment variables:
   ```yaml
   secrets:
     - postgres_password
   ```

3. **Disable pgAdmin** in production (remove from docker-compose.yml)

4. **Enable HTTPS** with reverse proxy (nginx/traefik)

### Performance

1. **Tune JVM options**:
   ```dockerfile
   ENTRYPOINT ["java", "-Xmx512m", "-Xms256m", "-jar", "app.jar"]
   ```

2. **Configure connection pool**:
   ```properties
   spring.datasource.hikari.maximum-pool-size=20
   spring.datasource.hikari.minimum-idle=5
   ```

3. **Enable database indexes** for frequently queried fields

### Monitoring

Add monitoring stack (Prometheus + Grafana):

```yaml
services:
  prometheus:
    image: prom/prometheus
    # ... configuration

  grafana:
    image: grafana/grafana
    # ... configuration
```

### Scaling

Scale application instances:

```bash
docker-compose up -d --scale app=3
```

Add load balancer (nginx) to distribute traffic.

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Docker Build and Push

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Build and push Docker image
        run: |
          docker build -t myregistry/spring-boot-react-app .
          docker push myregistry/spring-boot-react-app
```

### Docker Hub Deployment

```bash
# Build
docker build -t yourusername/spring-boot-react-app .

# Tag
docker tag spring-boot-react-app yourusername/spring-boot-react-app:latest
docker tag spring-boot-react-app yourusername/spring-boot-react-app:v1.0.0

# Push
docker push yourusername/spring-boot-react-app:latest
docker push yourusername/spring-boot-react-app:v1.0.0
```

## Network Configuration

All services run on a custom bridge network `app-network`:

- Containers can communicate using service names
- Isolated from other Docker networks
- Supports DNS resolution

## Useful Commands

```bash
# View container resource usage
docker stats

# View detailed container info
docker inspect spring-boot-react-app

# Export container as image
docker commit spring-boot-react-app my-backup-image

# Save image to file
docker save -o app-backup.tar spring-boot-react-app

# Load image from file
docker load -i app-backup.tar

# Execute command in running container
docker-compose exec app ls -la /app

# Copy files from container
docker cp spring-boot-react-app:/app/app.jar ./backup.jar

# Copy files to container
docker cp config.properties spring-boot-react-app:/app/
```

## Development Workflow

### Option 1: Full Rebuild

```bash
docker-compose down
docker-compose up --build
```

### Option 2: Code Changes Only

```bash
# Rebuild only the app service
docker-compose build app
docker-compose up -d app
```

### Option 3: Hot Reload with Volume Mount

Add volume mount in docker-compose.yml:

```yaml
services:
  app:
    volumes:
      - ./target:/app/target
```

Then use Maven in the container or locally to rebuild.

## Best Practices

1. ✅ Use multi-stage builds
2. ✅ Don't run as root user
3. ✅ Use health checks
4. ✅ Version your images
5. ✅ Keep images small
6. ✅ Use .dockerignore
7. ✅ Set resource limits
8. ✅ Use named volumes for data
9. ✅ Document environment variables
10. ✅ Implement proper logging

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Spring Boot Docker Guide](https://spring.io/guides/topicals/spring-boot-docker/)
- [PostgreSQL Docker Image](https://hub.docker.com/_/postgres)

## Support

For issues specific to Docker deployment:

1. Check container logs: `docker-compose logs -f`
2. Verify network connectivity: `docker network inspect app-network`
3. Check resource usage: `docker stats`
4. Review Docker documentation above
