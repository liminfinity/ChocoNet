import { DatabaseService } from '@/common/modules';
import { Injectable } from '@nestjs/common';
import { FindUserAvatarByIdsResponse, FindUserAvatarByUserIdResponse } from '../types';

@Injectable()
export class UserAvatarRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * Retrieves user avatar records by the specified list of IDs.
   *
   * @param ids - The IDs of the user avatar records to retrieve.
   * @returns A promise that resolves to an array of user avatar records that match the given IDs.
   *          The records will only contain the `id` and `filename` fields.
   */
  async findByIds(ids: string[]): Promise<FindUserAvatarByIdsResponse> {
    return this.databaseService.avatar.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      select: {
        id: true,
        filename: true,
      },
    });
  }

  /**
   * Finds user avatars by the user's ID.
   *
   * @param userId - The ID of the user whose avatars are to be found.
   * @returns A promise that resolves to an array of user avatars, each containing
   *          the `id` and `filename` fields.
   */
  async findByUserId(userId: string): Promise<FindUserAvatarByUserIdResponse> {
    return this.databaseService.avatar.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        filename: true,
      },
    });
  }
}
