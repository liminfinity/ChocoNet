import { joinPaths } from '@/common/lib';
import { ROUTER_PATHS as USERS_ROUTER_PATHS } from '@/modules/user/constants';
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { ROUTER_PATHS } from '../constants';
import { PhoneVerificationService } from '../services';
import { RequestWithUser, JwtAuthGuard } from '@/modules/auth';
import { VerifyCodeDto } from '../dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags(joinPaths(USERS_ROUTER_PATHS.USERS, ROUTER_PATHS.PHONE_VERIFICATION))
@Controller(joinPaths(USERS_ROUTER_PATHS.USERS, ROUTER_PATHS.PHONE_VERIFICATION))
export class PhoneVerificationController {
  constructor(private readonly phoneVerificationService: PhoneVerificationService) {}

  @ApiOperation({ summary: 'Send verification code' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Code sent successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  @Get(ROUTER_PATHS.CODE)
  @UseGuards(JwtAuthGuard)
  async getCode(@Req() { user }: RequestWithUser): Promise<void> {
    return this.phoneVerificationService.getCode(user.id);
  }

  @ApiOperation({ summary: 'Verify code' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Code verified successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  @Post(ROUTER_PATHS.VERIFY_CODE)
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  async verifyCode(
    @Req() { user }: RequestWithUser,
    @Body() { code }: VerifyCodeDto,
  ): Promise<void> {
    return this.phoneVerificationService.verifyCode(code, user.id);
  }

  @ApiOperation({ summary: 'Request new code' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Code sent successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  @Get(ROUTER_PATHS.NEW_CODE)
  @UseGuards(JwtAuthGuard)
  async requestNewCode(@Req() { user }: RequestWithUser): Promise<void> {
    return this.phoneVerificationService.requestNewCode(user.id);
  }
}