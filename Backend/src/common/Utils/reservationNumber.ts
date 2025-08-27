// utils/reservationNumber.ts
export function generateReservationNumber(firstName: string, lastName: string): string {
  const prefix = 'ABY-';
  const fNamePart = (firstName.slice(0, 2) || 'XX').toUpperCase();
  const lNamePart = (lastName.slice(0, 2) || 'XX').toUpperCase();

  // Generate 4 random digits as a string, padded with leading zeros if needed
  const randomDigits = Math.floor(1000 + Math.random() * 9000).toString();

  return `${prefix}${fNamePart}${lNamePart}${randomDigits}`;
}
