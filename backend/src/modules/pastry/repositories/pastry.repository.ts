import { DatabaseService } from '@/common/modules';
import { Injectable } from '@nestjs/common';
import { CreatePastryRepositoryRequest } from './types';
import { CreatePastryResponse } from '../types';

@Injectable()
export class PastryRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(userId: string, createPastryDto: CreatePastryRepositoryRequest): Promise<CreatePastryResponse> {
    const { media, geolocation, contact, categories, ...newPastry } = createPastryDto;

    return this.databaseService.pastry.create({
      data: {
        ...newPastry,
        geolocation: {
          create: geolocation,
        },
        contact: {
          create: contact,
        },
        categories: {
          create: categories,
        },
        media: {
          create: media,
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
      select: {
        id: true,
      },
    });
  }
}
