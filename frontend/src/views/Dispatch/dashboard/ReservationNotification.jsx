import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import reservationService from '../../../Services/Dispatch/ReservationManagement';

const POLL_INTERVAL = 10000;

function ReservationNotification() {
  const [lastReservationIds, setLastReservationIds] = useState(new Set());

  const checkNewReservations = async () => {
    try {
      const data = await reservationService.checkNewReservations();

      if (data.hasNewReservation) {
        // Show toast notification
        toast.info(`New Reservation${data.newReservations.length > 1 ? 's' : ''} Received!`, {
          position: "bottom-right",
          autoClose: 5000,
          pauseOnHover: true,
          closeOnClick: true,
          draggable: true,
          // optionally add a sound here or style toast to your liking
        });

        // Update known IDs to avoid repeat notifications
        const newIds = new Set(data.newReservations.map(r => r.id));
        setLastReservationIds(newIds);
      }
    } catch (error) {
      console.error('Error fetching new reservations:', error);
    }
  };

  useEffect(() => {
    checkNewReservations();
    const interval = setInterval(checkNewReservations, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <ToastContainer />
    </>
  );
}

export default ReservationNotification;
