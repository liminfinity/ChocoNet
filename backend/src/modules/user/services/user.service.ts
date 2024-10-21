import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories';
import { User } from '@prisma/client';
import { RegisterDto } from '@/modules/auth/dto';
import { CreateUserResponse } from '../types';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async findById(userId: string): Promise<User | null> {
    return this.userRepository.findById(userId);
  }

  async create(newUserDto: RegisterDto): Promise<CreateUserResponse> {
    return this.userRepository.create(newUserDto);
  }
}
