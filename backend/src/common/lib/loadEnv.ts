import { config } from 'dotenv';

export const loadEnv = (): void => {
  const env = process.env?.NODE_ENV || 'development';

  config({ path: '.env', override: true });
  config({ path: '.env.local', override: true });

  config({ path: `.env.${env}`, override: true });
  config({ path: `.env.${env}.local`, override: true });
};
