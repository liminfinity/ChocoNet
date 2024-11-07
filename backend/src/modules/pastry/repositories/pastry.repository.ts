import { DatabaseService } from '@/common/modules';
import { Injectable } from '@nestjs/common';
import { CreatePastryRepositoryRequest } from './types';
import { CreatePastryResponse } from '../types';
import { FindPastryByIdRepositoryResponse } from './types';

@Injectable()
export class PastryRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(
    userId: string,
    createPastryDto: CreatePastryRepositoryRequest,
  ): Promise<CreatePastryResponse> {
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

  async findById(pastryId: string): Promise<FindPastryByIdRepositoryResponse> {
    return this.databaseService.pastry.findUnique({
      where: {
        id: pastryId,
      },
      select: {
        id: true,
        userId: true,
        name: true,
        description: true,
        price: true,
        unit: true,
        geolocation: {
          select: {
            lat: true,
            lng: true,
          },
        },
        contact: {
          select: {
            phone: true,
          },
        },
        media: {
          select: {
            id: true,
            filename: true,
          },
        },
        createdAt: true,
        updatedAt: true,
        categories: {
          select: {
            id: true,
            category: true,
          },
        },
        _count: {
          select: {
            likes: true,
          }
        }
      },
    });
  }
}
