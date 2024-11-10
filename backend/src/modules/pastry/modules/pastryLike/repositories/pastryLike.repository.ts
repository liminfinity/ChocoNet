import { DatabaseService } from '@/common/modules';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PastryLikeRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * Creates a new like for a pastry.
   *
   * @param pastryId - The id of the pastry to like.
   * @param userId - The id of the user that is liking the pastry.
   * @returns A promise that resolves when the like is created.
   */
  async create(pastryId: string, userId: string): Promise<void> {
    await this.databaseService.pastryLike.create({
      data: {
        pastryId,
        userId,
      },
    });
  }

  /**
   * Deletes a like for a pastry with the specified id.
   *
   * @param pastryId - The id of the pastry to unlike.
   * @param userId - The id of the user that is unliking the pastry.
   * @returns A promise that resolves when the like is deleted.
   */
  async delete(pastryId: string, userId: string): Promise<void> {
    await this.databaseService.pastryLike.delete({
      where: {
        pastryId_userId: {
          pastryId,
          userId,
        },
      },
    });
  }

  /**
   * Checks if a user has liked a pastry.
   *
   * @param pastryId - The id of the pastry to check.
   * @param userId - The id of the user to check.
   * @returns A promise that resolves to true if the user has liked the pastry, or false otherwise.
   */
  async isLiked(pastryId: string, userId: string): Promise<boolean> {
    const like = await this.databaseService.pastryLike.findUnique({
      where: {
        pastryId_userId: {
          pastryId,
          userId,
        },
      },
    });

    return !!like;
  }
}
