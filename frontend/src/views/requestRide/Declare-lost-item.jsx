import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ArrowLeft, Package, DollarSign, MapPin, Phone, Clock, FileText } from 'lucide-react';
import { submitLostItem } from '../../Services/Landing/driverApplicationService'; // Adjust path as needed

export default function DeclareLostItemPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    itemCategory: '',
    description: '',
    approximateValue: '',
    lostLocation: '',
    preferredContactMethod: '',
    bestContactTime: '',
    additionalNotes: '',
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!form.itemCategory.trim() || !form.description.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Missing Fields',
        text: 'Please fill in at least the item category and description.',
      });
      return;
    }

    const confirm = await Swal.fire({
      title: 'Declare Lost Item?',
      text: `You are declaring a lost item under reservation ${id}. Continue?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, declare',
      cancelButtonText: 'Cancel',
    });

    if (!confirm.isConfirmed) return;

    try {
      setSubmitting(true);
      await submitLostItem(id, form);
      await Swal.fire({
        icon: 'success',
        title: 'Lost Item Declared',
        text: 'Thank you. We will get back to you soon.',
      });
      setForm({
        itemCategory: '',
        description: '',
        approximateValue: '',
        lostLocation: '',
        preferredContactMethod: '',
        bestContactTime: '',
        additionalNotes: '',
      });
      navigate('/');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: error.message || 'Failed to declare lost item.',
      });
    } finally {
      setSubmitting(false);
    }
  };

const labelClasses = 'flex items-center text-black font-medium mb-1 text-sm';
  const iconClasses = 'w-4 h-4 mr-2 text-blue-600';

  return (
    <div className="min-h-screen bg-blue-50 py-4 px-3">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-5 md:p-8">
          <div className="text-center mb-5">
            <h1 className="text-xl font-bold text-black mb-1">Declare Lost Item</h1>
         
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Item Category */}
            <div className="md:col-span-2">
              <label className={labelClasses}>
                <Package className={iconClasses} />
                Item Category *
              </label>
              <input
                type="text"
                name="itemCategory"
                value={form.itemCategory}
                onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-black"
                 
                placeholder="E.g., Wallet, Phone, Bag, Keys"
                required
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className={labelClasses}>
                <FileText className={iconClasses} />
                Description *
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                 className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-black"
                 
                placeholder="Detailed description including color, brand, size, distinctive features"
                required
              />
            </div>

            {/* Approximate Value */}
            <div>
              <label className={labelClasses}>
                <DollarSign className={iconClasses} />
                Approximate Value (USD)
              </label>
              <input
                type="number"
                name="approximateValue"
                value={form.approximateValue}
                onChange={handleChange}
                 className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-black"
                 
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>

            {/* Lost Location */}
            <div>
              <label className={labelClasses}>
                <MapPin className={iconClasses} />
                Lost Location
              </label>
              <input
                type="text"
                name="lostLocation"
                value={form.lostLocation}
                onChange={handleChange}
               className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-black"
                 
                placeholder="Where did you lose the item?"
              />
            </div>

    {/* Description */}
            <div className="md:col-span-2 py-1 mb-4">
              <label className={labelClasses}>
                <Phone className={iconClasses} />
                Contact Method
              </label>
              <select
                name="preferredContactMethod"
                value={form.preferredContactMethod}
                onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 px-3  text-sm text-black"
                >
                <option value="">Select method</option>
                <option value="Phone">Phone</option>
                <option value="Email">Email</option>
              </select>
            </div>
 

           <div className="md:col-span-2 py-1 mb-4">
              <label className={labelClasses}>
                <Clock className={iconClasses} />
                Best Contact Time
              </label>
              <input
                type="datetime-local"
                name="bestContactTime"
                value={form.bestContactTime}
                onChange={handleChange}
             className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-black"
                 
              />
            </div>


            {/* Additional Notes */}
            <div className="md:col-span-2">
              <label className={labelClasses}>
                <FileText className={iconClasses} />
                Additional Notes
              </label>
              <textarea
                name="additionalNotes"
                value={form.additionalNotes}
                onChange={handleChange}
                rows={2}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-black"
                placeholder="Any additional information that might help us"
              />
            </div>
          </div>
                {/* Preferred Contact Method - Reduced size */}
         

          {/* Submit Button */}
          <div className="mt-5 flex flex-col sm:flex-row gap-2 justify-center">
            <button
              disabled={submitting}
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </span>
              ) : (
                'Declare Lost Item'
              )}
            </button>

            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium rounded-md transition-all text-center flex items-center justify-center"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </button>
          </div>

          {/* Help Text */}
          <div className="mt-3 p-2 bg-blue-50 rounded-md border border-blue-100">
            <p className="text-xs text-gray-700 text-center">
              <strong>Note:</strong> Fields marked with * are required.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}