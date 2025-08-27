export function prepareEmailData(reservation: any, isClient = true) {
  const frontendBaseUrl = process.env.FRONTEND_URL || 'https://abyride.com'; // fallback
  const cancelUrl = `${frontendBaseUrl}/reservation-canceling/${reservation.id}`;

  const commonData = {
    firstName: reservation.firstName,
    lastName: reservation.lastName,
    pickup: reservation.pickup,
    dropoff: reservation.dropoff,
    scheduledDateTime: reservation.scheduledDateTime?.toLocaleString() ?? 'Not scheduled',
    numberOfPassengers: reservation.numberOfPassengers,
    distance: reservation.distance,
    duration: reservation.duration,
    price: `USD ${reservation.price.toFixed(2)}`,
    reservationNumber: reservation.ReservationNumber,
  };

  if (isClient) {
    return {
      ...commonData,
      paymentUrl: reservation.paymentUrl || '',
      paymentNote: '',
      cancelUrl, // Include cancel link here
    };
  } else {
    return {
      ...commonData,
      customerPhone: reservation.phoneNumber,
      customerEmail: reservation.email,
      reservationId: reservation.id,
    };
  }
}
