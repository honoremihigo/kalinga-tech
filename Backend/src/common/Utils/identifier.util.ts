export function isEmail(identifier: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
}

export function isPhone(identifier: string): boolean {
  return /^\+?\d{10,15}$/.test(identifier); // Simple international format
}
