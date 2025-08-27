import axios from 'axios';

class VehicleManagementService {
    constructor(baseURL = import.meta.env.VITE_API_URL) {
        this.api = axios.create({
            baseURL,
            withCredentials: true,
       
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

    // Update only the vehicle category
async updateVehicleCategory (data){
  try {
    // Make sure to send the data in the correct format
    // eslint-disable-next-line no-undef
    const response = await this.api.patch(`/vehicles/category/${data.vehicleid}`, {
      categoryName: data.categoryName
    });
    return response.data;
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to update category');
  }
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
       async getVehicleById(vehicleId) {
        try {
            const response = await this.api.get(`/vehicles/${vehicleId}`);
            return response.data;
        } catch (error) {
            console.error('Get vehicle by ID error:', error);
            throw error;
        }
    }

    // Create a new vehicle
    async createVehicle(vehicleData) {
   const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };


        try {
            const response = await this.api.post('/vehicles', vehicleData,config);
            return response.data;
        } catch (error) {
            console.error('Create vehicle error:', error);
            throw error;
        }
    }

    // Update existing vehicle by ID
    async updateVehicle(vehicleId, vehicleData) {

           const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };
        try {
            const response = await this.api.put(`/vehicles/${vehicleId}`, vehicleData,config);
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
