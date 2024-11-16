import { Injectable, NotFoundException } from '@nestjs/common';
import { PastryRepository } from '../repositories';
import { CreatePastryDto, GetPastriesDto, GetPastryQueriesDto, UpdatePastryDto } from '../dto';
import { CreatePastryResponse } from '../types';
import { addGeolocationToPastries, addMediaPathsToPastries, getPathToPastryMedia, mapCategoriesToObjectArray, mapPastryMediaToPaths } from '../lib';
import { getNextCursor, mapFilesToFilenames } from '@/common/lib';
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
import { GeolocationService } from '@/common/modules';

@Injectable()
export class PastryService {
  /**
   * The constructor for the PastryService.
   *
   * @param pastryRepository The repository for the Pastry entity.
   * @param pastryLikeService The service for the PastryLike entity.
   * @param pastryMediaService The service for the PastryMedia entity.
   * @param geolocationService The service for geolocation.
   */
  constructor(
    private readonly pastryRepository: PastryRepository,
    private readonly pastryLikeService: PastryLikeService,
    private readonly pastryMediaService: PastryMediaService,
    private readonly geolocationService: GeolocationService,
  ) {}

  /**
   * Creates a new pastry for a given user.
   *
   * @param userId - The ID of the user creating the pastry.
   * @param createPastryDto - The data transfer object containing pastry details, including categories and media.
   * @returns A promise that resolves to the response containing the ID of the newly created pastry.
   */
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

  /**
   * Finds a pastry by ID.
   *
   * @param pastryId - The ID of the pastry to find.
   * @param userId - The ID of the user making the request.
   * @returns A promise that resolves to an object containing the pastry details, or null if the pastry does not exist.
   *          If the user is the owner of the pastry, the response will contain the pastry details with the user field omitted.
   *          If the user is not the owner of the pastry, the response will contain the pastry details, as well as a boolean indicating
   *          whether the user has liked the pastry.
   */
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

  /**
   * Updates a pastry with the specified ID.
   *
   * @param pastryId - The ID of the pastry to update.
   * @param updatePastryDto - The data transfer object containing the updated pastry details, including categories and media.
   * @returns A promise that resolves when the update operation is complete.
   */
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

  /**
   * Deletes a pastry with the specified ID, as well as all related media.
   *
   * @param pastryId - The ID of the pastry to delete.
   * @returns A promise that resolves when the delete operation is complete.
   */
  async delete(pastryId: string): Promise<void> {
    const filesToRemove = await this.pastryMediaService.findByPastryId(pastryId);

    await this.pastryRepository.delete(pastryId);

    for (const { filename } of filesToRemove) {
      const path = getPathToPastryMedia(filename);
      await rm(path);
    }
  }

  /**
   * Determines if the user with the specified ID owns the pastry with the specified ID.
   *
   * @param pastryId - The ID of the pastry to check.
   * @param userId - The ID of the user to check.
   * @returns A promise that resolves to true if the user owns the pastry, or false otherwise.
   * @throws {NotFoundException} If the pastry with the specified ID does not exist.
   */
  async isPartyOwnedByUser(pastryId: string, userId: string): Promise<boolean> {
    const pastry = await this.pastryRepository.findById(pastryId);

    if (!pastry) {
      throw new NotFoundException('Pastry not found');
    }

    return pastry.user.id === userId;
  }

  /**
   * Retrieves a list of pastries based on the specified query parameters.
   *
   * @param query - The query parameters for fetching pastries.
   * @param userId - The ID of the user to include in the response, used for determining if the user has liked the pastry.
   * @returns A promise that resolves to a response containing the list of pastries.
   */
  async getPastries(query: GetPastryQueriesDto, userId?: string): Promise<GetPastriesDto> {
    const pastries = await this.pastryRepository.getPastries(query);

    const pastriesWithPaths = addMediaPathsToPastries(pastries);

    const nextCursor = getNextCursor(pastriesWithPaths);

    const pastriesWithGeolocation = await addGeolocationToPastries(
      pastriesWithPaths,
      this.geolocationService.getGeolocationByCoords.bind(this.geolocationService),
    );

    if (userId) {
      const pastriesWithIsLiked = await Promise.all(
        pastriesWithGeolocation.map(async (pastry) => {
          const isLiked = await this.pastryLikeService.isLiked(pastry.id, userId);
          return { ...pastry, isLiked };
        }),
      );

      return {
        data: pastriesWithIsLiked,
        nextCursor,
      };
    }

    return {
      data: pastriesWithGeolocation,
      nextCursor,
    };
  }
}
