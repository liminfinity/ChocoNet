import { Injectable, NotFoundException } from '@nestjs/common';
import { PastryRepository } from '../repositories';
import { CreatePastryDto, UpdatePastryDto } from '../dto';
import { CreatePastryResponse } from '../types';
import { getPathToPastryMedia, mapCategoriesToObjectArray, mapPastryMediaToPaths } from '../lib';
import { mapFilesToFilenames } from '@/common/lib';
import { CreatePastryRepositoryRequest } from '../repositories';
import {
  FindPastryByIdServiceResponse,
  OwnerFindPastryByIdServiceResponse,
  PublicFindPastryByIdServiceResponse,
} from './types';
import { PastryLikeService } from '../modules/pastryLike';
import { UpdatePastryRepositoryRequest } from '../repositories/types';
import { PastryMediaService } from '../modules/pastryMedia';
import { rm } from 'node:fs/promises';
import omit from 'lodash.omit';

@Injectable()
export class PastryService {
  constructor(
    private readonly pastryRepository: PastryRepository,
    private readonly pastryLikeService: PastryLikeService,
    private readonly pastryMediaService: PastryMediaService,
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
  ): Promise<OwnerFindPastryByIdServiceResponse | PublicFindPastryByIdServiceResponse | null> {
    const pastry = await this.pastryRepository.findById(pastryId);

    if (!pastry) {
      return null;
    }

    const baseResponse: FindPastryByIdServiceResponse = {
      ...pastry,
      media: mapPastryMediaToPaths(pastry.media),
    };

    if (pastry.user.id !== userId) {
      const isLiked = await this.pastryLikeService.isLiked(pastryId, userId);

      const publicResponse: PublicFindPastryByIdServiceResponse = {
        ...baseResponse,
        isLiked,
      };

      return publicResponse;
    } else {
      const ownerResponse: OwnerFindPastryByIdServiceResponse = omit(baseResponse, ['user']);

      return ownerResponse;
    }
  }

  async update(
    pastryId: string,
    { categories, media, mediaToRemove, ...updatePastryDto }: UpdatePastryDto,
  ): Promise<void> {
    const updatePartyRequest: UpdatePastryRepositoryRequest = {
      ...updatePastryDto,
      mediaToRemove: mediaToRemove || [],
      media: media && mapFilesToFilenames(media),
      categories: categories && mapCategoriesToObjectArray(categories),
    };

    const filesToRemove = await this.pastryMediaService.findByIds(updatePartyRequest.mediaToRemove);

    await this.pastryRepository.update(pastryId, updatePartyRequest);

    for (const { filename } of filesToRemove) {
      const path = getPathToPastryMedia(filename);
      await rm(path);
    }
  }

  async isPartyOwnedByUser(pastryId: string, userId: string): Promise<boolean> {
    const pastry = await this.pastryRepository.findById(pastryId);

    if (!pastry) {
      throw new NotFoundException('Pastry not found');
    }

    return pastry.user.id === userId;
  }
}
