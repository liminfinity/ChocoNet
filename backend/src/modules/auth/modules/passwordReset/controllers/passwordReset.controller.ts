import { Body, Controller, HttpCode, HttpStatus, Patch, Post, Res } from '@nestjs/common';
import { PasswordResetService } from '../services';
import { SendEmailDto, UpdatePasswordDto } from '../dto';
import { RequestCodeDto, VerifyCodeDto } from '@/modules/auth/dto';
import { UpdatePasswordControllerResponse } from './types';
import { COOKIE_OPTIONS, COOKIES } from '@/modules/auth/constants';
import { ACCESS_TOKEN_EXPIRATION_TIME, REFRESH_TOKEN_EXPIRATION_TIME } from '../../jwtToken';
import { Response } from 'express';
import omit from 'lodash.omit';
import { joinPaths } from '@/common/lib';

@Controller(joinPaths('auth', 'password-reset'))
export class PasswordResetController {
  constructor(private readonly passwordResetService: PasswordResetService) {}

  @Post('send-email')
  @HttpCode(HttpStatus.NO_CONTENT)
  async sendEmail(@Body() { email }: SendEmailDto): Promise<void> {
    return this.passwordResetService.sendEmail(email);
  }

  @Post('verify-code')
  @HttpCode(HttpStatus.NO_CONTENT)
  async verifyCode(@Body() verifyCodeDto: VerifyCodeDto): Promise<void> {
    return this.passwordResetService.verifyCode(verifyCodeDto);
  }

  @Patch('update-password')
  async updatePassword(
    @Body() updatePasswordDto: UpdatePasswordDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<UpdatePasswordControllerResponse> {
    const dtoWithoutConfirmPassword = omit(updatePasswordDto, ['confirmPassword']);

    const { accessToken, refreshToken, user } =
      await this.passwordResetService.updatePassword(dtoWithoutConfirmPassword);

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

  @Post('request-new-code')
  @HttpCode(HttpStatus.NO_CONTENT)
  async requestNewCode(@Body() requestCodeDto: RequestCodeDto): Promise<void> {
    return this.passwordResetService.requestNewCode(requestCodeDto);
  }
}
