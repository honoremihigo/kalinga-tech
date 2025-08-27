import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Building2, User, FileText, Check, Upload, X } from 'lucide-react';
import Swal from 'sweetalert2';
import DashboardNavbar from '../../../components/DashboardNavbar'
import memberService from '../../../Services/Landing/MemberService';
import { useNavigate } from 'react-router-dom';
const MemberRegistrationForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate =useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    district: '',
    city: '',
    country: '',
    expected_monthly_rides: '',
    ride_purposes: [],
    custom_ride_purpose: '',
    profile_image: null
  });
  const [errors, setErrors] = useState({});
  const [dragOver, setDragOver] = useState({ profile_image: false });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    { number: 1, title: 'Information', icon: Building2 },
    { number: 2, title: 'Contact & Address', icon: User },
    { number: 3, title: 'Service Details', icon: FileText }
  ];

  const rideVolumes = [
    '1-25',
    '26-50',
    '51-100',
    '101-200',
    '201-500',
    '500+'
  ];

  const [ridePurposeOptions, setRidePurposeOptions] = useState([
    'General ride-hailing and transportation services',
    'Medical transport',
    'Compassionate home care transportation solutions',
    'Employee commuting',
    'Client meetings',
    'Airport taxi and Transfers services',
    'Business events',
    'Delivery services',
  ]);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

  const validateField = (field, value) => {
    switch (field) {
      case 'name':
        return value.trim().length >= 2 ? '' : 'Name must be at least 2 characters';
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Invalid email format';
      case 'phone':
        return /^\+?\d{10,14}$/.test(value.replace(/\s/g, '')) ? '' : 'Invalid phone number (10-14 digits)';
      case 'street':
        return value.trim().length >= 3 ? '' : 'Street address must be at least 3 characters';
      case 'district':
        return value.trim().length >= 2 ? '' : 'District must be at least 2 characters';
      case 'city':
        return value.trim().length >= 2 ? '' : 'City must be at least 2 characters';
      case 'country':
        return value.trim().length >= 2 ? '' : 'Country must be at least 2 characters';
      case 'expected_monthly_rides':
        return rideVolumes.includes(value) ? '' : 'Please select a valid ride volume';
      case 'ride_purposes':
        return value.length > 0 ? '' : 'Please select at least one ride purpose';
      default:
        return '';
    }
  };

  const validateFileSize = (file) => {
    if (file && file.size > MAX_FILE_SIZE) {
      return `File size exceeds 5MB limit`;
    }
    return '';
  };

  const validateStep = () => {
    const newErrors = {};
    if (currentStep === 1) {
      newErrors.name = validateField('name', formData.name);
      newErrors.email = validateField('email', formData.email);
      newErrors.phone = validateField('phone', formData.phone);
    } else if (currentStep === 2) {
      newErrors.street = validateField('street', formData.street);
      newErrors.district = validateField('district', formData.district);
      newErrors.city = validateField('city', formData.city);
      newErrors.country = validateField('country', formData.country);
    } else if (currentStep === 3) {
      newErrors.expected_monthly_rides = validateField('expected_monthly_rides', formData.expected_monthly_rides);
      newErrors.ride_purposes = validateField('ride_purposes', formData.ride_purposes);
      if (formData.profile_image) {
        newErrors.profile_image = validateFileSize(formData.profile_image);
      }
    }
    setErrors(newErrors);
    return Object.values(newErrors).every(error => error === '');
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setErrors(prev => ({
      ...prev,
      [field]: validateField(field, value)
    }));
  };

  const handleArrayChange = (field, value, checked) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
    setErrors(prev => ({
      ...prev,
      [field]: validateField(field, checked ? [...formData[field], value] : formData[field].filter(item => item !== value))
    }));
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      const sizeError = validateFileSize(file);
      if (sizeError) {
        Swal.fire({
          icon: 'error',
          title: 'File Too Large',
          text: sizeError,
        });
        return;
      }
      setFormData(prev => ({
        ...prev,
        [fieldName]: file
      }));
      setErrors(prev => ({
        ...prev,
        [fieldName]: validateField(fieldName, file)
      }));
    }
  };

  const handleDrop = (e, fieldName) => {
    e.preventDefault();
    setDragOver(prev => ({ ...prev, [fieldName]: false }));
    const file = e.dataTransfer.files[0];
    if (file && fieldName === 'profile_image' && file.type.startsWith('image/')) {
      const sizeError = validateFileSize(file);
      if (sizeError) {
        Swal.fire({
          icon: 'error',
          title: 'File Too Large',
          text: sizeError,
        });
        return;
      }
      setFormData(prev => ({
        ...prev,
        [fieldName]: file
      }));
      setErrors(prev => ({
        ...prev,
        [fieldName]: validateField(fieldName, file)
      }));
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Invalid File',
        text: 'Please upload a valid image file.',
      });
    }
  };

  const handleDragOver = (e, fieldName) => {
    e.preventDefault();
    setDragOver(prev => ({ ...prev, [fieldName]: true }));
  };

  const handleDragLeave = (e, fieldName) => {
    e.preventDefault();
    setDragOver(prev => ({ ...prev, [fieldName]: false }));
  };

  const handleAddCustomPurpose = () => {
    if (formData.custom_ride_purpose.trim()) {
      setRidePurposeOptions(prev => [...prev, formData.custom_ride_purpose.trim()]);
      handleArrayChange('ride_purposes', formData.custom_ride_purpose.trim(), true);
      handleInputChange('custom_ride_purpose', '');
    }
  };

  const nextStep = () => {
    if (validateStep() && currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else if (!validateStep()) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please correct the errors in the form before proceeding.',
      });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep()) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please correct the errors in the form before submitting.',
      });
      return;
    }

    // Validate using MemberService's validateMemberData
    const validationResult = memberService.validateMemberData({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      street: formData.street,
      district: formData.district,
      city: formData.city,
      country: formData.country,
      expectedMonthlyRides: formData.expected_monthly_rides,
      ridePurposes: formData.ride_purposes
    });

    if (!validationResult.isValid) {
      setErrors(validationResult.errors);
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please correct the errors in the form before submitting.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const memberData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        street: formData.street,
        district: formData.district,
        city: formData.city,
        country: formData.country,
        expectedMonthlyRides: formData.expected_monthly_rides,
        ridePurposes: formData.ride_purposes
      };

      const response = await memberService.createMember(memberData, formData.profile_image);
    Swal.fire({
  icon: 'success',
  title: 'Registration Received',
  text: 'Your submission was successful. You will be notified once it has been reviewed and approved.',
      }).then(()=>{

      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        phone: '',
        street: '',
        district: '',
        city: '',
        country: '',
        expected_monthly_rides: '',
        ride_purposes: [],
        custom_ride_purpose: '',
        profile_image: null
      });
      setCurrentStep(1)

     navigate('/')
      

      });

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Submission Error',
        text: error.message || 'An error occurred while submitting the form.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Name *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Enter name"
          disabled={isSubmitting}
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email *
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="example@company.com"
          disabled={isSubmitting}
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phone *
        </label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="+250788123456"
          disabled={isSubmitting}
        />
        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg mb-4">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Address</h3>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Street Address *
        </label>
        <input
          type="text"
          value={formData.street}
          onChange={(e) => handleInputChange('street', e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${errors.street ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="KG 15 Ave, Nyarugenge"
          disabled={isSubmitting}
        />
        {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            District *
          </label>
          <input
            type="text"
            value={formData.district}
            onChange={(e) => handleInputChange('district', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${errors.district ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Nyarugenge"
            disabled={isSubmitting}
        />
          {errors.district && <p className="text-red-500 text-xs mt-1">{errors.district}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City *
          </label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Kigali"
            disabled={isSubmitting}
        />
          {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Country *
          </label>
          <input
            type="text"
            value={formData.country}
            onChange={(e) => handleInputChange('country', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${errors.country ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter your country"
            disabled={isSubmitting}
        />
          {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Expected Monthly Rides *
        </label>
        <select
          value={formData.expected_monthly_rides}
          onChange={(e) => handleInputChange('expected_monthly_rides', e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${errors.expected_monthly_rides ? 'border-red-500' : 'border-gray-300'}`}
          disabled={isSubmitting}
        >
          <option value="">Select ride volume</option>
          {rideVolumes.map(volume => (
            <option key={volume} value={volume}>{volume} rides</option>
          ))}
        </select>
        {errors.expected_monthly_rides && <p className="text-red-500 text-xs mt-1">{errors.expected_monthly_rides}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Ride Purposes * (Select all that apply)
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {ridePurposeOptions.map(purpose => (
            <label key={purpose} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.ride_purposes.includes(purpose)}
                onChange={(e) => handleArrayChange('ride_purposes', purpose, e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                disabled={isSubmitting}
              />
              <span className="text-sm text-gray-700">{purpose}</span>
            </label>
          ))}
          <div className="flex space-x-2">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom Ride Purpose
              </label>
              <input
                type="text"
                value={formData.custom_ride_purpose}
                onChange={(e) => handleInputChange('custom_ride_purpose', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                placeholder="Enter custom ride purpose"
                disabled={isSubmitting}
              />
            </div>
            <button
              type="button"
              onClick={handleAddCustomPurpose}
              className="mt-8 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              disabled={!formData.custom_ride_purpose.trim() || isSubmitting}
            >
              Add
            </button>
          </div>
        </div>
        {errors.ride_purposes && <p className="text-red-500 text-xs mt-1">{errors.ride_purposes}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Profile Image
        </label>
        <div 
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${dragOver.profile_image ? 'border-blue-400 bg-blue-50' : 'border-gray-300'}`}
          onDragOver={(e) => handleDragOver(e, 'profile_image')}
          onDragLeave={(e) => handleDragLeave(e, 'profile_image')}
          onDrop={(e) => handleDrop(e, 'profile_image')}
        >
          <input
            type="file"
            onChange={(e) => handleFileChange(e, 'profile_image')}
            accept="image/*"
            className="hidden"
            id="profile-image"
            disabled={isSubmitting}
          />
          <label htmlFor="profile-image" className="cursor-pointer">
            {formData.profile_image ? (
              <div className="relative">
                <img
                  src={URL.createObjectURL(formData.profile_image)}
                  alt="Profile preview"
                  className="w-32 h-32 object-cover rounded-lg mx-auto mb-2"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setFormData(prev => ({ ...prev, profile_image: null }));
                    setErrors(prev => ({ ...prev, profile_image: '' }));
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  disabled={isSubmitting}
                >
                  <X className="w-4 h-4" />
                </button>
                <p className="text-blue-600 font-medium">{formData.profile_image.name}</p>
                <p className="text-xs text-gray-500 mt-1">Click or drag to change image</p>
              </div>
            ) : (
              <div className="text-gray-500">
                <Upload className="w-12 h-12 mx-auto mb-2 text-blue-500" />
                <p className="text-sm">Click or drag to upload logo/image</p>
                <p className="text-xs mt-1">JPG, PNG, GIF (Max 5MB)</p>
              </div>
            )}
          </label>
        </div>
        {errors.profile_image && <p className="text-red-500 text-xs mt-1">{errors.profile_image}</p>}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 space-y-4">
      <DashboardNavbar />
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Join Abyride For Business
          </h1>
          <p className="text-gray-600">
            Register to access our transportation services
          </p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;
              
              return (
                <div key={step.number} className="flex items-center">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-colors ${
                    isCompleted ? 'bg-blue-600 border-blue-600 text-white' :
                    isActive ? 'border-blue-600 text-blue-600 bg-white' :
                    'border-gray-300 text-gray-400 bg-white'
                  }`}>
                    {isCompleted ? <Check className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                  </div>
                  <div className="ml-3 hidden md:block">
                    <p className={`text-sm font-medium ${
                      isActive || isCompleted ? 'text-blue-600' : 'text-gray-500'
                    }`}>
                      Step {step.number}
                    </p>
                    <p className={`text-xs ${
                      isActive || isCompleted ? 'text-blue-500' : 'text-gray-400'
                    }`}>
                      {step.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`hidden md:block w-16 h-0.5 ml-4 ${
                      currentStep > step.number ? 'bg-blue-600' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {steps[currentStep - 1].title}
            </h2>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 3) * 100}%` }}
              />
            </div>
          </div>

          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}

          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={prevStep}
              disabled={currentStep === 1 || isSubmitting}
              className={`flex items-center px-6 py-3 rounded-lg transition-colors ${
                currentStep === 1 || isSubmitting
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </button>

            {currentStep < 3 ? (
              <button
                onClick={nextStep}
                disabled={isSubmitting}
                className={`flex items-center px-6 py-3 rounded-lg transition-colors ${
                  isSubmitting
                    ? 'bg-blue-400 text-white cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`flex items-center px-6 py-3 rounded-lg transition-colors ${
                  isSubmitting
                    ? 'bg-blue-400 text-white cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Registration
                    <Check className="w-4 h-4 ml-2" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberRegistrationForm;