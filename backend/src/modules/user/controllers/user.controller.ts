import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../services';
import { ROUTER_PATHS } from '../constants';
import { deleteLeadingColonFromPath, joinPaths } from '@/common/lib';
import { User } from '../decorators/user';
import {
  GetGuestProfileDto,
  GetOtherProfileDto,
  GetSelfProfileDto,
  VerifyAndUpdatePasswordDto,
} from '../dto';
import {
  ApiBody,
  ApiCookieAuth,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { ROUTER_PATHS as PASTRY_ROUTER_PATHS } from '@/modules/pastry/constants';
import { GetUserPastriesDto, GetUserPastryQueriesDto } from '@/modules/pastry/dto';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt.guard';
import { COOKIES } from '@/modules/auth/constants';
import { UserIdentityGuard } from '../guards';
import omit from 'lodash.omit';

@ApiTags(ROUTER_PATHS.USERS)
@Controller(ROUTER_PATHS.USERS)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: 'Get user profile',
  })
  @ApiParam({
    name: deleteLeadingColonFromPath(ROUTER_PATHS.USER),
    type: String,
    description: 'User ID',
    required: true,
    example: '123e4567-e89b-12d3-a456-426655440000',
  })
  @ApiOkResponse({
    schema: {
      oneOf: [
        { $ref: getSchemaPath(GetGuestProfileDto), description: 'Guest profile' },
        { $ref: getSchemaPath(GetOtherProfileDto), description: 'Other profile' },
        { $ref: getSchemaPath(GetSelfProfileDto), description: 'Self profile' },
      ],
    },
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  @Get(ROUTER_PATHS.USER)
  async getProfile(
    @Param(deleteLeadingColonFromPath(ROUTER_PATHS.USER)) userId: string,
    @User('id') currentUserId: string | undefined,
  ): Promise<GetGuestProfileDto | GetOtherProfileDto | GetSelfProfileDto> {
    return this.userService.getProfile(userId, currentUserId);
  }

  @ApiOperation({
    summary: 'Get user pastries',
  })
  @ApiParam({
    name: deleteLeadingColonFromPath(ROUTER_PATHS.USER),
    type: String,
    description: 'User ID',
    required: true,
    example: '123e4567-e89b-12d3-a456-426655440000',
  })
  @ApiOkResponse({
    type: GetUserPastriesDto,
    description: 'Successfully retrieved user pastries',
  })
  @Get(joinPaths(ROUTER_PATHS.USER, PASTRY_ROUTER_PATHS.PASTRIES))
  async getUserPastries(
    @Query() query: GetUserPastryQueriesDto,
    @Param(deleteLeadingColonFromPath(ROUTER_PATHS.USER)) userId: string,
    @User('id') currentUserId: string | undefined,
  ): Promise<GetUserPastriesDto> {
    return this.userService.getUserPastries(query, userId, currentUserId);
  }

  @ApiOperation({
    summary: 'Delete user',
  })
  @ApiCookieAuth(COOKIES.ACCESS_TOKEN)
  @ApiParam({
    name: deleteLeadingColonFromPath(ROUTER_PATHS.USER),
    type: String,
    description: 'User ID',
    required: true,
    example: '123e4567-e89b-12d3-a456-426655440000',
  })
  @ApiNoContentResponse({ description: 'Successfully deleted user' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiForbiddenResponse({ description: 'You do not have permission to modify this user' })
  @Delete(ROUTER_PATHS.USER)
  @UseGuards(JwtAuthGuard, UserIdentityGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param(deleteLeadingColonFromPath(ROUTER_PATHS.USER)) userId: string,
  ): Promise<void> {
    return this.userService.delete(userId);
  }

  @ApiOperation({
    summary: 'Verify and update password',
  })
  @ApiCookieAuth(COOKIES.ACCESS_TOKEN)
  @ApiBody({ type: VerifyAndUpdatePasswordDto })
  @ApiNoContentResponse({ description: 'Successfully verified and updated password' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiForbiddenResponse({ description: 'You do not have permission to modify this user' })
  @ApiParam({
    name: deleteLeadingColonFromPath(ROUTER_PATHS.USER),
    type: String,
    description: 'User ID',
    required: true,
    example: '123e4567-e89b-12d3-a456-426655440000',
  })
  @Patch(joinPaths(ROUTER_PATHS.USER, ROUTER_PATHS.PASSWORD))
  @UseGuards(JwtAuthGuard, UserIdentityGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async verifyAndUpdatePassword(
    @Param(deleteLeadingColonFromPath(ROUTER_PATHS.USER)) userId: string,
    @Body() verifyAndUpdatePasswordDto: VerifyAndUpdatePasswordDto,
  ): Promise<void> {
    return this.userService.verifyAndUpdatePassword(
      userId,
      omit(verifyAndUpdatePasswordDto, ['confirmPassword']),
    );
  }
}
