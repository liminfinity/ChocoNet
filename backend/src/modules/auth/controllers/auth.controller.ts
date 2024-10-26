import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { LoginDto, RegisterDto, RequestCodeDto, VerifyCodeDto } from '../dto';
import { AuthService } from '../services';
import type {
  LoginControllerResponse,
  RefreshControllerResponse,
  VerifyCodeControllerResponse,
} from './types';
import type { Request, Response } from 'express';
import {
  COOKIE_OPTIONS,
  COOKIES,
  JWT_ACCESS_TOKEN_EXPIRATION_TIME,
  JWT_REFRESH_TOKEN_EXPIRATION_TIME,
} from '../constants';
import { JwtAuthGuard } from '../guards';
import { AvatarsInterceptor } from '@/modules/user/interceptors';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginControllerResponse> {
    const { accessToken, refreshToken, user } = await this.authService.login(loginDto);

    res.cookie(COOKIES.ACCESS_TOKEN, accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: JWT_ACCESS_TOKEN_EXPIRATION_TIME,
      signed: true,
    });

    if (loginDto.rememberMe) {
      res.cookie(COOKIES.REFRESH_TOKEN, refreshToken, {
        ...COOKIE_OPTIONS,
        maxAge: JWT_REFRESH_TOKEN_EXPIRATION_TIME,
        httpOnly: true,
        signed: true,
      });
    }

    return user;
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<void> {
    const refreshToken: string = req.signedCookies[COOKIES.REFRESH_TOKEN];

    await this.authService.logout(refreshToken);

    res.clearCookie(COOKIES.ACCESS_TOKEN);
    res.clearCookie(COOKIES.REFRESH_TOKEN);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<RefreshControllerResponse> {
    const currentRefreshToken: string | undefined = req.signedCookies[COOKIES.REFRESH_TOKEN];

    const { accessToken, refreshToken, user } = await this.authService.refresh(currentRefreshToken);

    res.cookie(COOKIES.ACCESS_TOKEN, accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: JWT_ACCESS_TOKEN_EXPIRATION_TIME,
      signed: true,
    });

    res.cookie(COOKIES.REFRESH_TOKEN, refreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: JWT_REFRESH_TOKEN_EXPIRATION_TIME,
      httpOnly: true,
      signed: true,
    });

    return user;
  }

  @Post('register')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseInterceptors(AvatarsInterceptor)
  async register(
    @Body() registerDto: RegisterDto,
    @UploadedFiles() avatars: Express.Multer.File[],
  ): Promise<void> {
    registerDto.avatars = avatars;
    return this.authService.register(registerDto);
  }

  @Post('verify-code')
  @HttpCode(HttpStatus.OK)
  async verifyCode(
    @Body() verifyCodeDto: VerifyCodeDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<VerifyCodeControllerResponse> {
    const { accessToken, refreshToken, user } = await this.authService.verifyCode(verifyCodeDto);

    res.cookie(COOKIES.ACCESS_TOKEN, accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: JWT_ACCESS_TOKEN_EXPIRATION_TIME,
      signed: true,
    });

    res.cookie(COOKIES.REFRESH_TOKEN, refreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: JWT_REFRESH_TOKEN_EXPIRATION_TIME,
      httpOnly: true,
      signed: true,
    });

    return user;
  }

  @Post('request-new-code')
  @HttpCode(HttpStatus.NO_CONTENT)
  async requestNewCode(@Body() requestCodeDto: RequestCodeDto): Promise<void> {
    return this.authService.requestNewCode(requestCodeDto);
  }

  @Get('ping')
  @UseGuards(JwtAuthGuard)
  async ping(@Req() req: Request): Promise<{ message: 'pong' }> {
    console.log(req.user);
    return {
      message: 'pong',
    };
  }

  @Post('uploads')
  @UseInterceptors(AvatarsInterceptor)
  async uploads(@UploadedFiles() avatars: Express.Multer.File[]): Promise<void> {
    console.log(avatars.map((avatar) => avatar.filename));
    console.log(avatars[0]);
  }
}
