import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories';
import { CreateUserRequest, CreateUserResponse } from '../types';
import { mapAvatarsToPaths } from '../lib';
import { FindUserByEmailServiceResponse, FindUserByIdServiceResponse } from './types';
import { HashService } from '@/common/modules';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashService: HashService,
  ) {}

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

  async create({ password, ...newUserDto }: CreateUserRequest): Promise<CreateUserResponse> {
    const hashedPassword = await this.hashService.hash(password);
    return this.userRepository.create({
      ...newUserDto,
      password: hashedPassword,
    });
  }

  async updatePassword(email: string, newPassword: string): Promise<void> {
    const hashedPassword = await this.hashService.hash(newPassword);
    return this.userRepository.updatePassword(email, hashedPassword);
  }
}
