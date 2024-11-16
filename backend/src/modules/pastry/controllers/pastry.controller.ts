import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PastryService } from '../services';
import { ROUTER_PATHS } from '../constants';
import { CreatePastryDto, GetPastryQueriesDto, UpdatePastryDto, GetPastriesDto } from '../dto';
import { MediaInterceptor } from '../interceptors';
import { Response } from 'express';
import { joinPaths } from '@/common/lib';
import { ROUTER_PATHS as BASE_ROUTER_PATHS } from '@/common/constants';
import { JwtAuthGuard, UserFromToken } from '@/modules/auth';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GuardUser, User } from '@/modules/user';
import { PastryOwnershipGuard } from '../guards';
import { COOKIES } from '@/modules/auth/constants';

@ApiTags(ROUTER_PATHS.PASTRIES)
@Controller(ROUTER_PATHS.PASTRIES)
export class PastryController {
  constructor(private readonly pastryService: PastryService) {}

  @ApiOperation({ summary: 'Create new pastry' })
  @ApiCookieAuth(COOKIES.ACCESS_TOKEN)
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreatePastryDto })
  @ApiCreatedResponse({ description: 'Pastry created' })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @ApiBadRequestResponse({ description: 'Data is invalid' })
  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(MediaInterceptor)
  async create(
    @GuardUser('id') userId: string,
    @Body() createPastryDto: CreatePastryDto,
    @UploadedFiles() media: Express.Multer.File[],
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    createPastryDto.media = media;
    const { id } = await this.pastryService.create(userId, createPastryDto);

    res.location(BASE_ROUTER_PATHS.HOME + joinPaths(ROUTER_PATHS.PASTRIES, id));
  }

  @ApiOperation({ summary: 'Update pastry' })
  @ApiCookieAuth(COOKIES.ACCESS_TOKEN)
  @ApiParam({
    name: ROUTER_PATHS.PASTRY.slice(1),
    description: 'Pastry ID',
    example: '1',
    required: true,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdatePastryDto })
  @ApiNoContentResponse({ description: 'Pastry updated' })
  @ApiNotFoundResponse({ description: 'Pastry not found' })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @ApiForbiddenResponse({ description: 'You do not have permission to modify this pastry' })
  @Patch(ROUTER_PATHS.PASTRY)
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard, PastryOwnershipGuard)
  @UseInterceptors(MediaInterceptor)
  async update(
    @Param(ROUTER_PATHS.PASTRY.slice(1)) pastryId: string,
    @Body() updatePastryDto: UpdatePastryDto,
    @UploadedFiles() media: Express.Multer.File[],
  ): Promise<void> {
    updatePastryDto.media = media;
    return this.pastryService.update(pastryId, updatePastryDto);
  }

  @ApiOperation({ summary: 'Delete pastry' })
  @ApiCookieAuth(COOKIES.ACCESS_TOKEN)
  @ApiParam({
    name: ROUTER_PATHS.PASTRY.slice(1),
    description: 'Pastry ID',
    example: '1',
    required: true,
  })
  @ApiNoContentResponse({ description: 'Pastry deleted' })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @ApiNotFoundResponse({ description: 'Pastry not found' })
  @ApiForbiddenResponse({ description: 'You do not have permission to delete this pastry' })
  @Delete(ROUTER_PATHS.PASTRY)
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard, PastryOwnershipGuard)
  async delete(@Param(ROUTER_PATHS.PASTRY.slice(1)) pastryId: string): Promise<void> {
    return this.pastryService.delete(pastryId);
  }

  @ApiOperation({ summary: 'Get pastries' })
  @ApiOkResponse({ type: GetPastriesDto, description: 'List of pastries' })
  @Get()
  async getPastries(
    @Query() query: GetPastryQueriesDto,
    @User() user: UserFromToken | undefined,
  ): Promise<GetPastriesDto> {
    return this.pastryService.getPastries(query, user?.id);
  }
}
