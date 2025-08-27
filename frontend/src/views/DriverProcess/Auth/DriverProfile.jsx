import React, { useState, useEffect } from 'react';
import { User, Car, FileText, Shield, Calendar, Phone, MapPin, CreditCard, Clock, Globe, Briefcase, CheckCircle, AlertCircle, X, LogOut } from 'lucide-react';
import AuthService from '../../../Services/DriverService/Auth'; // Import your AuthService
import { useNavigate } from 'react-router-dom';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.example.com';

const DriverProfile = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentDocument, setCurrentDocument] = useState(null);
  const navigate = useNavigate(); 


  const getProfile = async () => {
    try {
      setLoading(true);
      const user = await AuthService.getProfile();
      console.log('Logged in User ID:', user.driver ? user.driver.id : user.id);
      setProfileData(user);
    } catch (err) {
      setError('Failed to fetch profile data');
      console.error('Profile fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  const handleLogout = async () => {
  try {
    await AuthService.logout();
    navigate('/AbyrideDriver'); // Adjust this route as per your app structure
  } catch (error) {
    console.error('Logout failed:', error);
  }
};


  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getImageUrl = (filename) => {
    return `${API_BASE_URL}/uploads/${filename}`;
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getAvailabilityColor = (availability) => {
    switch (availability?.toLowerCase()) {
      case 'online': return 'text-green-600 bg-green-100';
      case 'offline': return 'text-red-600 bg-red-100';
      case 'busy': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const openDocumentModal = (document) => {
    setCurrentDocument(document);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentDocument(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#47B2E4] to-[#293751] flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#47B2E4] mx-auto"></div>
          <p className="text-gray-600 mt-4 text-center">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-300 via-blue-50 to-cyan-200 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-2xl text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={getProfile}
            className="mt-4 px-6 py-2 bg-[#47B2E4] text-white rounded-lg hover:bg-[#293751] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { driver, vehicles } = profileData || {};

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'vehicles', label: 'Vehicles', icon: Car },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'license', label: 'License & Employment', icon: Shield }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-300 via-blue-50 to-cyan-200 py-8 px-4">
   


        
<div className="max-w-9xl mx-auto">
  {/* Header */}
  <div className="bg-[#293751] rounded-2xl p-6 mb-8 shadow-xl">
    <div className="flex items-center justify-between">
      {/* Left: Profile Info */}
      <div className="flex items-center space-x-6">
<div className="w-20 h-20 bg-white rounded-full overflow-hidden shadow-lg">
  {driver?.nationalIdOrPassport ? (
    <img
      src={getImageUrl(driver.nationalIdOrPassport)}
      alt="Passport"
      className="w-full h-full object-cover"
    />
  ) : (
    <User className="w-10 h-10 text-[#47B2E4] mx-auto my-auto" />
  )}
</div>


        <div className="text-white">
          <h1 className="text-3xl font-bold mb-2">
            {driver?.firstName} {driver?.lastName}
          </h1>

          <div className="flex items-center space-x-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(driver?.Status)}`}>
              {driver?.Status}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getAvailabilityColor(driver?.Availability)}`}>
              {driver?.Availability}
            </span>
          </div>
        </div>
      </div>

      {/* Right: Logout Button */}
      <button
        onClick={handleLogout}
        className="flex items-center space-x-2 text-white border border-white px-4 py-2 rounded-lg hover:bg-white hover:text-[#293751] transition"
      >
        <LogOut className="w-5 h-5" />
        <span>Logout</span>
      </button>
    </div>
  </div>

        {/* Tabs */}
        <div className="bg-[#293751] backdrop-blur-sm rounded-2xl p-2 mb-8 shadow-xl">
          <div className="flex space-x-2 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-200 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-white text-[#47B2E4] shadow-lg transform scale-105'
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Personal Info Tab */}
          {activeTab === 'personal' && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <User className="w-6 h-6 mr-2 text-[#47B2E4]" />
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gradient-to-r from-[#47B2E4]/10 to-[#293751]/10 p-6 rounded-xl">
                  <div className="flex items-center mb-3">
                    <User className="w-5 h-5 text-[#47B2E4] mr-2" />
                    <h3 className="font-semibold text-gray-800">Basic Info</h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-600">First Name</label>
                      <p className="font-medium text-gray-800">{driver?.firstName}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Last Name</label>
                      <p className="font-medium text-gray-800">{driver?.lastName}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Gender</label>
                      <p className="font-medium text-gray-800">{driver?.gender}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Date of Birth</label>
                      <p className="font-medium text-gray-800">{formatDate(driver?.dateOfBirth)}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-[#47B2E4]/10 to-[#293751]/10 p-6 rounded-xl">
                  <div className="flex items-center mb-3">
                    <Phone className="w-5 h-5 text-[#47B2E4] mr-2" />
                    <h3 className="font-semibold text-gray-800">Contact Info</h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-600">Phone Number</label>
                      <p className="font-medium text-gray-800">{driver?.phoneNumber}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Email</label>
                      <p className="font-medium text-gray-800">{driver?.email}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Nationality</label>
                      <p className="font-medium text-gray-800">{driver?.nationality}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-[#47B2E4]/10 to-[#293751]/10 p-6 rounded-xl">
                  <div className="flex items-center mb-3">
                    <MapPin className="w-5 h-5 text-[#47B2E4] mr-2" />
                    <h3 className="font-semibold text-gray-800">Address</h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-600">Address</label>
                      <p className="font-medium text-gray-800">{driver?.address}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-[#47B2E4]/10 to-[#293751]/10 p-6 rounded-xl">
                  <div className="flex items-center mb-3">
                    <Shield className="w-5 h-5 text-[#47B2E4] mr-2" />
                    <h3 className="font-semibold text-gray-800">Emergency Contact</h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-600">Name</label>
                      <p className="font-medium text-gray-800">{driver?.emergencyContactName}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Phone</label>
                      <p className="font-medium text-gray-800">{driver?.emergencyContactNumber}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-[#47B2E4]/10 to-[#293751]/10 p-6 rounded-xl">
                  <div className="flex items-center mb-3">
                    <CreditCard className="w-5 h-5 text-[#47B2E4] mr-2" />
                    <h3 className="font-semibold text-gray-800">Banking</h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-600">Account Number</label>
                      <p className="font-medium text-gray-800">{driver?.bankAccountNumber}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-[#47B2E4]/10 to-[#293751]/10 p-6 rounded-xl">
                  <div className="flex items-center mb-3">
                    <Calendar className="w-5 h-5 text-[#47B2E4] mr-2" />
                    <h3 className="font-semibold text-gray-800">Joined</h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-600">Registration Date</label>
                      <p className="font-medium text-gray-800">{formatDate(driver?.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Vehicles Tab */}
          {activeTab === 'vehicles' && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Car className="w-6 h-6 mr-2 text-[#47B2E4]" />
                Vehicle Information
              </h2>
              {vehicles && vehicles.length > 0 ? (
                <div className="space-y-8">
                  {vehicles.map((vehicle, index) => (
                    <div key={vehicle.id} className="bg-gradient-to-r from-[#47B2E4]/5 to-[#293751]/5 rounded-xl p-6 border border-gray-200">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">
                        Vehicle {index + 1}
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm text-gray-600">Make & Model</label>
                            <p className="font-medium text-gray-800">{vehicle.make} {vehicle.model}</p>
                          </div>
                          <div>
                            <label className="text-sm text-gray-600">Year</label>
                            <p className="font-medium text-gray-800">{vehicle.year}</p>
                          </div>
                          <div>
                            <label className="text-sm text-gray-600">Color</label>
                            <p className="font-medium text-gray-800">{vehicle.color}</p>
                          </div>
                          <div>
                            <label className="text-sm text-gray-600">Category</label>
                            <p className="font-medium text-gray-800">{vehicle.category}</p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <label className="text-sm text-gray-600">Plate Number</label>
                            <p className="font-medium text-gray-800">{vehicle.plateNumber}</p>
                          </div>
                          <div>
                            <label className="text-sm text-gray-600">VIN Number</label>
                            <p className="font-medium text-gray-800">{vehicle.vinNumber}</p>
                          </div>
                          <div>
                            <label className="text-sm text-gray-600">Doors</label>
                            <p className="font-medium text-gray-800">{vehicle.numberOfDoors}</p>
                          </div>
                          <div>
                            <label className="text-sm text-gray-600">Seating Capacity</label>
                            <p className="font-medium text-gray-800">{vehicle.seatingCapacity}</p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <label className="text-sm text-gray-600">Registration Date</label>
                            <p className="font-medium text-gray-800">{formatDate(vehicle.registrationDate)}</p>
                          </div>
                          <div>
                            <label className="text-sm text-gray-600">Expiry Date</label>
                            <p className="font-medium text-gray-800">{formatDate(vehicle.expiryDate)}</p>
                          </div>
                          <div>
                            <label className="text-sm text-gray-600">Insurance Company</label>
                            <p className="font-medium text-gray-800">{vehicle.insuranceCompany}</p>
                          </div>
                          <div>
                            <label className="text-sm text-gray-600">Insurance Expiry</label>
                            <p className="font-medium text-gray-800">{formatDate(vehicle.insuranceExpiry)}</p>
                          </div>
                        </div>
                      </div>

                      {/* Vehicle Photos */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-3">Exterior Photos</h4>
                          <div className="grid grid-cols-2 gap-3">
                            {[vehicle.exteriorPhoto1, vehicle.exteriorPhoto2, vehicle.exteriorPhoto3, vehicle.exteriorPhoto4].filter(Boolean).map((photo, idx) => (
                              <div key={idx} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                <img 
                                  src={getImageUrl(photo)} 
                                  alt={`Exterior ${idx + 1}`}
                                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-gray-800 mb-3">Interior Photos</h4>
                          <div className="grid grid-cols-2 gap-3">
                            {[vehicle.interiorPhoto1, vehicle.interiorPhoto2, vehicle.interiorPhoto3, vehicle.interiorPhoto4].filter(Boolean).map((photo, idx) => (
                              <div key={idx} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                <img 
                                  src={getImageUrl(photo)} 
                                  alt={`Interior ${idx + 1}`}
                                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="text-sm text-gray-600">Service History</label>
                          <p className="font-medium text-gray-800">{vehicle.serviceHistory}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">Accident History</label>
                          <p className="font-medium text-gray-800">{vehicle.accidentHistory}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No vehicles registered</p>
                </div>
              )}
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <FileText className="w-6 h-6 mr-2 text-[#47B2E4]" />
                Documents
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { label: 'Profile picture', file: driver?.nationalIdOrPassport, type: 'image' },
                  { label: 'Police Clearance Certificate', file: driver?.policeClearanceCertificate, type: 'pdf' },
                  { label: 'National ID / Passport', file: driver?.proofOfAddress, type: 'pdf' },
                  { label: 'Driving Certificate', file: driver?.drivingCertificate, type: 'pdf' },
                  { label: 'Work Permit/Visa', file: driver?.workPermitOrVisa, type: 'pdf' },
                  { label: 'Drug Test Report', file: driver?.drugTestReport, type: 'pdf' },
                  { label: 'Employment Reference Letter', file: driver?.employmentReferenceLetter, type: 'pdf' },
                  { label: 'Bank Statement', file: driver?.bankStatementFile, type: 'pdf' }
                ].filter(doc => doc.file).map((doc, index) => (
                  <div key={index} className="bg-gradient-to-r from-[#47B2E4]/10 to-[#293751]/10 p-6 rounded-xl border border-gray-200">
                    <div className="flex items-center mb-3">
                      <FileText className="w-5 h-5 text-[#47B2E4] mr-2" />
                      <h3 className="font-semibold text-gray-800">{doc.label}</h3>
                    </div>
                    {doc.type === 'image' ? (
                      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3">
                        <img 
                          src={getImageUrl(doc.file)} 
                          alt={doc.label}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    ) : (
                      <div className="bg-gray-100 rounded-lg p-4 mb-3 flex items-center justify-center h-32">
                        <FileText className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    <a 
                      href={getImageUrl(doc.file)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block w-full text-center bg-[#47B2E4] text-white py-2 px-4 rounded-lg hover:bg-[#293751] transition-colors"
                    >
                      View Document
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* License & Employment Tab */}
          {activeTab === 'license' && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Shield className="w-6 h-6 mr-2 text-[#47B2E4]" />
                License & Employment
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-r from-[#47B2E4]/10 to-[#293751]/10 p-6 rounded-xl">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-[#47B2E4]" />
                    License Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-600">License ID</label>
                      <p className="font-medium text-gray-800">{driver?.licenseId}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">License Issued In</label>
                      <p className="font-medium text-gray-800">{driver?.licenseIssuedIn}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">License Expiry Date</label>
                      <p className="font-medium text-gray-800">{formatDate(driver?.licenseExpiryDate)}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Years of Experience</label>
                      <p className="font-medium text-gray-800">{driver?.yearsOfExperience} years</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-[#47B2E4]/10 to-[#293751]/10 p-6 rounded-xl">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <Briefcase className="w-5 h-5 mr-2 text-[#47B2E4]" />
                    Employment Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-600">Languages</label>
                      <p className="font-medium text-gray-800">{driver?.languages}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Previous Employment</label>
                      <p className="font-medium text-gray-800">{driver?.previousEmployment}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Availability to Start</label>
                      <p className="font-medium text-gray-800">{formatDate(driver?.availabilityToStart)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverProfile;