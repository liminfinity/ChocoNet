/**
 * Deletes the '+' character from the start of a phone number, if it exists.
 *
 * @param phone - The phone number to delete the '+' from.
 * @returns The phone number without the '+'.
 */
export const deletePlusFromPhone = (phone: string): string => {
  return phone.startsWith('+') ? phone.slice(1) : phone;
};
