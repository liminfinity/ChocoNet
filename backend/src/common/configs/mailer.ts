import type { MailerOptions } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { ENV } from '../constants';

export const mailerConfig: MailerOptions = {
  transport: {
    host: ENV.MAILER_HOST,
    port: ENV.MAILER_PORT,
    auth: {
      user: ENV.MAILER_USER,
      pass: ENV.MAILER_PASSWORD,
    },
  },
  defaults: {
    from: ENV.MAILER_FROM,
  },
  template: {
    adapter: new PugAdapter(),
    options: {
      strict: true,
    },
  },
  verifyTransporters: true,
};
