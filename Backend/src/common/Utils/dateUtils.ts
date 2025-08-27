// utils/dateUtils.ts
export function parseScheduledDateTime(dateTimeString?: string | null): Date | null {
  if (!dateTimeString) return null;
  const date = new Date(dateTimeString);
  return isNaN(date.getTime()) ? null : date;
}
