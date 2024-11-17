import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/common/modules';
import { CreateUserRequest, CreateUserResponse } from '../types';
import { FindUserByEmailRepositoryResponse, FindUserByIdRepositoryResponse } from './types';

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
   * @param email - The email of the user whose password is to be updated.
   * @param newPassword - The new password to set for the user.
   * @returns A promise that resolves when the password has been successfully updated.
   */
  async updatePassword(email: string, newPassword: string): Promise<void> {
    await this.databaseService.user.update({
      where: {
        email,
      },
      data: {
        password: newPassword,
      },
    });
  }
}
