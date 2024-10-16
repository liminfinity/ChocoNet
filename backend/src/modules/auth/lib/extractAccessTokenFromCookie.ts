import { Request } from 'express';
import { COOKIES } from '../constants';

export const extractAccessTokenFromCookie = (req: Request): string | null => {
  const accessToken: string | null = req?.signedCookies?.[COOKIES.ACCESS_TOKEN] ?? null;
  return accessToken;
};
