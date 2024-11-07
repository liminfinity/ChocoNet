import {
  Body,
  Controller,
  Post,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PastryService } from '../services';
import { ROUTER_PATHS } from '../constants';
import { CreatePastryDto } from '../dto';
import { MediaInterceptor } from '../interceptors';
import { Response } from 'express';
import { joinPaths } from '@/common/lib';
import { ROUTER_PATHS as BASE_ROUTER_PATHS } from '@/common/constants';
import { JwtAuthGuard } from '@/modules/auth';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '@/modules/user';

@ApiTags(ROUTER_PATHS.PASTRIES)
@Controller(ROUTER_PATHS.PASTRIES)
export class PastryController {
  constructor(private readonly pastryService: PastryService) {}

  @ApiOperation({ summary: 'Create new pastry' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreatePastryDto })
  @ApiCreatedResponse({ description: 'Pastry created' })
  @ApiBadRequestResponse({ description: 'Data is invalid' })
  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(MediaInterceptor)
  async create(
    @User('id') userId: string,
    @Body() createPastryDto: CreatePastryDto,
    @UploadedFiles() media: Express.Multer.File[],
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    createPastryDto.media = media;
    const { id } = await this.pastryService.create(userId, createPastryDto);

    res.location(BASE_ROUTER_PATHS.HOME + joinPaths(ROUTER_PATHS.PASTRIES, id));
  }
}
