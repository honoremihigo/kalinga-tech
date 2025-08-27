import React, { useState, useEffect } from 'react';
import { X, MapPin, Navigation, Globe, Calendar, AlertTriangle, User, Hash } from 'lucide-react';

// Delete Location Modal Component
const DeleteLocationModal = ({ isOpen, onClose, onConfirm, location, isLoading }) => {
  if (!isOpen || !location) return null;

  const formatCoordinates = (lat, lng) => {
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
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
              <h2 className="text-xl font-semibold text-gray-900">Delete Location</h2>
              <p className="text-gray-600">This action cannot be undone.</p>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-3">You are about to delete:</p>
            
            <div className="flex items-center gap-3 mb-3">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
                <MapPin size={24} />
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">
                  {location.name || 'Unnamed Location'}
                </div>
                <div className="text-sm text-gray-600">{location.address || 'No address'}</div>
                <div className="text-sm text-gray-500 font-mono">
                  {formatCoordinates(location.latitude, location.longitude)}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
              {location.created_at && (
                <span>Added {new Date(location.created_at).toLocaleDateString()}</span>
              )}
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
              {isLoading ? 'Deleting...' : 'Delete Location'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


export default DeleteLocationModal;