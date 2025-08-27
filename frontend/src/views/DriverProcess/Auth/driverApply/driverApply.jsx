import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Check, Upload, User, Car, FileText, Calendar, MapPin, Phone, Mail, CreditCard, Camera, AlertCircle } from 'lucide-react';
import DashboardNavbar from '../../../../components/DashboardNavbar';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import { FiUser, FiCalendar, FiMail, FiPhone, FiMapPin, FiAlertCircle } from 'react-icons/fi';
import { FiCreditCard, FiAward, FiGlobe, FiClock, FiBriefcase } from 'react-icons/fi';
const countries = [
  "Afghanistan", "Albania", "Algeria", /* ... add all countries ... */ "Zimbabwe"
];
import Swal from 'sweetalert2';
import { submitDriverApplication } from '../../../../Services/Landing/driverApplicationService'; // adjust path as needed
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


import frontimage from '../../../../assets/sample/front.jpg';
import backimage from '../../../../assets/sample/back.jpg';
import leftimage from '../../../../assets/sample/left-side.jpg';
import rightimage from '../../../../assets/sample/right.jpg';
import dashboardImage from '../../../../assets/sample/dashboard.jpg';
import backSeatsImage from '../../../../assets/sample/back-seats.jpg';
import frontSeatsImage from '../../../../assets/sample/front-seats.jpg';
import trunkImage from '../../../../assets/sample/trunk.jpg';



import axios from 'axios';
import { toast } from 'react-toastify';

const usStates = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", 
  "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", 
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", 
  "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", 
  "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", 
  "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", 
  "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];

const languages = [
  "English", "Spanish", "French", "German", "Mandarin", "Hindi", "Arabic", 
  "Portuguese", "Russian", "Japanese", "Italian", "Korean", "Dutch", "Swedish"
];

const DriverApplicationForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [nationalitySuggestions, setNationalitySuggestions] = useState([]);
  const [showNationalitySuggestions, setShowNationalitySuggestions] = useState(false);
