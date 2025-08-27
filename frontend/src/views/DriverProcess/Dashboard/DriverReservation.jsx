import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock,
  MapPin,
  User,
  ChevronRight,
} from 'lucide-react';

import {
  fetchDriverReservations,
} from '../../../Services/DriverService/driverReservationService';
import placefrombottle from "../../../assets/static/image.svg";
function DriverReservation() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadReservations = async () => {
      try {
        const data = await fetchDriverReservations();
        setReservations(data);
        setError(null); // Clear any previous errors
      } catch (err) {
        // Only set error if actual fetch failed
        setError('Failed to load reservations');
      } finally {
        setLoading(false);
      }
    };
    loadReservations();
  }, []);

  const handleViewDetails = (id) => {
    navigate(`${id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8  bg-gradient-to-br from-green-50 to-blue-50 h-[614px]">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Reservations</h1>

      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      ) : reservations.length === 0 ? (
        <div
          className="relative rounded-xl overflow-hidden h-64 flex items-center justify-center text-center mb-6"
          style={{
            backgroundImage: `url(${placefrombottle})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <h2 className="relative z-10 text-white text-3xl font-bold">
            No Reservations Found
          </h2>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reservations.map(r => (
            <div
              key={r.id}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    r.reservationStatus === 'Completed' ? 'bg-green-100 text-green-800' :
                    r.reservationStatus === 'Cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {r.reservationStatus}
                  </span>
                  <span className="text-gray-500 text-sm">
                    #{r.ReservationNumber}
                  </span>
                </div>

                <div className="flex items-center mb-2">
                  <User className="w-5 h-5 text-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-800">
                    {r.firstName} {r.lastName}
                  </h3>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="text-gray-600">
                      {new Date(r.scheduledDateTime).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="w-4 h-4 text-gray-500 mr-2 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-gray-600">
                        <span className="font-medium">From:</span> {r.pickup}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">To:</span> {r.dropoff}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center border-t border-gray-100 pt-4">
                  <div className="text-blue-600 font-medium">
                    ${r.driverEarningAmount.toFixed(2)}
                  </div>
                  <button
                    onClick={() => handleViewDetails(r.id)}
                    className="flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm"
                  >
                    View Details
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DriverReservation;
