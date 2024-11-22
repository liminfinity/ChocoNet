import { Injectable } from '@nestjs/common';
import { UserAvatarRepository } from '../repositories';
import { FindUserAvatarByIdsResponse, FindUserAvatarByUserIdResponse } from '../types';

@Injectable()
export class UserAvatarService {
  constructor(private readonly userAvatarRepository: UserAvatarRepository) {}

  /**
   * Retrieves user avatar records for the specified list of IDs.
   *
   * @param ids - An array of IDs corresponding to the user avatars to retrieve.
   * @returns A promise that resolves to an array of user avatar records
   *          containing the `id` and `filename` fields.
   */
  async findByIds(ids: string[]): Promise<FindUserAvatarByIdsResponse> {
    return this.userAvatarRepository.findByIds(ids);
  }

  /**
   * Finds a user's avatar by their user ID.
   *
   * @param userId - The ID of the user to find the avatar for.
   * @returns A promise that resolves to the avatar data with the avatar path,
   *          or null if the avatar is not found.
   */
  async findByUserId(userId: string): Promise<FindUserAvatarByUserIdResponse> {
    return this.userAvatarRepository.findByUserId(userId);
  }
}
