import React, { useState, useEffect } from 'react';
import { User, Phone, Calendar, AlertCircle, LogOut, Mail } from 'lucide-react';
import AuthService from '../../../Services/ClientProcess/Auth';
import { useNavigate } from 'react-router-dom';

const ClientProfile = () => {
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const getProfile = async () => {
    try {
      setLoading(true);
      const res = await AuthService.getProfile();
      setClient(res?.client);
    } catch (err) {
      console.error('Profile fetch error:', err);
      setError('Failed to fetch profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      navigate('/AbyrideClient');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  useEffect(() => {
    getProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-[#47B2E4] to-[#293751]">
        <div className="bg-white p-6 rounded-xl shadow-xl text-center">
          <div className="animate-spin h-10 w-10 border-4 border-[#47B2E4] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-slate-300 via-blue-50 to-cyan-200">
        <div className="bg-white p-6 rounded-xl shadow-xl text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold">Error</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={getProfile}
            className="mt-4 bg-[#47B2E4] text-white px-4 py-2 rounded hover:bg-[#293751] transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-300 via-blue-50 to-cyan-200 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-[#47B2E4] text-white flex items-center justify-center text-xl font-bold shadow-lg">
              {getInitials(client?.firstName, client?.lastName)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {client?.firstName} {client?.lastName}
              </h1>
              <p className="text-sm text-gray-500">{client?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 text-white bg-[#293751] px-4 py-2 rounded-lg hover:bg-white hover:text-[#293751] border border-white transition"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>

        {/* Info Section */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl bg-gradient-to-r from-[#47B2E4]/10 to-[#293751]/10">
            <div className="flex items-center mb-2">
              <User className="w-5 h-5 text-[#47B2E4] mr-2" />
              <h3 className="font-semibold text-gray-700">Name</h3>
            </div>
            <p className="text-gray-800 font-medium">
              {client?.firstName} {client?.lastName}
            </p>
          </div>

          <div className="p-6 rounded-xl bg-gradient-to-r from-[#47B2E4]/10 to-[#293751]/10">
            <div className="flex items-center mb-2">
              <Phone className="w-5 h-5 text-[#47B2E4] mr-2" />
              <h3 className="font-semibold text-gray-700">Phone</h3>
            </div>
            <p className="text-gray-800 font-medium">{client?.phoneNumber}</p>
          </div>

          <div className="p-6 rounded-xl bg-gradient-to-r from-[#47B2E4]/10 to-[#293751]/10">
            <div className="flex items-center mb-2">
              <Mail className="w-5 h-5 text-[#47B2E4] mr-2" />
              <h3 className="font-semibold text-gray-700">Email</h3>
            </div>
            <p className="text-gray-800 font-medium">{client?.email}</p>
          </div>
          
          <div className="p-6 rounded-xl bg-gradient-to-r from-[#47B2E4]/10 to-[#293751]/10">
            <div className="flex items-center mb-2">
              <Calendar className="w-5 h-5 text-[#47B2E4] mr-2" />
              <h3 className="font-semibold text-gray-700">Registered</h3>
            </div>
            <p className="text-gray-800 font-medium">{formatDate(client?.createdAt)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;
