import { loadEnv } from '@/common/lib';

loadEnv();

const { env } = process;

export const ENV = {
  JWT_SECRET: env.JWT_SECRET,
  JWT_ISSUER: env.JWT_ISSUER,
} as const;
