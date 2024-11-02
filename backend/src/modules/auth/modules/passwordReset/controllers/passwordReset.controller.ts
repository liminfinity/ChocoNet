import { Body, Controller, HttpCode, HttpStatus, Patch, Post, Res } from '@nestjs/common';
import { PasswordResetService } from '../services';
import { SendEmailDto, UpdatePasswordDto } from '../dto';
import { RequestCodeDto, VerifyCodeDto } from '@/modules/auth/dto';
import { UpdatePasswordControllerResponse } from './dto';
import {
  COOKIE_OPTIONS,
  COOKIES,
  ROUTER_PATHS as AUTH_ROUTER_PATHS,
} from '@/modules/auth/constants';
import { ACCESS_TOKEN_EXPIRATION_TIME, REFRESH_TOKEN_EXPIRATION_TIME } from '../../jwtToken';
import { Response } from 'express';
import omit from 'lodash.omit';
import { joinPaths } from '@/common/lib';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ROUTER_PATHS } from '../constants';

@ApiTags(joinPaths(AUTH_ROUTER_PATHS.AUTH, ROUTER_PATHS.PASSWORD_RESET))
@Controller(joinPaths(AUTH_ROUTER_PATHS.AUTH, ROUTER_PATHS.PASSWORD_RESET))
export class PasswordResetController {
  constructor(private readonly passwordResetService: PasswordResetService) {}

  @ApiOperation({ summary: 'send email for password reset' })
  @ApiBody({ type: SendEmailDto })
  @ApiNoContentResponse({ description: 'Password reset email sent' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @Post(ROUTER_PATHS.EMAIL)
  @HttpCode(HttpStatus.NO_CONTENT)
  async sendEmail(@Body() { email }: SendEmailDto): Promise<void> {
    return this.passwordResetService.sendEmail(email);
  }

  @ApiOperation({ summary: 'verify code for password reset' })
  @ApiBody({ type: VerifyCodeDto })
  @ApiNoContentResponse({ description: 'Code verified' })
  @ApiBadRequestResponse({ description: 'Invalid code' })
  @Post(ROUTER_PATHS.VERIFY_CODE)
  @HttpCode(HttpStatus.NO_CONTENT)
  async verifyCode(@Body() verifyCodeDto: VerifyCodeDto): Promise<void> {
    return this.passwordResetService.verifyCode(verifyCodeDto);
  }

  @ApiOperation({ summary: 'update password' })
  @ApiBody({ type: UpdatePasswordDto })
  @ApiOkResponse({ description: 'Password updated', type: UpdatePasswordControllerResponse })
  @ApiForbiddenResponse({ description: 'Email not confirmed' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @Patch(ROUTER_PATHS.PASSWORD)
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

  @Post(ROUTER_PATHS.NEW_CODE)
  @ApiNoContentResponse({ description: 'Code requested' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiBadRequestResponse({ description: 'You must wait before requesting a new code' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async requestNewCode(@Body() requestCodeDto: RequestCodeDto): Promise<void> {
    return this.passwordResetService.requestNewCode(requestCodeDto);
  }
}
