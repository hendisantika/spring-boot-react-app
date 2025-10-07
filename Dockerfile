# Multi-stage build for Spring Boot React App

# Stage 1: Build the application (using host architecture)
FROM maven:3.9.6-eclipse-temurin-21 AS build

WORKDIR /app

# Install Node.js and Yarn for frontend build
RUN apt-get update && \
    apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g yarn && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy pom.xml and download dependencies (for better caching)
COPY pom.xml .
COPY .mvn .mvn
COPY mvnw .

# Download dependencies
RUN ./mvnw dependency:go-offline -B || true

# Copy source code
COPY src ./src
COPY frontend ./frontend

# Build the application (includes frontend build)
# Skip frontend maven plugin and use local Node.js
RUN cd frontend && yarn install && yarn build && cd .. && \
    ./mvnw clean package -DskipTests -P default-jdk9-and-above

# Stage 2: Run the application
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Create a non-root user to run the application
RUN addgroup -S spring && adduser -S spring -G spring

# Copy the JAR file from build stage
COPY --from=build /app/target/*.jar app.jar

# Change ownership to spring user
RUN chown spring:spring app.jar

# Switch to non-root user
USER spring:spring

# Expose port 8080
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:8080/clients || exit 1

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
