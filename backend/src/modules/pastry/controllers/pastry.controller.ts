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
import {
  CreatePastryDto,
  GetPastryQueriesDto,
  UpdatePastryDto,
  GetPastriesDto,
  GetPastryAutorizedDto,
  GetPastryGuestDto,
  GetPastryOwnerDto,
  GetSimilarPastriesDto,
  GetSimilarPastryQueriesDto,
} from '../dto';
import { MediaInterceptor } from '../interceptors';
import { Response } from 'express';
import { deleteLeadingColonFromPath, joinPaths } from '@/common/lib';
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
  getSchemaPath,
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
    name: deleteLeadingColonFromPath(ROUTER_PATHS.PASTRY),
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
    @Param(deleteLeadingColonFromPath(ROUTER_PATHS.PASTRY)) pastryId: string,
    @Body() updatePastryDto: UpdatePastryDto,
    @UploadedFiles() media: Express.Multer.File[],
  ): Promise<void> {
    updatePastryDto.media = media;
    return this.pastryService.update(pastryId, updatePastryDto);
  }

  @ApiOperation({ summary: 'Delete pastry' })
  @ApiCookieAuth(COOKIES.ACCESS_TOKEN)
  @ApiParam({
    name: deleteLeadingColonFromPath(ROUTER_PATHS.PASTRY),
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
  async delete(
    @Param(deleteLeadingColonFromPath(ROUTER_PATHS.PASTRY)) pastryId: string,
  ): Promise<void> {
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

  @ApiOperation({ summary: 'Get pastry' })
  @ApiParam({
    name: deleteLeadingColonFromPath(ROUTER_PATHS.PASTRY),
    description: 'Pastry ID',
    example: '1',
    required: true,
  })
  @ApiOkResponse({
    schema: {
      oneOf: [
        { $ref: getSchemaPath(GetPastryGuestDto), description: 'Pastry for guest' },
        { $ref: getSchemaPath(GetPastryOwnerDto), description: 'Pastry for owner' },
        { $ref: getSchemaPath(GetPastryAutorizedDto), description: 'Pastry for autorized user' },
      ],
    },
  })
  @ApiNotFoundResponse({ description: 'Pastry not found' })
  @Get(ROUTER_PATHS.PASTRY)
  async findById(
    @Param(deleteLeadingColonFromPath(ROUTER_PATHS.PASTRY)) pastryId: string,
    @User() user: UserFromToken | undefined,
  ): Promise<GetPastryAutorizedDto | GetPastryGuestDto | GetPastryOwnerDto> {
    return this.pastryService.findById(pastryId, user?.id);
  }

  @ApiOperation({ summary: 'Get similar pastries' })
  @ApiParam({
    name: deleteLeadingColonFromPath(ROUTER_PATHS.PASTRY),
    description: 'Pastry ID',
    example: '1',
    required: true,
  })
  @ApiNotFoundResponse({ description: 'Pastry not found' })
  @ApiOkResponse({ type: GetSimilarPastriesDto, description: 'List of similar pastries' })
  @Get(joinPaths(ROUTER_PATHS.PASTRY, ROUTER_PATHS.SIMILAR))
  async getSimilarPastries(
    @Query() query: GetSimilarPastryQueriesDto,
    @Param(deleteLeadingColonFromPath(ROUTER_PATHS.PASTRY)) pastryId: string,
    @User() user: UserFromToken | undefined,
  ): Promise<GetSimilarPastriesDto> {
    return this.pastryService.getSimilarPastries(query, pastryId, user?.id);
  }
}
