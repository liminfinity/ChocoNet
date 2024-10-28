import { loadEnv } from '../lib';

loadEnv();

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
  NODE_ENV: env.NODE_ENV,
  LOG_LEVEL: env.LOG_LEVEL,
} as const;

export const IS_DEV = ENV.NODE_ENV === 'development';
export const IS_PROD = ENV.NODE_ENV === 'production';
