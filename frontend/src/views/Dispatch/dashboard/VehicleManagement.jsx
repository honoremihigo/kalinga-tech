import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Car,Eye, FileText, ChevronLeft, ChevronRight, X, Plus, Save, Upload

 } from 'lucide-react';
import Swal from 'sweetalert2';
import axios from 'axios';
import adminServiceInstance from '../../../Services/Dispatch/VehicleManagement';
import driverServiceInstance from '../../../Services/Dispatch/DriverManagement';
import { Link} from 'react-router-dom';
import {
  fetchVehiclesUtil,
  filterVehiclesUtil,
  initVehicleFormDataUtil as initFormDataUtil,
  notifySuccess,
  notifyError,
} from '../../../Utils/VehicleManagement';

const steps = [
  { id: 1, title: 'Basic Info', icon: Car, description: 'Vehicle identification' },
  { id: 2, title: 'Registration', icon: FileText, description: 'Registration & insurance' },
  { id: 3, title: 'Photos', icon: Upload, description: 'Vehicle photos' }
];

const VehicleManagement = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editVehicle, setEditVehicle] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [vinLoading, setVinLoading] = useState(false);
  const [drivers, setDrivers] = useState([]);

  const [filters, setFilters] = useState({ 
    plateNumber: '', 
    make: '', 
    model: ''
  });

  const [formData, setFormData] = useState(initFormDataUtil());

  useEffect(() => {
    loadVehicles();
    fetchDrivers();
  }, []);

  const loadVehicles = async () => {
    setLoading(true);
    try {
      const data = await fetchVehiclesUtil(adminServiceInstance);
      setVehicles(data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Failed to fetch vehicles');
      notifyError('Failed to fetch vehicles');
    }
  };

  const fetchDrivers = async () => {
    try {
      const data = await driverServiceInstance.getDrivers();
      setDrivers(data);
    } catch (error) {
      console.error('Error fetching drivers:', error);
    }
  };

  const filteredVehicles = filterVehiclesUtil(vehicles, filters);

  const handleFilterChange = (e) =>
    setFilters((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleShowModal = (vehicle = null) => {
    setEditVehicle(vehicle);
    setCurrentStep(1);
    setFormData(vehicle ? initFormDataUtil(vehicle) : initFormDataUtil());
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setEditVehicle(null);
    setShowModal(false);
    setCurrentStep(1);
    setFormData(initFormDataUtil());
  };

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
        notifySuccess('Vehicle information auto-filled from VIN');
      }
    } catch (err) {
      console.error('VIN decode error:', err);
      notifyError('Failed to decode VIN. Please enter vehicle details manually.');
    } finally {
      setVinLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, files, value, type } = e.target;

    if (type === 'file') {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0] || null,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      // Auto-decode VIN when VIN number is entered
      if (name === 'vinNumber' && value.length === 17) {
        handleVinDecode(value);
      }
    }
  };

  const handleNextStep = () => {
    if (currentStep < 3 && !isAnimating) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setIsAnimating(false);
      }, 200);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1 && !isAnimating) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        setIsAnimating(false);
      }, 200);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();

      for (const key in formData) {
        if (formData[key] !== null && formData[key] !== undefined) {
          if (key === 'ownerId') {
            if (formData.ownerId && formData.ownerId !== '') {
              formDataToSend.append(key, formData.ownerId);
            }
          } else {
            formDataToSend.append(key, formData[key]);
          }
        }
      }

      if (editVehicle) {
        await adminServiceInstance.updateVehicle(editVehicle.id, formDataToSend);
        notifySuccess('Vehicle updated successfully');
      } else {
        await adminServiceInstance.createVehicle(formDataToSend);
        notifySuccess('Vehicle added successfully');
      }

      loadVehicles();
      handleCloseModal();
    } catch (err) {
      notifyError(err.message || 'Operation failed');
    }
  };

  const handleDelete = async (id, plateNumber) => {
    const result = await Swal.fire({
      title: `Delete Vehicle ${plateNumber}?`,
      text: "This action cannot be undone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      try {
        await adminServiceInstance.deleteVehicle(id);
        notifySuccess('Vehicle deleted successfully');
        loadVehicles();
      } catch (err) {
        notifyError(err.message || 'Failed to delete vehicle');
      }
    }
  };

  const renderStepContent = () => {
    const baseInputClass = "w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400";
    const labelClass = "block text-xs font-semibold text-gray-700 mb-1.5";

    switch (currentStep) {
      case 1:
        return (
          <div className={`space-y-4 transition-all duration-300 ${isAnimating ? 'opacity-0 transform translate-x-4' : 'opacity-100 transform translate-x-0'}`}>
            <div className="grid grid-cols-2 gap-4">
              <div className="group col-span-2">
                <label className={labelClass}>VIN Number *</label>
                <div className="relative">
                  <input
                    type="text"
                    name="vinNumber"
                    value={formData.vinNumber}
                    onChange={handleFormChange}
                    required
                    maxLength={17}
                    className={baseInputClass}
                    style={{outline:"none"}}
                    placeholder="Enter 17-character VIN number"
                  />
                  {vinLoading && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">VIN will auto-fill make, model, and year</p>
              </div>
              
              <div className="group">
                <label className={labelClass}>Make *</label>
                <input
                  type="text"
                  name="make"
                  value={formData.make}
                  onChange={handleFormChange}
                  required
                  style={{outline:"none"}}
                  className={baseInputClass}
                  placeholder="Enter vehicle make"
                />
              </div>
              
              <div className="group">
                <label className={labelClass}>Model *</label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleFormChange}
                  required
                  style={{outline:"none"}}
                  className={baseInputClass}
                  placeholder="Enter vehicle model"
                />
              </div>
              
              <div className="group">
                <label className={labelClass}>Year *</label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleFormChange}
                  required
                  min="1900"
                  style={{outline:"none"}}
                  max="2030"
                  className={baseInputClass}
                  placeholder="Enter year"
                />
              </div>
              
              <div className="group">
                <label className={labelClass}>Plate Number *</label>
                <input
                  type="text"
                  name="plateNumber"
                  value={formData.plateNumber}
                  onChange={handleFormChange}
                  required
                  style={{outline:"none"}}
                  className={baseInputClass}
                  placeholder="Enter plate number"
                />
              </div>
              
              <div className="group">
                <label className={labelClass}>Color</label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleFormChange}
                  className={baseInputClass}
                  style={{outline:"none"}}
                  placeholder="Enter vehicle color"
                />
              </div>
              
              <div className="group">
                <label className={labelClass}>Owner</label>
                <select
                  name="ownerId"
                  value={formData.ownerId}
                  onChange={handleFormChange}
                  className={baseInputClass}
                  style={{outline:"none"}}
                >
                  <option value="">Select owner</option>
                  {drivers.map((driver) => (
                    <option key={driver.id} value={driver.id}>
                      {driver.firstName} {driver.lastName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="group">
                <label className={labelClass}>Number of Doors</label>
                <select
                  style={{outline:"none"}}
                  name="numberOfDoors"
                  value={formData.numberOfDoors}
                  onChange={handleFormChange}
                  className={baseInputClass}
                >
                  <option value="">Select doors</option>
                  <option value="2">2 Doors</option>
                  <option value="3">3 Doors</option>
                  <option value="4">4 Doors</option>
                  <option value="5">5 Doors</option>
                </select>
              </div>
              
              <div className="group">
                <label className={labelClass}>Seating Capacity</label>
                <input
                  type="number"
                  style={{outline:"none"}}
                  name="seatingCapacity"
                  value={formData.seatingCapacity}
                  onChange={handleFormChange}
                  min="1"
                  max="20"
                  className={baseInputClass}
                  placeholder="Enter seating capacity"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className={`space-y-4 transition-all duration-300 ${isAnimating ? 'opacity-0 transform translate-x-4' : 'opacity-100 transform translate-x-0'}`}>
            <div className="grid grid-cols-2 gap-4">
              <div className="group">
                <label className={labelClass}>Registration State</label>
                <input
                  type="text"
                  style={{outline:"none"}}
                  name="registrationState"
                  value={formData.registrationState}
                  onChange={handleFormChange}
                  className={baseInputClass}
                  placeholder="Enter registration state"
                />
              </div>
              
              <div className="group">
                <label className={labelClass}>Registration Date</label>
                <input
                  type="date"
                  style={{outline:"none"}}
                  name="registrationDate"
                  value={formData.registrationDate}
                  onChange={handleFormChange}
                  className={baseInputClass}
                />
              </div>
              
              <div className="group">
                <label className={labelClass}>Expiry Date</label>
                <input
                  type="date"
                  style={{outline:"none"}}
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleFormChange}
                  className={baseInputClass}
                />
              </div>
              
              <div className="group">
                <label className={labelClass}>Insurance Number</label>
                <input
                  type="text"
                  style={{outline:"none"}}
                  name="insuranceNumber"
                  value={formData.insuranceNumber}
                  onChange={handleFormChange}
                  className={baseInputClass}
                  placeholder="Enter insurance number"
                />
              </div>
              
              <div className="group">
                <label className={labelClass}>Insurance Company</label>
                <input
                  type="text"
                  style={{outline:"none"}}
                  name="insuranceCompany"
                  value={formData.insuranceCompany}
                  onChange={handleFormChange}
                  className={baseInputClass}
                  placeholder="Enter insurance company"
                />
              </div>
              
              <div className="group">
                <label className={labelClass}>Insurance Expiry</label>
                <input
                  type="date"
                  style={{outline:"none"}}
                  name="insuranceExpiry"
                  value={formData.insuranceExpiry}
                  onChange={handleFormChange}
                  className={baseInputClass}
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className={`space-y-4 transition-all duration-300 ${isAnimating ? 'opacity-0 transform translate-x-4' : 'opacity-100 transform translate-x-0'}`}>
            <div className="grid grid-cols-2 gap-4">
              <div className="group">
                <label className={labelClass}>Exterior Photo 1</label>
                <input
                  type="file"
                  style={{outline:"none"}}
                  name="exteriorPhoto1"
                  onChange={handleFormChange}
                  className={baseInputClass}
                  accept=".jpg,.jpeg,.png"
                />
              </div>
              
              <div className="group">
                <label className={labelClass}>Exterior Photo 2</label>
                <input
                  type="file"
                  style={{outline:"none"}}
                  name="exteriorPhoto2"
                  onChange={handleFormChange}
                  className={baseInputClass}
                  accept=".jpg,.jpeg,.png"
                />
              </div>
              
              <div className="group">
                <label className={labelClass}>Exterior Photo 3</label>
                <input
                  type="file"
                  style={{outline:"none"}}
                  name="exteriorPhoto3"
                  onChange={handleFormChange}
                  className={baseInputClass}
                  accept=".jpg,.jpeg,.png"
                />
              </div>
              
              <div className="group">
                <label className={labelClass}>Exterior Photo 4</label>
                <input
                  type="file"
                  style={{outline:"none"}}
                  name="exteriorPhoto4"
                  onChange={handleFormChange}
                  className={baseInputClass}
                  accept=".jpg,.jpeg,.png"
                />
              </div>
              
              <div className="group">
                <label className={labelClass}>Interior Photo 1</label>
                <input
                  type="file"
                  style={{outline:"none"}}
                  name="interiorPhoto1"
                  onChange={handleFormChange}
                  className={baseInputClass}
                  accept=".jpg,.jpeg,.png"
                />
              </div>
              
              <div className="group">
                <label className={labelClass}>Interior Photo 2</label>
                <input
                  type="file"
                  style={{outline:"none"}}
                  name="interiorPhoto2"
                  onChange={handleFormChange}
                  className={baseInputClass}
                  accept=".jpg,.jpeg,.png"
                />
              </div>
              
              <div className="group">
                <label className={labelClass}>Interior Photo 3</label>
                <input
                  type="file"
                  style={{outline:"none"}}
                  name="interiorPhoto3"
                  onChange={handleFormChange}
                  className={baseInputClass}
                  accept=".jpg,.jpeg,.png"
                />
              </div>
              
              <div className="group">
                <label className={labelClass}>Interior Photo 4</label>
                <input
                  type="file"
                  style={{outline:"none"}}
                  name="interiorPhoto4"
                  onChange={handleFormChange}
                  className={baseInputClass}
                  accept=".jpg,.jpeg,.png"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4 mt-6">
              <div className="group">
                <label className={labelClass}>Service History</label>
                <textarea
                  name="serviceHistory"
                  style={{outline:"none"}}
                  value={formData.serviceHistory || ''}
                  onChange={handleFormChange}
                  className={baseInputClass}
                  rows="3"
                  placeholder="Enter service history as JSON or leave empty"
                />
              </div>
              
              <div className="group">
                <label className={labelClass}>Accident History</label>
                <textarea
                  name="accidentHistory"
                  style={{outline:"none"}}
                  value={formData.accidentHistory || ''}
                  onChange={handleFormChange}
                  className={baseInputClass}
                  rows="3"
                  placeholder="Enter accident history as JSON or leave empty"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-sm text-gray-600">Loading vehicles...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <div className="text-red-600 text-sm">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">Vehicle Management</h3>
        <button
          onClick={() => handleShowModal()}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
        >
          <Plus className="w-4 h-4" />
          Add New Vehicle
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-2 mb-3 -mt-2 bg-gray-50 rounded-lg">
        <div>
          <input
            type="text"
            placeholder="Search by plate number..."
            name="plateNumber"
            value={filters.plateNumber}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Search by make..."
            name="make"
            value={filters.make}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Search by model..."
            name="model"
            value={filters.model}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700">#</th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700">Vin Number</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700">Plate Number</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700">Make</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700">Model</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray00">Year</th>
                            
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredVehicles.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-4 py-8 text-center text-xs text-gray-500">
                  No vehicles found
                </td>
              </tr>
            ) : (
              filteredVehicles.map((vehicle, idx) => (
                <tr key={vehicle.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-2 py-2 text-xs text-center text-gray-900">{idx + 1}</td>
                   <td className="px-2 py-2 text-xs text-center text-gray-900">{vehicle.vinNumber}</td>
                  <td className="px-2 py-2 text-xs text-center text-gray-900">{vehicle.plateNumber}</td>
                  <td className="px-2 py-2 text-xs text-center text-gray-900">{vehicle.make}</td>
                  <td className="px-2 py-2 text-xs text-center text-gray-900">{vehicle.model}</td>
                  <td className="px-2 py-2 text-xs text-center text-gray-900">{vehicle.year}</td>
                                 
                                    

                  <td className="px-2 py-2">
                    <div className="flex gap-2 justify-center">
                      <Link
                       to={`${vehicle.id}`}
                        className="p-1.5 rounded-lg bg-green-50 hover:bg-green-100 text-green-600 hover:text-green-700 transition-all duration-150"
                        title="View vehicle details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => handleShowModal(vehicle)}
                        className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 transition-all duration-150"
                        title="Edit vehicle"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(vehicle.id, vehicle.plateNumber)}
                        className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 transition-all duration-150"
                        title="Delete vehicle"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <p className="text-xs text-gray-600">Showing 1 to {filteredVehicles.length} of {filteredVehicles.length} entries</p>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-150">
            Previous
          </button>
          <button className="px-3 py-1.5 text-xs bg-blue-500 text-white rounded-lg">1</button>
          <button className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-150">
            Next
          </button>
        </div>
      </div>

      {/* Custom Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div 
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 backdrop-blur-sm"
              onClick={handleCloseModal}
            ></div>
            {/* Modal panel */}
            <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-2xl rounded-2xl">
              {/* Modal header */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  {editVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Stepper */}
              <div className="mb-6">
                <div className="flex justify-between">
                  {steps.map((step) => (
                    <div key={step.id} className="flex flex-col items-center w-full">
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full ${currentStep >= step.id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'} transition-colors duration-200`}
                      >
                        <step.icon className="w-5 h-5" />
                      </div>
                      <div className={`mt-2 text-xs font-medium ${currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'}`}>
                        {step.title}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="relative mt-2">
                  <div className="absolute top-0 left-0 right-0 flex items-center">
                    <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200 w-full">
                      <div
                        style={{ width: `${(currentStep / steps.length) * 100}%` }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-300"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form content */}
              <form onSubmit={handleSubmit}>
                {renderStepContent()}

                {/* Navigation buttons */}
                <div className="mt-8 flex justify-between">
                  <div>
                    {currentStep > 1 && (
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Previous
                      </button>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {currentStep < 3 ? (
                      <button
                        type="button"
                        onClick={handleNextStep}
                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Next
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        <Save className="mr-2 h-4 w-4" />
                        {editVehicle ? 'Update Vehicle' : 'Save Vehicle'}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleManagement;