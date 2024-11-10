import { loadEnv } from '@/common/lib';

loadEnv();

const { env } = process;

export const ENV = {
  GEOLOCATION_API_KEY: env.GEOLOCATION_API_KEY,
} as const;