const [stateSuggestions, setStateSuggestions] = useState([]);
  const [showStateSuggestions, setShowStateSuggestions] = useState(false);
  const [languageSuggestions, setLanguageSuggestions] = useState([]);
  const [showLanguageSuggestions, setShowLanguageSuggestions] = useState(false);
  const stateInputRef = useRef(null);
  const languageInputRef = useRef(null);
   const [vinLoading, setVinLoading] = useState(false);
  const navigate = useNavigate();

  const handleStateChange = (e) => {
    const value = e.target.value;
    handleInputChange('licenseIssuedIn', value);
    
    if (value.length > 1) {
      const filtered = usStates.filter(state => 
        state.toLowerCase().includes(value.toLowerCase())
      );
      setStateSuggestions(filtered);
      setShowStateSuggestions(true);
    } else {
      setShowStateSuggestions(false);
    }
  };

  const handleLanguageChange = (e) => {
    const value = e.target.value;
    handleInputChange('languages', value);
    
    if (value.length > 1) {
      const filtered = languages.filter(lang => 
        lang.toLowerCase().includes(value.toLowerCase())
      );
      setLanguageSuggestions(filtered);
      setShowLanguageSuggestions(true);
    } else {
      setShowLanguageSuggestions(false);
    }
  };

  const selectState = (state) => {
    handleInputChange('licenseIssuedIn', state);
    setShowStateSuggestions(false);
    stateInputRef.current.focus();
  };

  const selectLanguage = (language) => {
    handleInputChange('languages', language);
    setShowLanguageSuggestions(false);
    languageInputRef.current.focus();
  };


  const [formData, setFormData] = useState({
    // Driver data
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    nationality: '',
    phoneNumber: '',
    email: '',
    address: '',
    emergencyContactName: '',
    emergencyContactNumber: '',
    bankAccountNumber: '',
    licenseId: '',
    licenseExpiryDate: '',
    yearsOfExperience: '',
    languages: '',
    previousEmployment: '',
    availabilityToStart: '',
    licenseIssuedIn: '',
    
    // Document fields
    nationalIdOrPassport: null,
    policeClearanceCertificate: null,
    proofOfAddress: null,
    drivingCertificate: null,
    workPermitOrVisa: null,
    drugTestReport: null,
    employmentReferenceLetter: null,
    bankStatementFile: null,
    
    // Vehicle data
    vinNumber: '',
    make: '',
    model: '',
    year: '',
    plateNumber: '',
    color: '',
    registrationState: '',
    registrationDate: '',
    expiryDate: '',
    insuranceNumber: '',
    insuranceCompany: '',
    insuranceExpiry: '',
    numberOfDoors: '',
    seatingCapacity: '',
    
    // Vehicle photos
    exteriorPhoto1: null,
    exteriorPhoto2: null,
    exteriorPhoto3: null,
    exteriorPhoto4: null,
    interiorPhoto1: null,
    interiorPhoto2: null,
    interiorPhoto3: null,
    interiorPhoto4: null,
    
    // History
    serviceHistory: '',
    accidentHistory: ''
  });

    // VIN Decoding Function
  const handleVinDecode = async (vin) => {
    if (!vin || vin.length < 17) return;
    
    setVinLoading(true);
    try {
      const response = await axios.get(`https://api.carmd.com/v3.0/decode?vin=${vin}`, {
        headers: {
          'content-type': 'application/json',
          authorization: 'Basic ZTVhNWIyZTEtYzYzMC00ZmI5LTgwM2QtODM3ZDRlZmI5YjYy',
          'partner-token': 'd199f281ecd9409bb36c49c5b2d9fd50',
        },
      });

      if (response.data && response.data.data) {
        const vehicleData = response.data.data;
        setFormData(prev => ({
          ...prev,
          make: vehicleData.make || prev.make,
          model: vehicleData.model || prev.model,
          year: vehicleData.year || prev.year,
        }));
        toast.success('Vehicle information auto-filled from VIN');
      }
    } catch (err) {
      console.error('VIN decode error:', err);
      toast.error('Failed to decode VIN. Please enter vehicle details manually.');
    } finally {
      setVinLoading(false);
    }
  };

  const notifyInfo = (message) => {
    toast.info(message);
  };

    const handleNationalityChange = (e) => {
    const value = e.target.value;
    handleInputChange('nationality', value);
    
    if (value.length > 1) {
      const filtered = countries.filter(country => 
        country.toLowerCase().includes(value.toLowerCase())
      );
      setNationalitySuggestions(filtered);
      setShowNationalitySuggestions(true);
    } else {
      setShowNationalitySuggestions(false);
    }
  };

  const selectNationality = (country) => {
    handleInputChange('nationality', country);
    setShowNationalitySuggestions(false);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  

  const steps = [
    {
      title: 'Welcome to Abyride',
      subtitle: 'Driver Application Process',
      icon: <User className="w-8 h-8" />
    },
    {
      title: 'Personal Information',
      subtitle: 'Basic details about you',
      icon: <User className="w-8 h-8" />
    },
  
    {
      title: 'License & Experience',
      subtitle: 'Driving credentials',
      icon: <FileText className="w-8 h-8" />
    },
    {
      title: 'Documents Upload',
      subtitle: 'Required documents',
      icon: <Upload className="w-8 h-8" />
    },
    {
      title: 'Vehicle Information',
      subtitle: 'Your vehicle details',
      icon: <Car className="w-8 h-8" />
    },
    {
      title: 'Vehicle Photos',
      subtitle: 'Upload vehicle images',
      icon: <Camera className="w-8 h-8" />
    },
    {
      title: 'Review & Submit',
      subtitle: 'Final review',
      icon: <Check className="w-8 h-8" />
    }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (field, event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        [field]: file
      }));
    }
  };

