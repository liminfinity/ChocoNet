import type { ISendMailOptions } from '@nestjs-modules/mailer';
import { join, resolve } from 'node:path';

/**
 * Creates an email for resetting a password.
 *
 * @param to Recipient email address.
 * @param verificationCode Verification code.
 * @param options Additional mail options.
 * @returns Mail options for sending the password reset email.
 */
export const createPasswordResetMail = (
  to: string,
  verificationCode: string,
  options?: ISendMailOptions,
): ISendMailOptions => ({
  to,
  subject: 'Сброс пароля',
  template: join(__dirname, '..', 'templates', 'resetPassword'),
  context: {
    verificationCode,
    logo: resolve('public', 'images', 'donats.avif'),
  },
  ...options,
});
