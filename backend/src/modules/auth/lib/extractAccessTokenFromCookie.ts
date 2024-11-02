import { Request } from 'express';
import { COOKIES } from '../constants';

/**
 * Extracts the access token from the signed cookies of the request.
 *
 * @param req - The HTTP request object containing signed cookies.
 * @returns The access token as a string if present, otherwise null.
 */
export const extractAccessTokenFromCookie = (req: Request): string | null => {
  const accessToken: string | null = req?.signedCookies?.[COOKIES.ACCESS_TOKEN] ?? null;
  return accessToken;
};
