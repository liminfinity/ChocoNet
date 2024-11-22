import { deleteLeadingColonFromPath, joinPaths } from '@/common/lib';
import { ROUTER_PATHS as USER_ROUTER_PATHS } from '@/modules/user/constants';
import {
  ApiConflictResponse,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ROUTER_PATHS } from '../constants';
import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt.guard';
import { COOKIES } from '@/modules/auth/constants';
import { UserFollowService } from '../services';
import { GuardUser } from '@/modules/user/decorators/guardUser';
import { GetFollowQueriesDto, GetFollowsDto } from '../dto';

@ApiTags(joinPaths(USER_ROUTER_PATHS.USERS, ROUTER_PATHS.FOLLOWS))
@ApiCookieAuth(COOKIES.ACCESS_TOKEN)
@ApiUnauthorizedResponse({
  description: 'Unauthorized',
})
@Controller(joinPaths(USER_ROUTER_PATHS.USERS, ROUTER_PATHS.FOLLOWS))
@UseGuards(JwtAuthGuard)
export class UserFollowController {
  constructor(private readonly userFollowService: UserFollowService) {}

  @ApiOperation({ summary: 'Follow a user' })
  @ApiParam({
    name: deleteLeadingColonFromPath(ROUTER_PATHS.FOLLOWING),
    description: 'The following ID',
    example: '1',
    required: true,
  })
  @ApiCreatedResponse({
    description: 'Successfully followed the user',
  })
  @ApiNotFoundResponse({
    description: 'Following user not found',
  })
  @ApiForbiddenResponse({
    description: 'You cannot follow yourself',
  })
  @ApiConflictResponse({
    description: 'You are already following this user',
  })
  @Post(ROUTER_PATHS.FOLLOWING)
  async follow(
    @GuardUser('id') followerId: string,
    @Param(deleteLeadingColonFromPath(ROUTER_PATHS.FOLLOWING)) followingId: string,
  ): Promise<void> {
    return this.userFollowService.follow(followerId, followingId);
  }

  @ApiOperation({ summary: 'Unfollow a user' })
  @ApiParam({
    name: deleteLeadingColonFromPath(ROUTER_PATHS.FOLLOWING),
    description: 'The following ID',
    example: '1',
    required: true,
  })
  @ApiCreatedResponse({
    description: 'Successfully unfollowed the user',
  })
  @ApiNotFoundResponse({
    description: 'Following user not found',
  })
  @ApiForbiddenResponse({
    description: 'You cannot unfollow yourself',
  })
  @ApiConflictResponse({
    description: 'You are not following this user',
  })
  @Delete(ROUTER_PATHS.FOLLOWING)
  @HttpCode(HttpStatus.NO_CONTENT)
  async unfollow(
    @GuardUser('id') followerId: string,
    @Param(deleteLeadingColonFromPath(ROUTER_PATHS.FOLLOWING)) followingId: string,
  ): Promise<void> {
    return this.userFollowService.unfollow(followerId, followingId);
  }

  @ApiOperation({ summary: 'Unfollow from you' })
  @ApiParam({
    name: deleteLeadingColonFromPath(ROUTER_PATHS.FOLLOWING),
    description: 'The following ID',
    example: '1',
    required: true,
  })
  @ApiCreatedResponse({
    description: 'Successfully unfollowed from you',
  })
  @ApiNotFoundResponse({
    description: 'Follower user not found',
  })
  @ApiForbiddenResponse({
    description: 'You cannot unfollow yourself',
  })
  @ApiConflictResponse({
    description: 'This user is not following you',
  })
  @Delete(joinPaths(ROUTER_PATHS.UNFOLLOW_FROM_YOU, ROUTER_PATHS.FOLLOWING))
  @HttpCode(HttpStatus.NO_CONTENT)
  async unfollowFromYou(
    @GuardUser('id') followerId: string,
    @Param(deleteLeadingColonFromPath(ROUTER_PATHS.FOLLOWING)) followingId: string,
  ): Promise<void> {
    return this.userFollowService.unfollowFromYou(followingId, followerId);
  }

  @ApiOperation({ summary: 'Get follows' })
  @ApiOkResponse({
    description: 'Successfully got follows',
  })
  @Get()
  async getFollows(
    @Query() query: GetFollowQueriesDto,
    @GuardUser('id') userId: string,
  ): Promise<GetFollowsDto> {
    return this.userFollowService.getFollows(query, userId);
  }
}
