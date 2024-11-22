import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PastryLikeRepository } from '../repositories';
import { PastryRepository } from '@/modules/pastry/repositories';
import { GetLikedPastriesDto, GetLikedPastryQueriesDto } from '../dto';
import { addGeolocationToPastries, addMediaPathsToPastries } from '@/modules/pastry/lib';
import { GeolocationService } from '@/common/modules';
import { getNextCursor } from '@/common/lib';

@Injectable()
export class PastryLikeService {
  /**
   * The constructor for the PastryLikeService.
   *
   * @param pastryLikeRepository The repository for the PastryLike entity.
   * @param pastryRepository The repository for the Pastry entity.
   * @param geolocationService The service for geolocation.
   */
  constructor(
    private readonly pastryLikeRepository: PastryLikeRepository,
    private readonly pastryRepository: PastryRepository,
    private readonly geolocationService: GeolocationService,
  ) {}

  /**
   * Creates a like for the specified pastry by the given user.
   *
   * @param pastryId - The ID of the pastry to be liked.
   * @param userId - The ID of the user liking the pastry.
   * @throws {NotFoundException} If the pastry with the specified ID does not exist.
   * @throws {ForbiddenException} If the user attempts to like their own pastry.
   * @throws {ConflictException} If the user has already liked the pastry.
   * @returns A promise that resolves when the like is successfully created.
   */
  async createLike(pastryId: string, userId: string): Promise<void> {
    const pastry = await this.pastryRepository.findById(pastryId);

    if (!pastry) {
      throw new NotFoundException('Pastry not found');
    }

    if (pastry.user.id === userId) {
      throw new ForbiddenException('You cannot like your own pastry');
    }

    const isLiked = await this.pastryLikeRepository.isLiked(pastryId, userId);

    if (isLiked) {
      throw new ConflictException('You have already liked this pastry');
    }

    await this.pastryLikeRepository.create(pastryId, userId);
  }

  /**
   * Deletes a like for the specified pastry by the given user.
   *
   * @param pastryId - The ID of the pastry to be unliked.
   * @param userId - The ID of the user unliking the pastry.
   * @throws {NotFoundException} If the pastry with the specified ID does not exist.
   * @throws {ForbiddenException} If the user attempts to unlike their own pastry.
   * @throws {ConflictException} If the user has not liked the pastry.
   * @returns A promise that resolves when the like is successfully deleted.
   */
  async deleteLike(pastryId: string, userId: string): Promise<void> {
    const pastry = await this.pastryRepository.findById(pastryId);

    if (!pastry) {
      throw new NotFoundException('Pastry not found');
    }

    if (pastry.user.id === userId) {
      throw new ForbiddenException('You cannot unlike your own pastry');
    }

    const isLiked = await this.pastryLikeRepository.isLiked(pastryId, userId);

    if (!isLiked) {
      throw new ConflictException('You have not liked this pastry');
    }

    await this.pastryLikeRepository.delete(pastryId, userId);
  }

  /**
   * Checks if the user with the specified ID has liked the specified pastry.
   *
   * @param pastryId - The ID of the pastry to check.
   * @param userId - The ID of the user to check.
   * @returns A promise that resolves to true if the user has liked the pastry, or false otherwise.
   */
  async isLiked(pastryId: string, userId: string): Promise<boolean> {
    return this.pastryLikeRepository.isLiked(pastryId, userId);
  }

  /**
   * Retrieves a list of pastries that the user with the specified ID has liked.
   *
   * @param query - The query parameters for fetching liked pastries.
   * @param userId - The ID of the user whose liked pastries to retrieve.
   * @returns A promise that resolves to an object containing the list of liked pastries and a cursor for pagination.
   */
  async getLikedPastries(
    query: GetLikedPastryQueriesDto,
    userId: string,
  ): Promise<GetLikedPastriesDto> {
    const pastries = await this.pastryLikeRepository.getLikedPastries(query, userId);

    const pastriesWithPaths = addMediaPathsToPastries(pastries);

    const nextCursor = getNextCursor(pastriesWithPaths);

    const pastriesWithGeolocation = await addGeolocationToPastries(
      pastriesWithPaths,
      this.geolocationService.getGeolocationByCoords.bind(this.geolocationService),
    );

    return {
      data: pastriesWithGeolocation,
      nextCursor,
    };
  }

  /**
   * Retrieves the total count of likes received by the user for their pastries.
   *
   * @param userId - The ID of the user whose received likes count is to be retrieved.
   * @returns A promise that resolves to the number of likes received by the user's pastries.
   */
  async getReceivedLikesCount(userId: string): Promise<number> {
    return this.pastryLikeRepository.getReceivedLikesCount(userId);
  }
}
