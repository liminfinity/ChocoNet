import { Injectable, NotFoundException } from '@nestjs/common';
import { PastryRepository } from '../repositories';
import {
  CreatePastryDto,
  GetPastriesDto,
  GetPastryAutorizedDto,
  GetPastryGuestDto,
  GetPastryOwnerDto,
  GetPastryQueriesDto,
  GetSimilarPastriesDto,
  GetSimilarPastryQueriesDto,
  GetUserPastriesDto,
  GetUserPastryQueriesDto,
  UpdatePastryDto,
} from '../dto';
import { CreatePastryResponse } from '../types';
import {
  addGeolocationToPastries,
  addMediaPathsToPastries,
  getPathToPastryMedia,
  mapCategoriesToObjectArray,
  mapPastryMediaToPaths,
  sortPastriesByRelevance,
} from '../lib';
import { getNextCursor, mapFilesToFilenames } from '@/common/lib';
import { CreatePastryRepositoryRequest } from '../repositories';
import { PastryLikeService } from '../modules/pastryLike';
import { UpdatePastryRepositoryRequest } from '../repositories/types';
import { PastryMediaService } from '../modules';
import { rm } from 'node:fs/promises';
import { GeolocationService } from '@/common/modules';
import { getFormattedGeolocation } from '../lib';
import omit from 'lodash.omit';

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
   * Finds a pastry by its ID and formats the response based on the user's role.
   *
   * @param pastryId - The ID of the pastry to find.
   * @param userId - The optional ID of the user making the request.
   * @returns A promise that resolves to one of the following DTOs:
   *   - GetPastryOwnerDto if the requested user is the owner of the pastry.
   *   - GetPastryAutorizedDto if the user is logged in but not the owner.
   *   - GetPastryGuestDto if no user is logged in.
   * @throws NotFoundException if no pastry is found with the given ID.
   */
  async findById(
    pastryId: string,
    userId?: string,
  ): Promise<GetPastryAutorizedDto | GetPastryGuestDto | GetPastryOwnerDto> {
    const pastry = await this.pastryRepository.findById(pastryId);
    if (!pastry) {
      throw new NotFoundException('Pastry not found');
    }

    const { geolocation, media, user, ...pastryDetails } = pastry;

    const pastryWithMediaPaths = { ...pastryDetails, media: mapPastryMediaToPaths(media) };

    const [geolocationDto, isLiked] = await Promise.all([
      getFormattedGeolocation(
        geolocation,
        this.geolocationService.getGeolocationByCoords.bind(this.geolocationService),
      ),
      userId ? this.pastryLikeService.isLiked(pastryId, userId) : null,
    ]);

    const pastryDto = geolocationDto
      ? { ...pastryWithMediaPaths, geolocation: geolocationDto }
      : { ...pastryWithMediaPaths, geolocation: null };

    // Проверка на владельца
    if (user.id === userId) {
      return pastryDto;
    }

    // Публичное DTO не для владельцев
    const publicPastryDto = {
      ...omit(pastryDto, ['updatedAt']),
      owner: user,
    };

    // Если пользователь авторизован, добавляем информацию о лайке
    if (userId && isLiked !== null) {
      return { ...publicPastryDto, isLiked };
    }

    // Если пользователь не авторизован
    return publicPastryDto;
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

    await Promise.all(
      filesToRemove.map(({ filename }) => {
        const path = getPathToPastryMedia(filename);
        return rm(path);
      }),
    );
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

    await Promise.all(
      filesToRemove.map(({ filename }) => {
        const path = getPathToPastryMedia(filename);
        return rm(path);
      }),
    );
  }

  /**
   * Determines if the user with the specified ID owns the pastry with the specified ID.
   *
   * @param pastryId - The ID of the pastry to check.
   * @param userId - The ID of the user to check.
   * @returns A promise that resolves to true if the user owns the pastry, or false otherwise.
   * @throws {NotFoundException} If the pastry with the specified ID does not exist.
   */
  async isPastryOwnedByUser(pastryId: string, userId: string): Promise<boolean> {
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

    // Если пользователь авторизован
    if (userId) {
      const pastriesWithIsLiked = await Promise.all(
        pastriesWithGeolocation.map(async (pastry) => {
          const isPastryOwner = await this.isPastryOwnedByUser(pastry.id, userId);

          // Если владелец, то возвращаем без isLiked
          if (isPastryOwner) {
            return pastry;
          }

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

  /**
   * Retrieves a list of similar pastries to the one with the specified ID, based on the specified query parameters.
   *
   * @param query - The query parameters for fetching similar pastries.
   * @param pastryId - The ID of the pastry from which to get similar pastries.
   * @param userId - The ID of the user to include in the response, used for determining if the user has liked the pastry.
   * @returns A promise that resolves to a response containing the list of similar pastries.
   * @throws {NotFoundException} If the pastry with the specified ID does not exist.
   */
  async getSimilarPastries(
    query: GetSimilarPastryQueriesDto,
    pastryId: string,
    userId?: string,
  ): Promise<GetSimilarPastriesDto> {
    const pastry = await this.pastryRepository.findById(pastryId);

    if (!pastry) {
      throw new NotFoundException('Pastry not found');
    }

    const { categories, name } = pastry;

    const similarPastries = await this.pastryRepository.getSimilarPastries(query, {
      categories,
      name,
      id: pastryId,
    });

    sortPastriesByRelevance(similarPastries, {
      categories,
      name,
    });

    const nextCursor = getNextCursor(similarPastries);

    const similarPastriesWithoutCategories = similarPastries.map((pastry) => {
      return omit(pastry, ['categories']);
    });

    const similarPastriesWithPaths = addMediaPathsToPastries(similarPastriesWithoutCategories);

    const similarPastriesWithGeolocation = await addGeolocationToPastries(
      similarPastriesWithPaths,
      this.geolocationService.getGeolocationByCoords.bind(this.geolocationService),
    );

    if (userId) {
      const similarPastriesWithIsLiked = await Promise.all(
        similarPastriesWithGeolocation.map(async (pastry) => {
          const isPastryOwner = await this.isPastryOwnedByUser(pastry.id, userId);

          // Если владелец, то возвращаем без isLiked
          if (isPastryOwner) {
            return pastry;
          }
          const isLiked = await this.pastryLikeService.isLiked(pastry.id, userId);
          return { ...pastry, isLiked };
        }),
      );

      return {
        data: similarPastriesWithIsLiked,
        nextCursor,
      };
    }

    return {
      data: similarPastriesWithGeolocation,
      nextCursor,
    };
  }

  /**
   * Retrieves a list of pastries created by the user with the given ID.
   *
   * If the current user is authorized and is not the owner of the pastries, the
   * response will contain an additional `isLiked` property that indicates whether
   * the current user has liked the pastry.
   *
   * @param query - The query parameters for fetching user pastries.
   * @param userId - The ID of the user whose pastries to retrieve.
   * @param currentUserId - The ID of the current user, if authorized.
   * @returns A promise that resolves to an object containing the list of user
   *          pastries and a cursor for pagination.
   */
  async getUserPastries(
    query: GetUserPastryQueriesDto,
    userId: string,
    currentUserId?: string,
  ): Promise<GetUserPastriesDto> {
    const pastries = await this.pastryRepository.getUserPastries(query, userId);

    const pastriesWithPaths = addMediaPathsToPastries(pastries);

    const nextCursor = getNextCursor(pastriesWithPaths);

    const pastriesWithGeolocation = await addGeolocationToPastries(
      pastriesWithPaths,
      this.geolocationService.getGeolocationByCoords.bind(this.geolocationService),
    );

    // Если пользователь авторизован и не владелец
    if (currentUserId && currentUserId !== userId) {
      const pastriesWithIsLiked = await Promise.all(
        pastriesWithGeolocation.map(async (pastry) => {
          const isLiked = await this.pastryLikeService.isLiked(pastry.id, currentUserId);

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

  /**
   * Retrieves a list of pastry IDs created by the specified user.
   *
   * @param userId - The ID of the user whose pastry IDs are to be retrieved.
   * @returns A promise that resolves to an array of pastry IDs.
   */
  async getPastryIdsByUserId(userId: string): Promise<string[]> {
    return this.pastryRepository.getPastryIdsByUserId(userId);
  }
}
