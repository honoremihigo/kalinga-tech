import api from '../../api/api'; // Your axios instance

/**
 * Member Service - Frontend API integration for member operations
 * Handles all CRUD operations and file uploads for members
 */
class MemberService {
  
  /**
   * Create a new member with profile image
   * @param {Object} memberData - Member information
   * @param {File} profileImage - Profile image file
   * @returns {Promise<Object>} Created member data
   */
  async createMember(memberData, profileImage) {
    try {
      const formData = new FormData();
      
      // Append member data to FormData
      Object.keys(memberData).forEach(key => {
        if (memberData[key] !== null && memberData[key] !== undefined) {
          // Handle JSON fields like ridePurposes
          if (typeof memberData[key] === 'object') {
            formData.append(key, JSON.stringify(memberData[key]));
          } else {
            formData.append(key, memberData[key]);
          }
        }
      });
      
      // Append profile image if provided
      if (profileImage) {
        formData.append('profile_image', profileImage);
      }

      const response = await api.post('/members/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get all members
   * @returns {Promise<Array>} List of all members
   */
  async getAllMembers() {
    try {
      const response = await api.get('/members');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get a specific member by ID
   * @param {string} memberId - Member ID
   * @returns {Promise<Object>} Member data
   */
  async getMemberById(memberId) {
    try {
      const response = await api.get(`/members/${memberId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update a member
   * @param {string} memberId - Member ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated member data
   */
  async updateMember(memberId, updateData) {
    try {
      const response = await api.put(`/members/${memberId}`, updateData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Delete a member
   * @param {string} memberId - Member ID
   * @returns {Promise<Object>} Success message
   */
  async deleteMember(memberId) {
    try {
      const response = await api.delete(`/members/${memberId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Search members by criteria
   * @param {Object} searchCriteria - Search parameters
   * @returns {Promise<Array>} Filtered members
   */
  async searchMembers(searchCriteria) {
    try {
      const response = await api.get('/members', {
        params: searchCriteria
      });
      
      // Filter on frontend if backend doesn't support search
      let members = response.data.data || response.data;
      
      if (searchCriteria.name) {
        members = members.filter(member => 
          member.name.toLowerCase().includes(searchCriteria.name.toLowerCase())
        );
      }
      
      if (searchCriteria.email) {
        members = members.filter(member => 
          member.email.toLowerCase().includes(searchCriteria.email.toLowerCase())
        );
      }
      
      if (searchCriteria.city) {
        members = members.filter(member => 
          member.city.toLowerCase().includes(searchCriteria.city.toLowerCase())
        );
      }
      
      return { data: members, message: 'Members filtered successfully' };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get members by location
   * @param {string} city - City name
   * @param {string} district - District name (optional)
   * @returns {Promise<Array>} Members in the specified location
   */
  async getMembersByLocation(city, district = null) {
    try {
      const response = await api.get('/members');
      let members = response.data.data || response.data;
      
      members = members.filter(member => {
        const cityMatch = member.city.toLowerCase() === city.toLowerCase();
        const districtMatch = district ? 
          member.district.toLowerCase() === district.toLowerCase() : true;
        return cityMatch && districtMatch;
      });
      
      return { data: members, message: 'Members retrieved by location' };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get member statistics
   * @returns {Promise<Object>} Member statistics
   */
  async getMemberStats() {
    try {
      const response = await api.get('/members');
      const members = response.data.data || response.data;
      
      const stats = {
        totalMembers: members.length,
        membersByCity: {},
        membersByDistrict: {},
        averageExpectedRides: 0,
        ridePurposesDistribution: {}
      };
      
      let totalExpectedRides = 0;
      
      members.forEach(member => {
        // Count by city
        stats.membersByCity[member.city] = (stats.membersByCity[member.city] || 0) + 1;
        
        // Count by district
        stats.membersByDistrict[member.district] = (stats.membersByDistrict[member.district] || 0) + 1;
        
        // Calculate average expected rides
        const expectedRides = parseInt(member.expectedMonthlyRides) || 0;
        totalExpectedRides += expectedRides;
        
        // Analyze ride purposes
        if (member.ridePurposes) {
          const purposes = typeof member.ridePurposes === 'string' ? 
            JSON.parse(member.ridePurposes) : member.ridePurposes;
          
          if (Array.isArray(purposes)) {
            purposes.forEach(purpose => {
              stats.ridePurposesDistribution[purpose] = (stats.ridePurposesDistribution[purpose] || 0) + 1;
            });
          }
        }
      });
      
      stats.averageExpectedRides = members.length > 0 ? 
        Math.round(totalExpectedRides / members.length) : 0;
      
      return { data: stats, message: 'Member statistics calculated' };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Validate member data before submission
   * @param {Object} memberData - Member data to validate
   * @returns {Object} Validation result
   */
  validateMemberData(memberData) {
    const errors = {};
    
    // Required fields validation
    if (!memberData.name || memberData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters long';
    }
    
    if (!memberData.email || !this.isValidEmail(memberData.email)) {
      errors.email = 'Please provide a valid email address';
    }
    
    if (!memberData.phone || memberData.phone.trim().length < 10) {
      errors.phone = 'Phone number must be at least 10 digits';
    }
    
    if (!memberData.street || memberData.street.trim().length < 3) {
      errors.street = 'Street address is required';
    }
    
    if (!memberData.district || memberData.district.trim().length < 2) {
      errors.district = 'District is required';
    }
    
    if (!memberData.city || memberData.city.trim().length < 2) {
      errors.city = 'City is required';
    }
    
    if (!memberData.country || memberData.country.trim().length < 2) {
      errors.country = 'Country is required';
    }
    
    if (!memberData.expectedMonthlyRides || parseInt(memberData.expectedMonthlyRides) < 1) {
      errors.expectedMonthlyRides = 'Expected monthly rides must be at least 1';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean} Is valid email
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }


  /**
   * Handle API errors consistently
   * @param {Error} error - Error object
   * @returns {Error} Formatted error
   */
  handleError(error) {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || 'An error occurred';
      const status = error.response.status;
      return new Error(`${status}: ${message}`);
    } else if (error.request) {
      // Request was made but no response received
      return new Error('Network error: Unable to connect to server');
    } else {
      // Something else happened
      return new Error(error.message || 'An unexpected error occurred');
    }
  }
}

// Create and export a singleton instance
const memberService = new MemberService();
export default memberService;

// Export the class as well for testing or custom instances
export { MemberService };