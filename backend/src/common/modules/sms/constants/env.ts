import { loadEnv } from '@/common/lib';

loadEnv();

const { env } = process;

export const ENV = {
  SMS_API_KEY: env.SMS_API_KEY,
  SMS_FROM_NUMBER: env.SMS_FROM_NUMBER,
} as const;
