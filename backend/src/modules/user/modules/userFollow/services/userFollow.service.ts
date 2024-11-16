import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { UserFollowRepository } from '../repositories';
import { UserService } from '@/modules/user/services';

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
   * @throws {BadRequestException} If the follower ID is the same as the following ID.
   * @throws {ConflictException} If the follower ID is already following the following ID.
   */
  async follow(followerId: string, followingId: string): Promise<void> {
    if (followerId === followingId) {
      throw new ForbiddenException('You cannot follow yourself');
    }

    const followingUser = await this.userService.findById(followingId);

    if (!followingUser) {
      throw new BadRequestException('Following user not found');
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
   * @throws {BadRequestException} If the follower ID is the same as the following ID.
   * @throws {ConflictException} If the follower ID is not following the following ID.
   */
  async unfollow(followerId: string, followingId: string): Promise<void> {
    if (followerId === followingId) {
      throw new ForbiddenException('You cannot unfollow yourself');
    }

    const followingUser = await this.userService.findById(followingId);

    if (!followingUser) {
      throw new BadRequestException('Unfollowing user not found');
    }

    const isFollowing = await this.userFollowRepository.isFollowing(followerId, followingId);

    if (!isFollowing) {
      throw new ConflictException('You are not following this user');
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
}
