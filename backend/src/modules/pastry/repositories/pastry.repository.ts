import { DatabaseService } from '@/common/modules';
import { Injectable } from '@nestjs/common';
import {
  CreatePastryRepositoryRequest,
  GetPastriesResponse,
  GetSimilarPastriesResponse,
  GetUserPastriesResponse,
  PastryForGettingSimilar,
  UpdatePastryRepositoryRequest,
} from './types';
import { CreatePastryResponse } from '../types';
import { FindPastryByIdRepositoryResponse } from './types';
import { createPastryQuery, createSimilarPastryQuery } from '../lib';
import { GetPastryQueriesDto, GetSimilarPastryQueriesDto } from '../dto';

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
    const pastry = await this.databaseService.pastry.findUnique({
      where: {
        id: pastryId,
      },
      select: {
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
            category: true,
          },
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            nickname: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });

    if (!pastry) {
      return null;
    }

    return {
      ...pastry,
      categories: pastry.categories.map((category) => category.category),
    };
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

  /**
   * Retrieves a list of pastries similar to the given pastry.
   *
   * @param query - The query parameters for fetching similar pastries.
   * @param pastry - The pastry object from which to get similar pastries.
   * @returns A promise that resolves to a response containing the list of similar pastries.
   */
  async getSimilarPastries(
    query: GetSimilarPastryQueriesDto,
    pastry: PastryForGettingSimilar,
  ): Promise<GetSimilarPastriesResponse> {
    const pastryQuery = createSimilarPastryQuery(query, pastry);

    const pastries = await this.databaseService.pastry.findMany({
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
        categories: {
          select: {
            category: true,
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });

    return pastries.map(({ categories, ...pastry }) => ({
      ...pastry,
      categories: categories.map(({ category }) => category),
    }));
  }

  /**
   * Retrieves a list of pastries created by the user with the given ID, based on the given query parameters.
   *
   * @param queryDto - The query parameters for fetching user pastries.
   * @param userId - The ID of the user whose pastries to retrieve.
   * @returns A promise that resolves to a response containing the list of user pastries.
   */
  async getUserPastries(
    queryDto: GetPastryQueriesDto,
    userId: string,
  ): Promise<GetUserPastriesResponse> {
    const pastryQuery = createPastryQuery(queryDto);

    pastryQuery.where = {
      ...pastryQuery.where,
      user: {
        id: userId,
      },
    };

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
