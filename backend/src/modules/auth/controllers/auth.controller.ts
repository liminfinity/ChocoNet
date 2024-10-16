import { Body, Controller, Post, Res } from '@nestjs/common';
import { LoginDto } from '../dto';
import { AuthService } from '../services';
import type { LoginControllerResponse } from './types';
import type { Response } from 'express';
import {
  COOKIE_OPTIONS,
  COOKIES,
  JWT_ACCESS_TOKEN_EXPIRATION_TIME,
  JWT_REFRESH_TOKEN_EXPIRATION_TIME,
} from '../constants';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginControllerResponse> {
    const { accessToken, refreshToken, user } = await this.authService.login(loginDto);

    res.cookie(COOKIES.ACCESS_TOKEN, accessToken, {
      sameSite: COOKIE_OPTIONS.sameSite,
      maxAge: JWT_ACCESS_TOKEN_EXPIRATION_TIME,
    });

    if (loginDto.rememberMe) {
      res.cookie(COOKIES.REFRESH_TOKEN, refreshToken, {
        ...COOKIE_OPTIONS,
        maxAge: JWT_REFRESH_TOKEN_EXPIRATION_TIME,
      });
    }

    return user;
  }
}
