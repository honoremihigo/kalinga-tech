import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Copy, ArrowLeft } from 'lucide-react';
import bookingService from '../../Services/Dispatch/bookingService';

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [sessionId, setSessionId] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const sessionIdParam = searchParams.get('session_id');
    if (sessionIdParam) {

      setSessionId(sessionIdParam);
    }
  }, [searchParams]);



  useEffect(() => {

    if (sessionId) {

      handleSendingSessionId(sessionId)

    }

  }, [sessionId])


  const handleSendingSessionId = async (session_id) => {

    try {

      const response = await bookingService.sendSessionId(session_id)

      console.log('response  of sending :', response);




    } catch (error) {
      console.log(error);

    }

  }


  const copySessionId = () => {
    navigator.clipboard.writeText(sessionId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-[500px] bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
        {/* Success Icon */}
        <div className="mb-6">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Thank You!</h1>
          <p className="text-gray-600 mb-4">
            We have your location. Our driver has been notified.
          </p>
          <p className="text-gray-600">
            Please check your phone for a message with a tracking link to monitor your driver&apos;s location.
          </p>
        </div>

      </div>
    </div>
  );
}