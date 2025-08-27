import axios from 'axios';

// Base URL - update this to match your backend URL
const BASE_URL = import.meta.env.VITE_API_URL; // Adjust port and path as needed

class CategoryService {
  constructor() {
    this.apiClient = axios.create({
      baseURL: BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Create a new category
  async createCategory(categoryData) {
    try {
      const response = await this.apiClient.post('/category/create', categoryData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create category');
    }
  }

  // Get all categories
  async getAllCategories() {
    try {
      const response = await this.apiClient.get('/category/all');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch categories');
    }
  }

  // Get a single category by ID
  async getCategoryById(id) {
    try {
      const response = await this.apiClient.get(`/category/getone/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch category');
    }
  }

  // Update a category
  async updateCategory(id, categoryData) {
    try {
      const response = await this.apiClient.put(`/category/update/${id}`, categoryData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update category');
    }
  }

  // Delete a category
  async deleteCategory(id) {
    try {
      const response = await this.apiClient.delete(`/category/delete/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete category');
    }
  }
}

// Export a single instance
const categoryService = new CategoryService();
export default categoryService;

// Usage examples:
/*
import categoryService from './categoryService';

// Create category
const newCategory = await categoryService.createCategory({
  name: 'Electronics',
  description: 'Electronic devices and accessories'
});

// Get all categories
const categories = await categoryService.getAllCategories();

// Get single category
const category = await categoryService.getCategoryById(1);

// Update category
const updated = await categoryService.updateCategory(1, {
  name: 'Updated Electronics',
  description: 'Updated description'
});

// Delete category
await categoryService.deleteCategory(1);
*/