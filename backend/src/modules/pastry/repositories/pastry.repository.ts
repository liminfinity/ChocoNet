import { DatabaseService } from '@/common/modules';
import { Injectable } from '@nestjs/common';
import {
  CreatePastryRepositoryRequest,
  GetPastriesResponse,
  UpdatePastryRepositoryRequest,
} from './types';
import { CreatePastryResponse } from '../types';
import { FindPastryByIdRepositoryResponse } from './types';
import { createPastryQuery } from '../lib';
import { GetPastryQueriesDto } from '../dto';

@Injectable()
export class PastryRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * Creates a new pastry.
   *
   * @param userId - The id of the user that created the pastry.
   * @param createPastryDto - The data for the new pastry.
   * @returns A promise that resolves with the id of the new pastry.
   */
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

  /**
   * Finds a pastry by its id.
   *
   * @param pastryId - The id of the pastry to find.
   * @returns A promise that resolves to the found pastry, or null if it does not exist.
   */
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

  /**
   * Updates an existing pastry with the specified data.
   *
   * @param pastryId - The id of the pastry to update.
   * @param updatePastryDto - The data to update the pastry with, including optional updates for geolocation, contact, categories, and media.
   * @returns A promise that resolves when the update operation is complete.
   */
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

  /**
   * Deletes a pastry with the specified id.
   *
   * @param pastryId - The id of the pastry to delete.
   * @returns A promise that resolves when the delete operation is complete.
   */
  async delete(pastryId: string): Promise<void> {
    await this.databaseService.pastry.delete({
      where: {
        id: pastryId,
      },
    });
  }

  /**
   * Retrieves a list of pastries based on the provided query parameters.
   *
   * @param queryDto - DTO containing the query parameters for fetching pastries.
   * @returns A promise that resolves to a response containing the list of pastries.
   */
  async getPastries(queryDto: GetPastryQueriesDto): Promise<GetPastriesResponse> {
    const pastryQuery = createPastryQuery(queryDto);

    return this.databaseService.pastry.findMany({
      ...pastryQuery,
      select: {
        id: true,
        name: true,
        price: true,
        unit: true,
        createdAt: true,
        geolocation: {
          select: {
            lat: true,
            lng: true,
          },
        },
        media: {
          select: {
            id: true,
            filename: true,
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
}
