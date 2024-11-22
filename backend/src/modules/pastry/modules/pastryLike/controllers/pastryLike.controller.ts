import { deleteLeadingColonFromPath, joinPaths } from '@/common/lib';
import { ROUTER_PATHS as PASTRY_ROUTER_PATHS } from '@/modules/pastry/constants';
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
import { ROUTER_PATHS } from '../constants';
import { PastryLikeService } from '../services';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt.guard';
import { GuardUser } from '@/modules/user/decorators/guardUser';
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
import { COOKIES } from '@/modules/auth/constants';
import { GetLikedPastriesDto, GetLikedPastryQueriesDto } from '../dto';

@ApiTags(joinPaths(PASTRY_ROUTER_PATHS.PASTRIES, ROUTER_PATHS.LIKES))
@ApiCookieAuth(COOKIES.ACCESS_TOKEN)
@ApiUnauthorizedResponse({
  description: 'Unauthorized',
})
@Controller(joinPaths(PASTRY_ROUTER_PATHS.PASTRIES, ROUTER_PATHS.LIKES))
@UseGuards(JwtAuthGuard)
export class PastryLikeController {
  constructor(private readonly pastryLikeService: PastryLikeService) {}

  @ApiOperation({
    summary: 'Create a like for a pastry',
  })
  @ApiParam({
    name: deleteLeadingColonFromPath(ROUTER_PATHS.PASTRY),
    description: 'Pastry ID',
    example: '1',
    required: true,
  })
  @ApiCreatedResponse({
    description: 'The like has been created',
  })
  @ApiNotFoundResponse({
    description: 'Pastry not found',
  })
  @ApiForbiddenResponse({
    description: 'You cannot like your own pastry',
  })
  @ApiConflictResponse({
    description: 'You have already liked this pastry',
  })
  @Post(ROUTER_PATHS.PASTRY)
  async createLike(
    @GuardUser('id') userId: string,
    @Param(deleteLeadingColonFromPath(ROUTER_PATHS.PASTRY)) pastryId: string,
  ): Promise<void> {
    return this.pastryLikeService.createLike(pastryId, userId);
  }

  @ApiOperation({
    summary: 'Delete a like for a pastry',
  })
  @ApiParam({
    name: deleteLeadingColonFromPath(ROUTER_PATHS.PASTRY),
    description: 'Pastry ID',
    example: '1',
    required: true,
  })
  @ApiCreatedResponse({
    description: 'The like has been deleted',
  })
  @ApiNotFoundResponse({
    description: 'Pastry not found',
  })
  @ApiForbiddenResponse({
    description: 'You cannot unlike your own pastry',
  })
  @ApiConflictResponse({
    description: 'You have not liked this pastry',
  })
  @Delete(ROUTER_PATHS.PASTRY)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteLike(
    @GuardUser('id') userId: string,
    @Param(deleteLeadingColonFromPath(ROUTER_PATHS.PASTRY)) pastryId: string,
  ): Promise<void> {
    return this.pastryLikeService.deleteLike(pastryId, userId);
  }

  @ApiOperation({
    summary: 'Get all pastries liked by the user',
  })
  @ApiOkResponse({ type: GetLikedPastriesDto, description: 'The list of pastries' })
  @Get()
  async getLikedPastries(
    @Query() query: GetLikedPastryQueriesDto,
    @GuardUser('id') userId: string,
  ): Promise<GetLikedPastriesDto> {
    return this.pastryLikeService.getLikedPastries(query, userId);
  }
}
