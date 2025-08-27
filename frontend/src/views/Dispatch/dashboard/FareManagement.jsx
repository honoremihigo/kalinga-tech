import React, { useState, useEffect } from 'react';
import { Edit, X, Save, DollarSign, Clock } from 'lucide-react';
import Swal from 'sweetalert2';
import categoryService from '../../../Services/Dispatch/CategoryManagement';
import fareService from '../../../Services/Dispatch/FareManagement';

const FareManagement = () => {
  const [categories, setCategories] = useState([]);
  const [fares, setFares] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  
  // Form data for fares
  const [fareFormData, setFareFormData] = useState({
    categoryId: '',
    fromDay: '',
    tillDay: '',
    fromTime: '',
    tillTime: '',
    startRate: '',
    startRatePerMile: '',
  });

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    loadFares();
  }, []);

  const loadFares = async () => {
    setLoading(true);
    try {
      const [fareData, categoryData] = await Promise.all([
        fareService.getAllFares(),
        categoryService.getAllCategories()
      ]);
      setFares(fareData);
      setCategories(categoryData);
    } catch (err) {
      console.error('Failed to fetch fares:', err);
      Swal.fire('Error', err.message || 'Failed to fetch fares', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleShowModal = (item = null) => {
    setCurrentItem(item);
    setFareFormData(
      item ? {
        categoryId: item.categoryId,
        fromDay: item.fromDay,
        tillDay: item.tillDay,
        fromTime: item.fromTime,
        tillTime: item.tillTime,
        startRate: item.startRate,
        startRatePerMile: item.startRatePerMile,
      } : {
        categoryId: '',
        fromDay: '',
        tillDay: '',
        fromTime: '',
        tillTime: '',
        startRate: '',
        startRatePerMile: '',
      }
    );
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentItem(null);
  };

  const handleFareFormChange = (e) => {
    const { name, value } = e.target;
    if (name === 'categoryId') {
      setFareFormData(prev => ({ ...prev, [name]: Number(value) }));
      return;
    }
    setFareFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentItem) {
        await fareService.updateFare(currentItem.id, fareFormData);
        Swal.fire('Updated!', 'Fare has been updated successfully.', 'success');
      } else {
        await fareService.createFare(fareFormData);
        Swal.fire('Created!', 'New fare has been created successfully.', 'success');
      }
      loadFares();
      handleCloseModal();
    } catch (err) {
      console.error('Operation failed:', err);
      Swal.fire('Error', err.message || 'Operation failed', 'error');
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete this fare. This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      try {
        await fareService.deleteFare(id);
        Swal.fire('Deleted!', 'Fare has been deleted successfully.', 'success');
        loadFares();
      } catch (err) {
        console.error('Failed to delete fare:', err);
        Swal.fire('Error', err.message || 'Failed to delete fare', 'error');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-sm text-gray-600">Loading fares...</span>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">Fare Management</h3>
          <button
            onClick={() => handleShowModal()}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            Add New Fare
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {fares.map((fare) => (
            <div key={fare.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">
                      {fare.category ? fare.category.name : 'Unknown Category'}
                    </h4>
                    <p className="text-gray-500 text-xs">
                      {fare.fromDay} - {fare.tillDay}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleShowModal(fare)}
                    className="text-blue-500 hover:text-blue-700 p-1"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(fare.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="Delete"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-xs text-gray-600">Start Rate</span>
                  <span className="font-semibold text-xs">${fare.startRate?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-xs text-gray-600">Per Mile</span>
                  <span className="font-semibold text-xs">${fare.startRatePerMile?.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock size={12} />
                <span>{fare.fromTime} - {fare.tillTime}</span>
              </div>
            </div>
          ))}
          {fares.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
              <DollarSign size={48} className="mb-4 text-gray-300" />
              <p className="text-sm">No fares found. Click "Add New Fare" to create one.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {currentItem ? 'Edit Fare' : 'Add Fare'}
              </h3>
              <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="categoryId"
                  value={fareFormData.categoryId}
                  onChange={handleFareFormChange}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    From Day <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="fromDay"
                    value={fareFormData.fromDay}
                    onChange={handleFareFormChange}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select day</option>
                    {daysOfWeek.map((day) => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Till Day <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="tillDay"
                    value={fareFormData.tillDay}
                    onChange={handleFareFormChange}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select day</option>
                    {daysOfWeek.map((day) => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    From Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    name="fromTime"
                    value={fareFormData.fromTime}
                    onChange={handleFareFormChange}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Till Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    name="tillTime"
                    value={fareFormData.tillTime}
                    onChange={handleFareFormChange}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Start Rate ($) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  name="startRate"
                  value={fareFormData.startRate}
                  onChange={handleFareFormChange}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Start Rate Per Mile ($) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  name="startRatePerMile"
                  value={fareFormData.startRatePerMile}
                  onChange={handleFareFormChange}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  placeholder="0.00"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 flex items-center"
                >
                  <Save className="w-4 h-4 mr-1" />
                  {currentItem ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default FareManagement;