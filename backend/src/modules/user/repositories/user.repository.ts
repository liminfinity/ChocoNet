import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/common/modules';
import { CreateUserRequest, CreateUserResponse } from '../types';
import {
  FindByNicknameRepositoryResponse,
  FindUserByEmailRepositoryResponse,
  FindUserByIdRepositoryResponse,
  GetProfileRepositoryResponse,
  UpdateUserRepositoryRequest,
} from './types';

@Injectable()
export class UserRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * Finds a user by their email address.
   *
   * @param email - The email address of the user to find.
   * @returns A promise that resolves to the user's data with mapped avatar paths,
   *          or null if the user is not found.
   */
  async findByEmail(email: string): Promise<FindUserByEmailRepositoryResponse> {
    return this.databaseService.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        password: true,
        nickname: true,
        firstName: true,
        lastName: true,
        phone: true,
        about: true,
        createdAt: true,
        updatedAt: true,
        geolocation: {
          select: {
            lat: true,
            lng: true,
          },
        },
        avatars: {
          select: {
            filename: true,
            id: true,
          },
        },
      },
    });
  }

  /**
   * Finds a user by id.
   *
   * @param userId The id of the user to find.
   * @returns The user found by the given id.
   * @throws {NotFoundError} If no user is found with the given id.
   */
  async findById(userId: string): Promise<FindUserByIdRepositoryResponse> {
    return this.databaseService.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        password: true,
        nickname: true,
        firstName: true,
        lastName: true,
        phone: true,
        about: true,
        createdAt: true,
        updatedAt: true,
        geolocation: {
          select: {
            lat: true,
            lng: true,
          },
        },
        avatars: {
          select: {
            filename: true,
            id: true,
          },
        },
      },
    });
  }

  /**
   * Finds a user by nickname.
   *
   * @param nickname The nickname of the user to find.
   * @returns The user found by the given nickname.
   * @throws {NotFoundError} If no user is found with the given nickname.
   */
  async findByNickname(nickname: string): Promise<FindByNicknameRepositoryResponse> {
    return this.databaseService.user.findUnique({
      where: {
        nickname,
      },
      select: {
        id: true,
        email: true,
        password: true,
        nickname: true,
        firstName: true,
        lastName: true,
        phone: true,
        about: true,
        createdAt: true,
        updatedAt: true,
        geolocation: {
          select: {
            lat: true,
            lng: true,
          },
        },
        avatars: {
          select: {
            filename: true,
            id: true,
          },
        },
      },
    });
  }

  /**
   * Creates a new user in the database.
   *
   * @param newUserDto - The details of the new user to create, including geolocation and avatars.
   * @returns A promise that resolves to the newly created user's ID and email.
   */
  async create(newUserDto: CreateUserRequest): Promise<CreateUserResponse> {
    const { geolocation, avatars, ...user } = newUserDto;

    return this.databaseService.user.create({
      data: {
        ...user,
        geolocation: {
          create: geolocation,
        },
        avatars: {
          create: avatars,
        },
      },
      select: {
        id: true,
        email: true,
      },
    });
  }

  /**
   * Updates the user's password in the database.
   *
   * @param userId - The ID of the user whose password is to be updated.
   * @param newPassword - The new password to set for the user.
   * @returns A promise that resolves when the password has been successfully updated.
   */
  async updatePassword(userId: string, newPassword: string): Promise<void> {
    await this.databaseService.user.update({
      where: {
        id: userId,
      },
      data: {
        password: newPassword,
      },
    });
  }

  /**
   * Finds a user by their ID, and returns their profile data.
   *
   * @param userId - The ID of the user to find.
   * @returns A promise that resolves to the user's profile data, or null if the user is not found.
   */
  async getProfile(userId: string): Promise<GetProfileRepositoryResponse | null> {
    return this.databaseService.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        email: true,
        nickname: true,
        firstName: true,
        lastName: true,
        phone: true,
        about: true,
        createdAt: true,
        updatedAt: true,
        phoneVerification: {
          select: {
            isVerified: true,
          },
        },
        geolocation: {
          select: {
            lat: true,
            lng: true,
          },
        },
        avatars: {
          select: {
            filename: true,
            id: true,
          },
        },
        _count: {
          select: {
            followers: true,
            following: true,
            pastries: true,
          },
        },
      },
    });
  }

  /**
   * Deletes a user with the specified ID from the database.
   *
   * @param userId - The ID of the user to delete.
   * @returns A promise that resolves when the user has been successfully deleted.
   */
  async delete(userId: string): Promise<void> {
    await this.databaseService.user.delete({
      where: {
        id: userId,
      },
    });
  }

  /**
   * Updates the user's data in the database, including geolocation and avatars.
   *
   * @param userId - The ID of the user to update.
   * @param updateUserDto - The data transfer object containing the updated user details,
   *                        including optional updates for geolocation and avatars.
   *                        Avatars specified in avatarsToRemove will be deleted,
   *                        and new avatars will be created if provided.
   * @returns A promise that resolves when the update operation is complete.
   */
  async update(userId: string, updateUserDto: UpdateUserRepositoryRequest): Promise<void> {
    const { avatars, avatarsToRemove, geolocation, ...updatingUser } = updateUserDto;

    await this.databaseService.user.update({
      where: {
        id: userId,
      },
      data: {
        ...updatingUser,
        geolocation: {
          update: geolocation,
        },
        avatars: {
          deleteMany: {
            id: {
              in: avatarsToRemove,
            },
          },
          create: avatars,
        },
      },
    });
  }
}
