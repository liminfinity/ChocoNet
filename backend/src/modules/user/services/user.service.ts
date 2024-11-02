import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories';
import { CreateUserRequest, CreateUserResponse } from '../types';
import { mapAvatarsToPaths } from '../lib';
import { FindUserByEmailServiceResponse, FindUserByIdServiceResponse } from './types';
import { HashService } from '@/common/modules';

@Injectable()
export class UserService {
  /**
   * The constructor for the user service.
   *
   * @param userRepository - The repository to use for user data access.
   * @param hashService - The service to use for hashing passwords.
   */
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashService: HashService,
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
}
