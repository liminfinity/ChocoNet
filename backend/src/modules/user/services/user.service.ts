import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../repositories';
import { CreateUserRequest, CreateUserResponse } from '../types';
import { mapAvatarsToPaths } from '../lib';
import { FindUserByEmailServiceResponse, FindUserByIdServiceResponse } from './types';
import { GeolocationService, HashService } from '@/common/modules';
import { GetGuestProfileDto, GetOtherProfileDto, GetSelfProfileDto } from '../dto';
import { PastryLikeService } from '@/modules/pastry/modules/pastryLike';
import { UserFollowService } from '../modules';
import omit from 'lodash.omit';
import { getFormattedGeolocation } from '@/modules/pastry/lib/getFormattedGeolocation';
import { GetUserPastriesDto, GetUserPastryQueriesDto } from '@/modules/pastry/dto';
import { PastryService } from '@/modules/pastry/services';

@Injectable()
export class UserService {
  /**
   * Constructor for the UserService.
   *
   * @param userRepository - The repository for the User entity.
   * @param hashService - The service for hashing passwords.
   * @param pastryLikeService - The service for the PastryLike entity.
   * @param userFollowService - The service for the UserFollow entity.
   * @param geolocationService - The service for geolocation.
   */
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashService: HashService,
    private readonly pastryLikeService: PastryLikeService,
    private readonly userFollowService: UserFollowService,
    private readonly geolocationService: GeolocationService,
    @Inject(forwardRef(() => PastryService))
    private readonly pastryService: PastryService,
  ) {}

  /**
   * Finds a user by their email address.
   *
   * @param email - The email address of the user to find.
   * @returns A promise that resolves to the user's data with mapped avatar paths,
   *          or null if the user is not found.
   */
  async findByEmail(email: string): Promise<FindUserByEmailServiceResponse> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      return null;
    }

    return {
      ...user,
      avatars: mapAvatarsToPaths(user.avatars),
    };
  }

  /**
   * Finds a user by their ID.
   *
   * @param userId - The ID of the user to find.
   * @returns A promise that resolves to the user's data with mapped avatar paths,
   *          or null if the user is not found.
   */
  async findById(userId: string): Promise<FindUserByIdServiceResponse> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      return null;
    }

    return {
      ...user,
      avatars: mapAvatarsToPaths(user.avatars),
    };
  }

  /**
   * Creates a new user in the database.
   *
   * @param newUserDto - The details of the new user to create.
   * @returns A promise that resolves to the created user's data, with the password
   *          removed for security.
   */
  async create({ password, ...newUserDto }: CreateUserRequest): Promise<CreateUserResponse> {
    const hashedPassword = await this.hashService.hash(password);
    return this.userRepository.create({
      ...newUserDto,
      password: hashedPassword,
    });
  }

  /**
   * Updates the user's password in the database.
   *
   * @param email - The email of the user whose password is to be updated.
   * @param newPassword - The new password to set for the user.
   * @returns A promise that resolves when the password has been successfully updated.
   */
  async updatePassword(email: string, newPassword: string): Promise<void> {
    const hashedPassword = await this.hashService.hash(newPassword);
    return this.userRepository.updatePassword(email, hashedPassword);
  }

  /**
   * Retrieves a user's profile data.
   *
   * @param userId - The ID of the user to retrieve the profile for.
   * @param currentUserId - The ID of the currently logged-in user. If provided,
   *                       the returned profile will contain additional fields
   *                       such as the user's contact information and a flag
   *                       indicating whether the current user is following the
   *                       requested user.
   * @returns A promise that resolves to one of the following DTOs:
   *   - GetGuestProfileDto if the current user is not logged in.
   *   - GetOtherProfileDto if the current user is logged in but not the owner.
   *   - GetSelfProfileDto if the current user is the owner of the requested profile.
   * @throws {NotFoundException} If the requested user is not found.
   */
  async getProfile(
    userId: string,
    currentUserId?: string,
  ): Promise<GetGuestProfileDto | GetOtherProfileDto | GetSelfProfileDto> {
    const profile = await this.userRepository.getProfile(userId);

    if (!profile) {
      throw new NotFoundException('User not found');
    }

    const likesCnt = await this.pastryLikeService.getReceivedLikesCount(userId);

    const { avatars, _count } = profile;

    const avatarPaths = mapAvatarsToPaths(avatars);

    const profileWithAvatarPathsAndLikeCounts = {
      ...profile,
      avatars: avatarPaths,
      _count: {
        ..._count,
        likes: likesCnt,
      },
    };

    // Если текущий пользователь не авторизован
    if (!currentUserId) {
      return {
        ...omit(profileWithAvatarPathsAndLikeCounts, [
          'geolocation',
          'phoneVerification',
          'email',
          'phone',
          'updatedAt',
        ]),
      };
    }

    const { phoneVerification, phone, email, ...profileWithoutContact } =
      profileWithAvatarPathsAndLikeCounts;

    const profileWithContact = {
      ...profileWithoutContact,
      contact: {
        email,
        phone,
        phoneVerified: phoneVerification?.isVerified ?? false,
      },
    };

    const { geolocation } = profileWithContact;

    const formattedGeolocation = await getFormattedGeolocation(
      geolocation,
      this.geolocationService.getGeolocationByCoords.bind(this.geolocationService),
    );

    const profileWithGeolocation = {
      ...profileWithContact,
      geolocation: formattedGeolocation,
    };

    // Если текущий пользователь является владельцем профиля
    if (currentUserId === userId) {
      return profileWithGeolocation;
    }

    const isFollowing = await this.userFollowService.isFollowing(currentUserId, userId);

    return {
      ...omit(profileWithGeolocation, ['updatedAt']),
      isFollowing,
    };
  }

  /**
   * Retrieves a list of pastries created by a user.
   *
   * If the current user is authorized and is not the owner of the pastries,
   * the response will contain an additional `isLiked` property that indicates
   * whether the current user has liked the pastry.
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
    return this.pastryService.getUserPastries(query, userId, currentUserId);
  }
}
