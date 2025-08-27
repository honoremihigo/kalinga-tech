// utils/otherRider.ts
export function getOtherRiderFields(riderType: string, otherRiderData: any) {
  if (riderType !== 'someoneElse') {
    return { firstName: null, lastName: null, email: null, phone: null };
  }
  return {
    firstName: otherRiderData?.firstName || null,
    lastName: otherRiderData?.lastName || null,
    email: otherRiderData?.email || null,
    phone: otherRiderData?.phone || null,
  };
}
