import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function ApplicationPendingPage() {
  return (
    <div className="h-[620px] bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
        {/* Heading and Message */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Application Pending</h1>
          <p className="text-gray-700 mb-3">
            Your application has been received and is currently under review.
          </p>
          <p className="text-gray-600">
            You will be notified via email once your application is either accepted or rejected.
            Thank you for your time and patience.
          </p>
        </div>

        {/* Back Button */}
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
