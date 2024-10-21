import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/common/modules';
import { User } from '@prisma/client';
import { RegisterDto } from '@/modules/auth/dto';
import { CreateUserResponse } from '../types';

@Injectable()
export class UserRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.databaseService.user.findUnique({
      where: {
        email,
      },
      include: {
        avatars: true,
        geolocation: true,
      },
    });
  }

  async findById(userId: string): Promise<User | null> {
    return this.databaseService.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        avatars: true,
        geolocation: true,
      },
    });
  }

  async create(newUserDto: RegisterDto): Promise<CreateUserResponse> {
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
