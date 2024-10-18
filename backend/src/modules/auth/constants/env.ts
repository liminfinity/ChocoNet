const { env } = process;

export const ENV = {
  JWT_SECRET: env.JWT_SECRET,
  JWT_ISSUER: env.JWT_ISSUER,
};
