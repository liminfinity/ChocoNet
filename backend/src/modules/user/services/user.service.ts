import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories';
import {
  CreateUserRequest,
  CreateUserResponse,
  FindUserByEmailResponse,
  FindUserByIdResponse,
} from '../types';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findByEmail(email: string): Promise<FindUserByEmailResponse> {
    return this.userRepository.findByEmail(email);
  }

  async findById(userId: string): Promise<FindUserByIdResponse> {
    return this.userRepository.findById(userId);
  }

  async create(newUserDto: CreateUserRequest): Promise<CreateUserResponse> {
    return this.userRepository.create(newUserDto);
  }
}
