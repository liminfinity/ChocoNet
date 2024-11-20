import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from '../services';
import { ROUTER_PATHS } from '../constants';
import { deleteLeadingColonFromPath } from '@/common/lib';
import { User } from '../decorators';
import { GetGuestProfileDto, GetOtherProfileDto, GetSelfProfileDto } from '../dto';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';

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
}
