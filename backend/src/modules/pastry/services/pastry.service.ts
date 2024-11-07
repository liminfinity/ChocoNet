import { Injectable } from '@nestjs/common';
import { PastryRepository } from '../repositories';
import { CreatePastryDto } from '../dto';
import { CreatePastryResponse } from '../types';
import { mapCategoriesToObjectArray } from '../lib';
import { mapFilesToFilenames } from '@/common/lib';
import { CreatePastryRepositoryRequest } from '../repositories';

@Injectable()
export class PastryService {
  constructor(private readonly pastryRepository: PastryRepository) {}

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
}
