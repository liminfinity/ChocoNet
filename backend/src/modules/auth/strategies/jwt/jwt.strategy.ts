import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { JwtPayload, ValidateResponse } from './jwt.types';
import { extractAccessTokenFromCookie } from '../../lib';
import { AuthRepository } from '../../repositories';
import { ENV } from '../../constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authRepository: AuthRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([extractAccessTokenFromCookie]),
      secretOrKey: ENV.JWT_SECRET,
    });
  }
  async validate({ sub, email }: JwtPayload): Promise<ValidateResponse> {
    const user = await this.authRepository.findById(sub);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      userId: user.id,
      email,
    };
  }
}
