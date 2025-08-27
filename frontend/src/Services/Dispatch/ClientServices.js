import api from '../../api/api'; // Adjust the path as needed

class ClientService {
  // Get all clients with bookings and rides
  async getAllClients() {
    try {
      const response = await api.get('/client');
      return response.data;
    } catch (error) {
      console.error('Error fetching clients:', error);
      throw this.handleError(error);
    }
  }

}


// Create and export a singleton instance
const clientService = new ClientService();
export default clientService;