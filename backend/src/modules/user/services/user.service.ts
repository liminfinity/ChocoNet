import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async findById(userId: string): Promise<User | null> {
    return this.userRepository.findById(userId);
  }
}
