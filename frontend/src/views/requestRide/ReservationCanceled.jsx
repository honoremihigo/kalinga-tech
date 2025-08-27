import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import { cancelDriverApplication } from '../../Services/Landing/driverApplicationService';

export default function ReservationCanceledPage() {
  const { id } = useParams(); // Application ID
  const navigate = useNavigate();
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    if (!reason.trim()) {
      toast.error('Please enter a reason for cancellation.');
      return;
    }

    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'Sometimes, dreams don’t go as planned. Do you really want to cancel your journey?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e3342f',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, cancel it',
    });

    if (confirm.isConfirmed) {
      try {
        setLoading(true);
        await cancelDriverApplication(id, reason);
        await Swal.fire({
          icon: 'success',
          title: 'Cancelled',
          text: 'Your application has been cancelled. Some stories just end sooner than others.',
        });
        navigate('/');
      } catch (error) {
        toast.error(error.message || 'Failed to cancel application.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="h-[620px] bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">A Bittersweet Goodbye</h1>
          <p className="text-gray-700 mb-3">
            Every journey starts with hope. But sometimes, the path takes a different turn.
          </p>
          <p className="text-gray-600">
            If you’ve decided not to move forward, please share your reason below.
          </p>
        </div>

        <div className="mb-4 text-left">
          <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
            Reason for Cancellation
          </label>
          <textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
            className="w-full border rounded-lg px-3 py-2 text-sm text-gray-800 shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
            placeholder="Write something from the heart..."
          />
        </div>

        <button
          onClick={handleCancel}
          disabled={loading}
          className="w-full mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
        >
          {loading ? 'Cancelling...' : 'Cancel Application'}
        </button>

        <Link
          to="/"
          className="mt-6 inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Link>
      </div>
    </div>
  );
}
