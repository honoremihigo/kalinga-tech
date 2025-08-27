import api from '../../api/api'; // Using your existing API instance

/**
 * Product Service
 * Handles all product-related API calls including file uploads
 */
class ProductService {
    /**
     * Create a new product with optional file uploads
     * @param {FormData|Object} productData - Product creation data (FormData for files, Object for regular data)
     * @returns {Promise<Object>} Response with success message and created product
     */
    async createProduct(productData) {
        try {
            let response;

            if (productData instanceof FormData) {
                // Handle file uploads with FormData (productImage)
                response = await api.post('/products', productData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            } else {
                // Handle regular JSON data
                response = await api.post('/products', productData);
            }

            return response.data;
        } catch (error) {
            console.error('Error creating product:', error);
            const errorMessage =
                error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                'Failed to create product';
            throw new Error(errorMessage);
        }
    }

    /**
     * Get all products (ordered by creation date descending)
     * @returns {Promise<Array>} Array of all products
     */
    async getAllProducts() {
        try {
            const response = await api.get('/products');
            return response.data;
        } catch (error) {
            console.error('Error fetching products:', error);
            const errorMessage =
                error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                'Failed to fetch products';
            throw new Error(errorMessage);
        }
    }

    /**
     * Get a specific product by ID
     * @param {string} id - Product's ID
     * @returns {Promise<Object|null>} Product object or null if not found
     */
    async getProductById(id) {
        try {
            const response = await api.get(`/products/${id}`);
            return response.data;
        } catch (error) {
            if (error.response?.status === 404) {
                return null; // Product not found
            }
            console.error('Error fetching product by ID:', error);
            const errorMessage =
                error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                'Failed to fetch product';
            throw new Error(errorMessage);
        }
    }

    /**
     * Update a product with optional file uploads (productImage)
     * @param {string} id - Product's ID
     * @param {FormData|Object} productData - Product update data
     * @returns {Promise<Object>} Response with success message and updated product
     */
    async updateProduct(id, productData) {
        try {
            let response;

            if (productData instanceof FormData) {
                // Handle file uploads with FormData (productImage)
                response = await api.put(`/products/${id}`, productData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            } else {
                // Handle regular JSON data
                response = await api.put(`/products/${id}`, productData);
            }

            return response.data;
        } catch (error) {
            console.error('Error updating product:', error);
            const errorMessage =
                error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                'Failed to update product';
            throw new Error(errorMessage);
        }
    }

    /**
     * Delete a product
     * @param {string} id - Product's ID
     * @returns {Promise<Object>} Response with success message
     */
    async deleteProduct(id) {
        try {
            const response = await api.delete(`/products/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting product:', error);
            const errorMessage =
                error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                'Failed to delete product';
            throw new Error(errorMessage);
        }
    }

    /**
     * Validate product data before sending to backend
     * @param {Object|FormData} productData - Product data to validate
     * @returns {Object} Validation result with isValid boolean and errors array
     */
    validateProductData(productData) {
        const errors = [];

        // Convert FormData to object for validation if needed
        let dataToValidate = {};
        if (productData instanceof FormData) {
            for (let [key, value] of productData.entries()) {
                if (!(value instanceof File)) {
                    dataToValidate[key] = value;
                }
            }
        } else {
            dataToValidate = productData;
        }

        // Required fields validation
        if (!dataToValidate.name || !dataToValidate.name.trim()) {
            errors.push('Product name is required');
        }

        if (!dataToValidate.description || !dataToValidate.description.trim()) {
            errors.push('Product description is required');
        }

        if (!dataToValidate.brand || !dataToValidate.brand.trim()) {
            errors.push('Product brand is required');
        }

        if (!dataToValidate.model || !dataToValidate.model.trim()) {
            errors.push('Product model is required');
        }

        if (!dataToValidate.processor || !dataToValidate.processor.trim()) {
            errors.push('Product processor is required');
        }

        if (!dataToValidate.ram || !dataToValidate.ram.trim()) {
            errors.push('Product RAM is required');
        }

        if (!dataToValidate.storage || !dataToValidate.storage.trim()) {
            errors.push('Product storage is required');
        }

        if (!dataToValidate.graphicsCard || !dataToValidate.graphicsCard.trim()) {
            errors.push('Product graphics card is required');
        }

        if (!dataToValidate.resolution || !dataToValidate.resolution.trim()) {
            errors.push('Product resolution is required');
        }

        // Length and format validations
        if (dataToValidate.name && dataToValidate.name.length > 255) {
            errors.push('Product name must be less than 255 characters');
        }

        if (dataToValidate.description && dataToValidate.description.length > 1000) {
            errors.push('Product description must be less than 1000 characters');
        }

        if (dataToValidate.brand && dataToValidate.brand.length > 100) {
            errors.push('Product brand must be less than 100 characters');
        }

        if (dataToValidate.model && dataToValidate.model.length > 100) {
            errors.push('Product model must be less than 100 characters');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Get file URL for display
     * @param {string} filePath - Server file path
     * @returns {string} Full URL for file access
     */
    getFileUrl(filePath) {
        if (!filePath) return null;

        // If it's already a full URL, return as is
        if (filePath.startsWith('http')) {
            return filePath;
        }

        // Construct full URL from your API base
        const baseUrl = api.defaults.baseURL || '';
        return `${baseUrl}${filePath}`;
    }

    /**
     * Format product date for display
     * @param {string} dateString - ISO date string
     * @returns {string} Formatted date string
     */
    formatProductDate(dateString) {
        if (!dateString) return '';
        
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    /**
     * Get product excerpt for preview
     * @param {string} description - Full product description
     * @param {number} maxLength - Maximum length of excerpt (default: 150)
     * @returns {string} Product description excerpt
     */
    getProductExcerpt(description, maxLength = 150) {
        if (!description) return '';
        
        if (description.length <= maxLength) {
            return description;
        }
        
        return description.substring(0, maxLength).trim() + '...';
    }

    /**
     * Prepare product data for API submission
     * @param {Object} rawData - Raw product data from form
     * @param {File[]} files - Array of files to upload (optional)
     * @returns {FormData|Object} Prepared data for API submission
     */
    prepareProductData(rawData, files = []) {
        // Clean and prepare the data
        const cleanData = {
            name: rawData.name?.trim() || '',
            description: rawData.description?.trim() || '',
            brand: rawData.brand?.trim() || '',
            model: rawData.model?.trim() || '',
            processor: rawData.processor?.trim() || '',
            ram: rawData.ram?.trim() || '',
            storage: rawData.storage?.trim() || '',
            graphicsCard: rawData.graphicsCard?.trim() || '',
            resolution: rawData.resolution?.trim() || ''
        };

        if (files && files.length > 0) {
            // Use FormData for file uploads
            const formData = new FormData();
            
            // Add text fields
            Object.keys(cleanData).forEach(key => {
                if (cleanData[key] !== null && cleanData[key] !== undefined && cleanData[key] !== '') {
                    formData.append(key, cleanData[key]);
                }
            });
            
            // Add files (specifically for productImage)
            files.forEach((file, index) => {
                if (file) {
                    formData.append('productImage', file);
                }
            });
            
            return formData;
        } else {
            // Return regular object for JSON submission
            return cleanData;
        }
    }

    /**
     * Get product specifications as a formatted string
     * @param {Object} product - Product object
     * @returns {string} Formatted specifications string
     */
    getProductSpecs(product) {
        if (!product) return '';
        const specs = [
            `Brand: ${product.brand || 'N/A'}`,
            `Model: ${product.model || 'N/A'}`,
            `Processor: ${product.processor || 'N/A'}`,
            `RAM: ${product.ram || 'N/A'}`,
            `Storage: ${product.storage || 'N/A'}`,
            `Graphics: ${product.graphicsCard || 'N/A'}`,
            `Resolution: ${product.resolution || 'N/A'}`
        ];
        return specs.join(' | ');
    }
}

// Create and export a singleton instance
const productService = new ProductService();
export default productService;

// Named exports for individual methods
export const {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    validateProductData,
    getFileUrl,
    formatProductDate,
    getProductExcerpt,
    prepareProductData,
    getProductSpecs
} = productService;