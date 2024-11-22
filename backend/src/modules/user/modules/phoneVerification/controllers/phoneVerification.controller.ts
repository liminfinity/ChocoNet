import { joinPaths } from '@/common/lib';
import { ROUTER_PATHS as USERS_ROUTER_PATHS } from '@/modules/user/constants';
import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ROUTER_PATHS } from '../constants';
import { PhoneVerificationService } from '../services';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt.guard';
import { VerifyCodeDto } from '../dto';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GuardUser } from '@/modules/user/decorators/guardUser';
import { COOKIES } from '@/modules/auth/constants';

@ApiTags(joinPaths(USERS_ROUTER_PATHS.USERS, ROUTER_PATHS.PHONE_VERIFICATION))
@ApiCookieAuth(COOKIES.ACCESS_TOKEN)
@ApiUnauthorizedResponse({
  description: 'Unauthorized',
})
@Controller(joinPaths(USERS_ROUTER_PATHS.USERS, ROUTER_PATHS.PHONE_VERIFICATION))
@UseGuards(JwtAuthGuard)
export class PhoneVerificationController {
  constructor(private readonly phoneVerificationService: PhoneVerificationService) {}

  @ApiOperation({ summary: 'Send verification code' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Code sent successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  @Get(ROUTER_PATHS.CODE)
  async getCode(@GuardUser('id') userId: string): Promise<void> {
    return this.phoneVerificationService.getCode(userId);
  }

  @ApiOperation({ summary: 'Verify code' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Code verified successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  @Post(ROUTER_PATHS.VERIFY_CODE)
  @HttpCode(HttpStatus.NO_CONTENT)
  async verifyCode(
    @GuardUser('id') userId: string,
    @Body() { code }: VerifyCodeDto,
  ): Promise<void> {
    return this.phoneVerificationService.verifyCode(code, userId);
  }

  @ApiOperation({ summary: 'Request new code' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Code sent successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  @Get(ROUTER_PATHS.NEW_CODE)
  async requestNewCode(@GuardUser('id') userId: string): Promise<void> {
    return this.phoneVerificationService.requestNewCode(userId);
  }
}
