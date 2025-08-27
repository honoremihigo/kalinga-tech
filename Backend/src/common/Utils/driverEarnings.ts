/**
 * Calculate driver and AbyRide earnings from total price and driver percentage
 * @param totalPrice - total price paid by rider
 * @param driverPercentage - decimal fraction (e.g., 0.6 for 60%)
 * @returns { driverEarning: number, abyrideEarning: number }
 */
export function calculateEarnings(totalPrice: number, driverPercentage: number = 0.6) {
  if (totalPrice <= 0 || driverPercentage <= 0 || driverPercentage > 1) {
    return { driverEarning: 0, abyrideEarning: 0 };
  }
  const driverEarning = parseFloat((totalPrice * driverPercentage).toFixed(2));
  const abyrideEarning = parseFloat((totalPrice - driverEarning).toFixed(2));
  return { driverEarning, abyrideEarning };
}
