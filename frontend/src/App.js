import React, {useState} from 'react';
import ClientList from './components/ClientList';
import ClientForm from './components/ClientForm';
import './App.css';

/**
 * Main App Component
 * Manages the client management application
 */
function App() {
    const [selectedClient, setSelectedClient] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const handleEdit = (client) => {
        setSelectedClient(client);
    };

    const handleSave = () => {
        setSelectedClient(null);
        // Trigger refresh of client list
        setRefreshKey(prevKey => prevKey + 1);
    };

    const handleCancel = () => {
        setSelectedClient(null);
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>Client Management System</h1>
                <p className="subtitle">Spring Boot + React Application</p>
            </header>

            <main className="App-main">
                <div className="container">
                    <ClientForm
                        client={selectedClient}
                        onSave={handleSave}
                        onCancel={handleCancel}
                    />

                    <ClientList
                        key={refreshKey}
                        onEdit={handleEdit}
                    />
                </div>
            </main>

            <footer className="App-footer">
                <p>&copy; 2024 Client Management System | Built with Spring Boot &amp; React</p>
            </footer>
        </div>
    );
}

export default App;
