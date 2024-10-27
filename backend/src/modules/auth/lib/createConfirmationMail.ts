import type { ISendMailOptions } from '@nestjs-modules/mailer';
import { join } from 'node:path';

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
