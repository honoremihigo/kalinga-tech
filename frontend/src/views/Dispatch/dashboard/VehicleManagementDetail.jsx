import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  Calendar,
  Car,
  ClipboardList,
  Edit,
  MapPin,
  PaintBucket,
  User,
  Users,
  ChevronLeft,
  ChevronRight,
  X,
  ZoomIn
} from 'lucide-react';
import PropTypes from 'prop-types';
import adminServiceInstance from '../../../Services/Dispatch/VehicleManagement';
import feeService from '../../../Services/Dispatch/FeeManagement';

const backendImageURL = import.meta.env.VITE_BACKEND_IMAGE_LINK;

const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString();

const colorVariants = {
  blue: 'bg-blue-50 border-blue-100',
  orange: 'bg-orange-50 border-orange-100',
  green: 'bg-green-50 border-green-100',
  purple: 'bg-purple-50 border-purple-100',
  amber: 'bg-amber-50 border-amber-100'
};

const ImageGallery = ({ images }) => {
  const [mainImage, setMainImage] = useState(images[0]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const nextImage = () => {
    const nextIndex = (currentIndex + 1) % images.length;
    setCurrentIndex(nextIndex);
    setMainImage(images[nextIndex]);
  };

  const prevImage = () => {
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    setCurrentIndex(prevIndex);
    setMainImage(images[prevIndex]);
  };

  return (
    <div className="space-y-4">
      <div className="relative h-48 md:h-96 w-full rounded-xl overflow-hidden shadow-sm">
        <img src={`${backendImageURL}${mainImage}`} alt="Main Preview" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent flex items-end p-3">
          <span className="text-white text-sm bg-black/50 px-2 py-1 rounded">{currentIndex + 1}/{images.length}</span>
        </div>
        <button onClick={() => setIsFullscreen(true)} className="absolute top-2 right-2 bg-white/80 p-1 rounded">
          <ZoomIn className="w-4 h-4 text-gray-700" />
        </button>
      </div>

      <div className="flex space-x-2 overflow-x-auto pb-2">
        {images.map((img, idx) => (
          <div key={idx} className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden cursor-pointer border-2 ${mainImage === img ? 'border-blue-500' : 'border-transparent'}`} onClick={() => {
            setMainImage(img);
            setCurrentIndex(idx);
          }}>
            <img src={`${backendImageURL}${img}`} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>

      {isFullscreen && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center p-4">
          <div className="relative w-full h-full">
            <img src={`${backendImageURL}${mainImage}`} alt="Fullscreen Preview" className="w-full h-full object-contain" />
            <button onClick={() => setIsFullscreen(false)} className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full">
              <X className="w-5 h-5" />
            </button>
            <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

ImageGallery.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired
};

const InfoItem = ({ label, value, Icon, color = 'blue' }) => (
  <div className={`p-3 rounded-lg border ${colorVariants[color]} shadow-xs mb-2`}>
    <div className="flex items-center space-x-2">
      <Icon className={`w-4 h-4 ${colorVariants[color].split(' ')[0].replace('bg-', 'text-')}`} />
      <div>
        <dt className="text-xs font-medium text-gray-500">{label}</dt>
        <dd className="text-sm font-semibold text-gray-800">{value || 'N/A'}</dd>
      </div>
    </div>
  </div>
);

InfoItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  Icon: PropTypes.elementType.isRequired,
  color: PropTypes.string
};

function VehicleManagementDetail() {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        setLoading(true);
        const data = await adminServiceInstance.getVehicleById(id);
        setVehicle(data);
        setError('');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicle();
  }, [id]);

  const openCategoryModal = async () => {
    try {
      const data = await feeService.getCategories();
      setCategories(data);
      setSelectedCategoryId(vehicle?.categoryId || '');
      setIsModalOpen(true);
    } catch (error) {
      console.error('Failed to load categories:', error);
      alert('Failed to load categories');
    }
  };

  const handleUpdateCategory = async () => {
    try {
    if (!selectedCategoryId) {
      throw new Error('Please select a category first');
    }

    const selectedCategory = categories.find(c => c.id == selectedCategoryId);

    if (!selectedCategory) {
      throw new Error('Invalid category selection');
    }

    const updateData = {
      vehicleid: id,
      categoryName: selectedCategory.name
    };

    await adminServiceInstance.updateVehicleCategory(updateData);

    setVehicle(prev => ({
      ...prev,
      category: selectedCategory.name,
      categoryId: selectedCategory.id
    }));

    setIsModalOpen(false);

    // SweetAlert success
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: 'Category updated successfully!',
      timer: 2000,
      showConfirmButton: false,
    });

  } catch (error) {
    console.error('Update error:', error);

    // SweetAlert error
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: error.message,
    });
  }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;
  if (!vehicle) return null;

  const allImages = [
    vehicle.exteriorPhoto1, vehicle.exteriorPhoto2, vehicle.exteriorPhoto3, vehicle.exteriorPhoto4,
    vehicle.interiorPhoto1, vehicle.interiorPhoto2, vehicle.interiorPhoto3, vehicle.interiorPhoto4
  ].filter(Boolean);

  return (
    <div className="max-w-9xl mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">{vehicle.make} {vehicle.model} {vehicle.year}</h1>
        <button onClick={openCategoryModal} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center space-x-1">
          <Edit className="w-4 h-4" />
          <span>Edit Category</span>
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-80">
            <h2 className="text-lg font-semibold mb-4">Update Category</h2>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name} (ID: {cat.id})
                </option>
              ))}
            </select>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setIsModalOpen(false)} className="px-3 py-1 bg-gray-200 rounded">Cancel</button>
              <button onClick={handleUpdateCategory} className="px-3 py-1 bg-blue-600 text-white rounded">Save</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl p-4 shadow-xs border border-gray-100">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Vehicle Images</h2>
        {allImages.length > 0 ? <ImageGallery images={allImages} /> : <p>No images</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-xs border border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Basic Information</h2>
          <InfoItem label="VIN" value={vehicle.vinNumber} Icon={ClipboardList} />
          <InfoItem label="Plate" value={vehicle.plateNumber} Icon={Car} />
          <InfoItem label="Make/Model" value={`${vehicle.make} ${vehicle.model}`} Icon={Car} color="orange" />
          <InfoItem label="Year" value={vehicle.year} Icon={Calendar} color="orange" />
          <InfoItem label="Color" value={vehicle.color} Icon={PaintBucket} color="green" />
          <InfoItem label="Category" value={vehicle.category} Icon={ClipboardList} color="green" />
          <InfoItem label="Doors/Seats" value={`${vehicle.numberOfDoors} / ${vehicle.seatingCapacity}`} Icon={Users} color="purple" />
        </div>

        <div className="bg-white rounded-xl p-4 shadow-xs border border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Registration & Insurance</h2>
          <InfoItem label="Reg. State" value={vehicle.registrationState} Icon={MapPin} />
          <InfoItem label="Reg. Date" value={formatDate(vehicle.registrationDate)} Icon={Calendar} />
          <InfoItem label="Expiry Date" value={formatDate(vehicle.expiryDate)} Icon={Calendar} />
          <InfoItem label="Insurance No." value={vehicle.insuranceNumber} Icon={ClipboardList} />
          <InfoItem label="Insurance Co." value={vehicle.insuranceCompany} Icon={User} />
          <InfoItem label="Ins. Expiry" value={formatDate(vehicle.insuranceExpiry)} Icon={Calendar} />
          <InfoItem label="Added On" value={formatDate(vehicle.createdAt)} Icon={Calendar} />
        </div>
      </div>
    </div>
  );
}

export default VehicleManagementDetail;