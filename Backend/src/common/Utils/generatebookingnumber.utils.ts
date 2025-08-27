export function generateBookingNumber(): string {
  const prefix = 'BOOK';
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD
  const randomSuffix = Math.floor(100 + Math.random() * 900); // 3-digit random number
  return `${prefix}-${date}-${randomSuffix}`;
}