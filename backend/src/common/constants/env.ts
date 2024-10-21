const { env } = process;

export const ENV = {
  COOKIE_SECRET: env.COOKIE_SECRET,
} as const;
