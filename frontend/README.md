# Frontend - Spring Boot React App

This is the React frontend for the Spring Boot React App client management system.

## Available Scripts

### `yarn start`

Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `yarn test`

Launches the test runner in interactive watch mode.

### `yarn build`

Builds the app for production to the `build` folder.

## Project Structure

```
src/
├── components/
│   ├── ClientList.js      # Displays list of clients
│   └── ClientForm.js      # Form for creating/editing clients
├── services/
│   └── ClientService.js   # API service layer
├── App.js                 # Main application component
├── App.css               # Application styles
├── index.js              # Application entry point
└── index.css             # Global styles
```

## Integration with Spring Boot

The frontend is configured to proxy API requests to the Spring Boot backend running on port 8080.
The Maven build process automatically builds this React app and bundles it with the Spring Boot application.
