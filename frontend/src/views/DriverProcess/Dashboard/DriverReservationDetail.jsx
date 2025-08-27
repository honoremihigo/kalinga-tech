// src/pages/DriverReservationDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, MapPin, CheckCircle2, FilePlus } from 'lucide-react';
import Swal from 'sweetalert2';
import {
  fetchReservationDetails,
  markReservationComplete,
  submitFoundItem,
} from '../../../Services/DriverService/driverReservationService';

function DriverReservationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [marking, setMarking] = useState(false);
  const [submittingFoundItem, setSubmittingFoundItem] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchReservationDetails(id);
        setReservation(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleComplete = async () => {
    const confirm = await Swal.fire({
      title: 'Mark as Complete?',
      text: 'This ride will be marked as completed.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, complete it!',
    });

    if (confirm.isConfirmed) {
      setMarking(true);
      try {
        await markReservationComplete(id);
        setReservation((prev) => ({ ...prev, reservationStatus: 'Completed' }));
        Swal.fire('Success!', 'Reservation marked as completed.', 'success');
      } catch (e) {
        console.error(e);
        Swal.fire('Error', e.message || 'Failed to complete reservation', 'error');
      } finally {
        setMarking(false);
      }
    }
  };

  const handleSubmitFoundItem = async (foundItemData) => {
    setSubmittingFoundItem(true);
    try {
      await submitFoundItem(foundItemData);
      return true;
    } catch (error) {
      Swal.fire({
        title: 'Submission Failed',
        text: error.message || 'There was an error submitting your found item report',
        icon: 'error',
        confirmButtonText: 'Try Again'
      });
      return false;
    } finally {
      setSubmittingFoundItem(false);
    }
  };

  const openDeclareFoundItemModal = () => {
    Swal.fire({
      title: '<div style="color: #1f2937; font-size: 24px; font-weight: 600; margin-bottom: 8px;">📦 Found Item Report</div>',
      html: `
        <style>
          .found-item-form {
            max-width:700px;
            margin: 0 auto;
            padding: 10px;
            height:480px;
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            border-radius: 16px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          }
          
          .form-group {
            margin-bottom: 20px;
            position: relative;
          }
          
          .form-label {
            display: block;
            font-weight: 600;
            color: #374151;
            margin-bottom: 8px;
            font-size: 14px;
            text-align: left;
            letter-spacing: 0.025em;
          }
          
          .form-input {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid #e5e7eb;
            border-radius: 12px;
            font-size: 14px;
            transition: all 0.3s ease;
            background: white;
            box-sizing: border-box;
          }
          
          .form-input:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
            transform: translateY(-1px);
          }
          
          .form-textarea {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid #e5e7eb;
            border-radius: 12px;
            font-size: 14px;
            transition: all 0.3s ease;
            background: white;
            resize: vertical;
            min-height: 80px;
            font-family: inherit;
            box-sizing: border-box;
          }
          
          .form-textarea:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
            transform: translateY(-1px);
          }
          
          .form-select {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid #e5e7eb;
            border-radius: 12px;
            font-size: 14px;
            transition: all 0.3s ease;
            background: white;
            cursor: pointer;
            box-sizing: border-box;
          }
          
          .form-select:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
            transform: translateY(-1px);
          }
          
          .required-indicator {
            color: #ef4444;
            margin-left: 4px;
          }
          
          .form-hint {
            font-size: 12px;
            color: #6b7280;
            margin-top: 2px;
            font-style: italic;
          }
          
          .category-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 4px;
            margin-top: 4px;
          }
          
          .category-option {
            padding: 8px 12px;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            background: white;
            cursor: pointer;
            transition: all 0.2s ease;
            text-align: center;
            font-size: 12px;
            font-weight: 500;
          }
          
          .category-option:hover {
            border-color: #3b82f6;
            background: #eff6ff;
          }
          
          .category-option.selected {
            border-color: #3b82f6;
            background: #3b82f6;
            color: white;
          }
          
          .modal-header {
            text-align: center;
            border-bottom: 2px solid #e5e7eb;
          }
          
          .modal-subtitle {
            color: #6b7280;
            font-size: 14px;
          }
        </style>
        
        <div class="found-item-form">
          <form id="found-item-form">
            <div class="form-group">
              <label class="form-label">Item Category <span class="required-indicator">*</span></label>
              <input name="itemCategory" class="form-input" placeholder="e.g., Phone, Wallet, Keys, Jewelry" required />
            </div>
            
            <div class="form-group">
              <label class="form-label">Item Description <span class="required-indicator">*</span></label>
              <input name="itemDescription" class="form-input" placeholder="e.g., Black iPhone 14 with blue case" required />
              <div class="form-hint">Be as specific as possible to help identify the item</div>
            </div>
            
            <div class="form-group">
              <label class="form-label">Where was it found?</label>
              <input name="foundLocation" class="form-input" placeholder="e.g., Back seat, floor, door pocket" />
              <div class="form-hint">Specify the exact location in or around the vehicle</div>
            </div>
            
            <div class="form-group">
              <label class="form-label">Additional Notes</label>
              <textarea name="additionalNotes" class="form-textarea" placeholder="Any additional details that might help identify the owner..."></textarea>
              <div class="form-hint">Include any distinguishing features or circumstances</div>
            </div>
          </form>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: submittingFoundItem ? 
        '<span style="font-weight: 600;">Submitting...</span>' : 
        '<span style="font-weight: 600;">📤 Submit Report</span>',
      cancelButtonText: '<span style="font-weight: 500;">Cancel</span>',
      customClass: {
        popup: 'swal2-popup-custom',
        confirmButton: 'swal2-confirm-custom',
        cancelButton: 'swal2-cancel-custom'
      },
      width: '600px',
      padding: '2rem',
      backdrop: 'rgba(0, 0, 0, 0.6)',
      allowOutsideClick: false,
      focusConfirm: false,
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        const form = document.getElementById('found-item-form');
        const formData = new FormData(form);
        
        const itemCategory = formData.get('itemCategory');
        const itemDescription = formData.get('itemDescription');
        
        if (!itemCategory) {
          Swal.showValidationMessage('Please select an item category');
          return false;
        }
        
        if (!itemDescription || itemDescription.trim().length < 3) {
          Swal.showValidationMessage('Please provide a detailed item description (at least 3 characters)');
          return false;
        }
        
        const foundItemData = {
          reservationId: id,
          itemCategory: itemCategory,
          itemDescription: itemDescription.trim(),
          foundLocation: formData.get('foundLocation')?.trim() || 'Not specified',
          additionalNotes: formData.get('additionalNotes')?.trim() || '',
        };

        return await handleSubmitFoundItem(foundItemData);
      },
      didOpen: () => {
        const style = document.createElement('style');
        style.textContent = `
          .swal2-popup-custom {
            border-radius: 20px !important;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
          }
          
          .swal2-confirm-custom {
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%) !important;
            border: none !important;
            border-radius: 12px !important;
            padding: 12px 24px !important;
            font-size: 14px !important;
            margin: 0 8px !important;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
            transition: all 0.2s ease !important;
          }
          
          .swal2-confirm-custom:hover {
            transform: translateY(-1px) !important;
            box-shadow: 0 8px 12px -1px rgba(0, 0, 0, 0.15) !important;
          }
          
          .swal2-cancel-custom {
            background: #f3f4f6 !important;
            color: #374151 !important;
            border: 2px solid #e5e7eb !important;
            border-radius: 12px !important;
            padding: 12px 24px !important;
            font-size: 14px !important;
            margin: 0 8px !important;
            transition: all 0.2s ease !important;
          }
          
          .swal2-cancel-custom:hover {
            background: #e5e7eb !important;
            transform: translateY(-1px) !important;
          }
          
          .swal2-actions {
            margin-top: 24px !important;
          }
        `;
        document.head.appendChild(style);
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const foundItemData = result.value;
        Swal.fire({
          title: 'Report Submitted Successfully! 🎉',
          html: `
          
            <p style="color: #6b7280; font-size: 14px; margin-top: 16px;">
              Our team will contact you if we need more information. Thank you for helping return lost items! 🙏
            </p>
          `,
          icon: 'success',
          confirmButtonText: 'Got it!',
          customClass: {
            confirmButton: 'swal2-confirm-custom'
          },
          width: '500px'
        });
      }
    });
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;
  if (!reservation) return <div className="p-8">Reservation not found</div>;

  const {
    pickup,
    dropoff,
    firstName,
    lastName,
    scheduledDateTime,
    driverEarningAmount,
    Rating,
    reservationStatus,
  } = reservation;
  const starCount = Number(Rating);

  const mapSrc = `https://www.google.com/maps/embed/v1/directions?key=AIzaSyCAo41N5qtFgFOcSyYqAimRIjQD5rgKkhs&origin=${encodeURIComponent(
    'current+location'
  )}&destination=${encodeURIComponent(
    pickup
  )}&waypoints=${encodeURIComponent(dropoff)}&mode=driving`;

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8 bg-gradient-to-br from-green-50 to-blue-50 min-h-[614px]">
      <div className="flex-1 bg-white rounded-lg shadow p-6 space-y-6">
        <h2 className="text-2xl font-semibold">Reservation Details</h2>
        <p><strong>Rider:</strong> {firstName} {lastName}</p>
        <p><strong>Scheduled:</strong> {new Date(scheduledDateTime).toLocaleString()}</p>
        <p><strong>Earnings:</strong> ${driverEarningAmount.toFixed(2)}</p>
        <p className="flex items-center">
          <strong>Rating:</strong>
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-5 h-5 ml-1 ${i < starCount ? 'text-yellow-500' : 'text-gray-300'}`} />
          ))}
        </p>
        <p className="flex items-center"><MapPin className="w-5 h-5 mr-2 text-gray-600" />Pickup: {pickup}</p>
        <p className="flex items-center"><MapPin className="w-5 h-5 mr-2 text-gray-600 rotate-180" />Dropoff: {dropoff}</p>
        <p><strong>Status:</strong> <span className="capitalize">{reservationStatus}</span></p>

        {reservationStatus !== 'Completed' && (
          <button
            onClick={handleComplete}
            disabled={marking}
            className={`mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded ${marking ? 'opacity-50 cursor-wait' : ''}`}
          >
            <CheckCircle2 className="inline-block w-5 h-5 mr-2 mb-1" />
            {marking ? 'Marking...' : 'Mark as Complete'}
          </button>
        )}

        <button
          onClick={openDeclareFoundItemModal}
          disabled={submittingFoundItem}
          className={`mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded flex items-center justify-center ${submittingFoundItem ? 'opacity-50 cursor-wait' : ''}`}
        >
          <FilePlus className="inline-block w-5 h-5 mr-2 mb-1" /> 
          {submittingFoundItem ? 'Submitting...' : 'Declare Found Item'}
        </button>

        <button
          onClick={() => navigate(-1)}
          className="mt-2 text-blue-600 hover:underline"
        >
          ← Back to Reservations
        </button>
      </div>

      <div className="flex-1 h-[550px] rounded-lg overflow-hidden shadow">
        <iframe
          title="Route Map"
          src={mapSrc}
          allowFullScreen
          className="w-full h-full border-0"
        />
      </div>
    </div>
  );
}

export default DriverReservationDetail;