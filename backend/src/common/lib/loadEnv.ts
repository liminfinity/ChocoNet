import { config } from 'dotenv';

/**
 * Loads environment variables from .env, .env.local, .env.{NODE_ENV}, and
 * .env.{NODE_ENV}.local. The local files are loaded last, so they can override
 * the non-local files.
 *
 * If NODE_ENV is not set, it defaults to 'development'.
 *
 * The files are loaded in the following order, with the last file overriding
 * the previous ones:
 *
 * 1. .env
 * 2. .env.local
 * 3. .env.{NODE_ENV}
 * 4. .env.{NODE_ENV}.local
 *
 * This allows you to have environment variables that are shared between all
 * environments, and environment variables that are specific to a particular
 * environment.
 */
export const loadEnv = (): void => {
  const env = process.env?.NODE_ENV || 'development';

  config({ path: '.env', override: true });
  config({ path: '.env.local', override: true });

  config({ path: `.env.${env}`, override: true });
  config({ path: `.env.${env}.local`, override: true });
};
