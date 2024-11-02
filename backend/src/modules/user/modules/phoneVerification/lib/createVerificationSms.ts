/**
 * Creates a verification SMS message from the given code.
 *
 * @param code Verification code to include in the message.
 * @returns Verification SMS message.
 */
export const createVerificationSms = (code: string): string => {
  return `Ваш код подтверждения: ${code}`;
};
