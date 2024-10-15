import { Body, Controller, Post, Res } from '@nestjs/common';
import { LoginDto } from '../dto';
import { AuthService } from '../services';
import type { LoginControllerResponse } from './types';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginControllerResponse> {
    const { accessToken, refreshToken, ...result } = await this.authService.login(loginDto);

    res.cookie('accessToken', accessToken);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
    });

    return result;
  }
}
