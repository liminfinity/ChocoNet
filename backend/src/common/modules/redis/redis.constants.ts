import { loadEnv } from '@/common/lib';

loadEnv();

const { env } = process;

const DEFAULT_PORT = 6379;
const DEFAULT_HOST = 'localhost';

export const ENV = {
  REDIS_HOST: env.REDIS_HOST ?? DEFAULT_HOST,
  REDIS_PORT: Number(env.REDIS_PORT) ?? DEFAULT_PORT,
} as const;

export const TTL = 60 * 2; // 2 minutes
