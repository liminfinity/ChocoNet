import { Injectable } from '@nestjs/common';
import { PastryRepository } from '../repositories';
import { CreatePastryDto } from '../dto';
import { CreatePastryResponse } from '../types';
import { mapCategoriesToObjectArray, mapPastryMediaToPaths } from '../lib';
import { mapFilesToFilenames } from '@/common/lib';
import { CreatePastryRepositoryRequest } from '../repositories';
import {
  FindPastryByIdServiceResponse,
  PrivateFindPastryByIdServiceResponse,
  PublicFindPastryByIdServiceResponse,
} from './types';
import { PastryLikeService } from '../modules/pastryLike';

@Injectable()
export class PastryService {
  constructor(
    private readonly pastryRepository: PastryRepository,
    private readonly pastryLikeService: PastryLikeService,
  ) {}

  async create(
    userId: string,
    { categories, media, ...createPastryDto }: CreatePastryDto,
  ): Promise<CreatePastryResponse> {
    const createPastryRequest: CreatePastryRepositoryRequest = {
      ...createPastryDto,
      categories: mapCategoriesToObjectArray(categories),
      media: mapFilesToFilenames(media),
    };

    return this.pastryRepository.create(userId, createPastryRequest);
  }

  async findById(
    pastryId: string,
    userId: string,
  ): Promise<PrivateFindPastryByIdServiceResponse | PublicFindPastryByIdServiceResponse> {
    const pastry = await this.pastryRepository.findById(pastryId);

    if (!pastry) {
      return null;
    }

    const baseResponse: FindPastryByIdServiceResponse = {
      ...pastry,
      media: mapPastryMediaToPaths(pastry.media),
    };

    if (pastry.userId !== userId) {
      const isLiked = await this.pastryLikeService.isLiked(pastryId, userId);
      return {
        ...baseResponse,
        isLiked,
      };
    } else {
      return baseResponse;
    }
  }
}
