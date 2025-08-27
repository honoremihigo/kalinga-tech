import axios from 'axios';

class FeeManagementService {
  constructor(baseURL = import.meta.env.VITE_API_URL) {
    this.api = axios.create({
      baseURL,
      withCredentials: true,
      headers: { 'Content-Type': 'application/json' },
    });

    this.api.interceptors.response.use(
      res => res,
      err => {
        const msg = err.response?.data?.message || err.message || 'API error';
        console.error('API Error:', msg);
        throw new Error(msg);
      }
    );
  }

  // list all categories
  async getCategories(params = {}) {
    const res = await this.api.get('/fees/category', { params });
    return res.data;
  }

  // get one
  async getCategory(id) {
    const res = await this.api.get(`/fees/category/${id}`);
    return res.data;
  }

  // create
  async createCategory(data) {
    const res = await this.api.post('/fees/category', data);
    return res.data;
  }

  // update
  async updateCategory(id, data) {
    const res = await this.api.patch(`/fees/category/${id}`, data);
    return res.data;
  }

  // delete
  async deleteCategory(id) {
    await this.api.delete(`/fees/category/${id}`);
  }

  // helper for display
  formatFeeDescription(cat) {
    return `${cat.name}: $${cat.bookingFee.toFixed(2)} booking + $${cat.feePerMile.toFixed(2)}/mile`;
  }
}

export default new FeeManagementService();
