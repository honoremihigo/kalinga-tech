import React, { useState, useEffect } from 'react';
import { Save, X, Edit, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import FeeManagementService from '../../../Services/Dispatch/FeeManagement';

const FeeManagement = () => {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentFee, setCurrentFee] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    bookingFee: '',
    feePerMile: '',
  });

  useEffect(() => {
    loadFees();
  }, []);

  const loadFees = async () => {
    setLoading(true);
    try {
      const data = await FeeManagementService.getCategories();
      setFees(data);
    } catch (err) {
      Swal.fire('Error', err.message || 'Failed to fetch fees', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleShowModal = (fee = null) => {
    setCurrentFee(fee);
    setFormData(
      fee
        ? {
            name: fee.name,
            description: fee.description,
            bookingFee: fee.bookingFee,
            feePerMile: fee.feePerMile,
          }
        : { name: '', description: '', bookingFee: '', feePerMile: '' }
    );
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentFee(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentFee) {
        await FeeManagementService.updateCategory(currentFee.id, formData);
        Swal.fire('Updated!', 'Fee category has been updated.', 'success');
      } else {
        await FeeManagementService.createCategory(formData);
        Swal.fire('Created!', 'New fee category has been added.', 'success');
      }
      handleCloseModal();
      loadFees();
    } catch (err) {
      Swal.fire('Error', err.message || 'Operation failed', 'error');
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the fee category.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      try {
        await FeeManagementService.deleteCategory(id);
        Swal.fire('Deleted!', 'Fee category has been deleted.', 'success');
        loadFees();
      } catch (err) {
        Swal.fire('Error', err.message || 'Failed to delete category', 'error');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-sm text-gray-600">Loading fees...</span>
      </div>
    );
  }



  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">Fee Management</h3>
        <button
          onClick={() => handleShowModal()}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600"
        >
          Add New Category
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Category Name</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Description</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700">Booking Fee</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700">Fee Per Mile</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700">Created</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {fees.map((fee) => (
              <tr key={fee.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-left text-xs font-medium text-gray-900">{fee.name}</td>
                <td className="px-4 py-2 text-left text-xs text-gray-600">{fee.description}</td>
                <td className="px-4 py-2 text-center text-xs text-gray-900">${fee.bookingFee?.toFixed(2)}</td>
                <td className="px-4 py-2 text-center text-xs text-gray-900">${fee.feePerMile?.toFixed(2)}</td>
                <td className="px-4 py-2 text-center text-xs text-gray-500">
                  {new Date(fee.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 text-center">
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => handleShowModal(fee)}
                      className="text-blue-500 hover:text-blue-700"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(fee.id)}
                      className="text-red-500 hover:text-red-700"
                      title="Delete"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {fees.length === 0 && (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center text-gray-500 text-sm">
                  No fee categories found. Click  Add New Category to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {currentFee ? 'Edit Fee Category' : 'Add Fee Category'}
              </h3>
              <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

    

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  placeholder="e.g., Standard, Premium, Economy"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  rows="3"
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Brief description of this fee category"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Booking Fee ($) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  name="bookingFee"
                  value={formData.bookingFee}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Fee Per Mile ($) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  name="feePerMile"
                  value={formData.feePerMile}
                  onChange={handleFormChange}
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
                  {currentFee ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeeManagement;