import { joinPaths } from '@/common/lib';
import { ROUTER_PATHS as PASTRY_ROUTER_PATHS } from '@/modules/pastry/constants';
import { Controller, Delete, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { ROUTER_PATHS } from '../constants';
import { PastryLikeService } from '../services';
import { JwtAuthGuard } from '@/modules/auth';
import { GuardUser } from '@/modules/user';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags(joinPaths(PASTRY_ROUTER_PATHS.PASTRIES, ROUTER_PATHS.LIKES))
@Controller(joinPaths(PASTRY_ROUTER_PATHS.PASTRIES, ROUTER_PATHS.LIKES))
@UseGuards(JwtAuthGuard)
export class PastryLikeController {
  constructor(private readonly pastryLikeService: PastryLikeService) {}

  @ApiOperation({
    summary: 'Create a like for a pastry',
  })
  @ApiParam({
    name: ROUTER_PATHS.PASTRY.slice(1),
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
    @Param(ROUTER_PATHS.PASTRY.slice(1)) pastryId: string,
  ): Promise<void> {
    return this.pastryLikeService.createLike(pastryId, userId);
  }

  @ApiOperation({
    summary: 'Delete a like for a pastry',
  })
  @ApiParam({
    name: ROUTER_PATHS.PASTRY.slice(1),
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
    @Param(ROUTER_PATHS.PASTRY.slice(1)) pastryId: string,
  ): Promise<void> {
    return this.pastryLikeService.deleteLike(pastryId, userId);
  }
}
