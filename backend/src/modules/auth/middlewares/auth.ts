import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { COOKIES } from '../constants';
import { JwtTokenService } from '../modules';
import { UserFromToken } from '../strategies';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtTokenService: JwtTokenService) {}
  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    const currentRefreshToken: string | undefined = req.signedCookies[COOKIES.REFRESH_TOKEN];

    if (currentRefreshToken) {
      const user = await this.jwtTokenService.verifyRefreshToken(currentRefreshToken);

      if (!user) {
        return next();
      }

      req.user = {
        id: user.sub,
        email: user.email,
      } satisfies UserFromToken;
    }

    next();
  }
}
