import axios from 'axios';

const API_BASE_URL = '/clients';

class ClientService {
    /**
     * Get all clients
     * @returns {Promise} List of all clients
     */
    getAllClients() {
        return axios.get(API_BASE_URL);
    }

    /**
     * Get client by ID
     * @param {number} id - Client ID
     * @returns {Promise} Client data
     */
    getClientById(id) {
        return axios.get(`${API_BASE_URL}/${id}`);
    }

    /**
     * Create new client
     * @param {Object} client - Client data {name, email}
     * @returns {Promise} Created client
     */
    createClient(client) {
        return axios.post(API_BASE_URL, client);
    }

    /**
     * Update existing client
     * @param {number} id - Client ID
     * @param {Object} client - Updated client data {name, email}
     * @returns {Promise} Updated client
     */
    updateClient(id, client) {
        return axios.put(`${API_BASE_URL}/${id}`, client);
    }

    /**
     * Delete client
     * @param {number} id - Client ID
     * @returns {Promise} Delete confirmation
     */
    deleteClient(id) {
        return axios.delete(`${API_BASE_URL}/${id}`);
    }
}

const clientService = new ClientService();
export default clientService;
