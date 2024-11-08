import { DatabaseService } from '@/common/modules';
import { Injectable } from '@nestjs/common';
import { CreatePastryRepositoryRequest, UpdatePastryRepositoryRequest } from './types';
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

  async findById(pastryId: string): Promise<FindPastryByIdRepositoryResponse | null> {
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
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });
  }

  async update(pastryId: string, updatePastryDto: UpdatePastryRepositoryRequest): Promise<void> {
    const { geolocation, contact, categories, media, mediaToRemove, ...updatingPastry } =
      updatePastryDto;

    await this.databaseService.pastry.update({
      where: {
        id: pastryId,
      },
      data: {
        ...updatingPastry,
        geolocation: {
          update: geolocation,
        },
        contact: {
          update: contact,
        },
        categories: {
          deleteMany: {},
          create: categories,
        },
        media: {
          deleteMany: {
            id: {
              in: mediaToRemove,
            },
          },
          create: media,
        },
      },
    });
  }
}
