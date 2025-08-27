import React, { useState, useEffect } from 'react';
import { X, ClipboardList, User, MapPin, Image, AlertCircle, Upload } from 'lucide-react';
import { API_URL } from '../../../../api/api';
import driverManagementService from '../../../../Services/Dispatch/DriverManagement';

const UpsertFoundPropertyModal = ({ isOpen, onClose, onSubmit, property, isLoading, title }) => {
  const [formData, setFormData] = useState({
    itemDescription: '',
    locationFound: '',
    driverId: ''
  });
  const [drivers,setDrivers] =  useState([])
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading,setLoading] = useState(true)

  useEffect(()=>{
    const getDrivers = async ()=>{
        setLoading(true)
        try {
            const response =  await driverManagementService.getDrivers()
           setDrivers(response)
            
        } catch (error) {
            console.log(error.message);
            
        }
        finally{
            setLoading(false)
        }
    }

    getDrivers()
    
  },[isOpen,property])

  useEffect(() => {
    if (isOpen) {
      if (property) {
        // Edit mode
        setFormData({
          itemDescription: property.itemDescription || '',
          locationFound: property.locationFound || '',
          driverId: property.driverId ? String(property.driverId) : ''
        });
        setPreviewImage(property.imageUrl ? `${API_URL}${property.imageUrl}` :  null);
      } else {
        // Add mode
        setFormData({
          itemDescription: '',
          locationFound: '',
          driverId: ''
        });
        setPreviewImage(null);
      }
      setImage(null);
      setErrors({});
    }
  }, [isOpen, property]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          image: 'Image size must be less than 5MB'
        }));
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          image: 'Please select a valid image file (JPG/PNG)'
        }));
        return;
      }
      
      setImage(file);
      setErrors(prev => ({
        ...prev,
        image: ''
      }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setPreviewImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.itemDescription.trim() || formData.itemDescription.trim().length < 3) {
      newErrors.itemDescription = 'Description must be at least 3 characters long';
    }
    if (!formData.locationFound.trim()) {
      newErrors.locationFound = 'Location found is required';
    }
    if (formData.driverId && isNaN(parseInt(formData.driverId))) {
      newErrors.driverId = 'Driver ID must be a valid number';
    }
    if (!property && !image) {
      newErrors.image = 'Image is required for new properties';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData, image);
    }
  };

  if (!isOpen) return null;

  if(loading){
    return
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ClipboardList className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[75vh] overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Image Section */}
            <div className="flex flex-col items-center gap-4 p-6 bg-gray-50 rounded-lg">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl overflow-hidden">
                {previewImage ? (
                  <img 
                    src={previewImage} 
                    alt="Property preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image size={24} />
                )}
              </div>
              <div>
                <label className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <Upload size={16} />
                  Choose Property Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                <p className="text-sm text-gray-500 mt-2">Max 5MB, JPG/PNG only{!property ? ' (Required)' : ''}</p>
                {errors.image && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.image}
                  </p>
                )}
              </div>
            </div>

            {/* Property Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin size={16} className="inline mr-2" />
                  Location Found *
                </label>
                <input
                  type="text"
                  name="locationFound"
                  value={formData.locationFound}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.locationFound ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter location where item was found"
                />
                {errors.locationFound && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.locationFound}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User size={16} className="inline mr-2" />
                  Driver ID
                </label>
                 <select
                  name="driverId"
                  value={formData.driverId}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.driverId ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="" selected>Choose driver ID </option>
                  {
                    drivers.map((driver,key)=>(
                        <option value={driver.id} key={key}> {key + 1}. {driver.firstName} {driver.lastName}</option>
                    ))
                  }
                </select>
              
                {errors.driverId && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.driverId}
                  </p>
                )}
              </div>
            </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <ClipboardList size={16} className="inline mr-2" />
                  Item Description *
                </label>
                <textarea
                  name="itemDescription"
                  value={formData.itemDescription}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.itemDescription ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Describe the found item"
                  rows="4"
                />
                {errors.itemDescription && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.itemDescription}
                  </p>
                )}
              </div>
              
              
            {/* Footer Actions */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {property ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  property ? 'Update Property' : 'Create Property'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpsertFoundPropertyModal;