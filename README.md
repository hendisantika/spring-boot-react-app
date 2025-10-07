# Spring Boot React App

A full-stack web application built with Spring Boot backend and React frontend, demonstrating CRUD operations for client
management.

## Overview

This project showcases the integration of Spring Boot 3.3.0 with a React frontend, using modern Java features and best
practices. The application provides a RESTful API for managing client data with a responsive React user interface.

## Tech Stack

### Backend

- **Java 21** - Latest LTS version with modern language features
- **Spring Boot 3.3.0** - Framework for building production-ready applications
- **Spring Data JPA** - Data persistence and ORM
- **H2 Database** - In-memory database for development
- **Lombok** - Reduces boilerplate code
- **JavaFaker** - Generates realistic test data

### Frontend

- **React** - Modern JavaScript library for building user interfaces
- **Node.js v22.2.0** - JavaScript runtime
- **Yarn v1.22.22** - Package manager

### Build Tools

- **Maven** - Backend dependency management and build
- **Frontend Maven Plugin** - Integrates frontend build with Maven

## Features

- **CRUD Operations**: Complete Create, Read, Update, Delete functionality for clients
- **RESTful API**: Clean REST endpoints following best practices
- **Automatic Data Initialization**: Bootstrap initial data using JavaFaker
- **Single JAR Deployment**: Frontend and backend bundled together
- **Hot Reload**: Development tools for rapid iteration

## Project Structure

```
spring-boot-react-app/
├── src/main/java/
│   └── id/my/hendisantika/springbootreactapp/
│       ├── SpringBootReactAppApplication.java    # Main application class
│       ├── model/
│       │   └── Client.java                       # Client entity
│       ├── repository/
│       │   └── ClientRepository.java             # JPA repository
│       ├── controller/
│       │   └── ClientsController.java            # REST controller
│       └── config/
│           └── BoostrapInitialData.java          # Data initialization
├── src/main/resources/
│   └── application.properties                     # Application configuration
├── frontend/                                      # React application
└── pom.xml                                        # Maven configuration
```

## API Endpoints

| Method | Endpoint        | Description            |
|--------|-----------------|------------------------|
| GET    | `/clients`      | Get all clients        |
| GET    | `/clients/{id}` | Get client by ID       |
| POST   | `/clients`      | Create new client      |
| PUT    | `/clients/{id}` | Update existing client |
| DELETE | `/clients/{id}` | Delete client          |

## Getting Started

### Prerequisites

- Java 21 or higher
- Maven 3.6+
- Node.js v22.2.0 (automatically installed via frontend-maven-plugin)
- Yarn v1.22.22 (automatically installed via frontend-maven-plugin)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/spring-boot-react-app.git
cd spring-boot-react-app
```

2. Build the project (includes frontend build):

```bash
./mvnw clean install
```

3. Run the application:

```bash
./mvnw spring-boot:run
```

4. Access the application:
    - Frontend: http://localhost:8080
    - API: http://localhost:8080/clients

### Development Mode

For frontend development with hot reload:

1. Start the Spring Boot backend:

```bash
./mvnw spring-boot:run
```

2. In a separate terminal, navigate to frontend directory and start React dev server:

```bash
cd frontend
yarn start
```

## Build Process

The Maven build process automatically:

1. Installs Node.js and Yarn (if not present)
2. Installs frontend dependencies
3. Runs frontend tests
4. Builds the React application
5. Copies the built frontend to `target/classes/static`
6. Packages everything into a single executable JAR

## Configuration

### Database

The application uses H2 in-memory database by default. Configuration can be modified in
`src/main/resources/application.properties`.

To access H2 console (if enabled):

- URL: http://localhost:8080/h2-console
- JDBC URL: jdbc:h2:mem:testdb
- Username: sa
- Password: (leave empty)

### Maven Profiles

- **default-jdk9-and-above**: Skips frontend build (for faster backend-only builds)
- **integration-jdk9-and-above**: Integration testing profile

## Testing

Run backend tests:

```bash
./mvnw test
```

Run frontend tests:

```bash
cd frontend
yarn test
```

## Deployment

Build production-ready JAR:

```bash
./mvnw clean package
```

Run the JAR:

```bash
java -jar target/spring-boot-react-app-0.0.1-SNAPSHOT.jar
```

## Client Model

The Client entity contains:

- `id` (Long) - Auto-generated unique identifier
- `name` (String) - Client name
- `email` (String) - Client email address

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Author

**Hendi Santika**

- Email: hendisantika@gmail.com
- Telegram: @hendisantika34

## Acknowledgments

- Spring Boot team for the excellent framework
- React team for the powerful UI library
- All contributors and supporters of this project
