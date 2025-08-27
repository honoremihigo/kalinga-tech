import Swal from 'sweetalert2';

// Fetch all vehicles
export const fetchVehiclesUtil = async (serviceInstance) => {
  const data = await serviceInstance.getVehicles();
  return data;
};

// Filter vehicles by VIN, Make, Model, and Registration Date
export const filterVehiclesUtil = (vehicles, filters) => {
  return vehicles.filter((vehicle) => {
    const vinMatch = vehicle.vinNumber.toLowerCase().includes(filters.vinNumber?.toLowerCase() || '');
    const makeMatch = vehicle.make.toLowerCase().includes(filters.make?.toLowerCase() || '');
    const modelMatch = vehicle.model.toLowerCase().includes(filters.model?.toLowerCase() || '');
    const regDate = vehicle.registrationDate?.slice(0, 10) || '';
    const matchRegDate = filters.registrationDate ? regDate === filters.registrationDate : true;

    return vinMatch && makeMatch && modelMatch && matchRegDate;
  });
};

// Initialize form data for vehicle form
export const initVehicleFormDataUtil = (vehicle = {}) => ({
  vinNumber: vehicle.vinNumber || '',
  make: vehicle.make || '',
  model: vehicle.model || '',
  year: vehicle.year || '',
  plateNumber: vehicle.plateNumber || '',
  color: vehicle.color || '',
  ownerId: vehicle.ownerId || '',

  registrationState: vehicle.registrationState || '',
  registrationDate: vehicle.registrationDate?.slice(0, 10) || '',
  expiryDate: vehicle.expiryDate?.slice(0, 10) || '',

  insuranceNumber: vehicle.insuranceNumber || '',
  insuranceCompany: vehicle.insuranceCompany || '',
  insuranceExpiry: vehicle.insuranceExpiry?.slice(0, 10) || '',

  numberOfDoors: vehicle.numberOfDoors || '',
  seatingCapacity: vehicle.seatingCapacity || '',

  // File/image fields initialized as `null`
  exteriorPhoto1: null,
  exteriorPhoto2: null,
  exteriorPhoto3: null,
  exteriorPhoto4: null,
  interiorPhoto1: null,
  interiorPhoto2: null,
  interiorPhoto3: null,
  interiorPhoto4: null,

  // History (optional JSON fields)
  serviceHistory: vehicle.serviceHistory || null,
  accidentHistory: vehicle.accidentHistory || null,
});

// Notification utilities
export const notifySuccess = (message) =>
  Swal.fire({
    icon: 'success',
    title: 'Success!',
    text: message,
    showConfirmButton: false,
    timer: 2000,
    toast: true,
    position: 'top-end'
  });

export const notifyError = (message) =>
  Swal.fire({
    icon: 'error',
    title: 'Error',
    text: message,
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000
  });
