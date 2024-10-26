import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/common/modules';
import {
  CreateUserRequest,
  CreateUserResponse,
  FindUserByEmailResponse,
  FindUserByIdResponse,
} from '../types';

@Injectable()
export class UserRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findByEmail(email: string): Promise<FindUserByEmailResponse> {
    return this.databaseService.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        password: true,
        firstName: true,
        lastName: true,
        phone: true,
        about: true,
        createdAt: true,
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

  async findById(userId: string): Promise<FindUserByIdResponse> {
    return this.databaseService.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        password: true,
        firstName: true,
        lastName: true,
        phone: true,
        about: true,
        createdAt: true,
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
}
