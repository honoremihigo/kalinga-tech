import { useState, useEffect } from 'react';
import { Edit, Trash2Icon, X } from 'lucide-react';
import adminServiceInstance from '../../../Services/Dispatch/Auth';


const ReservationTable = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const data = await adminServiceInstance.getReservations();
        setReservations(data);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch reservations');
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  if (loading) {
    return <div className="p-4 text-center text-gray-600">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Reservations</h3>
      <table className="w-full text-left">
        <thead>
          <tr className="text-sm text-gray-600 border-b">
            <th className="p-2">ID</th>
            <th className="p-2">FULL NAME</th>
            <th className="p-2">EMAIL</th>
            <th className="p-2">PHONE</th>
            <th className="p-2">PICKUP</th>
            <th className="p-2">DROPOFF</th>
            <th className="p-2">DISTANCE</th>
            <th className="p-2">DURATION</th>
            <th className="p-2">PRICE</th>
            <th className="p-2">CREATED AT</th>
            <th className="p-2">ACTION</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((reservation,key) => (
            <tr key={reservation.id} className="border-b text-sm">
              <td className="p-2 text-teal-600">{key+1}</td>
              <td className="p-2">{reservation.fullName}</td>
              <td className="p-2">{reservation.email}</td>
              <td className="p-2">{reservation.phoneNumber}</td>
              <td className="p-2">{reservation.pickup}</td>
              <td className="p-2">{reservation.dropoff}</td>
              <td className="p-2">{reservation.distance} km</td>
              <td className="p-2">{reservation.duration}</td>
              <td className="p-2">${reservation.price.toFixed(2)}</td>
              <td className="p-2">{new Date(reservation.createdAt).toLocaleDateString()}</td>
              <td className="p-2 flex space-x-2">
                <button className="p-1 rounded-full bg-gray-100 hover:bg-gray-200">
                  <Edit className="w-4 h-4 text-blue-600" />
                </button>
                <button className="p-1 rounded-full bg-gray-100 hover:bg-gray-200">
                  <Trash2Icon className="w-4 h-4 text-red-600" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-600">1 of 1</p>
        <div className="flex space-x-2">
          <button className="px-3 py-1 border rounded-lg">Prev</button>
          <button className="px-3 py-1 bg-teal-600 text-white rounded-lg">1</button>
          <button className="px-3 py-1 border rounded-lg">Next</button>
        </div>
      </div>
    </div>
  );
};

export default ReservationTable;