import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit3, Trash2, Check, AlertTriangle, ClipboardList, Calendar, User, RefreshCw, Eye, ChevronLeft, ChevronRight, Package } from 'lucide-react';
import lostPropertiesService from '../../../../Services/Dispatch/lostPropertyService';
import bookingService from '../../../../Services/Dispatch/bookingService';




const MarkAsFoundModal = ({ isOpen, onClose, onSubmit, property, isLoading }) => {
  const [formData, setFormData] = useState({
    returnerName: '',
    returnerPhone: '',
    returnerEmail: '',
    returnerDescription: ''
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (isOpen && !property) {
      setFormData({
        returnerName: '',
        returnerPhone: '',
        returnerEmail: '',
        returnerDescription: ''
      });
      setFormErrors({});
    }
  }, [isOpen, property]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Use service validation for returner data
    const validation = lostPropertiesService.validateReturnerData ? 
      lostPropertiesService.validateReturnerData(formData) : 
      { isValid: true, errors: {} };

    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    onSubmit(formData);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Mark as Found</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={isLoading}
            >
              ✕
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-green-50 border border-green-200 p-3 rounded-lg mb-4">
            <p className="text-green-700 text-sm">
              <strong>Item:</strong> {property?.itemName}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Returner Name *
            </label>
            <input
              type="text"
              value={formData.returnerName}
              onChange={(e) => handleInputChange('returnerName', e.target.value)}
              placeholder="Who found/returned the item?"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                formErrors.returnerName ? 'border-red-300' : 'border-gray-300'
              }`}
              disabled={isLoading}
            />
            {formErrors.returnerName && (
              <p className="text-red-600 text-sm mt-1">{formErrors.returnerName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              value={formData.returnerPhone}
              onChange={(e) => handleInputChange('returnerPhone', e.target.value)}
              placeholder="+250788123456"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                formErrors.returnerPhone ? 'border-red-300' : 'border-gray-300'
              }`}
              disabled={isLoading}
            />
            {formErrors.returnerPhone && (
              <p className="text-red-600 text-sm mt-1">{formErrors.returnerPhone}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              value={formData.returnerEmail}
              onChange={(e) => handleInputChange('returnerEmail', e.target.value)}
              placeholder="returner@example.com"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                formErrors.returnerEmail ? 'border-red-300' : 'border-gray-300'
              }`}
              disabled={isLoading}
            />
            {formErrors.returnerEmail && (
              <p className="text-red-600 text-sm mt-1">{formErrors.returnerEmail}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.returnerDescription}
              onChange={(e) => handleInputChange('returnerDescription', e.target.value)}
              placeholder="Additional details about where/how the item was found..."
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none ${
                formErrors.returnerDescription ? 'border-red-300' : 'border-gray-300'
              }`}
              disabled={isLoading}
            />
            {formErrors.returnerDescription && (
              <p className="text-red-600 text-sm mt-1">{formErrors.returnerDescription}</p>
            )}
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {isLoading ? 'Updating...' : 'Mark as Found'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MarkAsFoundModal;