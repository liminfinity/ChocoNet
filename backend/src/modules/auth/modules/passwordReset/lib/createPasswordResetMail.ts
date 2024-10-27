import type { ISendMailOptions } from '@nestjs-modules/mailer';
import { join, resolve } from 'node:path';

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
