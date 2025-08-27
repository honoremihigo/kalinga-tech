import axios from 'axios';

class VehicleManagementService {
    constructor(baseURL = import.meta.env.VITE_API_URL) {
        this.api = axios.create({
            baseURL,
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        this.api.interceptors.response.use(
            (response) => response,
            (error) => {
                const message = error.response?.data?.message || error.message || 'An error occurred';
                console.error('API Error:', message);
                throw new Error(message);
            }
        );
    }

    // Get all vehicles
    async getVehicles(params = {}) {
        // params can include search/filter query like make, model, year
        try {
            const response = await this.api.get('/vehicles', { params });
            return response.data;
        } catch (error) {
            console.error('Get vehicles error:', error);
            throw error;
        }
    }

    // Create a new vehicle
    async createVehicle(vehicleData) {
        try {
            const response = await this.api.post('/vehicles', vehicleData);
            return response.data;
        } catch (error) {
            console.error('Create vehicle error:', error);
            throw error;
        }
    }

    // Update existing vehicle by ID
    async updateVehicle(vehicleId, vehicleData) {
        try {
            const response = await this.api.put(`/vehicles/${vehicleId}`, vehicleData);
            return response.data;
        } catch (error) {
            console.error('Update vehicle error:', error);
            throw error;
        }
    }

    // Delete vehicle by ID
    async deleteVehicle(vehicleId) {
        try {
            const response = await this.api.delete(`/vehicles/${vehicleId}`);
            return response.data;
        } catch (error) {
            console.error('Delete vehicle error:', error);
            throw error;
        }
    }

    // Utility method to get vehicle initials from make and model
    getInitials(make, model) {
        if (!make && !model) return '';
        const makeInitial = make?.charAt(0) || '';
        const modelInitial = model?.charAt(0) || '';
        return (makeInitial + modelInitial).toUpperCase();
    }
}

const vehicleManagementService = new VehicleManagementService();
export default vehicleManagementService;
