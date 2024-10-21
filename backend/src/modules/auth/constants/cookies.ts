import { CookieOptions } from 'express';

export const COOKIES = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
} as const;

export const COOKIE_OPTIONS: CookieOptions = {
  sameSite: 'strict',
} as const;
