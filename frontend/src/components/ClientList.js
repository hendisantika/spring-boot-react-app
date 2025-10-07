import React, {useEffect, useState} from 'react';
import ClientService from '../services/ClientService';

/**
 * ClientList Component
 * Displays a list of all clients with options to edit and delete
 */
const ClientList = ({onEdit}) => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadClients();
    }, []);

    const loadClients = () => {
        setLoading(true);
        ClientService.getAllClients()
            .then(response => {
                setClients(response.data);
                setLoading(false);
                setError(null);
            })
            .catch(error => {
                console.error('Error loading clients:', error);
                setError('Failed to load clients. Please try again.');
                setLoading(false);
            });
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this client?')) {
            ClientService.deleteClient(id)
                .then(() => {
                    loadClients();
                })
                .catch(error => {
                    console.error('Error deleting client:', error);
                    setError('Failed to delete client. Please try again.');
                });
        }
    };

    if (loading) {
        return <div className="loading">Loading clients...</div>;
    }

    if (error) {
        return (
            <div className="error">
                <p>{error}</p>
                <button onClick={loadClients}>Retry</button>
            </div>
        );
    }

    return (
        <div className="client-list">
            <h2>Client List</h2>
            {clients.length === 0 ? (
                <p className="no-data">No clients found. Add a new client to get started.</p>
            ) : (
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {clients.map(client => (
                        <tr key={client.id}>
                            <td>{client.id}</td>
                            <td>{client.name}</td>
                            <td>{client.email}</td>
                            <td>
                                <button
                                    className="btn-edit"
                                    onClick={() => onEdit(client)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="btn-delete"
                                    onClick={() => handleDelete(client.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ClientList;
