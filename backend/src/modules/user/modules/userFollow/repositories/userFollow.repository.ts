import { DatabaseService } from '@/common/modules';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserFollowRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * Creates a follow relationship between two users.
   *
   * @param followerId - The ID of the user who is following.
   * @param followingId - The ID of the user who is being followed.
   * @throws {ConflictException} If the follower ID is already following the following ID.
   */
  async follow(followerId: string, followingId: string): Promise<void> {
    await this.databaseService.userFollow.create({
      data: {
        followerId,
        followingId,
      },
    });
  }

  /**
   * Deletes a follow relationship between two users.
   *
   * @param followerId - The ID of the user who is unfollowing.
   * @param followingId - The ID of the user who is being unfollowed.
   * @throws {ConflictException} If the follower ID is not following the following ID.
   */
  async unfollow(followerId: string, followingId: string): Promise<void> {
    await this.databaseService.userFollow.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });
  }

  /**
   * Checks if the user with the specified ID is following the other user with the specified ID.
   *
   * @param followerId - The ID of the user who is following.
   * @param followingId - The ID of the user who is being followed.
   * @returns A promise that resolves to true if the user is following the other user, or false otherwise.
   */
  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const isFollowing = await this.databaseService.userFollow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    return !!isFollowing;
  }
}
