import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { ValidateResponse } from './validateResponse.types';
import { extractAccessTokenFromCookie } from '../../lib';
import { ENV } from '../../constants';
import { UserService } from '@/modules/user';
import { JwtPayload } from '../../modules/jwtTokens';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([extractAccessTokenFromCookie]),
      secretOrKey: ENV.JWT_SECRET,
    });
  }
  async validate({ sub, email }: JwtPayload): Promise<ValidateResponse> {
    const user = await this.userService.findById(sub);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      userId: user.id,
      email,
    };
  }
}
