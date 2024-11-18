import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserFollowRepository } from '../repositories';
import { UserService } from '@/modules/user/services';
import { GetFollowQueriesDto, GetFollowsDto } from '../dto';
import { addAvatarPathToFollows } from '../lib';
import { getNextCursor } from '@/common/lib';

@Injectable()
export class UserFollowService {
  constructor(
    private readonly userFollowRepository: UserFollowRepository,
    private readonly userService: UserService,
  ) {}

  /**
   * Creates a follow relationship between two users.
   *
   * @param followerId - The ID of the user who is following.
   * @param followingId - The ID of the user who is being followed.
   * @throws {ForbiddenException} If the follower ID is the same as the following ID.
   * @throws {NotFoundException} If the following user is not found.
   * @throws {ConflictException} If the user is already following the other user.
   * @returns A promise that resolves when the follow relationship is successfully created.
   */
  async follow(followerId: string, followingId: string): Promise<void> {
    if (followerId === followingId) {
      throw new ForbiddenException('You cannot follow yourself');
    }

    const followingUser = await this.userService.findById(followingId);

    if (!followingUser) {
      throw new NotFoundException('Following user not found');
    }

    const isFollowing = await this.userFollowRepository.isFollowing(followerId, followingId);

    if (isFollowing) {
      throw new ConflictException('You are already following this user');
    }

    await this.userFollowRepository.follow(followerId, followingId);
  }

  /**
   * Deletes a follow relationship between two users.
   *
   * @param followerId - The ID of the user who is unfollowing.
   * @param followingId - The ID of the user who is being unfollowed.
   * @throws {ForbiddenException} If the follower ID is the same as the following ID.
   * @throws {NotFoundException} If the following user is not found.
   * @throws {ConflictException} If the user is not following the other user.
   * @returns A promise that resolves when the follow relationship is successfully deleted.
   */
  async unfollow(followerId: string, followingId: string): Promise<void> {
    if (followerId === followingId) {
      throw new ForbiddenException('You cannot unfollow yourself');
    }

    const followingUser = await this.userService.findById(followingId);

    if (!followingUser) {
      throw new NotFoundException('Unfollowing user not found');
    }

    const isFollowing = await this.userFollowRepository.isFollowing(followerId, followingId);

    if (!isFollowing) {
      throw new ConflictException('You are not following this user');
    }

    await this.userFollowRepository.unfollow(followerId, followingId);
  }

  /**
   * Deletes a follow relationship initiated by the specified follower.
   *
   * @param followerId - The ID of the user who is unfollowing.
   * @param followingId - The ID of the user who is being unfollowed.
   * @throws {ForbiddenException} If the follower ID is the same as the following ID.
   * @throws {NotFoundException} If the follower user is not found.
   * @throws {ConflictException} If the follower is not following the specified user.
   * @returns A promise that resolves when the follow relationship is successfully deleted.
   */
  async unfollowFromYou(followerId: string, followingId: string): Promise<void> {
    if (followerId === followingId) {
      throw new ForbiddenException('You cannot unfollow yourself');
    }

    const followerUser = await this.userService.findById(followerId);

    if (!followerUser) {
      throw new NotFoundException('Follower user not found');
    }

    const isFollowing = await this.userFollowRepository.isFollowing(followerId, followingId);

    if (!isFollowing) {
      throw new ConflictException('This user is not following you');
    }

    await this.userFollowRepository.unfollow(followerId, followingId);
  }

  /**
   * Checks if the user with the specified follower ID is following the user with the specified following ID.
   *
   * @param followerId - The ID of the user who is potentially following.
   * @param followingId - The ID of the user who is potentially being followed.
   * @returns A promise that resolves to true if the user is following the other user, or false otherwise.
   */
  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    return this.userFollowRepository.isFollowing(followerId, followingId);
  }

  /**
   * Retrieves a list of follow relationships for a given user based on query parameters.
   *
   * @param query - The query parameters for fetching follow relationships, including follow type, order, and pagination.
   * @param userId - The ID of the user whose follow relationships are being retrieved.
   * @returns A promise that resolves to a response containing the list of follow relationships with user details and a creation date.
   *          The response also includes a next cursor value for pagination.
   */
  async getFollows(query: GetFollowQueriesDto, userId: string): Promise<GetFollowsDto> {
    const follows = await this.userFollowRepository.getFollows(query, userId);

    const followsWithAvatarPath = addAvatarPathToFollows(follows);

    const nextCursor = getNextCursor(followsWithAvatarPath);

    return {
      data: followsWithAvatarPath,
      nextCursor,
    };
  }
}
