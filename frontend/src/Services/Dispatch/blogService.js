// blogService.js - Frontend service for blog operations
import api from '../../api/api'; // Using your existing API instance

/**
 * Blog Service
 * Handles all blog-related API calls including file uploads
 */
class BlogService {
    /**
     * Create a new blog post with optional file uploads (requires admin authentication)
     * @param {FormData|Object} blogData - Blog creation data (FormData for files, Object for regular data)
     * @returns {Promise<Object>} Response with success message and created blog
     */
    async createBlog(blogData) {
        try {
            let response;

            if (blogData instanceof FormData) {
                // Handle file uploads with FormData (blogImage)
                response = await api.post('/blogs', blogData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            } else {
                // Handle regular JSON data
                response = await api.post('/blogs', blogData);
            }

            return response.data;
        } catch (error) {
            console.error('Error creating blog:', error);
            const errorMessage =
                error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                'Failed to create blog';
            throw new Error(errorMessage);
        }
    }

    /**
     * Get all blog posts (ordered by creation date descending)
     * @returns {Promise<Array>} Array of all blogs with their admin details
     */
    async getAllBlogs() {
        try {
            const response = await api.get('/blogs');
            return response.data;
        } catch (error) {
            console.error('Error fetching blogs:', error);
            const errorMessage =
                error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                'Failed to fetch blogs';
            throw new Error(errorMessage);
        }
    }

    /**
     * Get a specific blog by ID
     * @param {string} id - Blog's ID
     * @returns {Promise<Object|null>} Blog object with admin details or null if not found
     */
    async getBlogById(id) {
        try {
            const response = await api.get(`/blogs/${id}`);
            return response.data;
        } catch (error) {
            if (error.response?.status === 404) {
                return null; // Blog not found
            }
            console.error('Error fetching blog by ID:', error);
            const errorMessage =
                error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                'Failed to fetch blog';
            throw new Error(errorMessage);
        }
    }

    /**
     * Update a blog with optional file uploads (blogImage)
     * @param {string} id - Blog's ID
     * @param {FormData|Object} blogData - Blog update data
     * @returns {Promise<Object>} Response with success message and updated blog
     */
    async updateBlog(id, blogData) {
        try {
            let response;

            if (blogData instanceof FormData) {
                // Handle file uploads with FormData (blogImage)
                response = await api.put(`/blogs/${id}`, blogData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            } else {
                // Handle regular JSON data
                response = await api.put(`/blogs/${id}`, blogData);
            }

            return response.data;
        } catch (error) {
            console.error('Error updating blog:', error);
            const errorMessage =
                error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                'Failed to update blog';
            throw new Error(errorMessage);
        }
    }

    /**
     * Delete a blog
     * @param {string} id - Blog's ID
     * @returns {Promise<Object>} Response with success message
     */
    async deleteBlog(id) {
        try {
            const response = await api.delete(`/blogs/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting blog:', error);
            const errorMessage =
                error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                'Failed to delete blog';
            throw new Error(errorMessage);
        }
    }

    /**
     * Get blogs by admin ID
     * @param {string} adminId - Admin's ID
     * @returns {Promise<Array>} Array of blogs created by the admin
     */
    async getBlogsByAdmin(adminId) {
        try {
            const response = await api.get(`/blog/admin/${adminId}`);
            return response.data || [];
        } catch (error) {
            console.error('Error fetching blogs by admin:', error);
            const errorMessage =
                error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                'Failed to fetch admin blogs';
            throw new Error(errorMessage);
        }
    }

    /**
     * Search blogs by title or content
     * @param {string} searchTerm - Search term to look for
     * @returns {Promise<Array>} Array of matching blogs
     */
    async searchBlogs(searchTerm) {
        try {
            const response = await api.get(`/blog/search?q=${encodeURIComponent(searchTerm)}`);
            return response.data || [];
        } catch (error) {
            console.error('Error searching blogs:', error);
            const errorMessage =
                error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                'Failed to search blogs';
            throw new Error(errorMessage);
        }
    }

    /**
     * Get blogs with pagination
     * @param {number} page - Page number (default: 1)
     * @param {number} limit - Number of blogs per page (default: 10)
     * @returns {Promise<Object>} Response with blogs array and pagination info
     */
    async getBlogsWithPagination(page = 1, limit = 10) {
        try {
            const response = await api.get(`/blog?page=${page}&limit=${limit}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching paginated blogs:', error);
            const errorMessage =
                error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                'Failed to fetch paginated blogs';
            throw new Error(errorMessage);
        }
    }

    /**
     * Get blogs by category
     * @param {string} category - Blog category
     * @returns {Promise<Array>} Array of blogs in the specified category
     */
    async getBlogsByCategory(category) {
        try {
            const response = await api.get(`/blog/category/${encodeURIComponent(category)}`);
            return response.data || [];
        } catch (error) {
            console.error('Error fetching blogs by category:', error);
            const errorMessage =
                error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                'Failed to fetch blogs by category';
            throw new Error(errorMessage);
        }
    }

    /**
     * Get all unique blog categories
     * @returns {Promise<Array>} Array of unique categories
     */
    async getBlogCategories() {
        try {
            const response = await api.get('/blog/categories');
            return response.data || [];
        } catch (error) {
            console.error('Error fetching blog categories:', error);
            const errorMessage =
                error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                'Failed to fetch blog categories';
            throw new Error(errorMessage);
        }
    }

    /**
     * Validate blog data before sending to backend
     * @param {Object|FormData} blogData - Blog data to validate
     * @returns {Object} Validation result with isValid boolean and errors array
     */
    validateBlogData(blogData) {
        const errors = [];

        // Convert FormData to object for validation if needed
        let dataToValidate = {};
        if (blogData instanceof FormData) {
            for (let [key, value] of blogData.entries()) {
                if (!(value instanceof File)) {
                    dataToValidate[key] = value;
                }
            }
        } else {
            dataToValidate = blogData;
        }

        // Required fields validation
        if (!dataToValidate.title || !dataToValidate.title.trim()) {
            errors.push('Blog title is required');
        }

        if (!dataToValidate.content || !dataToValidate.content.trim()) {
            errors.push('Blog content is required');
        }

        if (!dataToValidate.category || !dataToValidate.category.trim()) {
            errors.push('Blog category is required');
        }

        // Length validations
        if (dataToValidate.title && dataToValidate.title.length > 255) {
            errors.push('Blog title must be less than 255 characters');
        }

        if (dataToValidate.content && dataToValidate.content.length < 10) {
            errors.push('Blog content must be at least 10 characters long');
        }

        if (dataToValidate.content && dataToValidate.content.length > 10000) {
            errors.push('Blog content must be less than 10,000 characters');
        }

        if (dataToValidate.category && dataToValidate.category.length > 100) {
            errors.push('Blog category must be less than 100 characters');
        }

        if (dataToValidate.quote && dataToValidate.quote.length > 500) {
            errors.push('Blog quote must be less than 500 characters');
        }

        // Optional field validations
        if (dataToValidate.quote && dataToValidate.quote.trim() === '') {
            errors.push('Quote cannot be empty if provided');
        }

        // Note: adminId is automatically handled by the backend from the authenticated admin
        // blogImage is handled separately as a file upload

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Download file helper for blog attachments
     * @param {string} fileUrl - URL of the file to download
     * @param {string} fileName - Name for the downloaded file
     */
    async downloadFile(fileUrl, fileName) {
        try {
            const response = await api.get(fileUrl, {
                responseType: 'blob',
            });

            const blob = response.data;
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading file:', error);
            throw new Error('Failed to download file');
        }
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
        return `${baseUrl}/${filePath}`;
    }

    /**
     * Format blog date for display
     * @param {string} dateString - ISO date string
     * @returns {string} Formatted date string
     */
    formatBlogDate(dateString) {
        if (!dateString) return '';
        
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    /**
     * Get blog excerpt for preview
     * @param {string} content - Full blog content
     * @param {number} maxLength - Maximum length of excerpt (default: 150)
     * @returns {string} Blog excerpt
     */
    getBlogExcerpt(content, maxLength = 150) {
        if (!content) return '';
        
        if (content.length <= maxLength) {
            return content;
        }
        
        return content.substring(0, maxLength).trim() + '...';
    }

    /**
     * Format category for display (capitalize first letter, handle multiple words)
     * @param {string} category - Raw category string
     * @returns {string} Formatted category string
     */
    formatCategory(category) {
        if (!category) return '';
        
        return category
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    }

    /**
     * Truncate quote for preview
     * @param {string} quote - Full quote string
     * @param {number} maxLength - Maximum length of quote preview (default: 100)
     * @returns {string} Truncated quote
     */
    truncateQuote(quote, maxLength = 100) {
        if (!quote) return '';
        
        if (quote.length <= maxLength) {
            return quote;
        }
        
        return quote.substring(0, maxLength).trim() + '...';
    }

    /**
     * Prepare blog data for API submission
     * @param {Object} rawData - Raw blog data from form
     * @param {File[]} files - Array of files to upload (optional)
     * @returns {FormData|Object} Prepared data for API submission
     */
    prepareBlogData(rawData, files = []) {
        // Clean and prepare the data
        const cleanData = {
            title: rawData.title?.trim() || '',
            content: rawData.content?.trim() || '',
            category: rawData.category?.trim() || '',
            quote: rawData.quote?.trim() || '',
            // Remove empty quote if not provided
            ...(rawData.quote?.trim() && { quote: rawData.quote.trim() })
        };

        // Remove the quote field if it's empty to avoid sending empty strings
        if (!cleanData.quote) {
            delete cleanData.quote;
        }

        if (files && files.length > 0) {
            // Use FormData for file uploads
            const formData = new FormData();
            
            // Add text fields
            Object.keys(cleanData).forEach(key => {
                if (cleanData[key] !== null && cleanData[key] !== undefined && cleanData[key] !== '') {
                    formData.append(key, cleanData[key]);
                }
            });
            
            // Add files (specifically for blogImage)
            files.forEach((file, index) => {
                if (file) {
                    formData.append('blogImage', file);
                }
            });
            
            return formData;
        } else {
            // Return regular object for JSON submission
            return cleanData;
        }
    }

    /**
     * Get blog statistics
     * @returns {Promise<Object>} Blog statistics including total count, categories, etc.
     */
    async getBlogStats() {
        try {
            const response = await api.get('/blog/stats');
            return response.data;
        } catch (error) {
            console.error('Error fetching blog stats:', error);
            const errorMessage =
                error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                'Failed to fetch blog statistics';
            throw new Error(errorMessage);
        }
    }
}

// Create and export a singleton instance
const blogService = new BlogService();
export default blogService;

// Named exports for individual methods
export const {
    createBlog,
    getAllBlogs,
    getBlogById,
    updateBlog,
    deleteBlog,
    getBlogsByAdmin,
    searchBlogs,
    getBlogsWithPagination,
    getBlogsByCategory,
    getBlogCategories,
    validateBlogData,
    downloadFile,
    getFileUrl,
    formatBlogDate,
    getBlogExcerpt,
    formatCategory,
    truncateQuote,
    prepareBlogData,
    getBlogStats
} = blogService;