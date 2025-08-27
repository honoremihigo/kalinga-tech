import axios from 'axios';

class DriverManagementService {
    constructor(baseURL =
        import.meta.env.VITE_API_URL) {
        this.api = axios.create({
            baseURL,
            withCredentials: true,
         
        });

        this.api.interceptors.response.use(
            (response) => response,
            (error) => {
                const message = error.response ?.data ?.message || error.message || 'An error occurred';
                console.error('API Error:', message);
                throw new Error(message);
            }
        );
    }

    // Get all drivers
    async getDrivers() {
        // params can include search/filter query like name, dob, createdAt
        try {
            const response = await this.api.get('/drivers');
            return response.data;
        } catch (error) {
            console.error('Get drivers error:', error);
            throw error;
        }
    }

    // Inside DriverManagementService class
async getDriverById(driverId) {
    try {
        const response = await this.api.get(`/drivers/${driverId}`);
        return response.data;
    } catch (error) {
        console.error('Get driver by ID error:', error);
        throw error;
    }
}




    // Create a new driver
  // Create a new driver
// In your DriverManagementService class
async createDriver(driverData) {
  try {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };
    const response = await this.api.post('/drivers', driverData, config);
    return response.data;
  } catch (error) {
    console.error('Create driver error:', error);
    throw error;
  }
}

    // Update existing driver by ID
    async updateDriver(driverId, driverData) {

            const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };
        try {
            const response = await this.api.put(`/drivers/${driverId}`, driverData,config);
            return response.data;
        } catch (error) {
            console.error('Update driver error:', error);
            throw error;
        }
    }

    // Delete driver by ID
    async deleteDriver(driverId) {
        try {
            const response = await this.api.delete(`/drivers/${driverId}`);
            return response.data;
        } catch (error) {
            console.error('Delete driver error:', error);
            throw error;
        }
    }

    
    async approveDriverStatus(driverId) {
        try {
            const response = await this.api.put(`/drivers/approve/${driverId}`);
            return response.data;
        } catch (error) {
            console.error('Approve driver error:', error);
            throw error;
        }
    }

    // Utility method to get driver's initials from firstName and lastName
    getInitials(firstName, lastName) {
        if (!firstName && !lastName) return '';
        const firstInitial = firstName ?.charAt(0) || '';
        const lastInitial = lastName ?.charAt(0) || '';
        return (firstInitial + lastInitial).toUpperCase();
    }
}

const driverManagementService = new DriverManagementService();
export default driverManagementService;