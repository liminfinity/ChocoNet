import {
  Body,
  Controller,
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
import {
  LoginControllerResponse,
  RefreshControllerResponse,
  VerifyCodeControllerResponse,
} from './dto';
import type { Request, Response } from 'express';
import { COOKIE_OPTIONS, COOKIES, ROUTER_PATHS } from '../constants';
import { JwtAuthGuard } from '../guards';
import { AvatarsInterceptor } from '@/modules/user/interceptors';
import { ACCESS_TOKEN_EXPIRATION_TIME, REFRESH_TOKEN_EXPIRATION_TIME } from '../modules/jwtToken';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiConsumes,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags(ROUTER_PATHS.AUTH)
@Controller(ROUTER_PATHS.AUTH)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ description: 'User logged in', type: LoginControllerResponse })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiForbiddenResponse({ description: 'Email not confirmed' })
  @Post(ROUTER_PATHS.LOGIN)
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginControllerResponse> {
    const { accessToken, refreshToken, user } = await this.authService.login(loginDto);
    res.cookie(COOKIES.ACCESS_TOKEN, accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: ACCESS_TOKEN_EXPIRATION_TIME,
      signed: true,
    });

    if (loginDto.rememberMe) {
      res.cookie(COOKIES.REFRESH_TOKEN, refreshToken, {
        ...COOKIE_OPTIONS,
        maxAge: REFRESH_TOKEN_EXPIRATION_TIME,
        httpOnly: true,
        signed: true,
      });
    }

    return user;
  }

  @ApiOperation({ summary: 'Logout user' })
  @ApiCookieAuth(COOKIES.ACCESS_TOKEN)
  @ApiNoContentResponse({ description: 'User logged out' })
  @ApiUnauthorizedResponse({ description: 'Refresh token not found' })
  @Post(ROUTER_PATHS.LOGOUT)
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<void> {
    const refreshToken: string | undefined = req.signedCookies[COOKIES.REFRESH_TOKEN];

    await this.authService.logout(refreshToken);

    res.clearCookie(COOKIES.ACCESS_TOKEN);
    res.clearCookie(COOKIES.REFRESH_TOKEN);
  }

  @ApiOperation({ summary: 'Refresh user token' })
  @ApiOkResponse({ description: 'User token refreshed', type: RefreshControllerResponse })
  @ApiUnauthorizedResponse({ description: 'Refresh token or user not found' })
  @ApiForbiddenResponse({ description: 'Email not confirmed' })
  @Post(ROUTER_PATHS.REFRESH)
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<RefreshControllerResponse> {
    const currentRefreshToken: string | undefined = req.signedCookies[COOKIES.REFRESH_TOKEN];

    const { accessToken, refreshToken, user } = await this.authService.refresh(currentRefreshToken);

    res.cookie(COOKIES.ACCESS_TOKEN, accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: ACCESS_TOKEN_EXPIRATION_TIME,
      signed: true,
    });

    res.cookie(COOKIES.REFRESH_TOKEN, refreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: REFRESH_TOKEN_EXPIRATION_TIME,
      httpOnly: true,
      signed: true,
    });

    return user;
  }

  @ApiOperation({ summary: 'Register user' })
  @ApiBody({ type: RegisterDto })
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({ description: 'User registered' })
  @ApiConflictResponse({ description: 'User already exists' })
  @Post(ROUTER_PATHS.REGISTER)
  @UseInterceptors(AvatarsInterceptor)
  async register(
    @Body() registerDto: RegisterDto,
    @UploadedFiles() avatars: Express.Multer.File[],
  ): Promise<void> {
    registerDto.avatars = avatars;
    return this.authService.register(registerDto);
  }

  @ApiOperation({ summary: 'Verify user code' })
  @ApiBody({ type: VerifyCodeDto })
  @ApiOkResponse({ description: 'User verified', type: VerifyCodeControllerResponse })
  @ApiBadRequestResponse({ description: 'Invalid code' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @Post(ROUTER_PATHS.VERIFY_CODE)
  @HttpCode(HttpStatus.OK)
  async verifyCode(
    @Body() verifyCodeDto: VerifyCodeDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<VerifyCodeControllerResponse> {
    const { accessToken, refreshToken, user } = await this.authService.verifyCode(verifyCodeDto);

    res.cookie(COOKIES.ACCESS_TOKEN, accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: ACCESS_TOKEN_EXPIRATION_TIME,
      signed: true,
    });

    res.cookie(COOKIES.REFRESH_TOKEN, refreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: REFRESH_TOKEN_EXPIRATION_TIME,
      httpOnly: true,
      signed: true,
    });

    return user;
  }

  @ApiOperation({ summary: 'Request new code' })
  @ApiBody({ type: RequestCodeDto })
  @ApiNoContentResponse({ description: 'Code requested' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiBadRequestResponse({ description: 'You must wait before requesting a new code' })
  @Post(ROUTER_PATHS.NEW_CODE)
  @HttpCode(HttpStatus.NO_CONTENT)
  async requestNewCode(@Body() requestCodeDto: RequestCodeDto): Promise<void> {
    return this.authService.requestNewCode(requestCodeDto);
  }
}
