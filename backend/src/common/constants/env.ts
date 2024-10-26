const { env } = process;

const DEFAULT_PORT = 3000;
const DEFAULT_HOST = 'localhost';

export const ENV = {
  COOKIE_SECRET: env.COOKIE_SECRET,
  MAILER_PORT: env.MAILER_PORT,
  MAILER_HOST: env.MAILER_HOST,
  MAILER_USER: env.MAILER_USER,
  MAILER_PASSWORD: env.MAILER_PASSWORD,
  MAILER_FROM: env.MAILER_FROM,
  PORT: Number(env.PORT) ?? DEFAULT_PORT,
  HOST: env.HOST ?? DEFAULT_HOST,
} as const;
