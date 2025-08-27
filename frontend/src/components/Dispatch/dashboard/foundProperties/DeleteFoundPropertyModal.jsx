import React from 'react';
import { X, Image, User, Calendar, AlertTriangle, MapPin, Hash } from 'lucide-react';

// Delete Found Property Modal Component
const DeleteFoundPropertyModal = ({ isOpen, onClose, onConfirm, item, isLoading }) => {
  if (!isOpen || !item) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'returned':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'unclaimed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Delete Property</h2>
              <p className="text-gray-600">This action cannot be undone.</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-3">You are about to delete:</p>

            <div className="flex items-center gap-3 mb-3">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white overflow-hidden">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt="Property"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = '<Image size={24} className="text-white" />';
                    }}
                  />
                ) : (
                  <Image size={24} />
                )}
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">
                  {item.itemDescription || 'Unknown Item'}
                </div>
                <div className="text-sm text-gray-600 flex items-center gap-1">
                  <MapPin size={12} />
                  {item.locationFound || 'No location'}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                    {item.status || 'pending'}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs text-gray-500">
              {item.driver && (
                <div className="flex items-center gap-1">
                  <User size={12} />
                  <span>Found by: {item.driver.firstName} {item.driver.lastName}</span>
                </div>
              )}
              {item.createdAt && (
                <div className="flex items-center gap-1">
                  <Calendar size={12} />
                  <span>Found on {formatDate(item.createdAt)}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Hash size={12} />
                <span className="font-mono">ID: {item.id}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Deleting...' : 'Delete Property'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteFoundPropertyModal;