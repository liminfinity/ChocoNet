import { Controller, Get, Param, Query } from '@nestjs/common';
import { UserService } from '../services';
import { ROUTER_PATHS } from '../constants';
import { deleteLeadingColonFromPath, joinPaths } from '@/common/lib';
import { User } from '../decorators/user';
import { GetGuestProfileDto, GetOtherProfileDto, GetSelfProfileDto } from '../dto';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { ROUTER_PATHS as PASTRY_ROUTER_PATHS } from '@/modules/pastry/constants';
import { GetUserPastriesDto, GetUserPastryQueriesDto } from '@/modules/pastry/dto';

@ApiTags(ROUTER_PATHS.USERS)
@Controller(ROUTER_PATHS.USERS)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: 'Get user profile',
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
}
