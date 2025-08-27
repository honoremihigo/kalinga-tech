import React, { useState, useEffect } from 'react';
import { User, Mail, Save, X } from 'lucide-react';
import Swal from 'sweetalert2';
import adminServiceInstance from '../../../Services/Dispatch/Auth';

const AdminProfile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    names: '',
    email: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Function to get initials from name
  const getInitials = (name) => {
    if (!name) return 'AD';
    const nameParts = name.trim().split(' ');
    return nameParts
      .map(part => part.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };

  // Fetch user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const userData = await adminServiceInstance.getProfile();
        setUser(userData);
        setFormData({
          names: userData.names || '',
          email: userData.email || '',
        });
        setIsLoading(false);
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch profile: ' + error.message,
        });
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Validation functions
  const validateForm = () => {
    const newErrors = {};

    if (!formData.names.trim()) {
      newErrors.names = 'Name is required';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
    setMessage('');
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please correct the errors in the form before submitting.',
      });
      return;
    }

    setIsLoading(true);
    try {
      const updatedProfile = await adminServiceInstance.editProfile(formData);
      setUser(updatedProfile);
      setIsEditing(false);
      setMessage('Profile updated successfully!');
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Profile updated successfully!',
      });
    } catch (error) {
      setMessage('Failed to update profile: ' + error.message);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update profile: ' + error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setFormData({
      names: user.names || '',
      email: user.email || '',
    });
    setErrors({});
    setMessage('');
    setIsEditing(false);
  };

  return (
    <div className=" bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Profile</h1>
          <p className="text-gray-600">Manage your administrative account information</p>
        </div>

        {/* Main Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-10 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black opacity-10"></div>
            <div className="relative z-10 flex items-center space-x-6">
              <div className="w-20 h-20 bg-neutral-50 bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <span className="text-2xl font-bold text-white">{getInitials(user?.names)}</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2 text-gray-100">{user?.names || "Admin"}</h2>
                <p className="text-gray-200 text-base">{user?.email || "Not provided"}</p>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6">
            {isLoading && !user ? (
              <div className="flex flex-col items-center justify-center p-6">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 mb-4"></div>
                <p className="text-gray-600">Loading profile...</p>
              </div>
            ) : (
              <>
                {message && (
                  <div
                    className={`p-3 rounded-lg mb-4 text-center ${
                      message.includes('successfully')
                        ? 'bg-blue-50 text-blue-600'
                        : 'bg-red-50 text-red-600'
                    }`}
                  >
                    {message}
                  </div>
                )}

                <div className="space-y-4">
                  {/* Names */}
                  <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center">
                        <User className="w-4 h-4 mr-2 text-blue-600" />
                        Full Name
                      </label>
                      {isEditing ? (
                        <div>
                          <input
                            type="text"
                            name="names"
                            value={formData.names}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              errors.names ? 'border-red-500' : 'border-blue-200'
                            }`}
                            placeholder="Enter your full name"
                            disabled={isLoading}
                          />
                          {errors.names && (
                            <p className="mt-1 text-sm text-red-600">{errors.names}</p>
                          )}
                        </div>
                      ) : (
                        <p className="text-gray-600 font-semibold">{user?.names || 'N/A'}</p>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center">
                        <Mail className="w-4 h-4 mr-2 text-blue-600" />
                        Email Address
                      </label>
                      {isEditing ? (
                        <div>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              errors.email ? 'border-red-500' : 'border-blue-200'
                            }`}
                            placeholder="Enter your email"
                            disabled={isLoading}
                          />
                          {errors.email && (
                            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                          )}
                        </div>
                      ) : (
                        <p className="text-gray-600 font-semibold">{user?.email || 'N/A'}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex justify-end space-x-3">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className={`flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                          isLoading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {isLoading ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white mr-2"></div>
                            Saving...
                          </div>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Save
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleCancel}
                        disabled={isLoading}
                        className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Edit Profile
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Additional Info Card */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-center text-gray-600">
            <User className="w-5 h-5 mr-2 text-blue-600" />
            <p className="text-sm">
              Update your admin profile information to keep your account details current.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;