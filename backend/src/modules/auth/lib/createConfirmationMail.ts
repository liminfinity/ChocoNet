import type { ISendMailOptions } from '@nestjs-modules/mailer';
import { join } from 'node:path';

/**
 * Creates an email for confirming an email address.
 *
 * @param to Recipient email address.
 * @param verificationCode Verification code.
 * @param options Additional mail options.
 * @returns Mail options for sending the confirmation email.
 */
export const createConfirmationMail = (
  to: string,
  verificationCode: string,
  options?: ISendMailOptions,
): ISendMailOptions => ({
  to,
  subject: 'Подтверждение почты',
  template: join(__dirname, '..', 'templates', 'emailConfirmation'),
  context: {
    verificationCode,
  },
  ...options,
});
