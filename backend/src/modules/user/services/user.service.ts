import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories';
import { CreateUserRequest, CreateUserResponse } from '../types';
import { mapAvatarsToPaths } from '../lib';
import { FindUserByEmailServiceResponse, FindUserByIdServiceResponse } from './types';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

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

  async create(newUserDto: CreateUserRequest): Promise<CreateUserResponse> {
    return this.userRepository.create(newUserDto);
  }
}