const submitToBackend = async () => {
  setIsSubmitting(true);

  try {
    await submitDriverApplication(formData);

    Swal.fire({
      icon: 'success',
      title: 'Submitted!',
      text: 'Application submitted successfully!',
      confirmButtonColor: '#3085d6',
    });
     navigate('/application-pending');
  } catch (error) {
    console.error('Error:', error);

    Swal.fire({
      icon: 'error',
      title: 'Submission Failed',
      text: 'Error submitting application. Please try again.',
      confirmButtonColor: '#d33',
    });

      // ✅ Redirect to application-pending page
  navigate('/application-pending');
  } finally {
    setIsSubmitting(false);
  }
};
  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const [selectedDate, setSelectedDate] = useState(null);

  const renderStepContent = () => {
    switch (currentStep) {
    case 0:
  return (
    <div className="text-center space-y-8 p-8 max-w-8xl mx-auto">
   

      {/* Application Process Guide */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 text-left shadow-lg border border-blue-100">
        <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent mb-6">
          Application Process Guide:
        </h3>
        <ul className="space-y-4">
          <li className="flex items-start group">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-1 mr-4 mt-0.5 shadow-md">
              <Check className="w-4 h-4 text-white" />
            </div>
            <span className="text-gray-700 text-sm group-hover:text-gray-900 transition-colors">
              Complete personal information and contact details
            </span>
          </li>
          <li className="flex items-start group">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-1 mr-4 mt-0.5 shadow-md">
              <Check className="w-4 h-4 text-white" />
            </div>
            <span className="text-gray-700 text-sm group-hover:text-gray-900 transition-colors">
              Provide driving license and experience information
            </span>
          </li>
          <li className="flex items-start group">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-1 mr-4 mt-0.5 shadow-md">
              <Check className="w-4 h-4 text-white" />
            </div>
            <span className="text-gray-700 text-sm group-hover:text-gray-900 transition-colors">
              Upload required documents (ID, license, etc.)
            </span>
          </li>
          <li className="flex items-start group">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-1 mr-4 mt-0.5 shadow-md">
              <Check className="w-4 h-4 text-white" />
            </div>
            <span className="text-gray-700 text-sm group-hover:text-gray-900 transition-colors">
              Add vehicle information and photos
            </span>
          </li>
          <li className="flex items-start group">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-1 mr-4 mt-0.5 shadow-md">
              <Check className="w-4 h-4 text-white" />
            </div>
            <span className="text-gray-700 text-sm group-hover:text-gray-900 transition-colors">
              Review and submit your application
            </span>
          </li>
        </ul>
      </div>

      {/* Important Notice */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-center mb-3">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-full p-2 mr-3 shadow-md">
            <AlertCircle className="w-5 h-5 text-white" />
          </div>
          <span className="text-amber-800 font-semibold text-sm">Important Notice</span>
        </div>
        <p className="text-amber-700 text-sm text-center">
          Please have all required documents ready before starting the application.
        </p>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mt-8 pt-6">
        <button
          disabled
          className="bg-gray-100 text-gray-400 px-8 py-3 rounded-xl cursor-not-allowed text-sm font-medium shadow-sm"
        >
          Previous
        </button>
        <button
          onClick={() => setCurrentStep(currentStep + 1)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg text-sm font-medium"
        >
          Get Started
        </button>
      </div>
    </div>
  );


      case 1:
        return (
           <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Personal Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First Name */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Name *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiUser className="text-gray-400" />
            </div>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all"
              placeholder="Enter your first name"
            />
          </div>
        </div>

        {/* Last Name */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Name *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiUser className="text-gray-400" />
            </div>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all"
              placeholder="Enter your last name"
            />
          </div>
        </div>

        {/* Date of Birth */}
<div className="grid">
  
    <label className="text-sm text-white">Native Date Picker</label>
    <input
      type="date"
      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
      placeholder
      className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md"
    />


</div>



        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gender *
          </label>
          <select
            value={formData.gender}
            onChange={(e) => handleInputChange('gender', e.target.value)}
            className="w-full pl-3 pr-10 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all appearance-none"
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </div>

        {/* Nationality with autocomplete */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nationality *
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.nationality}
              onChange={handleNationalityChange}
              onFocus={() => formData.nationality.length > 1 && setShowNationalitySuggestions(true)}
              onBlur={() => setTimeout(() => setShowNationalitySuggestions(false), 200)}
              className="w-full pl-3 pr-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all"
              placeholder="Start typing country name"
            />
            {showNationalitySuggestions && nationalitySuggestions.length > 0 && (
              <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                {nationalitySuggestions.map((country, index) => (
                  <li 
                    key={index}
                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                    onClick={() => selectNationality(country)}
                  >
                    {country}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Phone Number with country picker */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number *
          </label>
          <PhoneInput
            defaultCountry="us"
            value={formData.phoneNumber}
            onChange={(phone) => handleInputChange('phoneNumber', phone)}
            inputClassName="w-full pl-10 pr-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all"
            countrySelectorStyleProps={{
              buttonClassName: "px-3 py-2 border-r border-gray-200",
              dropdownStyleProps: {
                className: "z-10 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg"
              }
            }}
          />
        </div>
{/* Email */}
<div className="relative md:col-span-1">
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Email Address *
  </label>
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <FiMail className="text-gray-400" />
    </div>
    <input
      type="email"
      value={formData.email}
      onChange={(e) => handleInputChange('email', e.target.value)}
      className="w-full pl-10 pr-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all"
      placeholder="your.email@example.com"
    />
  </div>
</div>

{/* Address */}
<div className="relative md:col-span-1">
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Address *
  </label>
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <FiMapPin className="text-gray-400" />
    </div>
    <input
      type="text"
      value={formData.address}
      onChange={(e) => handleInputChange('address', e.target.value)}
      className="w-full pl-10 pr-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all"
      placeholder="Street, City, Postal Code, Country"
    />
  </div>
</div>

        {/* Emergency Contact Name */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Emergency Contact Name *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiUser className="text-gray-400" />
            </div>
            <input
              type="text"
              value={formData.emergencyContactName}
              onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all"
              placeholder="Contact's full name"
            />
          </div>
        </div>

        {/* Emergency Contact Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Emergency Contact Number *
          </label>
          <PhoneInput
            defaultCountry="us"
            value={formData.emergencyContactNumber}
            onChange={(phone) => handleInputChange('emergencyContactNumber', phone)}
            inputClassName="w-full pl-10 pr-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all"
            countrySelectorStyleProps={{
              buttonClassName: "px-3 py-2 border-r border-gray-200",
              dropdownStyleProps: {
                className: "z-10 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg"
              }
            }}
          />
        </div>

        {/* Bank Account Number */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bank Account Number (Optional)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiAlertCircle className="text-gray-400" />
            </div>
            <input
              type="text"
              value={formData.bankAccountNumber}
              onChange={(e) => handleInputChange('bankAccountNumber', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all"
              placeholder="For payroll purposes"
            />
          </div>
        </div>
      </div>
    </div>
        );



      case 2:
        return (
       

    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">License & Experience</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* License ID */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            License ID *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiCreditCard className="text-gray-400" />
            </div>
            <input
              type="text"
              value={formData.licenseId}
              onChange={(e) => handleInputChange('licenseId', e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all"
              placeholder="Enter license ID"
            />
          </div>
        </div>

        {/* License Expiry Date */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            License Expiry Date *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiCalendar className="text-gray-400" />
            </div>
            <input
              type="date"
              value={formData.licenseExpiryDate}
              onChange={(e) => handleInputChange('licenseExpiryDate', e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-500 appearance-none"
            />
          </div>
        </div>

        {/* Years of Experience */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Years of Experience *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiAward className="text-gray-400" />
            </div>
            <input
              type="number"
              value={formData.yearsOfExperience}
              onChange={(e) => handleInputChange('yearsOfExperience', e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-500"
              placeholder="Years of experience"
              min="0"
            />
          </div>
        </div>

        {/* License Issued In (with US state autocomplete) */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            License Issued In *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiMapPin className="text-gray-400" />
            </div>
            <input
              ref={stateInputRef}
              type="text"
              value={formData.licenseIssuedIn}
              onChange={handleStateChange}
              onFocus={() => setShowStateSuggestions(true)}
              onBlur={() => setTimeout(() => setShowStateSuggestions(false), 200)}
              className="w-full pl-9 pr-3 py-1.5 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-500"
              placeholder="State where license was issued"
            />
            {showStateSuggestions && stateSuggestions.length > 0 && (
              <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                {stateSuggestions.map((state, index) => (
                  <li 
                    key={index}
                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => selectState(state)}
                  >
                    {state}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Languages Spoken (with autocomplete) */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Languages Spoken *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiGlobe className="text-gray-400" />
            </div>
            <input
              ref={languageInputRef}
              type="text"
              value={formData.languages}
              onChange={handleLanguageChange}
              onFocus={() => setShowLanguageSuggestions(true)}
              onBlur={() => setTimeout(() => setShowLanguageSuggestions(false), 200)}
              className="w-full pl-9 pr-3 py-1.5 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-500"
              placeholder="e.g., English, Spanish"
            />
            {showLanguageSuggestions && languageSuggestions.length > 0 && (
              <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                {languageSuggestions.map((language, index) => (
                  <li 
                    key={index}
                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => selectLanguage(language)}
                  >
                    {language}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Availability to Start */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Availability to Start *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiClock className="text-gray-400" />
            </div>
            <input
              type="date"
              value={formData.availabilityToStart}
              onChange={(e) => handleInputChange('availabilityToStart', e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-500 appearance-none"
            />
          </div>
        </div>

        {/* Previous Employment */}
        <div className="relative md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Previous Employment (Optional)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 pt-2 flex items-start pointer-events-none">
              <FiBriefcase className="text-gray-400" />
            </div>
            <textarea
              value={formData.previousEmployment}
              onChange={(e) => handleInputChange('previousEmployment', e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-500"
              rows="3"
              placeholder="Describe your previous employment experience"
            />
          </div>
        </div>
      </div>
    </div>

        );

      case 3:
        return (
          <div className="space-y-4">
  <h2 className="text-xl font-bold text-gray-800">Document Upload</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {[
      { key: 'nationalIdOrPassport', label: ' Profile Image', required: true },
      { key: 'drivingCertificate', label: 'Driving Certificate', required: true },
      { key: 'policeClearanceCertificate', label: 'Police Clearance Certificate', required: false },
      { key: 'proofOfAddress', label: 'National id or  Passport', required: true },
      { key: 'workPermitOrVisa', label: 'Work Permit or Visa', required: false },
      { key: 'drugTestReport', label: 'Drug Test Report', required: false },
      { key: 'employmentReferenceLetter', label: 'Employment Reference Letter', required: false },
      { key: 'bankStatementFile', label: 'Bank Statement', required: false }
    ].map(({ key, label, required }) => (
      <div key={key} className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center hover:border-blue-400 transition-colors">
        <Upload className="w-6 h-6 mx-auto mb-1 text-gray-400" />
        <label className="block text-xs font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => handleFileUpload(key, e)}
          className="w-full text-xs text-gray-500 
                    file:mr-2 file:py-1 file:px-3 
                    file:rounded-full file:border-0 
                    file:text-xs file:font-semibold 
                    file:bg-blue-50 file:text-blue-700 
                    hover:file:bg-blue-100"
        />
        {formData[key] && (
          <p className="text-xs text-green-600 mt-1 truncate">
            ✓ {formData[key].name}
          </p>
        )}
      </div>
    ))}
  </div>
</div>
        )

case 4:
return (
  <div className="space-y-4">
    <h2 className="text-xl font-bold text-gray-800">Vehicle Information</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {/* VIN Number */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          VIN Number *
        </label>
        <div className="relative">
          <input
            type="text"
            value={formData.vinNumber}
            onChange={(e) => {
              handleInputChange('vinNumber', e.target.value);
              if (e.target.value.length === 17) {
                handleVinDecode(e.target.value);
              }
            }}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
            placeholder="Enter 17-digit VIN"
            maxLength={17}
          />
          {vinLoading ? (
            <div className="absolute right-2 top-1.5">
              <svg className="animate-spin h-3.5 w-3.5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : formData.vinNumber && formData.vinNumber.length === 17 ? (
            <div className="absolute right-2 top-1.5 text-green-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          ) : (
            <div className="absolute right-2 top-1.5 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Don&apos;t know your VIN? <button 
            type="button" 
            onClick={() => notifyInfo('Please enter vehicle details manually below')}
            className="text-blue-500 hover:underline focus:outline-none"
          >
            Click here
          </button>
        </p>
      </div>
      
      {/* Make */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Make *
        </label>
        <div className="relative">
          <input
            type="text"
            value={formData.make}
            onChange={(e) => handleInputChange('make', e.target.value)}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
            placeholder="e.g., Toyota, Honda, Ford"
          />
          <div className="absolute right-2 top-1.5 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Model */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Model *
        </label>
        <div className="relative">
          <input
            type="text"
            value={formData.model}
            onChange={(e) => handleInputChange('model', e.target.value)}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
            placeholder="e.g., Camry, Civic, Focus"
          />
          <div className="absolute right-2 top-1.5 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Year */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Year *
        </label>
        <div className="relative">
          <input
            type="text"
            value={formData.year}
            onChange={(e) => handleInputChange('year', e.target.value)}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
            placeholder="e.g., 2020"
          />
          <div className="absolute right-2 top-1.5 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Plate Number */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Plate Number
        </label>
        <div className="relative">
          <input
            type="text"
            value={formData.plateNumber}
            onChange={(e) => handleInputChange('plateNumber', e.target.value)}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
            placeholder="Enter plate number"
          />
          <div className="absolute right-2 top-1.5 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Color */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Color *
        </label>
        <div className="relative">
          <input
            type="text"
            value={formData.color}
            onChange={(e) => handleInputChange('color', e.target.value)}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
            placeholder="e.g., White, Black, Silver"
          />
          <div className="absolute right-2 top-1.5 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Number of Doors */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Number of Doors
        </label>
        <div className="relative">
          <select
            value={formData.numberOfDoors}
            onChange={(e) => handleInputChange('numberOfDoors', e.target.value)}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none appearance-none bg-white"
          >
            <option value="">Select doors</option>
            <option value="2">2 doors</option>
            <option value="4">4 doors</option>
            <option value="5">5 doors</option>
          </select>
          <div className="absolute right-2 top-1.5 text-gray-400 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Seating Capacity */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Seating Capacity
        </label>
        <div className="relative">
          <select
            value={formData.seatingCapacity}
            onChange={(e) => handleInputChange('seatingCapacity', e.target.value)}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none appearance-none bg-white"
          >
            <option value="">Select capacity</option>
            <option value="2">2 seats</option>
            <option value="4">4 seats</option>
            <option value="5">5 seats</option>
            <option value="7">7 seats</option>
            <option value="8">8 seats</option>
          </select>
          <div className="absolute right-2 top-1.5 text-gray-400 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Registration State */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Registration State
        </label>
        <div className="relative">
          <input
            type="text"
            value={formData.registrationState}
            onChange={(e) => handleInputChange('registrationState', e.target.value)}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
            placeholder="Enter registration state"
          />
          <div className="absolute right-2 top-1.5 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Registration Date */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Registration Date
        </label>
        <div className="relative">
          <input
            type="date"
            value={formData.registrationDate}
            onChange={(e) => handleInputChange('registrationDate', e.target.value)}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
          />
          <div className="absolute right-2 top-1.5 text-gray-400 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Registration Expiry Date */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Registration Expiry Date
        </label>
        <div className="relative">
          <input
            type="date"
            value={formData.expiryDate}
            onChange={(e) => handleInputChange('expiryDate', e.target.value)}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
          />
          <div className="absolute right-2 top-1.5 text-gray-400 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Insurance Number */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Insurance Number
        </label>
        <div className="relative">
          <input
            type="text"
            value={formData.insuranceNumber}
            onChange={(e) => handleInputChange('insuranceNumber', e.target.value)}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
            placeholder="Enter insurance number"
          />
          <div className="absolute right-2 top-1.5 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Insurance Company */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Insurance Company
        </label>
        <div className="relative">
          <input
            type="text"
            value={formData.insuranceCompany}
            onChange={(e) => handleInputChange('insuranceCompany', e.target.value)}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
            placeholder="Enter insurance company name"
          />
          <div className="absolute right-2 top-1.5 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Insurance Expiry Date */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Insurance Expiry Date
        </label>
        <div className="relative">
          <input
            type="date"
            value={formData.insuranceExpiry}
            onChange={(e) => handleInputChange('insuranceExpiry', e.target.value)}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
          />
          <div className="absolute right-2 top-1.5 text-gray-400 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Service History */}
      <div className="md:col-span-2">
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Service History
        </label>
        <div className="relative">
          <textarea
            value={formData.serviceHistory}
            onChange={(e) => handleInputChange('serviceHistory', e.target.value)}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
            rows="3"
            placeholder="Describe vehicle service history"
          />
          <div className="absolute right-2 top-1.5 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Accident History */}
      <div className="md:col-span-2">
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Accident History
        </label>
        <div className="relative">
          <textarea
            value={formData.accidentHistory}
            onChange={(e) => handleInputChange('accidentHistory', e.target.value)}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
            rows="3"
            placeholder="Describe any accident history (if applicable)"
          />
          <div className="absolute right-2 top-1.5 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
)
case 5:
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Vehicle Photos</h2>
      <p className="text-gray-600">
        Please upload clear photos of your vehicle from all angles. All photos must be in JPG or PNG format.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Exterior Photos */}
  <div className="space-y-4">
    <h3 className="font-medium text-gray-700">Exterior Photos *</h3>
    <div className="grid grid-cols-2 gap-4">
      {['exteriorPhoto1', 'exteriorPhoto2', 'exteriorPhoto3', 'exteriorPhoto4'].map((field, index) => (
        <div key={field} className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center hover:border-blue-400 transition-colors">
          <label className="block text-xs font-medium text-gray-600 mb-2">
            {['Front', 'Back', 'Left Side', 'Right Side'][index]}
          </label>
          {formData[field] ? (
            <div className="relative group">
              <img 
                src={URL.createObjectURL(formData[field])} 
                alt={`Vehicle ${['Front', 'Back', 'Left Side', 'Right Side'][index]}`}
                className="w-full h-40 object-cover rounded-md"
              />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleInputChange(field, null);
                }}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 transform translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ) : (
            <label htmlFor={field} className="cursor-pointer block">
              <div className="relative">
                <img 
                  src={
                    index === 0 ? frontimage :
                    index === 1 ? backimage :
                    index === 2 ? leftimage :
                    rightimage
                  }
                  alt={`Example: ${['Front', 'Back', 'Left Side', 'Right Side'][index]} view`}
                  className="w-full h-40 object-cover rounded-md mb-2 opacity-70 border border-gray-200"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/90 rounded-full p-2 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                </div>
              </div>
              <span className="text-xs text-blue-600 hover:text-blue-800">Upload Photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(field, e)}
                className="hidden"
                id={field}
              />
            </label>
          )}
        </div>
      ))}
    </div>
  </div>

  <div className="space-y-4">
      <h3 className="font-medium text-gray-700">Interior Photos *</h3>
      <div className="grid grid-cols-2 gap-4">
        {['interiorPhoto1', 'interiorPhoto2', 'interiorPhoto3', 'interiorPhoto4'].map((field, index) => (
          <div key={field} className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center hover:border-blue-400 transition-colors">
            <label className="block text-xs font-medium text-gray-600 mb-2">
              {['Dashboard', 'Back Seats', 'Front Seats', 'Trunk'][index]}
            </label>
            {formData[field] ? (
              <div className="relative group">
                <img 
                  src={URL.createObjectURL(formData[field])} 
                  alt={`Vehicle ${['Dashboard', 'Back Seats', 'Front Seats', 'Trunk'][index]}`}
                  className="w-full h-40 object-cover rounded-md"
                />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleInputChange(field, null);
                  }}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 transform translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ) : (
              <label htmlFor={field} className="cursor-pointer block">
                <div className="relative">
                  <img 
                    src={
                      index === 0 ? dashboardImage :
                      index === 1 ? backSeatsImage :
                      index === 2 ? frontSeatsImage :
                      trunkImage
                    }
                    alt={`Example: ${['Dashboard', 'Back Seats', 'Front Seats', 'Trunk'][index]} view`}
                    className="w-full h-40 object-cover rounded-md mb-2 opacity-70 border border-gray-200"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/90 rounded-full p-2 shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                  </div>
                </div>
                <span className="text-xs text-blue-600 hover:text-blue-800">Upload Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(field, e)}
                  className="hidden"
                  id={field}
                />
              </label>
            )}
          </div>
        ))}
      </div>
    </div>
  </div>

  </div>
  )


  case 6:
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Review Your Application</h2>
      <p className="text-gray-600">
        Please review all the information you ve provided before submitting your application.
      </p>

      <div className="bg-white rounded-lg shadow-md p-6 space-y-8">
        {/* Personal Information Review */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4 flex items-center">
            <User className="w-5 h-5 mr-2" />
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">First Name</p>
              <p className="font-medium">{formData.firstName || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Last Name</p>
              <p className="font-medium">{formData.lastName || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date of Birth</p>
              <p className="font-medium">{formData.dateOfBirth || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Gender</p>
              <p className="font-medium">{formData.gender || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Nationality</p>
              <p className="font-medium">{formData.nationality || 'Not provided'}</p>
            </div>
          </div>
        </div>

        {/* Contact Information Review */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4 flex items-center">
            <Phone className="w-5 h-5 mr-2" />
            Contact Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Phone Number</p>
              <p className="font-medium">{formData.phoneNumber || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{formData.email || 'Not provided'}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500">Address</p>
              <p className="font-medium">{formData.address || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Emergency Contact</p>
              <p className="font-medium">
                {formData.emergencyContactName || 'Not provided'}
                {formData.emergencyContactNumber && ` (${formData.emergencyContactNumber})`}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Bank Account</p>
              <p className="font-medium">{formData.bankAccountNumber || 'Not provided'}</p>
            </div>
          </div>
        </div>

        {/* License & Experience Review */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            License & Experience
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">License ID</p>
              <p className="font-medium">{formData.licenseId || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">License Expiry</p>
              <p className="font-medium">{formData.licenseExpiryDate || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Years of Experience</p>
              <p className="font-medium">{formData.yearsOfExperience || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Languages</p>
              <p className="font-medium">{formData.languages || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Availability to Start</p>
              <p className="font-medium">{formData.availabilityToStart || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">License Issued In</p>
              <p className="font-medium">{formData.licenseIssuedIn || 'Not provided'}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500">Previous Employment</p>
              <p className="font-medium">{formData.previousEmployment || 'Not provided'}</p>
            </div>
          </div>
        </div>

        {/* Documents Review */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4 flex items-center">
            <Upload className="w-5 h-5 mr-2" />
            Documents
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: 'nationalIdOrPassport', label: 'National ID/Passport' },
              { key: 'drivingCertificate', label: 'Driving Certificate' },
              { key: 'policeClearanceCertificate', label: 'Police Clearance' },
              { key: 'proofOfAddress', label: 'Proof of Address' },
              { key: 'workPermitOrVisa', label: 'Work Permit/Visa' },
              { key: 'drugTestReport', label: 'Drug Test Report' },
              { key: 'employmentReferenceLetter', label: 'Reference Letter' },
              { key: 'bankStatementFile', label: 'Bank Statement' }
            ].map(({ key, label }) => (
              <div key={key}>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="font-medium">
                  {formData[key] ? (
                    <span className="text-green-600">✓ Uploaded ({formData[key].name})</span>
                  ) : (
                    <span className="text-red-500">✗ Missing</span>
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Vehicle Information Review */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4 flex items-center">
            <Car className="w-5 h-5 mr-2" />
            Vehicle Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Make & Model</p>
              <p className="font-medium">
                {formData.make || 'Not provided'} {formData.model}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Year</p>
              <p className="font-medium">{formData.year || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Color</p>
              <p className="font-medium">{formData.color || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Plate Number</p>
              <p className="font-medium">{formData.plateNumber || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">VIN Number</p>
              <p className="font-medium">{formData.vinNumber || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Seating Capacity</p>
              <p className="font-medium">{formData.seatingCapacity || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Insurance Company</p>
              <p className="font-medium">{formData.insuranceCompany || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Insurance Expiry</p>
              <p className="font-medium">{formData.insuranceExpiry || 'Not provided'}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500">Service History</p>
              <p className="font-medium">{formData.serviceHistory || 'Not provided'}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500">Accident History</p>
              <p className="font-medium">{formData.accidentHistory || 'Not provided'}</p>
            </div>
          </div>
        </div>

        {/* Vehicle Photos Review */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4 flex items-center">
            <Camera className="w-5 h-5 mr-2" />
            Vehicle Photos
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Exterior Photos</p>
              <p className="font-medium">
                {['exteriorPhoto1', 'exteriorPhoto2', 'exteriorPhoto3', 'exteriorPhoto4'].every(
                  field => formData[field]
                ) ? (
                  <span className="text-green-600">✓ All uploaded</span>
                ) : (
                  <span className="text-red-500">✗ Missing some photos</span>
                )}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Interior Photos</p>
              <p className="font-medium">
                {['interiorPhoto1', 'interiorPhoto2', 'interiorPhoto3', 'interiorPhoto4'].every(
                  field => formData[field]
                ) ? (
                  <span className="text-green-600">✓ All uploaded</span>
                ) : (
                  <span className="text-red-500">✗ Missing some photos</span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-4">
        <div className="flex items-start">
          <input
            type="checkbox"
            id="terms-agreement"
            className="mt-1 mr-2"
          />
          <label htmlFor="terms-agreement" className="text-sm text-gray-700">
            I certify that all information provided is accurate and complete to the best of my knowledge.
            I understand that providing false information may result in rejection of my application
            or termination of my driver account if discovered later.
          </label>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={prevStep}
          className="flex items-center px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          Back
        </button>
        <button
          onClick={submitToBackend}
          disabled={isSubmitting}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Application'}
        </button>
      </div>
    </div>
  );

      default:
        return null;
    }
  };

  return (
    <div>
      <DashboardNavbar />
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 mx-auto">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Driver Application</h1>
          <p className="mt-2 text-lg text-gray-600">
            Complete the form to join our team of professional drivers
          </p>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
  <div className="flex justify-between items-start">
    {steps.map((step, index) => (
      <div key={index} className="flex flex-col items-center flex-1 relative">
        {/* Icon */}
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${
            currentStep >= index ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}
        >
          {currentStep > index ? <Check className="w-6 h-6" /> : step.icon}
        </div>

        {/* Line (except after the last step) */}
        {index < steps.length - 1 && (
          <div className="absolute top-5 left-1/2 w-full h-1 -z-0">
            <div
              className={`w-full h-1 ${currentStep > index ? 'bg-blue-600' : 'bg-gray-200'}`}
            ></div>
          </div>
        )}

        {/* Label */}
        <div className="text-center mt-2">
          <p
            className={`text-sm ${
              currentStep === index ? 'text-blue-600 font-medium' : 'text-gray-500'
            }`}
          >
            {step.title}
          </p>
          <p className="text-xs text-gray-400">{step.subtitle}</p>
        </div>
      </div>
    ))}
  </div>
</div>

          {/* Form content */}
          <div className="p-6 sm:p-8">
            {renderStepContent()}
          </div>

          {/* Navigation buttons */}
          {currentStep > 0 && currentStep < steps.length - 1 && (
           <div className="px-4 py-2 w-full bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 border-t border-gray-200 flex justify-between">
  <button
    onClick={prevStep}
    className="flex items-center px-3 py-1.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
  >
    <ChevronLeft className="w-5 h-5 mr-2" />
    Previous
  </button>
  <button
    onClick={nextStep}
    className="flex items-center px-3 py-1.5 bg-white/10 text-white rounded-md hover:bg-white/20 transition-colors"
  >
    Next
    <ChevronRight className="w-5 h-5 ml-2" />
  </button>
</div>

          )}
        </div>
      </div>
    </div>
    </div>
  );
};

export default DriverApplicationForm;