# Running the Application

## Quick Start

### Option 1: Production Build (Recommended)

Build and run the complete application (Spring Boot + React bundled together):

```bash
# Build the project (includes frontend build)
./mvnw clean package

# Run the application
java -jar target/spring-boot-react-app-0.0.1-SNAPSHOT.jar

# Or run directly with Maven
./mvnw spring-boot:run
```

Access the application at: **http://localhost:8080**

### Option 2: Development Mode (Hot Reload)

For frontend development with hot reload:

**Terminal 1 - Start Backend:**

```bash
./mvnw spring-boot:run
```

**Terminal 2 - Start Frontend Dev Server:**

```bash
cd frontend
yarn start
```

- Backend API: http://localhost:8080/clients
- Frontend Dev: http://localhost:3000 (with proxy to backend)

## What You'll See

1. **Home Page**: Client Management System interface
2. **Add Client Form**: Create new clients with name and email
3. **Client List**: View all clients in a table with Edit/Delete actions
4. **Edit Client**: Click "Edit" to modify existing client data
5. **Delete Client**: Click "Delete" to remove a client (with confirmation)

## API Endpoints

The backend provides these REST endpoints:

- `GET /clients` - Get all clients
- `GET /clients/{id}` - Get specific client
- `POST /clients` - Create new client
- `PUT /clients/{id}` - Update existing client
- `DELETE /clients/{id}` - Delete client

Test with curl:

```bash
# Get all clients
curl http://localhost:8080/clients

# Create new client
curl -X POST http://localhost:8080/clients \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com"}'

# Get specific client
curl http://localhost:8080/clients/1

# Update client
curl -X PUT http://localhost:8080/clients/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","email":"jane@example.com"}'

# Delete client
curl -X DELETE http://localhost:8080/clients/1
```

## Database Access

H2 Console is available at: **http://localhost:8080/h2-console**

Connection details:

- JDBC URL: `jdbc:h2:mem:testdb` (check console logs for actual URL)
- Username: `sa`
- Password: (leave empty)

## Initial Data

The application automatically initializes with 10 sample clients using JavaFaker library.
This happens on startup via `BoostrapInitialData.java`.

## Troubleshooting

### Port Already in Use

If port 8080 is already in use, stop the conflicting process or change the port in
`src/main/resources/application.properties`:

```properties
server.port=8081
```

### Frontend Build Issues

If you encounter frontend build errors:

```bash
cd frontend
rm -rf node_modules yarn.lock
yarn install
yarn build
```

### Lombok Issues

If you get compilation errors about missing getters/setters, ensure your IDE has Lombok plugin installed and annotation
processing enabled.

## Project Structure

```
spring-boot-react-app/
├── src/main/java/               # Backend Java code
│   ├── controller/              # REST controllers
│   ├── model/                   # JPA entities
│   ├── repository/              # Data repositories
│   └── config/                  # Configuration classes
├── frontend/                    # React application
│   ├── src/
│   │   ├── components/         # React components
│   │   └── services/           # API service layer
│   └── public/                 # Static assets
└── target/                     # Build output
    └── classes/static/         # Bundled frontend
```

## Next Steps

1. **Customize the UI**: Modify styles in `frontend/src/App.css`
2. **Add Features**: Extend the Client model with additional fields
3. **Add Validation**: Implement server-side validation in the controller
4. **Add Testing**: Write tests for both frontend and backend
5. **Deploy**: Package as JAR and deploy to your server
