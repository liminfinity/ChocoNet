import { DatabaseService } from '@/common/modules';
import { Injectable } from '@nestjs/common';
import { createFollowQuery } from '../lib';
import { FollowType, GetFollowQueriesDto } from '../dto';
import { GetFollowsResponse } from './types';

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

  /**
   * Retrieves a list of follow relationships for a given user based on query parameters.
   *
   * @param queryDto - The query parameters for fetching follow relationships, including follow type, order, and pagination.
   * @param userId - The ID of the user whose follow relationships are being retrieved.
   * @returns A promise that resolves to a response containing the list of follow relationships with user details and a creation date.
   */
  async getFollows(queryDto: GetFollowQueriesDto, userId: string): Promise<GetFollowsResponse> {
    const followQuery = createFollowQuery(queryDto);

    const isFollowerSelected = queryDto.followType === FollowType.FOLLOWER;

    const followId = isFollowerSelected ? 'followingId' : 'followerId';

    followQuery.where = {
      ...followQuery.where,
      [followId]: userId,
    };

    const res = await this.databaseService.userFollow.findMany({
      ...followQuery,
      select: {
        id: true,
        createdAt: true,
        follower: {
          select: {
            id: true,
            nickname: true,
            firstName: true,
            lastName: true,
            avatars: {
              take: 1,
              select: {
                id: true,
                filename: true,
              },
            },
          },
        },
        following: {
          select: {
            id: true,
            nickname: true,
            firstName: true,
            lastName: true,
            avatars: {
              take: 1,
              select: {
                id: true,
                filename: true,
              },
            },
          },
        },
      },
    });

    const follows = res.map(({ follower, following, ...folowDetails }) => {
      const user = isFollowerSelected ? follower : following;

      const { avatars, ...userDetails } = user;
      const userWithOneAvatar = {
        ...userDetails,
        avatar: avatars.length > 0 ? avatars[0] : null,
      };

      return {
        ...folowDetails,
        user: userWithOneAvatar,
      };
    });

    return follows;
  }
}
