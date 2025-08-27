import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import { submitDriverRating } from '../../Services/Landing/driverApplicationService'; // 🔧 You'll create this

export default function RateDriverPage() {
  const { id } = useParams(); // Reservation ID
  const navigate = useNavigate();
  const [selectedRating, setSelectedRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const handleRatingClick = (rating) => {
    setSelectedRating(rating);
  };

  const handleSubmit = async () => {
    if (selectedRating === 0) {
      toast.error('Please select a star rating.');
      return;
    }

    const confirm = await Swal.fire({
      title: 'Submit Rating?',
      text: `You rated this trip ${selectedRating} star${selectedRating > 1 ? 's' : ''}.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, submit',
    });

    if (confirm.isConfirmed) {
      try {
        setSubmitting(true);
        await submitDriverRating(id, selectedRating);
        await Swal.fire({
          icon: 'success',
          title: 'Thank You!',
          text: 'Your rating has been submitted.',
        });
        navigate('/');
      } catch (error) {
        toast.error(error.message || 'Failed to submit rating.');
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <div className="h-[500px] bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Rate Your Driver</h1>
        <p className="text-gray-700 mb-6">
          Let us know how your experience was. Tap a star to rate.
        </p>

        <div className="flex justify-center mb-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleRatingClick(star)}
              className={`text-4xl mx-1 transition-colors ${
                star <= selectedRating ? 'text-yellow-500' : 'text-gray-300'
              }`}
            >
              ★
            </button>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : 'Submit Rating'}
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
