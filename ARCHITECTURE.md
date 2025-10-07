# Architecture Documentation

## System Architecture

This application follows a modern full-stack architecture pattern with clear separation of concerns.

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser                               │
│                    (React Frontend)                          │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/REST
                         │ (axios)
┌────────────────────────▼────────────────────────────────────┐
│                   Spring Boot Backend                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │          REST Controller Layer                       │  │
│  │         (ClientsController.java)                     │  │
│  │  - GET /clients                                      │  │
│  │  - GET /clients/{id}                                 │  │
│  │  - POST /clients                                     │  │
│  │  - PUT /clients/{id}                                 │  │
│  │  - DELETE /clients/{id}                              │  │
│  └──────────────────────┬───────────────────────────────┘  │
│                         │                                    │
│  ┌──────────────────────▼───────────────────────────────┐  │
│  │          Repository Layer                            │  │
│  │         (ClientRepository.java)                      │  │
│  │         extends JpaRepository                        │  │
│  └──────────────────────┬───────────────────────────────┘  │
│                         │                                    │
│  ┌──────────────────────▼───────────────────────────────┐  │
│  │          Entity/Model Layer                          │  │
│  │            (Client.java)                             │  │
│  │  - id: Long                                          │  │
│  │  - name: String                                      │  │
│  │  - email: String                                     │  │
│  └──────────────────────┬───────────────────────────────┘  │
└─────────────────────────┼────────────────────────────────────┘
                          │ JPA/Hibernate
┌─────────────────────────▼────────────────────────────────────┐
│                   H2 In-Memory Database                       │
│                     (Development)                             │
└───────────────────────────────────────────────────────────────┘
```

## Frontend Architecture

### Component Hierarchy

```
App.js
├── Header (inline)
├── ClientForm.js
│   ├── Form inputs (name, email)
│   ├── Validation logic
│   └── Submit/Cancel actions
├── ClientList.js
│   ├── Table display
│   ├── Edit buttons
│   └── Delete buttons
└── Footer (inline)
```

### Service Layer

```
ClientService.js
├── getAllClients()
├── getClientById(id)
├── createClient(client)
├── updateClient(id, client)
└── deleteClient(id)
```

All API calls use Axios with base URL `/clients` (proxied to backend in dev mode).

## Backend Architecture

### Layer Responsibilities

**Controller Layer** (`ClientsController.java`)

- Handle HTTP requests/responses
- Map REST endpoints to service methods
- Validate request data
- Return appropriate HTTP status codes

**Repository Layer** (`ClientRepository.java`)

- Interface extending JpaRepository
- Provides CRUD operations automatically
- Custom query methods can be added

**Model Layer** (`Client.java`)

- JPA entity representing database table
- Uses Lombok annotations (@Data, @Entity, etc.)
- Contains business logic (if any)

**Configuration Layer** (`BoostrapInitialData.java`)

- Implements CommandLineRunner
- Initializes database with sample data on startup
- Uses JavaFaker for realistic test data

## Data Flow

### Create Client Flow

```
1. User fills form in ClientForm.js
2. Form validation (frontend)
3. ClientService.createClient() called
4. POST request to /clients
5. ClientsController.createClient() receives request
6. ClientRepository.save() persists to database
7. Response sent back to frontend
8. Client list refreshed automatically
```

### Update Client Flow

```
1. User clicks "Edit" button in ClientList.js
2. Selected client data loaded into ClientForm.js
3. User modifies data
4. Form validation (frontend)
5. ClientService.updateClient() called
6. PUT request to /clients/{id}
7. ClientsController.updateClient() receives request
8. ClientRepository.save() updates database
9. Response sent back to frontend
10. Client list refreshed automatically
```

## Build Process

### Maven Build Lifecycle

```
1. clean
   └── Delete target directory

2. install-node-and-yarn
   └── Frontend Maven Plugin installs Node.js and Yarn

3. yarn install
   └── Install frontend dependencies

4. compile (Java)
   └── Compile backend Java code
   └── Lombok annotation processing

5. yarn build
   └── Build React production bundle
   └── Output to frontend/build/

6. copy-resources
   └── Copy frontend build to target/classes/static

7. package
   └── Create executable JAR with embedded frontend
```

### Development vs Production

**Development:**

- Backend: Hot reload with Spring DevTools
- Frontend: React dev server with hot reload
- Separate processes on different ports
- Proxy configuration for API calls

**Production:**

- Single JAR file
- Frontend served as static resources
- Backend API on same port
- Optimized and minified assets

## Technology Choices

### Why Spring Boot?

- Rapid application development
- Auto-configuration
- Embedded server (Tomcat)
- Excellent ecosystem
- Production-ready features

### Why React?

- Component-based architecture
- Virtual DOM for performance
- Large ecosystem
- Easy to learn
- Great developer experience

### Why H2 Database?

- In-memory for development
- Zero configuration
- Built-in web console
- Easy to switch to production database

### Why Lombok?

- Reduces boilerplate code
- Cleaner entity classes
- Maintains readability
- IDE support

## Security Considerations

**Current State (Development):**

- No authentication/authorization
- CORS enabled by default
- H2 console accessible

**Production Recommendations:**

- Add Spring Security
- Implement JWT authentication
- Configure CORS properly
- Disable H2 console
- Use production database (PostgreSQL/MySQL)
- Add HTTPS
- Input validation and sanitization
- Rate limiting

## Scalability Considerations

**Current Architecture:**

- Suitable for small to medium applications
- In-memory database (data lost on restart)
- No caching layer

**Scaling Recommendations:**

- Switch to persistent database
- Add Redis for caching
- Implement pagination for large datasets
- Add database connection pooling (already has HikariCP)
- Consider microservices for large applications
- Add load balancer for horizontal scaling
- Implement API rate limiting

## Testing Strategy

### Backend Testing

- Unit tests for controllers
- Integration tests for repositories
- Service layer tests
- API endpoint tests with MockMvc

### Frontend Testing

- Component unit tests with Jest
- Integration tests with React Testing Library
- E2E tests with Cypress (optional)

## Deployment Options

1. **Traditional Server**
    - Deploy JAR to server
    - Run with `java -jar`
    - Use systemd for service management

2. **Docker Container**
    - Create Dockerfile
    - Build image
    - Deploy to container platform

3. **Cloud Platforms**
    - Heroku
    - AWS Elastic Beanstalk
    - Google Cloud Platform
    - Azure App Service

4. **Kubernetes**
    - For enterprise deployments
    - Auto-scaling support
    - High availability
